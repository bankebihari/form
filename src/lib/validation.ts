import { z } from "zod";
import { CALL_SLOTS } from "@/lib/constants";

/** Indian mobile numbers, tolerant of +91, 0 prefixes and spaces. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s\-()]/g, ""))
  .refine(
    (value) => /^(\+?91|0)?[6-9]\d{9}$/.test(value),
    "Enter a valid 10-digit Indian mobile number"
  )
  .transform((value) => value.replace(/^(\+?91|0)/, ""));

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(80, "That name looks too long")
  .regex(/^[\p{L}\s.'-]+$/u, "Name can only contain letters, spaces and . ' -");

export const optionalEmail = z
  .union([z.literal(""), z.string().trim().email("Enter a valid email address")])
  .optional()
  .transform((value) => value || "");

const shortText = (max: number) => z.string().trim().max(max).optional().default("");

export const applicationInputSchema = z.object({
  serviceSlug: z.string().trim().min(1, "Choose the service you need"),
  name: nameSchema,
  phone: phoneSchema,
  email: optionalEmail,
  city: shortText(60),
  state: shortText(60),
  address: shortText(240),
  requirement: z
    .string()
    .trim()
    .max(1500, "Please keep this under 1500 characters")
    .optional()
    .default(""),
  purpose: shortText(120),
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
  city: shortText(60),
  serviceSlug: shortText(80),
  serviceTitle: shortText(120),
  message: z
    .string()
    .trim()
    .max(1200, "Please keep this under 1200 characters")
    .optional()
    .default(""),
  preferredDate: z
    .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date")])
    .optional()
    .default(""),
  preferredSlot: z
    .union([z.literal(""), z.enum(CALL_SLOTS)])
    .optional()
    .default(""),
  consent: z
    .boolean()
    .refine((value) => value === true, "Please accept the terms to continue"),
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const trackLookupSchema = z.object({
  trackingId: z
    .string()
    .trim()
    .toUpperCase()
    .min(6, "Enter the Tracking ID we sent you")
    .max(24),
  phone: phoneSchema,
});

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Turns a ZodError into { fieldName: message } for the form UI. */
export function fieldErrors(error: z.ZodError) {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!output[key]) output[key] = issue.message;
  }
  return output;
}
