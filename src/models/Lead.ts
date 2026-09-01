import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { LEAD_SOURCES, LEAD_STATUSES, LEAD_TYPES } from "@/lib/constants";

const LeadSchema = new Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    city: { type: String, trim: true, default: "" },
    /** Which service they asked about, when known. */
    serviceSlug: { type: String, default: "" },
    serviceTitle: { type: String, default: "" },
    message: { type: String, default: "", trim: true },

    /** Callback / demo scheduling */
    preferredDate: { type: String, default: "" }, // yyyy-mm-dd
    preferredSlot: { type: String, default: "" },

    status: { type: String, enum: LEAD_STATUSES, default: "NEW", index: true },
    source: { type: String, enum: LEAD_SOURCES, default: "WEBSITE" },
    handledBy: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    contactedAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });

export type LeadDoc = InferSchemaType<typeof LeadSchema> & { _id: string };

export const Lead: Model<LeadDoc> =
  (models.Lead as Model<LeadDoc>) || model<LeadDoc>("Lead", LeadSchema);
