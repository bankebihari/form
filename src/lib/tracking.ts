import { siteConfig } from "@/config/site";
import type { PlainApplication, TrackingView } from "@/types";

/** Amounts the admin has not filled in yet are derived from the total. */
export function computeAmounts(application: PlainApplication) {
  const total = application.quote?.totalAmount ?? 0;
  const advance =
    application.payments?.advance?.amount ||
    Math.round((total * siteConfig.advancePercent) / 100);
  const balance = application.payments?.balance?.amount || Math.max(total - advance, 0);
  return { total, advance, balance };
}

export function amountDueFor(application: PlainApplication) {
  const { advance, balance } = computeAmounts(application);
  if (application.payments?.advance?.status === "PENDING") return advance;
  if (application.payments?.balance?.status === "PENDING") return balance;
  return 0;
}

/**
 * Strips an application down to what the client is allowed to see. Internal
 * notes, staff names on private entries and raw file ids never leave here.
 */
export function toTrackingView(application: PlainApplication): TrackingView {
  const { total, advance, balance } = computeAmounts(application);

  return {
    trackingId: application.trackingId,
    status: application.status,
    serviceTitle: application.service.title,
    serviceSlug: application.service.slug,
    applicantName: application.applicant.name,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    quote: {
      totalAmount: total,
      governmentFee: application.quote?.governmentFee ?? 0,
      notes: application.quote?.notes ?? "",
    },
    payments: {
      advance: { ...application.payments.advance, amount: advance },
      balance: { ...application.payments.balance, amount: balance },
    },
    amountDue: amountDueFor(application),
    document: {
      exists: Boolean(application.deliverable?.fileId),
      filename: application.deliverable?.filename || "",
      hasPreview: Boolean(application.deliverable?.previewFileId),
      released: Boolean(application.deliverable?.released),
      releasedAt: application.deliverable?.releasedAt,
    },
    timeline: (application.timeline ?? [])
      .filter((entry) => !entry.internal)
      .map((entry) => ({
        status: entry.status,
        title: entry.title,
        note: entry.note,
        at: entry.at,
      }))
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()),
  };
}

/** Re-exported so callers have one obvious place to reach for it. */
export { normalisePhone } from "@/lib/sanitize";
