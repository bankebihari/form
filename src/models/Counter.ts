import { Schema, model, models, type Model } from "mongoose";

export interface CounterDoc {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter: Model<CounterDoc> =
  (models.Counter as Model<CounterDoc>) || model<CounterDoc>("Counter", CounterSchema);

/** Atomically bumps a named counter and returns the new value. */
export async function nextSequence(key: string) {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();
  return doc?.seq ?? 1;
}

/** Human-friendly, non-guessable-enough tracking id: DS-2609-0042 */
export async function generateTrackingId() {
  const now = new Date();
  const period = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const seq = await nextSequence(`application-${period}`);
  return `DS-${period}-${String(seq).padStart(4, "0")}`;
}
