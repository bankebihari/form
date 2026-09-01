/**
 * Smoke test for the preview generator: builds a small PDF, watermarks it,
 * and writes both files so you can open them and compare.
 */
import { writeFileSync } from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { buildWatermarkedPreview } from "../src/lib/watermark";

async function main() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText("CASTE CERTIFICATE", {
    x: 60,
    y: 740,
    size: 22,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText("This is to certify that Ramesh Patel belongs to...", {
    x: 60,
    y: 700,
    size: 12,
    font,
  });
  const original = Buffer.from(await pdf.save());
  writeFileSync("scripts/tmp-original.pdf", original);

  const preview = await buildWatermarkedPreview({
    buffer: original,
    contentType: "application/pdf",
    trackingId: "DS-2609-0001",
  });

  if (!preview) {
    console.error("FAILED: no preview produced");
    process.exit(1);
  }

  writeFileSync("scripts/tmp-preview.pdf", preview.buffer);
  console.log(
    `OK  original ${original.length} bytes -> preview ${preview.buffer.length} bytes (${preview.contentType})`
  );

  const unsupported = await buildWatermarkedPreview({
    buffer: Buffer.from("not a document"),
    contentType: "application/msword",
    trackingId: "DS-2609-0002",
  });
  console.log(
    unsupported === null
      ? "OK  unsupported type returns null, so the client sees the locked card"
      : "FAILED: unsupported type should return null"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
