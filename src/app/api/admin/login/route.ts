import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import {
  clearFailures,
  clientIp,
  fail,
  failureCount,
  handleError,
  ok,
  rateLimit,
  recordFailure,
  tooManyRequests,
} from "@/lib/api";
import { createSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { adminLoginSchema } from "@/lib/validation";
import { AdminUser } from "@/models/AdminUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limit = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return fail("Enter your email and password.", 422);
    }

    const parsed = adminLoginSchema.safeParse(payload);
    if (!parsed.success) {
      return fail("Enter your email and password.", 422);
    }

    // Per-account throttle as well as per-IP, so guessing one password from
    // many addresses is slowed too. Only failures count, so nobody can lock a
    // colleague out by spamming their address with junk.
    const accountKey = `admin-login-account:${parsed.data.email}`;
    const accountWindow = 15 * 60 * 1000;
    if (failureCount(accountKey, accountWindow) >= 10) {
      return tooManyRequests();
    }

    await connectDB();

    const user = await AdminUser.findOne({ email: parsed.data.email })
      .select("+passwordHash name email role active tokenVersion")
      .exec();

    // Same response for unknown email and wrong password.
    const invalid = () => {
      recordFailure(accountKey, accountWindow);
      return fail("Incorrect email or password.", 401);
    };
    if (!user || !user.active) {
      // Burn similar time so timing does not leak whether the account exists.
      await bcrypt.compare(parsed.data.password, "$2a$12$invalidsaltinvalidsaltuO");
      return invalid();
    }

    const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!matches) return invalid();

    clearFailures(accountKey);

    await createSession({
      sub: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "OWNER" | "STAFF",
      tokenVersion: user.tokenVersion ?? 0,
    });

    user.lastLoginAt = new Date();
    await user.save();

    return ok({ name: user.name });
  } catch (error) {
    return handleError(error);
  }
}
