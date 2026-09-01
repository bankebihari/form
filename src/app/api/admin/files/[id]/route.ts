import { NextRequest } from "next/server";
import { fail, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";
import { fileContentType, findFile, openWebStream, toObjectId } from "@/lib/gridfs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Staff-only access to any stored file: client uploads, deliverables, previews. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) return fail("Sign in to view this file.", 401);

    const { id } = await params;
    const objectId = toObjectId(id);
    if (!objectId) return fail("Invalid file reference.", 400);

    const file = await findFile(objectId);
    if (!file) return fail("File not found.", 404);

    const stream = await openWebStream(objectId);
    return new Response(stream, {
      headers: {
        "Content-Type": fileContentType(file),
        "Content-Length": String(file.length),
        "Content-Disposition": `inline; filename="${file.filename.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
