import { computeQuote } from "@/lib/pricing";
import type { PlainApplication, TrackingView } from "@/types";

/**
 * What the client owes. The stored payment amounts win, because a staff member
 * may have adjusted them; the computed split is only a fallback for records
 * saved before an amount was set.
 */
export function computeAmounts(application: PlainApplication) {
  const serviceCharge = application.quote?.serviceCharge ?? 0;
  const governmentFee = application.quote?.governmentFee ?? 0;
  const quote = computeQuote(serviceCharge, governmentFee);

  return {
    serviceCharge: quote.serviceCharge,
    governmentFee: quote.governmentFee,
    total: application.quote?.totalAmount || quote.total,
    advance: application.payments?.advance?.amount || quote.advance,
    balance: application.payments?.balance?.amount || quote.balance,
    serviceAdvance: quote.serviceAdvance,
  };
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
  const amounts = computeAmounts(application);
  const { total, advance, balance } = amounts;

  return {
    trackingId: application.trackingId,
    status: application.status,
    serviceTitle: application.service.title,
    serviceSlug: application.service.slug,
    applicantName: application.applicant.name,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    quote: {
      serviceCharge: amounts.serviceCharge,
      governmentFee: amounts.governmentFee,
      totalAmount: total,
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
      released: Boolean(application.deliverable?.released),
      releasedAt: application.deliverable?.releasedAt,
    },
    messages: (application.messages ?? []).map((message) => ({
      from: message.from,
      body: message.body,
      byName: message.from === "STAFF" ? message.byName : "",
      at: message.at,
    })),
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
