import { GridFSBucket, ObjectId, type GridFSFile } from "mongodb";
import mongoose from "mongoose";
import { connectDB } from "./db";

/**
 * Files live inside MongoDB (GridFS) so the whole product needs exactly one
 * piece of infrastructure — no S3 bucket, no disk that disappears on redeploy.
 */
export async function getBucket(bucketName = "uploads") {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection is not ready");
  return new GridFSBucket(db, { bucketName });
}

export async function uploadBuffer(options: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  metadata?: Record<string, unknown>;
  bucketName?: string;
}) {
  const bucket = await getBucket(options.bucketName);
  return new Promise<ObjectId>((resolve, reject) => {
    const stream = bucket.openUploadStream(options.filename, {
      // The v6 driver dropped the top-level contentType option, so it rides
      // along in metadata and is read back by fileContentType().
      metadata: { contentType: options.contentType, ...options.metadata },
    });
    stream.on("error", reject);
    stream.on("finish", () => resolve(stream.id as ObjectId));
    stream.end(options.buffer);
  });
}

export async function findFile(id: string | ObjectId, bucketName?: string) {
  const bucket = await getBucket(bucketName);
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  const [file] = await bucket.find({ _id }).limit(1).toArray();
  return (file as GridFSFile | undefined) ?? null;
}

export async function downloadBuffer(id: string | ObjectId, bucketName?: string) {
  const bucket = await getBucket(bucketName);
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  const chunks: Buffer[] = [];
  const stream = bucket.openDownloadStream(_id);
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

/** Node stream -> web ReadableStream, so route handlers can stream the file back. */
export async function openWebStream(id: string | ObjectId, bucketName?: string) {
  const bucket = await getBucket(bucketName);
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  const nodeStream = bucket.openDownloadStream(_id);

  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (error) => controller.error(error));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export async function deleteFile(id: string | ObjectId, bucketName?: string) {
  const bucket = await getBucket(bucketName);
  const _id = typeof id === "string" ? new ObjectId(id) : id;
  try {
    await bucket.delete(_id);
  } catch {
    // Already gone — deleting twice should never break an admin action.
  }
}

/** GridFS stores our mime type inside metadata; fall back to the legacy field. */
export function fileContentType(file: GridFSFile | null) {
  const fromMeta = (file?.metadata as { contentType?: string } | undefined)
    ?.contentType;
  return fromMeta || "application/octet-stream";
}

export function toObjectId(value: unknown) {
  if (!value) return null;
  const raw = String(value);
  return ObjectId.isValid(raw) ? new ObjectId(raw) : null;
}
