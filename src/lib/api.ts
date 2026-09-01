import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fieldErrors } from "@/lib/validation";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(
  message: string,
  status = 400,
  errors?: Record<string, string>
) {
  return NextResponse.json({ ok: false, message, errors }, { status });
}

/** One place to turn any thrown value into a safe JSON response. */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Please check the highlighted fields.", 422, fieldErrors(error));
  }

  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("MONGODB_URI is not set")) {
    console.error("[api] database not configured");
    return fail(
      "The service is not connected to its database yet. Please call us and we will take your request over the phone.",
      503
    );
  }

  if (message.includes("E11000")) {
    return fail("That record already exists.", 409);
  }

  console.error("[api]", error);
  return fail(
    "Something went wrong on our side. Please try again, or reach us on WhatsApp.",
    500
  );
}

/**
 * In-memory sliding window. Enough to stop casual form spam on a single
 * instance; put a real limiter in front of the app if you scale horizontally.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((time) => now - time < windowMs);
  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > 5000) {
    for (const [bucketKey, times] of buckets) {
      if (!times.some((time) => now - time < windowMs)) buckets.delete(bucketKey);
    }
  }

  return {
    allowed: hits.length <= limit,
    remaining: Math.max(0, limit - hits.length),
  };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function tooManyRequests() {
  return fail(
    "Too many attempts. Please wait a minute and try again, or message us on WhatsApp.",
    429
  );
}
