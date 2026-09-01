import { NextRequest } from "next/server";
import {
  clientIp,
  fail,
  handleError,
  rateLimit,
  tooManyRequests,
} from "@/lib/api";
import { connectDB } from "@/lib/db";
import { fileContentType, findFile, openWebStream } from "@/lib/gridfs";
import { cleanFilename } from "@/lib/sanitize";
import { verifyTrackToken } from "@/lib/tokens";
import { Application } from "@/models/Application";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves a client-facing file.
 *
 *   kind=preview  -> the watermarked copy, available once the work is done
 *   kind=original -> the real document, ONLY after the admin has released it
 *
 * The release flag is the single gate. Nothing else in the app can hand out
 * the original file.
 */
export async function GET(request: NextRequest) {
  try {
    // A valid token should not become an unlimited download tap.
    const limit = rateLimit(`track-file:${clientIp(request)}`, 60, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests();

    const token = request.nextUrl.searchParams.get("token") ?? "";
    const kind = request.nextUrl.searchParams.get("kind") ?? "preview";

    const claims = await verifyTrackToken(token);
    if (!claims) {
      return fail("Your session expired. Please look up your application again.", 401);
    }

    await connectDB();
    const application = await Application.findById(claims.applicationId).lean();
    if (!application) return fail("Application not found.", 404);

    const deliverable = application.deliverable;

    if (kind === "original") {
      if (!deliverable?.fileId) {
        return fail("Your document is not ready yet.", 404);
      }
      if (!deliverable.released) {
        return fail(
          "This document has not been released yet. It unlocks as soon as our team confirms your balance payment.",
          403
        );
      }

      const file = await findFile(deliverable.fileId);
      if (!file) return fail("The file is no longer available.", 404);

      const stream = await openWebStream(deliverable.fileId);
      await Application.updateOne(
        { _id: application._id },
        {
          $inc: { "deliverable.downloadCount": 1 },
          $set: { "deliverable.lastDownloadedAt": new Date() },
        }
      );

      const filename = cleanFilename(
        deliverable.filename,
        `${claims.trackingId}.pdf`
      );
      return new Response(stream, {
        headers: {
          "Content-Type": fileContentType(file),
          "Content-Length": String(file.length),
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "private, no-store",
        },
      });
    }

    if (!deliverable?.previewFileId) {
      return fail("No preview is available for this application yet.", 404);
    }

    const file = await findFile(deliverable.previewFileId);
    if (!file) return fail("The preview is no longer available.", 404);

    const stream = await openWebStream(deliverable.previewFileId);
    return new Response(stream, {
      headers: {
        "Content-Type": fileContentType(file),
        "Content-Length": String(file.length),
        "Content-Disposition": `inline; filename="preview-${claims.trackingId}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
