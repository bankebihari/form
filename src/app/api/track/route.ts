import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  ok,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import { connectDB, serialize } from "@/lib/db";
import { signTrackToken } from "@/lib/tokens";
import { normalisePhone, toTrackingView } from "@/lib/tracking";
import { trackLookupSchema } from "@/lib/validation";
import { Application } from "@/models/Application";
import type { PlainApplication } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    // Tight limit: the Tracking ID plus phone pair must not be brute-forceable.
    const limit = rateLimit(`track:${ip}`, 12, 5 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    const body = await request.json();
    const parsed = trackLookupSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!errors[key]) errors[key] = issue.message;
      }
      return fail("Please check the details you entered.", 422, errors);
    }

    await connectDB();

    const trackingId = parsed.data.trackingId.trim().toUpperCase();
    const phone = normalisePhone(parsed.data.phone);

    const doc = await Application.findOne({
      trackingId,
      "applicant.phone": phone,
    }).lean();

    if (!doc) {
      // Same message either way, so this cannot be used to enumerate IDs.
      return fail(
        "We could not find an application with that Tracking ID and mobile number. Check both, or message us on WhatsApp and we will look it up for you.",
        404
      );
    }

    const application = serialize(doc) as unknown as PlainApplication;

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
