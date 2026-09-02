/**
 * ============================================================
 *  SINGLE PLACE TO EDIT YOUR BUSINESS DETAILS
 *  Change the values below and the whole website updates.
 * ============================================================
 */

export const siteConfig = {
  // --- Brand -------------------------------------------------
  name: "Online Cyber Cafe",
  legalName: "Online Cyber Cafe",
  tagline: "Government documents, done for you.",

  /**
   * Leads every Tracking ID: OCC-2609-K7Q3XM. Two to four letters. Changing it
   * only affects new IDs - the ones already given to clients keep working,
   * because lookups match the shape, not this exact prefix.
   */
  trackingPrefix: "OCC",
  description:
    "Apply for caste certificate, income certificate, domicile, PAN, passport, affidavits and more without standing in queues. Raise a request online, track it live, and pay the government fee plus only 10% of our service charge to begin.",

  // --- Contact (EDIT THESE) ----------------------------------
  // Use full international format WITHOUT + or spaces for WhatsApp.
  whatsappNumber: "917707026152", // 91 + 10 digit number
  phoneNumber: "+91 77070 26152", // shown on the website
  phoneDial: "+917707026152", // used inside tel: links
  email: "support@onlinecybercafe.in",

  address: {
    line1: "Shop No. 12, Main Market Road",
    line2: "Near Bus Stand",
    city: "Indore",
    state: "Madhya Pradesh",
    postalCode: "452001",
    country: "IN",
  },

  hours: "Mon – Sat, 9:00 AM – 8:00 PM",

  // --- Web ---------------------------------------------------
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://onlinecybercafe.in",
  ogImage: "/og",

  social: {
    youtube: "https://youtube.com/@onlinecybercafe",
    instagram: "https://instagram.com/onlinecybercafe",
    facebook: "https://facebook.com/onlinecybercafe",
  },

  // --- Commercial model --------------------------------------
  advancePercent: 10, // paid to start the work
  balancePercent: 90, // paid before the document is released

  /**
   * Prices are never published on the website. Each request is quoted by the
   * admin from the panel after reviewing the case, and the client sees that
   * amount only on their own tracking page. Flip this to true only if you
   * later decide to advertise starting prices.
   */
  showPublicPrices: false,

  // --- Trust numbers shown on the site -----------------------
  stats: {
    applications: "12,000+",
    yearsActive: "7",
    avgDays: "3–7",
    rating: "4.9",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Builds a wa.me deep link. The visitor needs no account with us — it just opens WhatsApp. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const callLink = `tel:${siteConfig.phoneDial}`;

/** Opens WhatsApp addressed to any number — used by staff to message a client. */
export function whatsappTo(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  const full = digits.length === 10 ? `91${digits}` : digits;
  const base = `https://wa.me/${full}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: link for any number. */
export function callTo(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  return `tel:+${digits.length === 10 ? `91${digits}` : digits}`;
}

export const fullAddress = [
  siteConfig.address.line1,
  siteConfig.address.line2,
  `${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.postalCode}`,
].join(", ");
