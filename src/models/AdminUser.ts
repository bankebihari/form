import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["OWNER", "STAFF"], default: "STAFF" },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: undefined },
    /** Bumped on password change so old sessions stop validating. */
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema> & {
  _id: string;
};

export const AdminUser: Model<AdminUserDoc> =
  (models.AdminUser as Model<AdminUserDoc>) ||
  model<AdminUserDoc>("AdminUser", AdminUserSchema);
