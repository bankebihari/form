import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { siteConfig } from "@/config/site";

/**
 * Builds the copy the client is allowed to look at before paying the balance.
 *
 * Everything comes back as a PDF: PDFs get a diagonal watermark stamped on
 * every page, and images are wrapped into a single watermarked page. The
 * original file is never sent to the browser until the admin releases it.
 */
export async function buildWatermarkedPreview(options: {
  buffer: Buffer;
  contentType: string;
  trackingId: string;
}): Promise<{ buffer: Buffer; contentType: string } | null> {
  const { buffer, contentType, trackingId } = options;

  try {
    if (contentType === "application/pdf") {
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      await stamp(pdf, trackingId);
      const bytes = await pdf.save();
      return { buffer: Buffer.from(bytes), contentType: "application/pdf" };
    }

    if (contentType === "image/jpeg" || contentType === "image/png") {
      const pdf = await PDFDocument.create();
      const image =
        contentType === "image/jpeg"
          ? await pdf.embedJpg(buffer)
          : await pdf.embedPng(buffer);

      // Fit the image onto an A4-ish page without distorting it.
      const maxWidth = 595;
      const maxHeight = 842;
      const scale = Math.min(
        maxWidth / image.width,
        maxHeight / image.height,
        1
      );
      const width = image.width * scale;
      const height = image.height * scale;

      const page = pdf.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
      await stamp(pdf, trackingId);

      const bytes = await pdf.save();
      return { buffer: Buffer.from(bytes), contentType: "application/pdf" };
    }
  } catch (error) {
    console.error("[watermark] could not build a preview:", error);
  }

  // Unsupported type (e.g. a .docx): no preview, the client sees a locked card.
  return null;
}

async function stamp(pdf: PDFDocument, trackingId: string) {
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const small = await pdf.embedFont(StandardFonts.Helvetica);
  const label = "PREVIEW";
  const footer = `${siteConfig.name} preview copy - ${trackingId} - not valid for official use`;

  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();

    // Large diagonal mark across the middle of the page.
    const size = Math.min(width, height) * 0.22;
    const textWidth = font.widthOfTextAtSize(label, size);
    page.drawText(label, {
      x: width / 2 - textWidth / 2.4,
      y: height / 2 - size / 2,
      size,
      font,
      color: rgb(0.09, 0.32, 0.61),
      opacity: 0.14,
      rotate: degrees(38),
    });

    // Repeated tiling so a screenshot crop still carries the mark.
    const tile = "PREVIEW";
    const tileSize = Math.max(9, Math.min(width, height) * 0.028);
    for (let y = 40; y < height; y += tileSize * 7) {
      for (let x = -20; x < width; x += tileSize * 9) {
        page.drawText(tile, {
          x,
          y,
          size: tileSize,
          font: small,
          color: rgb(0.09, 0.32, 0.61),
          opacity: 0.07,
          rotate: degrees(38),
        });
      }
    }

    // Footer strip identifying the copy.
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 22,
      color: rgb(0.03, 0.09, 0.18),
      opacity: 0.92,
    });
    page.drawText(footer, {
      x: 10,
      y: 7,
      size: 8,
      font: small,
      color: rgb(1, 1, 1),
      opacity: 0.95,
    });
  }
}
