/**
 * One source of truth for cleaning and checking user input.
 *
 * Both the browser and the server import from here, so the rules can never
 * drift apart — the form cannot accept something the API will later reject,
 * and the API never trusts that the form did its job.
 *
 * Every pattern below is written with escape sequences on purpose: these are
 * invisible characters, and a literal one pasted into the source would be
 * impossible to review.
 */

/**
 * The code point ranges we strip, written as numbers on purpose: every
 * character in them is invisible, so a literal one inside a regex would be
 * impossible to review in a diff.
 *
 * C0 controls (tab and newline kept), DEL and the C1 block, then the
 * zero-width and bidirectional-override characters that can make stored text
 * render as something other than what was saved.
 */
const STRIPPED_RANGES: readonly (readonly [number, number])[] = [
  [0x00, 0x08],
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x9f],
  [0x200b, 0x200f],
  [0x2028, 0x2029],
  [0x202a, 0x202e],
  [0x2060, 0x2064],
  [0x2066, 0x2069],
  [0xfeff, 0xfeff],
];

function isStripped(codePoint: number) {
  return STRIPPED_RANGES.some(([low, high]) => codePoint >= low && codePoint <= high);
}

/** Removes anything invisible or non-printing, keeping tabs and newlines. */
export function stripControl(value: string) {
  let out = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint !== undefined && isStripped(codePoint)) continue;
    out += character;
  }
  return out;
}

/** Turns any run of whitespace, newlines included, into a single space. */
export function collapseSpace(value: string) {
  return value.replace(/\s+/g, " ");
}

/**
 * Multi-line free text (textareas). Newlines survive, but runs of three or
 * more are squeezed to two so nobody can pad a note into a wall of blanks.
 */
export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return stripControl(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

/** Single-line text: no newline survives. */
export function cleanLine(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return collapseSpace(stripControl(value)).trim().slice(0, max);
}

/* ------------------------------------------------------------------- name */

export const NAME_MAX = 80;

/** Letters in any script, spaces, and the few marks that appear in real names. */
export function cleanName(value: unknown) {
  if (typeof value !== "string") return "";
  return collapseSpace(stripControl(value).replace(/[^\p{L}\s.'-]/gu, ""))
    .replace(/^[\s.'-]+/, "")
    .slice(0, NAME_MAX);
}

export function isValidName(value: string) {
  const cleaned = cleanName(value).trim();
  return cleaned.length >= 2 && /\p{L}/u.test(cleaned);
}

/* ------------------------------------------------------------------ phone */

/**
 * Indian mobile numbers, reduced to the bare 10 digits we store.
 *
 * The country code is stripped only when the length proves it is one:
 * 9123456789 is a valid number and must not lose its leading "91".
 */
export function normalisePhone(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  let digits = String(value).replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("091")) digits = digits.slice(3);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function isValidPhone(value: string) {
  return /^[6-9]\d{9}$/.test(normalisePhone(value));
}

/** What a phone input should show while somebody is still typing. */
export function phoneInputValue(value: string) {
  const digits = String(value).replace(/\D/g, "");
  return digits.length > 12 ? normalisePhone(digits) : digits;
}

/* ------------------------------------------------------------------ email */

export const EMAIL_MAX = 160;
const EMAIL_PATTERN = /^[^\s@<>",;:\\]+@[^\s@<>",;:\\]+\.[a-z]{2,}$/i;

export function cleanEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return stripControl(value)
    .replace(/\s/g, "")
    .toLowerCase()
    .slice(0, EMAIL_MAX);
}

export function isValidEmail(value: string) {
  const cleaned = cleanEmail(value);
  return cleaned.length > 0 && EMAIL_PATTERN.test(cleaned);
}

/* ------------------------------------------------------------ tracking id */

export const TRACKING_ID_MAX = 24;

export function cleanTrackingId(value: unknown) {
  if (typeof value !== "string") return "";
  return stripControl(value)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, TRACKING_ID_MAX);
}

/** Shape check only - DS-2609-K7Q3XM. Whether it exists is the database's job. */
export function isValidTrackingId(value: string) {
  return /^[A-Z]{2}-\d{4}-[A-Z0-9]{4,8}$/.test(cleanTrackingId(value));
}

/* ------------------------------------------------------------ place names */

export const CITY_MAX = 60;

export function cleanCity(value: unknown) {
  if (typeof value !== "string") return "";
  return collapseSpace(stripControl(value).replace(/[^\p{L}\s.'()-]/gu, ""))
    .trim()
    .slice(0, CITY_MAX);
}

/* ------------------------------------------------------------------ files */

export const FILENAME_MAX = 120;

/**
 * Filenames come from the client and end up in a Content-Disposition header
 * and in GridFS. Path separators, quotes and control characters are removed so
 * neither can be broken out of.
 */
export function cleanFilename(value: unknown, fallback = "document") {
  if (typeof value !== "string") return fallback;
  const cleaned = stripControl(value)
    .replace(/[\\/]/g, "-")
    .replace(/["'`<>|?*:]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^\.+/, "")
    .trim()
    .slice(0, FILENAME_MAX);
  return cleaned || fallback;
}

/* --------------------------------------------------------------- payments */

export const REFERENCE_MAX = 60;

/** UPI refs and receipt numbers: alphanumerics and simple separators only. */
export function cleanReference(value: unknown) {
  if (typeof value !== "string") return "";
  return stripControl(value)
    .replace(/[^A-Za-z0-9\-_/. ]/g, "")
    .trim()
    .slice(0, REFERENCE_MAX);
}

/** Money: a non-negative whole number of rupees, capped at a sane ceiling. */
export function cleanAmount(value: unknown, max = 10_000_000) {
  const number = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.min(Math.round(number), max);
}

/* -------------------------------------------------------------- passwords */

export const PASSWORD_MAX = 128;

/**
 * Passwords are never trimmed or rewritten — that would silently change what
 * someone typed. They are only length-capped, so an oversized body cannot be
 * used to make bcrypt burn CPU.
 */
export function capPassword(value: unknown) {
  return typeof value === "string" ? value.slice(0, PASSWORD_MAX) : "";
}
