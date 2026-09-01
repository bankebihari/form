/** Application lifecycle. The order here drives the tracking timeline. */
export const APPLICATION_STATUSES = [
  "SUBMITTED",
  "QUOTED",
  "ADVANCE_PAID",
  "IN_PROGRESS",
  "READY_PREVIEW",
  "FULL_PAID",
  "DELIVERED",
] as const;

export const TERMINAL_STATUSES = ["ON_HOLD", "CANCELLED"] as const;

export const ALL_STATUSES = [
  ...APPLICATION_STATUSES,
  ...TERMINAL_STATUSES,
] as const;

export type ApplicationStatus = (typeof ALL_STATUSES)[number];

type StatusMeta = {
  label: string;
  /** Shown to the client on the tracking page. */
  clientLabel: string;
  description: string;
  tone: "neutral" | "info" | "warn" | "success" | "danger";
};

export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  SUBMITTED: {
    label: "Submitted",
    clientLabel: "Request received",
    description:
      "We have your request. Our team will call you shortly to confirm details and share the final price.",
    tone: "info",
  },
  QUOTED: {
    label: "Quoted",
    clientLabel: "Price confirmed",
    description:
      "Your price is confirmed. Pay the 10% booking amount over call or WhatsApp and we begin immediately.",
    tone: "warn",
  },
  ADVANCE_PAID: {
    label: "Advance received",
    clientLabel: "Booking amount received",
    description:
      "Thank you. Your 10% booking amount is recorded and your file is now in our work queue.",
    tone: "success",
  },
  IN_PROGRESS: {
    label: "In progress",
    clientLabel: "Work in progress",
    description:
      "Our team is preparing and filing your document with the concerned department.",
    tone: "info",
  },
  READY_PREVIEW: {
    label: "Ready — preview",
    clientLabel: "Document ready (preview)",
    description:
      "Your document is ready. You can view a watermarked preview here. Clear the remaining 90% to unlock the original download.",
    tone: "warn",
  },
  FULL_PAID: {
    label: "Full payment received",
    clientLabel: "Payment complete",
    description:
      "Full payment recorded. Your original document is being released to your tracking page.",
    tone: "success",
  },
  DELIVERED: {
    label: "Delivered",
    clientLabel: "Delivered",
    description:
      "Your original document is available for download. It stays here for 90 days.",
    tone: "success",
  },
  ON_HOLD: {
    label: "On hold",
    clientLabel: "On hold",
    description:
      "This request is temporarily paused. Our team will contact you with the reason and next step.",
    tone: "warn",
  },
  CANCELLED: {
    label: "Cancelled",
    clientLabel: "Cancelled",
    description: "This request was cancelled.",
    tone: "danger",
  },
};

export const PAYMENT_STATES = ["PENDING", "RECEIVED", "WAIVED"] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const PAYMENT_METHODS = [
  "UPI",
  "CASH",
  "BANK_TRANSFER",
  "CHEQUE",
  "OTHER",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const LEAD_TYPES = ["CALLBACK", "DEMO", "CONTACT"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "CONVERTED",
  "CLOSED",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_META: Record<
  LeadStatus,
  { label: string; tone: "info" | "warn" | "success" | "neutral" }
> = {
  NEW: { label: "New", tone: "info" },
  CONTACTED: { label: "Contacted", tone: "warn" },
  CONVERTED: { label: "Converted", tone: "success" },
  CLOSED: { label: "Closed", tone: "neutral" },
};

export const CALL_SLOTS = [
  "09:00 AM – 11:00 AM",
  "11:00 AM – 01:00 PM",
  "01:00 PM – 04:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
] as const;

export const LEAD_SOURCES = [
  "WEBSITE",
  "YOUTUBE",
  "WHATSAPP",
  "REFERRAL",
  "WALK_IN",
  "OTHER",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

/** Status reached => which step of the public timeline is complete. */
export function statusStepIndex(status: ApplicationStatus) {
  const index = APPLICATION_STATUSES.indexOf(
    status as (typeof APPLICATION_STATUSES)[number]
  );
  return index; // -1 for ON_HOLD / CANCELLED
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_UPLOAD_FILES = 5;
export const ACCEPTED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];
