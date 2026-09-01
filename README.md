# DocSeva — document service portal

A complete website for a document-assistance business: clients raise a request,
talk to you on WhatsApp or phone, pay **10% to start**, watch the status live,
see a **watermarked preview** of the finished document, and download the
original only after you record their **90% balance**.

No payment gateway. No third-party payment processing. Every rupee is arranged
by you directly and recorded by hand in the staff panel.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · MongoDB +
Mongoose · GridFS for files · JWT staff auth · pdf-lib for watermarking

---

## 1. Getting it running

```bash
npm install
```

Copy the environment file and paste your MongoDB connection string into it:

```bash
cp .env.example .env.local
```

Open `.env.local` and set `MONGODB_URI`. Everything else already has a working
default (an `AUTH_SECRET` was generated for you when the project was created).

```bash
npm run seed
```

That loads the 16 services into the database and creates your first staff
login from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`.

```bash
npm run dev
```

Open <http://localhost:3000>. The staff panel is at
<http://localhost:3000/admin>.

> **Before the database is connected** the public pages still work — the
> services catalogue falls back to the copy bundled in `src/data/services.ts`.
> Forms, tracking and the staff panel need MongoDB.

---

## 2. Where to change your business details

Everything about your business lives in **one file**:

`src/config/site.ts`

| Field | What it controls |
| --- | --- |
| `name`, `legalName`, `tagline` | Branding across the whole site |
| `whatsappNumber` | The `wa.me` deep links — `91` + 10 digits, no `+` or spaces |
| `phoneNumber` | The number displayed on screen |
| `phoneDial` | What `tel:` links dial |
| `email`, `address`, `hours` | Footer, contact page, structured data |
| `social.youtube` | The "Watch on YouTube" buttons |
| `advancePercent` / `balancePercent` | The 10 / 90 split, used everywhere |
| `showPublicPrices` | Currently `false` — prices are never published |
| `stats` | The trust numbers on the home page |

Change a value there and it updates the header, footer, every WhatsApp message,
every call button, the sitemap and the structured data at once.

The service catalogue (titles, descriptions, documents required, FAQs) lives in
`src/data/services.ts`. Edit it and run `npm run seed` again to push the
changes into MongoDB.

---

## 3. How the money flow works

The website never touches money. It only records what you tell it.

1. A client raises a request → status **Submitted**, they get a Tracking ID.
2. You call them, then open the application in the panel and **set the price**.
   The system splits it into 10% booking and 90% balance automatically.
3. They pay you by UPI, bank transfer or cash. You press **Mark as received**
   on the booking amount → status **Booking amount received**.
4. You do the work, updating the status as you go so their tracking page moves.
5. You **upload the finished document**. The system automatically produces a
   watermarked PDF preview and shows it to the client. The original stays
   locked. A fresh upload always starts locked, whatever the previous state.
6. They pay the balance. You **Mark as received** on the balance.
7. You press **Release to the client** → the original unlocks on their tracking
   page and the status becomes **Delivered**.

The release flag is the only gate on the original file. `/api/track/file`
refuses `kind=original` unless `deliverable.released` is `true`, so no URL
guessing gets around it.

If you need to release before recording payment (a regular client, say), tick
the override box on the release form — the action records that you did.

---

## 4. Staff panel

- **Login:** `/admin/login`. There is **no link to it anywhere on the public
  site** — you reach it by typing the address. The whole `/admin` tree is
  `noindex, nofollow` and disallowed in `robots.txt`, so it stays out of search
  results too.
- **Dashboard** shows the four queues that need action: needs a price, waiting
  for booking, in progress, waiting for balance.
- **Applications** — search by Tracking ID, name, phone or service; filter by
  status; open one to price it, record payments, change status, add updates,
  upload the document and release it.
- **Message the client** — on every application, six ready-written WhatsApp
  messages (send the Tracking ID, send the price, work started, document ready,
  balance reminder, released). Tapping one opens WhatsApp addressed to that
  client with the message already typed, tracking link included; you press send.
  The one that fits the current status is highlighted.
- **Money** — collected today / this month / all time, still to collect, the two
  chase lists (booking pending, balance pending) with one-tap call and WhatsApp
  reminders, and a full ledger of every confirmed payment with method,
  reference and who recorded it.
- **Calls & demos** — every call-back request, demo booking and contact message,
  with one-tap call and WhatsApp buttons.
- **Settings** — change your password (this signs out every device).

Add more staff accounts by inserting into the `adminusers` collection with a
bcrypt hash, or by temporarily changing `ADMIN_EMAIL` / `ADMIN_PASSWORD` and
running `npm run seed` again.

---

## 5. Client-facing pages

| Route | Purpose |
| --- | --- |
| `/` | Home — trust, services, how it works, the 10/90 promise, FAQ |
| `/services`, `/services/[slug]` | SEO landing page per document type |
| `/request` | Four-step mobile request form with file upload |
| `/request/success/[trackingId]` | Tracking ID + WhatsApp handoff |
| `/track` | Status lookup by Tracking ID + phone |
| `/request-a-call`, `/book-a-demo`, `/contact` | Lead capture |
| `/how-it-works`, `/about` | Explainers |
| `/privacy`, `/terms`, `/refund-policy` | Legal |

Clients never create an account. The Tracking ID plus their registered phone
number is the whole authentication model, and a successful lookup issues a
2-hour signed token used to fetch the preview and (once released) the original.

---

## 6. SEO

- Per-page titles, descriptions, canonicals and OpenGraph, generated from the
  service data
- `sitemap.xml` and `robots.txt` generated at `/sitemap.xml` and `/robots.txt`
- Structured data: `LocalBusiness`, `WebSite` + SearchAction, `Service`,
  `FAQPage`, `HowTo`, `BreadcrumbList`, `ItemList`
- A social share card rendered at `/og`
- Mobile-first layouts, 16px form inputs (no zoom-on-focus), sticky WhatsApp /
  Call / Track bar on phones

After deploying, submit `https://yourdomain.com/sitemap.xml` in Google Search
Console and set `NEXT_PUBLIC_SITE_URL` to your real domain — the canonicals,
sitemap and structured data all read from it.

---

## 7. Deploying

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` in the Vercel dashboard —
   `MONGODB_URI`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` at minimum.
4. In MongoDB Atlas, allow access from anywhere (`0.0.0.0/0`) or from Vercel's
   IP ranges.
5. Deploy, then run `npm run seed` once locally against the production
   `MONGODB_URI` to load the services and create your login.

Files live in MongoDB via GridFS, so there is no S3 bucket or disk to
configure — the whole product needs exactly one piece of infrastructure.

---

## 8. Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run start       # run the production build
npm run seed        # load services + create the first staff login
npm run typecheck   # TypeScript, no emit
npm run lint        # ESLint
```

`python scripts/plan.py` prints the build plan and which chunks are done.
`npx tsx scripts/check-watermark.ts` smoke-tests the preview generator.

---

## 11. How a Tracking ID is made

`DS-YYMM-NNNN`, for example `DS-2609-0042`: `DS` for the brand, `2609` for the
month it was raised (September 2026), and a counter that restarts each month.
The counter is bumped atomically in MongoDB (`findByIdAndUpdate` with `$inc`),
so two requests arriving at the same instant can never get the same number.

The client sees it three ways: on the success page right after submitting, in
the WhatsApp message they send you from that page, and in the message you send
them from the panel. It is also the only thing (with their mobile number) that
opens their tracking page — so it is worth sending it on WhatsApp every time.

---

## 9. Input handling

Every field is cleaned and checked in **one place**, `src/lib/sanitize.ts`, and
both the browser and the server import from it. The form cannot accept
something the API will reject, and the API never trusts that the form did its
job — it cleans and re-validates everything itself.

- **Names** keep letters in any script, spaces, `.`, `'` and `-`. Digits and
  symbols are removed as you type, so `23424m,sdnvsd,nv` becomes `msdnvsdnv`.
- **Phone numbers** are reduced to the 10 digits we store. The country code is
  stripped only when the length proves it is one, so `9123456789` keeps its
  leading `91`.
- **Emails** are lowercased, stripped of whitespace and length-capped.
- **State** must be one of the 36 in `src/data/states.ts`, never free text.
- **Free text** loses control characters, zero-width characters and the
  bidirectional overrides that can make stored text render as something other
  than what was saved. Runs of blank lines are squeezed.
- **Filenames** lose path separators, quotes and control characters before they
  are stored or put into a `Content-Disposition` header.
- **Amounts** become non-negative whole rupees with a ceiling.
- **Passwords** are never trimmed or rewritten — only length-capped at 128, so
  an oversized body cannot make bcrypt burn CPU.

---

## 10. Security notes

- Passwords are bcrypt-hashed (cost 12); changing one bumps a token version
  that invalidates every existing session.
- Staff sessions are httpOnly, SameSite=Lax, Secure in production, and are
  re-checked against the database on every request.
- Client uploads and finished documents are only served through routes that
  check either a staff session or a signed tracking token.
- Public form endpoints are rate-limited per IP and carry honeypot fields.
- Tracking lookups return the same message for a wrong ID and a wrong phone, so
  Tracking IDs cannot be enumerated.
- The site never asks for card numbers, CVV, UPI PIN or OTP, and says so on
  every payment-related screen.
