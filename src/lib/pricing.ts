import { siteConfig } from "@/config/site";

/**
 * How a price is split. One place, used by the admin quote form, the client's
 * tracking page, the WhatsApp templates and the money reports, so all four can
 * never disagree about what somebody owes.
 *
 * Two separate amounts make up a job:
 *
 *   Government fee  - what the department charges. It is not ours, and we have
 *                     to hand it over before anything can be filed, so it is
 *                     payable in full at the start. It is never split.
 *
 *   Service charge  - what we charge for doing the work. This is the only part
 *                     the 10/90 split applies to.
 *
 * So for a PAN card with a 100 government fee and a 50 service charge:
 *   to start  = 100 + 10% of 50  = 105
 *   balance   =       90% of 50  =  45
 *   total     = 150
 *
 * Splitting the government fee would mean funding the department out of our own
 * pocket on every job, which is why it sits outside the split.
 */
export type QuoteBreakdown = {
  serviceCharge: number;
  governmentFee: number;
  total: number;
  /** Payable before work starts: the government fee plus the service deposit. */
  advance: number;
  /** The service deposit on its own, for showing the arithmetic. */
  serviceAdvance: number;
  /** Payable once the finished document is ready. */
  balance: number;
};

export function computeQuote(
  serviceCharge: number,
  governmentFee: number
): QuoteBreakdown {
  const service = Math.max(0, Math.round(serviceCharge || 0));
  const government = Math.max(0, Math.round(governmentFee || 0));

  const serviceAdvance = Math.round(
    (service * siteConfig.advancePercent) / 100
  );

  return {
    serviceCharge: service,
    governmentFee: government,
    total: service + government,
    advance: government + serviceAdvance,
    serviceAdvance,
    balance: Math.max(service - serviceAdvance, 0),
  };
}

/** A one-line explanation of the split, used wherever the amounts are shown. */
export function explainAdvance(breakdown: QuoteBreakdown) {
  if (breakdown.governmentFee > 0) {
    return `Government fee ${breakdown.governmentFee} in full, plus ${siteConfig.advancePercent}% of our ${breakdown.serviceCharge} service charge`;
  }
  return `${siteConfig.advancePercent}% of our ${breakdown.serviceCharge} service charge`;
}
