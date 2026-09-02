import { randomInt } from "node:crypto";
import { siteConfig } from "@/config/site";
import { connectDB } from "@/lib/db";
import { Application } from "@/models/Application";

/**
 * Tracking IDs look like OCC-2609-K7Q3XM: the brand prefix, the month it was
 * raised, and six random characters.
 *
 * The random part matters. The ID on its own is enough to open a tracking
 * page, so a running sequence (0001, 0002, ...) would let anyone read the next
 * person's application by adding one. Thirty-two unambiguous characters over
 * six places is about a billion combinations, which is not worth guessing at
 * twelve lookups per five minutes.
 *
 * The alphabet leaves out 0/O and 1/I so nobody mistypes an ID read out over
 * the phone.
 */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const RANDOM_LENGTH = 6;

function randomBlock() {
  let out = "";
  for (let index = 0; index < RANDOM_LENGTH; index += 1) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

/**
 * Accepts 2 to 4 leading letters so IDs issued under an earlier brand prefix
 * keep resolving. Nobody should be told their Tracking ID stopped working
 * because we renamed the business.
 */
export function trackingIdPattern() {
  return new RegExp(`^[A-Z]{2,4}-\\d{4}-[${ALPHABET}]{${RANDOM_LENGTH}}$`);
}

export async function generateTrackingId() {
  await connectDB();

  const now = new Date();
  const period = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  // A collision is vanishingly unlikely, but cheap to rule out.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `${siteConfig.trackingPrefix}-${period}-${randomBlock()}`;
    const clash = await Application.exists({ trackingId: candidate });
    if (!clash) return candidate;
  }

  throw new Error("Could not generate a unique Tracking ID");
}
