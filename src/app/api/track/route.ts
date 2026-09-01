import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  ok,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import { STATUS_META } from "@/lib/constants";
import { connectDB, serialize } from "@/lib/db";
import {
  cleanTrackingId,
  isValidPhone,
  isValidTrackingId,
  normalisePhone,
} from "@/lib/sanitize";
import { signTrackToken } from "@/lib/tokens";
import { toTrackingView } from "@/lib/tracking";
import { trackLookupSchema } from "@/lib/validation";
import { Application } from "@/models/Application";
import type { PlainApplication, TrackingMatch } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deliberately identical for every kind of miss, so nothing can be probed. */
const NOT_FOUND =
  "We could not find anything for that. Check the Tracking ID or the mobile number, or message us on WhatsApp and we will look it up for you.";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    // Tight limit: this is the only gate on someone's application.
    const limit = rateLimit(`track:${ip}`, 12, 5 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Enter your Tracking ID or mobile number.", 422);
    }

    const parsed = trackLookupSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      return fail("Please check what you entered.", 422, errors);
    }

    const query = parsed.data.query;
    await connectDB();

    // A Tracking ID is unguessable, so on its own it identifies one request.
    // A mobile number can have several, so that returns a list to pick from.
    const asTrackingId = cleanTrackingId(query);
    const asPhone = normalisePhone(query);

    let docs: unknown[] = [];

    if (isValidTrackingId(asTrackingId)) {
      const doc = await Application.findOne({ trackingId: asTrackingId }).lean();
      if (doc) docs = [doc];
    } else if (isValidPhone(asPhone)) {
      docs = await Application.find({ "applicant.phone": asPhone })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    } else {
      return fail(
        "That does not look like a Tracking ID or a 10-digit mobile number.",
        422,
        { query: "Enter your Tracking ID or the mobile number you gave us" }
      );
    }

    if (!docs.length) return fail(NOT_FOUND, 404);

    const applications = serialize(docs) as unknown as PlainApplication[];

    // Several requests from one number: send back just enough to choose.
    if (applications.length > 1) {
      const matches: TrackingMatch[] = applications.map((application) => ({
        trackingId: application.trackingId,
        serviceTitle: application.service.title,
        statusLabel: STATUS_META[application.status]?.label ?? application.status,
        createdAt: application.createdAt,
      }));
      return ok({ matches });
    }

    const application = applications[0]!;

    // Useful for follow-ups: we know the client has actually looked.
    await Application.updateOne(
      { _id: application._id },
      { $set: { lastViewedAt: new Date() } }
    );

    const token = await signTrackToken({
      applicationId: String(application._id),
      trackingId: application.trackingId,
    });

    return ok({ view: toTrackingView(application), token });
  } catch (error) {
    return handleError(error);
  }
}
