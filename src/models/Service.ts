import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const FaqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Certificates",
    },
    /** lucide-react icon name, rendered by <ServiceIcon /> */
    icon: { type: String, default: "FileText" },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    /** "Starting from" price in INR. Final price is always confirmed on a call. */
    startingPrice: { type: Number, required: true, min: 0 },
    governmentFeeNote: { type: String, default: "Government fees, if any, are charged at actuals." },
    estimatedDays: { type: String, default: "3–7 working days" },
    documentsRequired: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    keywords: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 100 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

ServiceSchema.index({ active: 1, order: 1 });
ServiceSchema.index({ title: "text", shortDescription: "text", keywords: "text" });

export type ServiceDoc = InferSchemaType<typeof ServiceSchema> & { _id: string };

export const Service: Model<ServiceDoc> =
  (models.Service as Model<ServiceDoc>) || model<ServiceDoc>("Service", ServiceSchema);
