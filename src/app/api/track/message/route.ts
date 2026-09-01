import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  ok,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import { connectDB } from "@/lib/db";
import { cleanText } from "@/lib/sanitize";
import { verifyTrackToken } from "@/lib/tokens";
import { Application } from "@/models/Application";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A client replying on their own tracking page. The signed token from their
 * lookup is what authorises it — there is no account to log in to.
 */
export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(`track-message:${clientIp(request)}`, 20, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return fail("Write a message first.", 422);
    }

    const { token, body } = (payload ?? {}) as { token?: unknown; body?: unknown };

    const claims = await verifyTrackToken(typeof token === "string" ? token : "");
    if (!claims) {
      return fail("Your session expired. Please look up your application again.", 401);
    }

    const message = cleanText(body, 1200);
    if (message.length < 2) {
      return fail("Write a message first.", 422, {
        body: "Please type your message",
      });
    }

    await connectDB();

    const result = await Application.updateOne(
      { _id: claims.applicationId },
      {
        $push: {
          messages: { from: "CLIENT", body: message, at: new Date() },
        },
      }
    );

    if (!result.matchedCount) return fail("Application not found.", 404);

    return ok({ sent: true }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
