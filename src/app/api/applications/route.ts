import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  ok,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import {
  ACCEPTED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  MAX_UPLOAD_TOTAL_BYTES,
} from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { uploadBuffer } from "@/lib/gridfs";
import { UNSPECIFIED_SERVICE_SLUG } from "@/lib/constants";
import { cleanFilename } from "@/lib/sanitize";
import { getServiceBySlug } from "@/lib/services";
import { applicationInputSchema } from "@/lib/validation";
import { Application } from "@/models/Application";
import { generateTrackingId } from "@/lib/tracking-id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function boolFrom(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function textFrom(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(`application:${ip}`, 6, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return fail("We could not read that submission. Please try again.", 422);
    }

    const parsed = applicationInputSchema.safeParse({
      serviceSlug: textFrom(form.get("serviceSlug")),
      name: textFrom(form.get("name")),
      phone: textFrom(form.get("phone")),
      email: textFrom(form.get("email")),
      city: textFrom(form.get("city")),
      state: textFrom(form.get("state")),
      address: textFrom(form.get("address")),
      requirement: textFrom(form.get("requirement")),
      purpose: textFrom(form.get("purpose")),
      urgent: boolFrom(form.get("urgent")),
      consent: boolFrom(form.get("consent")),
      website: textFrom(form.get("website")),
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      return fail("Please check the highlighted fields.", 422, errors);
    }

    const input = parsed.data;

    // Honeypot: quietly accept so the bot does not learn anything useful.
    if (input.website) return ok({ trackingId: "DS-0000-0000" });

    // No service chosen is a valid request: our team decides on the call.
    const service = input.serviceSlug
      ? await getServiceBySlug(input.serviceSlug)
      : null;

    if (input.serviceSlug && !service) {
      return fail("That service is not available. Please pick another.", 422, {
        serviceSlug: "Choose a service from the list",
      });
    }

    const serviceRef = service
      ? {
          serviceId: /^[0-9a-fA-F]{24}$/.test(service._id)
            ? service._id
            : undefined,
          slug: service.slug,
          title: service.title,
          startingPrice: service.startingPrice,
        }
      : { slug: UNSPECIFIED_SERVICE_SLUG, title: "Not specified yet" };

    await connectDB();

    const files = form
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0)
      .slice(0, MAX_UPLOAD_FILES);

    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes > MAX_UPLOAD_TOTAL_BYTES) {
      return fail(
        "Those files come to more than 4 MB altogether. Please send them on WhatsApp instead, or upload fewer at a time.",
        413
      );
    }

    for (const file of files) {
      // Never echo a raw client filename back into a message.
      const shown = cleanFilename(file.name, "That file");
      if (file.size > MAX_UPLOAD_BYTES) {
        return fail(
          `"${shown}" is larger than 4 MB. Please send it on WhatsApp instead.`,
          413
        );
      }
      if (file.type && !ACCEPTED_UPLOAD_TYPES.includes(file.type)) {
        return fail(
          `"${shown}" is not a supported file type. Upload a PDF or a photo.`,
          415
        );
      }
    }

    const trackingId = await generateTrackingId();

    const attachments = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // The filename is client-supplied and later lands in a response header,
      // so it is cleaned before it is ever stored.
      const filename = cleanFilename(file.name, "attachment");
      const contentType = file.type || "application/octet-stream";
      const fileId = await uploadBuffer({
        buffer,
        filename,
        contentType,
        metadata: { trackingId, kind: "supporting-document" },
      });
      attachments.push({
        fileId,
        filename,
        contentType,
        size: file.size,
        uploadedAt: new Date(),
      });
    }

    const application = await Application.create({
      trackingId,
      service: serviceRef,
      applicant: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        city: input.city,
        state: input.state,
        address: input.address,
      },
      requirement: input.requirement,
      // What they typed becomes the first message, so the thread on their
      // tracking page starts with their own words.
      messages: input.requirement
        ? [{ from: "CLIENT", body: input.requirement, at: new Date() }]
        : [],
      extra: input.purpose ? { purpose: input.purpose } : {},
      attachments,
      status: "SUBMITTED",
      priority: input.urgent ? "URGENT" : "NORMAL",
      source: "WEBSITE",
      timeline: [
        {
          status: "SUBMITTED",
          title: "Request received",
          note: service
            ? `Request raised on the website for ${service.title}.`
            : "Request raised on the website. The service will be confirmed on the call.",
          by: "Website",
          at: new Date(),
        },
      ],
    });

    return ok(
      {
        trackingId: application.trackingId,
        serviceTitle: serviceRef.title,
        name: input.name,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
