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

  // The database being unreachable is an outage, not a client mistake. Saying
  // so plainly stops it looking like a wrong password on the login screen.
  const name = error instanceof Error ? error.name : "";
  if (
    name === "MongooseServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoServerSelectionError" ||
    message.includes("Could not connect to any servers") ||
    message.includes("connection timed out") ||
    message.includes("ECONNREFUSED")
  ) {
    console.error("[api] database unreachable:", message);
    return fail(
      "We cannot reach the database right now. If you are the site owner, check that this server's IP address is allowed in MongoDB Atlas under Network Access.",
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

/**
 * The caller's IP, as reported by the proxy in front of us.
 *
 * These headers are only trustworthy behind a proxy that sets them (Vercel,
 * nginx, Cloudflare). If you ever run this process exposed directly to the
 * internet, a client can forge x-forwarded-for and slip past the rate limits —
 * put a proxy in front, or switch to the socket address.
 */
export function clientIp(request: Request) {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0]!.trim();

  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();

  return "unknown";
}

/**
 * Counts only the attempts we choose to record, so a rate limit can be spent
 * by failures alone. Used to slow password guessing against a single account
 * without letting anyone lock a colleague out by spamming their address.
 */
const failures = new Map<string, number[]>();

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const hits = (failures.get(key) ?? []).filter((time) => now - time < windowMs);
  hits.push(now);
  failures.set(key, hits);

  if (failures.size > 5000) {
    for (const [bucketKey, times] of failures) {
      if (!times.some((time) => now - time < windowMs)) failures.delete(bucketKey);
    }
  }
}

export function failureCount(key: string, windowMs: number) {
  const now = Date.now();
  return (failures.get(key) ?? []).filter((time) => now - time < windowMs).length;
}

export function clearFailures(key: string) {
  failures.delete(key);
}

export function tooManyRequests() {
  return fail(
    "Too many attempts. Please wait a minute and try again, or message us on WhatsApp.",
    429
  );
}
