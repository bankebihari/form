import type { ApplicationStatus, PaymentState } from "@/lib/constants";

/** Plain (JSON-safe) shapes handed from server components to the client. */

export type PlainService = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  icon: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  governmentFeeNote: string;
  estimatedDays: string;
  documentsRequired: string[];
  eligibility: string[];
  steps: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
  popular: boolean;
  active: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type PlainPayment = {
  label: string;
  percent: number;
  amount: number;
  status: PaymentState;
  method?: string;
  reference?: string;
  receivedAt?: string;
  note?: string;
};

export type PlainTimelineEntry = {
  status: ApplicationStatus;
  title: string;
  note?: string;
  internal?: boolean;
  by?: string;
  at: string;
};

export type PlainMessage = {
  from: "CLIENT" | "STAFF";
  body: string;
  byName?: string;
  at: string;
  readAt?: string;
};

export type PlainAttachment = {
  fileId: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedAt: string;
};

export type PlainApplication = {
  _id: string;
  trackingId: string;
  service: {
    serviceId?: string;
    slug: string;
    title: string;
    startingPrice?: number;
  };
  applicant: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    state?: string;
    address?: string;
  };
  requirement?: string;
  extra?: Record<string, string>;
  attachments: PlainAttachment[];
  status: ApplicationStatus;
  quote: {
    totalAmount: number;
    governmentFee: number;
    notes?: string;
    quotedAt?: string;
  };
  payments: { advance: PlainPayment; balance: PlainPayment };
  deliverable: {
    fileId?: string;
    previewFileId?: string;
    filename?: string;
    contentType?: string;
    size?: number;
    uploadedAt?: string;
    released: boolean;
    releasedAt?: string;
    downloadCount?: number;
    lastDownloadedAt?: string;
  };
  timeline: PlainTimelineEntry[];
  messages: PlainMessage[];
  source: string;
  priority: "NORMAL" | "URGENT";
  assignedTo?: string;
  internalNotes?: string;
  lastViewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

/** What the public tracking page is allowed to see — never the raw document. */
export type TrackingView = {
  trackingId: string;
  status: ApplicationStatus;
  serviceTitle: string;
  serviceSlug: string;
  applicantName: string;
  createdAt: string;
  updatedAt: string;
  quote: { totalAmount: number; governmentFee: number; notes?: string };
  payments: { advance: PlainPayment; balance: PlainPayment };
  amountDue: number;
  document: {
    exists: boolean;
    filename?: string;
    hasPreview: boolean;
    released: boolean;
    releasedAt?: string;
  };
  timeline: PlainTimelineEntry[];
  messages: PlainMessage[];
};

/** Enough to pick between several requests raised from one mobile number. */
export type TrackingMatch = {
  trackingId: string;
  serviceTitle: string;
  statusLabel: string;
  createdAt: string;
};

/** Lead as handed to admin client components. */
export type LeadDocPlain = {
  _id: string;
  type: "CALLBACK" | "DEMO" | "CONTACT";
  name: string;
  phone: string;
  email?: string;
  city?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  message?: string;
  preferredDate?: string;
  preferredSlot?: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  source: string;
  handledBy?: string;
  adminNote?: string;
  contactedAt?: string;
  createdAt: string;
  updatedAt: string;
};
