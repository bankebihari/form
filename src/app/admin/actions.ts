"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { requireAdmin } from "@/lib/auth";
import {
  ALL_STATUSES,
  PAYMENT_METHODS,
  type ApplicationStatus,
} from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { deleteFile, uploadBuffer } from "@/lib/gridfs";
import {
  cleanAmount,
  cleanFilename,
  cleanLine,
  cleanReference,
  cleanText,
} from "@/lib/sanitize";
import { buildWatermarkedPreview } from "@/lib/watermark";
import { Application } from "@/models/Application";
import { AdminUser } from "@/models/AdminUser";
import { Lead } from "@/models/Lead";

export type ActionState = { ok: boolean; message: string };

const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid record id");

function done(message: string): ActionState {
  return { ok: true, message };
}

function problem(message: string): ActionState {
  return { ok: false, message };
}

function refresh(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  if (id) revalidatePath(`/admin/applications/${id}`);
}

/* ------------------------------------------------------------------ quote */

export async function setQuoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      totalAmount: z.unknown().transform((value) => cleanAmount(value)),
      governmentFee: z.unknown().transform((value) => cleanAmount(value)),
      notes: z
        .unknown()
        .transform((value) => cleanText(typeof value === "string" ? value : "", 600)),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) return problem("Enter a valid amount.");
  const { id, totalAmount, governmentFee, notes } = parsed.data;

  if (governmentFee > totalAmount) {
    return problem("Government fee cannot be more than the total price.");
  }

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  const advance = Math.round((totalAmount * siteConfig.advancePercent) / 100);
  const balance = Math.max(totalAmount - advance, 0);

  application.quote = {
    totalAmount,
    governmentFee,
    notes,
    quotedAt: new Date(),
  };
  application.payments.advance.amount = advance;
  application.payments.balance.amount = balance;

  // Only move the status forward: a re-quote must not undo later progress.
  if (application.status === "SUBMITTED") {
    application.status = "QUOTED";
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title: "Price confirmed",
    note: `Total ${totalAmount}. Booking ${advance}, balance ${balance}.${
      notes ? ` ${notes}` : ""
    }`,
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);
  return done("Price saved. The client can now see it on their tracking page.");
}

/* ---------------------------------------------------------------- payment */

export async function recordPaymentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      which: z.enum(["advance", "balance"]),
      amount: z.unknown().transform((value) => cleanAmount(value)),
      method: z.enum(PAYMENT_METHODS),
      reference: z.unknown().transform((value) => cleanReference(value)),
      note: z
        .unknown()
        .transform((value) => cleanText(typeof value === "string" ? value : "", 300)),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) return problem("Check the payment details and try again.");
  const { id, which, amount, method, reference, note } = parsed.data;

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  if (which === "balance" && application.payments.advance.status === "PENDING") {
    return problem("Record the booking amount before the balance.");
  }

  const payment = application.payments[which];
  payment.amount = amount || payment.amount;
  payment.status = "RECEIVED";
  payment.method = method;
  payment.reference = reference;
  payment.note = note;
  payment.receivedAt = new Date();
  payment.recordedBy = session.name;

  if (which === "advance" && ["SUBMITTED", "QUOTED"].includes(application.status)) {
    application.status = "ADVANCE_PAID";
  }
  if (which === "balance") {
    application.status = "FULL_PAID";
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title:
      which === "advance"
        ? "Booking amount received"
        : "Balance payment received",
    note: `${amount} by ${method}${reference ? ` (ref ${reference})` : ""}.`,
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);

  return done(
    which === "balance"
      ? "Balance recorded. You can release the document now."
      : "Booking amount recorded. Work can begin."
  );
}

/** Undo a payment recorded by mistake. */
export async function clearPaymentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({ id: idSchema, which: z.enum(["advance", "balance"]) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return problem("Could not undo that payment.");

  await connectDB();
  const application = await Application.findById(parsed.data.id);
  if (!application) return problem("Application not found.");

  const payment = application.payments[parsed.data.which];
  payment.status = "PENDING";
  payment.method = undefined;
  payment.reference = "";
  payment.receivedAt = undefined;
  payment.recordedBy = "";

  // A cleared balance must also re-lock the document.
  if (parsed.data.which === "balance" && application.deliverable.released) {
    application.deliverable.released = false;
    application.deliverable.releasedAt = undefined;
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title: "Payment record corrected",
    note: `${parsed.data.which === "advance" ? "Booking" : "Balance"} payment marked as not received.`,
    internal: true,
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(parsed.data.id);
  return done("Payment record cleared.");
}

/* ----------------------------------------------------------------- status */

export async function updateStatusAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      status: z.enum(ALL_STATUSES),
      note: z
        .unknown()
        .transform((value) => cleanText(typeof value === "string" ? value : "", 600)),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) return problem("Pick a valid status.");
  const { id, status, note } = parsed.data;

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  if (status === "DELIVERED" && !application.deliverable.released) {
    return problem(
      "Release the document before marking this as delivered."
    );
  }

  application.status = status;
  application.timeline.push({
    status,
    title: statusTitle(status),
    note,
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);
  return done("Status updated. The client sees this on their tracking page.");
}

function statusTitle(status: ApplicationStatus) {
  const titles: Record<ApplicationStatus, string> = {
    SUBMITTED: "Request received",
    QUOTED: "Price confirmed",
    ADVANCE_PAID: "Booking amount received",
    IN_PROGRESS: "Work in progress",
    READY_PREVIEW: "Document ready for your review",
    FULL_PAID: "Payment complete",
    DELIVERED: "Document delivered",
    ON_HOLD: "Put on hold",
    CANCELLED: "Request cancelled",
  };
  return titles[status];
}

/* ------------------------------------------------------------------- note */

export async function addNoteAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      title: z
        .unknown()
        .transform((value) => cleanLine(typeof value === "string" ? value : "", 120))
        .refine((value) => value.length >= 2, "Write a short title"),
      note: z
        .unknown()
        .transform((value) => cleanText(typeof value === "string" ? value : "", 800)),
      internal: z
        .union([z.literal("on"), z.literal("true"), z.literal("")])
        .optional(),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) return problem("Write a short title for the update.");
  const { id, title, note, internal } = parsed.data;

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title,
    note,
    internal: internal === "on" || internal === "true",
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);
  return done("Update added.");
}

/* -------------------------------------------------------------- documents */

export async function uploadDeliverableAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!idSchema.safeParse(id).success) return problem("Invalid application.");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return problem("Choose the finished document to upload.");
  }
  if (file.size > 20 * 1024 * 1024) {
    return problem("That file is larger than 20 MB.");
  }

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";
  const filename = cleanFilename(file.name, `${application.trackingId}.pdf`);

  // Replacing an earlier upload: drop the old blobs so GridFS does not grow.
  if (application.deliverable.fileId) {
    await deleteFile(application.deliverable.fileId);
  }
  if (application.deliverable.previewFileId) {
    await deleteFile(application.deliverable.previewFileId);
  }

  const fileId = await uploadBuffer({
    buffer,
    filename,
    contentType,
    metadata: {
      trackingId: application.trackingId,
      kind: "deliverable",
      uploadedBy: session.name,
    },
  });

  const preview = await buildWatermarkedPreview({
    buffer,
    contentType,
    trackingId: application.trackingId,
  });

  let previewFileId;
  if (preview) {
    previewFileId = await uploadBuffer({
      buffer: preview.buffer,
      filename: `preview-${application.trackingId}.pdf`,
      contentType: preview.contentType,
      metadata: { trackingId: application.trackingId, kind: "preview" },
    });
  }

  application.deliverable = {
    fileId,
    previewFileId,
    filename,
    contentType,
    size: file.size,
    uploadedAt: new Date(),
    // A fresh upload always starts locked, whatever the previous state was.
    released: false,
    releasedAt: undefined,
    downloadCount: 0,
    lastDownloadedAt: undefined,
  };

  if (!["FULL_PAID", "DELIVERED"].includes(application.status)) {
    application.status = "READY_PREVIEW";
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title: "Document ready for your review",
    note: preview
      ? "A watermarked preview is now visible on your tracking page. The original unlocks after the balance is cleared."
      : "Your document is ready. Contact us to view it before clearing the balance.",
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);

  return done(
    preview
      ? "Document uploaded and a watermarked preview was generated."
      : "Document uploaded. No preview could be generated for this file type."
  );
}

export async function releaseDocumentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({ id: idSchema, force: z.string().optional() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return problem("Invalid application.");

  await connectDB();
  const application = await Application.findById(parsed.data.id);
  if (!application) return problem("Application not found.");

  if (!application.deliverable.fileId) {
    return problem("Upload the finished document first.");
  }

  const balancePaid = application.payments.balance.status !== "PENDING";
  const forced = parsed.data.force === "on" || parsed.data.force === "true";

  if (!balancePaid && !forced) {
    return problem(
      "The balance is still pending. Record the payment first, or tick the override box."
    );
  }

  application.deliverable.released = true;
  application.deliverable.releasedAt = new Date();
  application.status = "DELIVERED";

  application.timeline.push({
    status: "DELIVERED",
    title: "Document released",
    note: "Your original document is now available to download on this page for the next 90 days.",
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(parsed.data.id);
  return done("Document released. The client can download it now.");
}

export async function lockDocumentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z.object({ id: idSchema }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return problem("Invalid application.");

  await connectDB();
  const application = await Application.findById(parsed.data.id);
  if (!application) return problem("Application not found.");

  application.deliverable.released = false;
  application.deliverable.releasedAt = undefined;
  if (application.status === "DELIVERED") {
    application.status = application.payments.balance.status === "PENDING"
      ? "READY_PREVIEW"
      : "FULL_PAID";
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title: "Download temporarily locked",
    note: "",
    internal: true,
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(parsed.data.id);
  return done("Download locked again.");
}

/* ------------------------------------------------------------------ leads */

export async function updateLeadAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      status: z.enum(["NEW", "CONTACTED", "CONVERTED", "CLOSED"]),
      adminNote: z
        .unknown()
        .transform((value) => cleanText(typeof value === "string" ? value : "", 600)),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) return problem("Could not update that lead.");

  await connectDB();
  await Lead.updateOne(
    { _id: parsed.data.id },
    {
      $set: {
        status: parsed.data.status,
        adminNote: parsed.data.adminNote,
        handledBy: session.name,
        ...(parsed.data.status !== "NEW" ? { contactedAt: new Date() } : {}),
      },
    }
  );

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return done("Lead updated.");
}

/* --------------------------------------------------------------- password */

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      currentPassword: z.string().min(1, "Enter your current password"),
      newPassword: z
        .string()
        .min(10, "Use at least 10 characters")
        .max(128)
        .regex(/[a-z]/, "Include a lowercase letter")
        .regex(/[A-Z]/, "Include an uppercase letter")
        .regex(/\d/, "Include a number"),
      confirmPassword: z.string(),
    })
    .safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return problem(parsed.error.issues[0]?.message ?? "Check the form.");
  }
  if (parsed.data.newPassword !== parsed.data.confirmPassword) {
    return problem("The two new passwords do not match.");
  }

  await connectDB();
  const user = await AdminUser.findById(session.sub).select("+passwordHash");
  if (!user) return problem("Account not found.");

  const matches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash
  );
  if (!matches) return problem("Your current password is not correct.");

  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  // Invalidates every existing session, including this one.
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();

  return done("Password changed. Please sign in again with the new password.");
}
