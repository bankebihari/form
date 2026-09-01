import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  ALL_STATUSES,
  LEAD_SOURCES,
  PAYMENT_METHODS,
  PAYMENT_STATES,
} from "@/lib/constants";

const AttachmentSchema = new Schema(
  {
    fileId: { type: Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PaymentSchema = new Schema(
  {
    label: { type: String, required: true }, // "Booking (10%)" / "Balance (90%)"
    percent: { type: Number, required: true },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: PAYMENT_STATES, default: "PENDING" },
    method: { type: String, enum: PAYMENT_METHODS, default: undefined },
    reference: { type: String, default: "" }, // UPI ref / receipt no.
    receivedAt: { type: Date, default: undefined },
    recordedBy: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const PaymentsSchema = new Schema(
  {
    advance: {
      type: PaymentSchema,
      required: true,
      default: () => ({ label: "Booking (10%)", percent: 10 }),
    },
    balance: {
      type: PaymentSchema,
      required: true,
      default: () => ({ label: "Balance (90%)", percent: 90 }),
    },
  },
  { _id: false }
);

const DeliverableSchema = new Schema(
  {
    fileId: { type: Schema.Types.ObjectId, default: undefined },
    previewFileId: { type: Schema.Types.ObjectId, default: undefined },
    filename: { type: String, default: "" },
    contentType: { type: String, default: "" },
    size: { type: Number, default: 0 },
    uploadedAt: { type: Date, default: undefined },
    /** Master switch - the original file is downloadable only when true. */
    released: { type: Boolean, default: false },
    releasedAt: { type: Date, default: undefined },
    downloadCount: { type: Number, default: 0 },
    lastDownloadedAt: { type: Date, default: undefined },
  },
  { _id: false }
);

const TimelineSchema = new Schema(
  {
    status: { type: String, enum: ALL_STATUSES, required: true },
    title: { type: String, required: true },
    note: { type: String, default: "" },
    /** Hidden entries are internal-only and never shown on the tracking page. */
    internal: { type: Boolean, default: false },
    by: { type: String, default: "System" },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema = new Schema(
  {
    trackingId: { type: String, required: true, unique: true, uppercase: true, trim: true },

    service: {
      serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
      slug: { type: String, required: true },
      title: { type: String, required: true },
      startingPrice: { type: Number, default: 0 },
    },

    applicant: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      email: { type: String, trim: true, lowercase: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      address: { type: String, trim: true, default: "" },
    },

    requirement: { type: String, default: "", trim: true },
    /** Free-form per-service answers, e.g. { purpose: "college admission" } */
    extra: { type: Map, of: String, default: {} },

    attachments: { type: [AttachmentSchema], default: [] },

    status: { type: String, enum: ALL_STATUSES, default: "SUBMITTED", index: true },

    quote: {
      totalAmount: { type: Number, default: 0 },
      governmentFee: { type: Number, default: 0 },
      notes: { type: String, default: "" },
      quotedAt: { type: Date, default: undefined },
    },

    payments: { type: PaymentsSchema, required: true, default: () => ({}) },

    deliverable: { type: DeliverableSchema, required: true, default: () => ({}) },

    timeline: { type: [TimelineSchema], default: [] },

    source: { type: String, enum: LEAD_SOURCES, default: "WEBSITE" },
    priority: { type: String, enum: ["NORMAL", "URGENT"], default: "NORMAL" },
    assignedTo: { type: String, default: "" },
    internalNotes: { type: String, default: "" },
    /** Set when the client opens their tracking page — useful for follow-ups. */
    lastViewedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ status: 1, createdAt: -1 });
ApplicationSchema.index({ "applicant.phone": 1, trackingId: 1 });

/** Booking amount due (10% of total) — computed, never trusted from the client. */
ApplicationSchema.methods.advanceDue = function advanceDue() {
  return Math.round((this.quote?.totalAmount ?? 0) * 0.1);
};

export type ApplicationDoc = InferSchemaType<typeof ApplicationSchema> & {
  _id: string;
};

export const Application: Model<ApplicationDoc> =
  (models.Application as Model<ApplicationDoc>) ||
  model<ApplicationDoc>("Application", ApplicationSchema);
