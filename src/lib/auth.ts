import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import {
  ADMIN_COOKIE,
  signAdminToken,
  verifyAdminToken,
  type AdminTokenPayload,
} from "@/lib/tokens";
import { AdminUser } from "@/models/AdminUser";

export type AdminSession = AdminTokenPayload;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function createSession(payload: AdminTokenPayload) {
  const token = await signAdminToken(payload);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, COOKIE_OPTIONS);
}

export async function destroySession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

/**
 * Reads the signed cookie and re-checks the account against the database, so a
 * deactivated staff member or a changed password kills the session immediately.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const claims = await verifyAdminToken(token);
  if (!claims) return null;

  try {
    await connectDB();
    const user = await AdminUser.findById(claims.sub)
      .select("name email role active tokenVersion")
      .lean();
    if (!user || !user.active) return null;
    if ((user.tokenVersion ?? 0) !== claims.tokenVersion) return null;

    return {
      sub: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role as "OWNER" | "STAFF",
      tokenVersion: user.tokenVersion ?? 0,
    };
  } catch (error) {
    console.error("[auth] session check failed:", error);
    return null;
  }
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
