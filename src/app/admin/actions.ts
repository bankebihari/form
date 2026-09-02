"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  ALL_STATUSES,
  LEAD_SOURCES,
  MAX_UPLOAD_BYTES,
  PAYMENT_METHODS,
  UNSPECIFIED_SERVICE_SLUG,
  type ApplicationStatus,
} from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { computeQuote } from "@/lib/pricing";
import { deleteFile, uploadBuffer } from "@/lib/gridfs";
import {
  cleanAmount,
  cleanFilename,
  cleanLine,
  cleanName,
  cleanReference,
  cleanText,
  isValidPhone,
  normalisePhone,
} from "@/lib/sanitize";
import { Application } from "@/models/Application";
import { generateTrackingId } from "@/lib/tracking-id";
import { AdminUser } from "@/models/AdminUser";
import { Lead } from "@/models/Lead";
import { SETTINGS_ID, Setting } from "@/models/Setting";

export type ActionState = { ok: boolean; message: string };

const idSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid record id");

/**
 * Pulls the named fields out of a FormData as plain strings, with anything
 * missing becoming "".
 *
 * An unchecked checkbox or an absent input simply does not appear in a
 * FormData, and a schema that assumes the key is there fails with an unhelpful
 * "expected nonoptional, received undefined". Normalising here keeps every
 * schema below dealing with plain strings.
 */
function fields<K extends string>(formData: FormData, keys: readonly K[]) {
  const out = {} as Record<K, string>;
  for (const key of keys) {
    const value = formData.get(key);
    out[key] = typeof value === "string" ? value : "";
  }
  return out;
}

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

/* ------------------------------------------------- create from the panel */

/**
 * Raise a request on someone's behalf: a walk-in, a phone call, a WhatsApp
 * message. Only a mobile number and a title are needed. The Tracking ID that
 * comes back is what you send them, and it is all they need (with this number)
 * to follow the job themselves.
 */
export async function createApplicationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      phone: z
        .string()
        .transform((value) => normalisePhone(value))
        .refine(isValidPhone, "Enter a valid 10-digit mobile number"),
      title: z
        .string()
        .transform((value) => cleanLine(value, 120))
        .refine((value) => value.length >= 3, "Write what the work is"),
      name: z.string().transform((value) => cleanName(value)),
      serviceSlug: z
        .string()
        .transform((value) => cleanLine(value, 80).toLowerCase())
        .refine(
          (value) => value === "" || /^[a-z0-9-]{2,80}$/.test(value),
          "Choose a service from the list"
        ),
      source: z
        .string()
        .transform((value) =>
          ((LEAD_SOURCES as readonly string[]).includes(value)
            ? value
            : "WHATSAPP") as (typeof LEAD_SOURCES)[number]
        ),
      serviceCharge: z.string().transform((value) => cleanAmount(value)),
      governmentFee: z.string().transform((value) => cleanAmount(value)),
      note: z.string().transform((value) => cleanText(value, 800)),
      urgent: z
        .string()
        .transform((value) => value === "on" || value === "true"),
    })
    .safeParse(fields(formData, [
        "phone",
        "title",
        "name",
        "serviceSlug",
        "source",
        "serviceCharge",
        "governmentFee",
        "note",
        "urgent",
      ] as const));

  if (!parsed.success) {
    return problem(parsed.error.issues[0]?.message ?? "Check the details.");
  }

  const input = parsed.data;

  await connectDB();

  const trackingId = await generateTrackingId();
  const now = new Date();

  const application = await Application.create({
    trackingId,
    service: {
      slug: input.serviceSlug || UNSPECIFIED_SERVICE_SLUG,
      title: input.title,
    },
    applicant: {
      // A name is nice to have, but the phone number is what identifies them.
      name: input.name || "Client",
      phone: input.phone,
    },
    requirement: input.note,
    // Their own words start the conversation, so the thread reads in order.
    messages: input.note
      ? [{ from: "CLIENT" as const, body: input.note, at: now }]
      : [],
    status: "SUBMITTED",
    priority: input.urgent ? "URGENT" : "NORMAL",
    source: input.source,
    timeline: [
      {
        status: "SUBMITTED",
        title: "Request received",
        note: `Raised by our team for ${input.title}.`,
        by: session.name,
        at: now,
      },
    ],
  });

  // A price given up front saves a second visit to this screen.
  if (input.serviceCharge > 0) {
    const quote = computeQuote(input.serviceCharge, input.governmentFee);
    application.quote = {
      serviceCharge: quote.serviceCharge,
      governmentFee: quote.governmentFee,
      totalAmount: quote.total,
      notes: "",
      quotedAt: now,
    };
    application.payments.advance.amount = quote.advance;
    application.payments.balance.amount = quote.balance;
    application.status = "QUOTED";
    application.timeline.push({
      status: "QUOTED",
      title: "Price confirmed",
      note: `Government fee ${quote.governmentFee} + service charge ${quote.serviceCharge} = ${quote.total}. To start ${quote.advance}, balance ${quote.balance}.`,
      by: session.name,
      at: now,
    });
    await application.save();
  }

  refresh();
  // Straight to the record, where the "Send the Tracking ID" message is ready.
  redirect(`/admin/applications/${application._id}?created=1`);
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
      serviceCharge: z.string().transform((value) => cleanAmount(value)),
      governmentFee: z.string().transform((value) => cleanAmount(value)),
      notes: z.string().transform((value) => cleanText(value, 600)),
    })
    .safeParse(
      fields(formData, ["id", "serviceCharge", "governmentFee", "notes"] as const)
    );

  if (!parsed.success) return problem("Enter a valid amount.");
  const { id, serviceCharge, governmentFee, notes } = parsed.data;

  if (serviceCharge <= 0) {
    return problem("Enter your service charge. It cannot be zero.");
  }

  await connectDB();
  const application = await Application.findById(id);
  if (!application) return problem("Application not found.");

  // The government fee is payable in full up front; only our own charge splits.
  const quote = computeQuote(serviceCharge, governmentFee);

  application.quote = {
    serviceCharge: quote.serviceCharge,
    governmentFee: quote.governmentFee,
    totalAmount: quote.total,
    notes,
    quotedAt: new Date(),
  };
  application.payments.advance.amount = quote.advance;
  application.payments.balance.amount = quote.balance;

  // Only move the status forward: a re-quote must not undo later progress.
  if (application.status === "SUBMITTED") {
    application.status = "QUOTED";
  }

  application.timeline.push({
    status: application.status as ApplicationStatus,
    title: "Price confirmed",
    note: `Government fee ${quote.governmentFee} + service charge ${quote.serviceCharge} = ${quote.total}. To start ${quote.advance}, balance ${quote.balance}.${
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
      amount: z.string().transform((value) => cleanAmount(value)),
      method: z.enum(PAYMENT_METHODS),
      reference: z.string().transform((value) => cleanReference(value)),
      note: z.string().transform((value) => cleanText(value, 300)),
    })
    .safeParse(fields(formData, ["id","which","amount","method","reference","note"] as const));

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
    .safeParse(fields(formData, ["id","which"] as const));
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
      note: z.string().transform((value) => cleanText(value, 600)),
    })
    .safeParse(fields(formData, ["id","status","note"] as const));

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

/* --------------------------------------------------------------- replies */

/** A staff reply in the thread the client sees on their tracking page. */
export async function replyToClientAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({
      id: idSchema,
      body: z
        .string()
        .transform((value) => cleanText(value, 1200))
        .refine((value) => value.length >= 2, "Write a message first"),
    })
    .safeParse(fields(formData, ["id", "body"] as const));

  if (!parsed.success) {
    return problem(parsed.error.issues[0]?.message ?? "Write a message first.");
  }

  await connectDB();
  const now = new Date();

  // Marking the client's messages read has to be a separate update: MongoDB
  // refuses a $push and an arrayFilters $set on the same path in one command.
  const marked = await Application.updateOne(
    { _id: parsed.data.id },
    { $set: { "messages.$[unread].readAt": now } },
    { arrayFilters: [{ "unread.from": "CLIENT", "unread.readAt": null }] }
  );

  if (!marked.matchedCount) return problem("Application not found.");

  await Application.updateOne(
    { _id: parsed.data.id },
    {
      $push: {
        messages: {
          from: "STAFF",
          body: parsed.data.body,
          byName: session.name,
          at: now,
        },
      },
    }
  );

  refresh(parsed.data.id);
  return done("Reply sent. The client sees it on their tracking page.");
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
        .string()
        .transform((value) => cleanLine(value, 120))
        .refine((value) => value.length >= 2, "Write a short title"),
      note: z.string().transform((value) => cleanText(value, 800)),
      internal: z
        .union([z.literal("on"), z.literal("true"), z.literal("")])
        .optional(),
    })
    .safeParse(fields(formData, ["id","title","note","internal"] as const));

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
  // Same serverless body limit applies to server actions.
  if (file.size > MAX_UPLOAD_BYTES) {
    return problem(
      "That file is larger than 4 MB. Compress it or scan at a lower quality, then upload again."
    );
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

  application.deliverable = {
    fileId,
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
    title: "Your document is ready",
    note: "It is prepared and waiting. Clear the balance and it unlocks for download on this page.",
    by: session.name,
    at: new Date(),
  });

  await application.save();
  refresh(id);

  return done("Document uploaded. It stays locked until you release it.");
}

export async function releaseDocumentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const parsed = z
    .object({ id: idSchema, force: z.string().optional() })
    .safeParse(fields(formData, ["id","force"] as const));
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

  const parsed = z.object({ id: idSchema }).safeParse(fields(formData, ["id"] as const));
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
      adminNote: z.string().transform((value) => cleanText(value, 600)),
    })
    .safeParse(fields(formData, ["id","status","adminNote"] as const));

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

/* --------------------------------------------------------------- settings */

/** Only http(s) links, so nothing on the footer can become a javascript: URL. */
function cleanUrl(value: string) {
  const trimmed = cleanLine(value, 300);
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export async function saveSocialLinksAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireAdmin();

  const input = fields(formData, ["youtube", "instagram", "facebook"] as const);

  const social = {
    youtube: cleanUrl(input.youtube),
    instagram: cleanUrl(input.instagram),
    facebook: cleanUrl(input.facebook),
  };

  // Tell them which one was dropped rather than silently blanking it.
  const rejected = (
    ["youtube", "instagram", "facebook"] as const
  ).filter((key) => input[key].trim() && !social[key]);

  if (rejected.length) {
    return problem(
      `That ${rejected.join(" and ")} link is not a valid web address. Paste the full link, starting with https://`
    );
  }

  await connectDB();
  await Setting.findByIdAndUpdate(
    SETTINGS_ID,
    { $set: { social, updatedBy: session.name } },
    { upsert: true, new: true }
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return done("Saved. The footer updates everywhere on the site.");
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
    .safeParse(fields(formData, ["currentPassword","newPassword","confirmPassword"] as const));

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
