import { SignJWT, jwtVerify } from "jose";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 24) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random string in .env.local."
    );
  }
  return new TextEncoder().encode(value);
}

/* -------------------------------------------------------------------------
   Client tracking tokens
   Issued after a successful Tracking ID + phone lookup. They let the browser
   fetch the preview and (once released) the original file without ever putting
   the phone number in a URL.
   ------------------------------------------------------------------------- */

export type TrackTokenPayload = {
  applicationId: string;
  trackingId: string;
};

export async function signTrackToken(payload: TrackTokenPayload) {
  return new SignJWT({ ...payload, scope: "track" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret());
}

export async function verifyTrackToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.scope !== "track") return null;
    return {
      applicationId: String(payload.applicationId),
      trackingId: String(payload.trackingId),
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------
   Admin session tokens
   ------------------------------------------------------------------------- */

export type AdminTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
  tokenVersion: number;
};

export const ADMIN_COOKIE = "docseva_admin";

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT({ ...payload, scope: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.scope !== "admin") return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "OWNER" ? ("OWNER" as const) : ("STAFF" as const),
      tokenVersion: Number(payload.tokenVersion ?? 0),
    };
  } catch {
    return null;
  }
}
