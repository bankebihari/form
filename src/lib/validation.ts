import { z } from "zod";
import { INDIAN_STATES } from "@/data/states";
import { CALL_SLOTS } from "@/lib/constants";
import {
  CITY_MAX,
  EMAIL_MAX,
  NAME_MAX,
  PASSWORD_MAX,
  TRACKING_ID_MAX,
  capPassword,
  cleanCity,
  cleanEmail,
  cleanLine,
  cleanName,
  cleanText,
  cleanTrackingId,
  isValidEmail,
  isValidName,
  isValidPhone,
  normalisePhone,
} from "@/lib/sanitize";

/**
 * Every schema here sanitises first and validates second, using the shared
 * helpers in `lib/sanitize`. The browser runs the same helpers, so what the
 * form accepts and what the server accepts cannot drift apart — and the server
 * still cleans everything again, because a form is not a security boundary.
 */

export const phoneSchema = z
  .string()
  .max(20, "That does not look like a phone number")
  .transform(normalisePhone)
  .refine(isValidPhone, "Enter a valid 10-digit Indian mobile number");

export const nameSchema = z
  .string()
  .max(200)
  .transform(cleanName)
  .refine(isValidName, "Please enter your full name using letters only");

export const optionalEmail = z
  .string()
  .max(300)
  .optional()
  .default("")
  .transform(cleanEmail)
  .refine(
    (value) => value === "" || isValidEmail(value),
    "Enter a valid email address"
  );

/** Free text we store and later show to staff. */
const paragraph = (max: number, message: string) =>
  z
    .string()
    .max(max * 4, message)
    .optional()
    .default("")
    .transform((value) => cleanText(value, max));

const line = (max: number) =>
  z
    .string()
    .max(max * 4)
    .optional()
    .default("")
    .transform((value) => cleanLine(value, max));

const citySchema = z
  .string()
  .max(CITY_MAX * 4)
  .optional()
  .default("")
  .transform(cleanCity);

/** A free-text state would end up in reports, so it must be one we know. */
const stateSchema = z
  .string()
  .max(80)
  .optional()
  .default("")
  .transform((value) => cleanLine(value, 80))
  .refine(
    (value) =>
      value === "" || (INDIAN_STATES as readonly string[]).includes(value),
    "Choose a state from the list"
  );

export const applicationInputSchema = z.object({
  serviceSlug: z
    .string()
    .max(80)
    .transform((value) => value.trim().toLowerCase())
    .refine(
      (value) => /^[a-z0-9-]{2,80}$/.test(value),
      "Choose the service you need"
    ),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmail,
  city: citySchema,
  state: stateSchema,
  address: paragraph(240, "Please keep the address shorter"),
  requirement: paragraph(1500, "Please keep this under 1500 characters"),
  purpose: line(120),
  urgent: z.boolean().optional().default(false),
  consent: z
    .boolean()
    .refine((value) => value === true, "Please accept the terms to continue"),
  /** Honeypot — real people never fill this hidden field. */
  website: z.string().max(0).optional().default(""),
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;

export const leadInputSchema = z.object({
  type: z.enum(["CALLBACK", "DEMO", "CONTACT"]),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmail,
  city: citySchema,
  serviceSlug: z
    .string()
    .max(80)
    .optional()
    .default("")
    .transform((value) => value.trim().toLowerCase())
    .refine(
      (value) => value === "" || /^[a-z0-9-]{2,80}$/.test(value),
      "Unknown service"
    ),
  serviceTitle: line(120),
  message: paragraph(1200, "Please keep this under 1200 characters"),
  preferredDate: z
    .string()
    .max(20)
    .optional()
    .default("")
    .transform((value) => cleanLine(value, 20))
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      "Pick a valid date"
    )
    .refine((value) => {
      if (!value) return true;
      const picked = new Date(`${value}T00:00:00`);
      if (Number.isNaN(picked.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const limit = new Date(today);
      limit.setDate(limit.getDate() + 60);
      return picked >= today && picked <= limit;
    }, "Pick a date within the next 60 days"),
  preferredSlot: z
    .string()
    .max(40)
    .optional()
    .default("")
    .transform((value) => cleanLine(value, 40))
    .refine(
      (value) => value === "" || (CALL_SLOTS as readonly string[]).includes(value),
      "Pick a time window from the list"
    ),
  consent: z
    .boolean()
    .refine((value) => value === true, "Please accept the terms to continue"),
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const trackLookupSchema = z.object({
  trackingId: z
    .string()
    .max(TRACKING_ID_MAX * 4)
    .transform(cleanTrackingId)
    .refine(
      (value) => value.length >= 6,
      "Enter the Tracking ID we sent you, for example DS-2609-0042"
    ),
  phone: phoneSchema,
});

export const adminLoginSchema = z.object({
  email: z
    .string()
    .max(EMAIL_MAX * 4)
    .transform(cleanEmail)
    .refine(isValidEmail, "Enter a valid email address"),
  // Never trimmed or rewritten: that would change what someone typed. Only
  // capped, so an oversized body cannot make bcrypt burn CPU.
  password: z
    .string()
    .transform(capPassword)
    .refine((value) => value.length >= 8, "Password must be at least 8 characters"),
});

export const NAME_LIMIT = NAME_MAX;
export const PASSWORD_LIMIT = PASSWORD_MAX;

/** Turns a ZodError into { fieldName: message } for the form UI. */
export function fieldErrors(error: z.ZodError) {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!output[key]) output[key] = issue.message;
  }
  return output;
}
