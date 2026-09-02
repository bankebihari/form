import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A single document holding the things the owner should be able to change
 * without a redeploy. Everything here falls back to `src/config/site.ts`, so an
 * empty database still renders a complete site.
 */
const SettingSchema = new Schema(
  {
    _id: { type: String, default: "site" },
    social: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    updatedBy: { type: String, default: "" },
  },
  { timestamps: true, _id: false }
);

export type SettingDoc = InferSchemaType<typeof SettingSchema> & { _id: string };

export const Setting: Model<SettingDoc> =
  (models.Setting as Model<SettingDoc>) ||
  model<SettingDoc>("Setting", SettingSchema);

export const SETTINGS_ID = "site";
