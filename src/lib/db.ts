import mongoose, { type Mongoose } from "mongoose";

/**
 * Cached connection. Next.js hot-reloads modules in dev, which would otherwise
 * open a new pool on every change and exhaust the Atlas connection limit.
 */
declare global {
  var _mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const cache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB(): Promise<Mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and paste your MongoDB connection string."
    );
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || "docseva",
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

/** True when the app has a usable database configured. */
export function hasDatabase() {
  return Boolean(process.env.MONGODB_URI);
}

/** Deep-clones a mongoose doc into a plain object safe to pass to client components. */
export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
