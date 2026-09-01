# DocSeva — Online Document Service Portal
**Stack:** Next.js 16 (App Router, TS) · Tailwind v4 · MongoDB + Mongoose · GridFS files · JWT admin auth · No third-party payment gateway

---

## Business flow (what we are building)

1. Visitor lands on site (mostly mobile) → sees services (Caste Certificate, Income, Domicile, PAN, Passport, Affidavit, etc.)
2. Visitor picks a service → **Raise Request** form (name, phone, service, details, docs upload optional)
3. On submit → system creates application with **Tracking ID** → instantly offers:
   - **Continue on WhatsApp** (wa.me deep link, pre-filled message + tracking ID) — no account creation needed
   - **Call Now** (tel: link)
4. Admin sees request → calls/WhatsApps client → quotes price → marks **Quoted**
5. Client pays **10% advance** offline (UPI/cash/bank — arranged over call/WhatsApp) → admin marks **Advance Received**
6. Admin works on it → marks **In Progress** → uploads finished document
7. System auto-generates a **watermarked, non-downloadable preview** → client can SEE the doc but not take it
8. Client pays remaining **90%** → admin marks **Full Payment Received** → clicks **Release Document**
9. Client downloads the original file from the tracking page. Status = **Delivered**
10. Anywhere on site: **Request a Call** and **Book a Demo** → stored as leads + WhatsApp handoff

**Payments are never processed on the website.** The site only *records* what the admin confirms. Every payment CTA routes the client to a call or WhatsApp.

---

## Chunks

### CHUNK 1 — Foundation & design system  ✅ target
- Next.js scaffold, Tailwind v4 theme tokens ("banking trust" palette: deep navy, trust blue, emerald, gold)
- `src/config/site.ts` — single place for business name, phone, WhatsApp number, email, address, hours
- Fonts, global CSS, base layout, `cn()` helper, container/section primitives
- Mobile-first rules: sticky bottom action bar (WhatsApp + Call), 44px tap targets

### CHUNK 2 — Database layer
- `lib/db.ts` cached mongoose connection (hot-reload safe)
- Models: `Service`, `Application`, `Lead`, `AdminUser`, `Counter`
- Application sub-docs: `timeline[]`, `payments{advance,final}`, `files{source[],final,preview}`
- Tracking ID generator (e.g. `DS-2609-4821`), status + payment enums
- Seed script (`npm run seed`) — services catalogue + first admin user

### CHUNK 3 — Shared UI kit
- Header (mobile drawer nav), Footer, StickyMobileCTA, WhatsAppButton, CallButton
- Button / Input / Select / Textarea / Card / Badge / Alert / Stepper / Modal
- Trust elements: secure badge row, stats strip, testimonial card, FAQ accordion

### CHUNK 4 — Public pages
- `/` Home: hero → trust strip → services grid → how it works → pricing model (10/90) → why us → testimonials → FAQ → CTA
- `/services` + `/services/[slug]` (SEO landing page per service: docs required, timeline, fee model, FAQ)
- `/about`, `/contact`, `/privacy`, `/terms`, `/refund-policy`

### CHUNK 5 — Request flow
- `/request` multi-step mobile form (Service → Details → Contact → Review)
- File upload for supporting docs (GridFS)
- `POST /api/applications` (zod validated, rate-limited, honeypot)
- `/request/success/[trackingId]` — Tracking ID card, copy button, WhatsApp handoff, call button

### CHUNK 6 — Tracking
- `/track` (enter Tracking ID + phone) → `/track/[trackingId]`
- Visual status timeline, payment stage cards (10% / 90%), amount due
- Locked watermarked preview when ready; download button unlocks only after admin releases
- `GET /api/track`, `GET /api/files/[id]` (authorised download guard)

### CHUNK 7 — Leads (Call + Demo)
- `/request-a-call` and `/book-a-demo` (slot picker: date + time window)
- `POST /api/leads`, WhatsApp handoff, thank-you states
- Floating "Get connected" widget on mobile

### CHUNK 8 — Admin panel
- `/admin/login` (bcrypt + JWT httpOnly cookie), server-side guard in admin layout
- Dashboard: counts by status, today's leads, pending payments, revenue recorded
- Applications: search/filter table → detail page → update status, set quote, record advance/final payment, add timeline note, upload final doc, release/lock document
- Leads: table, mark contacted/converted, one-click WhatsApp/call
- Services: create/edit/toggle
- Settings: change password

### CHUNK 9 — SEO & performance
- Per-page metadata, canonical, OpenGraph, Twitter cards
- `sitemap.ts`, `robots.ts`, dynamic OG image
- JSON-LD: LocalBusiness, Service, FAQPage, BreadcrumbList, WebSite+SearchAction
- Image/font optimisation, Lighthouse pass, semantic headings, internal linking

### CHUNK 10 — Hardening & handover
- Validation everywhere, rate limiting, error/loading/not-found states
- `.env.example`, `README.md` (setup, seed, deploy to Vercel, how to add Mongo URI)
- Final mobile QA + production build

---

## Status legend used in the app
`SUBMITTED → QUOTED → ADVANCE_PAID → IN_PROGRESS → READY_PREVIEW → FULL_PAID → DELIVERED`
(plus `ON_HOLD`, `CANCELLED`)
