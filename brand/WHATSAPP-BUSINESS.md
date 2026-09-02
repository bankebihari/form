# WhatsApp Business profile — ready to paste

Everything below is written for the way this business actually works: no payment
on the website, 10% to start, the document shown before the balance is due, and
a Tracking ID the client uses to follow the job.

Set it up in **WhatsApp Business → Settings → Business tools → Business profile**.

---

## Profile photo

Use `brand/logo-square-640.png`.

It is the same shield mark as the website, centred with a wide margin so it
survives WhatsApp's circular crop. If you ever need a bigger version there is
`logo-square-1024.png`, and `logo-wordmark.png` for letterheads and invoices.

---

## Business name

```
Online Cyber Cafe
```

Keep it under 75 characters. This is the name people see before they know you,
so it should say what you do, not just what you are called.

> The name people search for is exactly this, which is the point. It reads as a
> service rather than a brand nobody knows yet.

---

## Category

```
Professional Services
```

If your version of the app offers a narrower option, prefer **Legal Service** or
**Notary** — both are closer to what you actually do.

---

## Description (max 512 characters)

```
Government documents prepared, filed and delivered without the queues.

Caste, income and domicile certificates, EWS, birth, death and marriage
registration, PAN, passport, Aadhaar, voter ID, ration card, affidavits and
notary, Gumasta, Udyam and GST.

You pay the government fee at actuals, never marked up, plus only 10% of our
service charge to begin. The rest of our charge is due once your document is
ready. Track every stage online with the Tracking ID we send you.

Mon-Sat, 9 AM to 8 PM. We are a private assistance service, not a government
office.
```

That last line matters. Saying it up front stops the misunderstanding that
causes disputes later, and it is the same disclaimer that sits in your website
footer.

---

## About / status line (max 139 characters)

```
Documents done for you. Govt fee + only 10% of our charge to start. Mon-Sat 9-8.
```

---

## Address, hours, email, website

| Field | Value |
| --- | --- |
| Address | Shop No. 12, Main Market Road, Near Bus Stand, Indore, Madhya Pradesh 452001 |
| Hours | Monday to Saturday, 9:00 AM - 8:00 PM. Sunday closed |
| Email | support@onlinecybercafe.in |
| Website | https://docseva-in.netlify.app |

**These are still the placeholders from the website.** Replace the address and
email with your real ones in `src/config/site.ts` — that one file feeds the
site footer, the contact page and the structured data Google reads, so changing
it there keeps everything consistent.

---

## Greeting message (max 200 characters)

Sent automatically to anyone messaging you for the first time.

```
Namaste, thank you for contacting Online Cyber Cafe.

Tell us which document you need and your city, and we will reply with the exact
papers required, the price and the time it takes.
```

---

## Away message (max 200 characters)

Set it for **Outside of business hours**, not "Always".

```
Thank you for your message. Our office is closed right now.

We reply as soon as we open, Mon-Sat 9 AM to 8 PM. If it is urgent, send your
document name and city and we will call you first thing.
```

---

## Quick replies

Type `/` in a chat to fire these. Set them up under **Business tools → Quick
replies**. These are the six messages you will send most often.

| Shortcut | Message |
| --- | --- |
| `/papers` | To start, please send clear photos of: Aadhaar card, ration card or family ID, proof of address, and one passport size photo. Phone photos are fine. |
| `/price` | Government fee Rs ____ plus our service charge Rs ____. To begin, please pay Rs ____ - that is the government fee in full plus 10% of our charge. The remaining Rs ____ is due once your document is ready. |
| `/pay` | You can pay by UPI, bank transfer or cash at our office. I will share the details now. We never ask for your card number, CVV, UPI PIN or OTP. |
| `/track` | Your Tracking ID is ____. Check the status any time here: https://docseva-in.netlify.app/track - enter that ID or this mobile number. |
| `/ready` | Good news, your document is ready. The balance of Rs ____ is now due. As soon as we confirm it, the file unlocks on your tracking page for download. |
| `/done` | Payment received, thank you. Your original document is now unlocked on your tracking page. It stays there for 90 days, so please save a copy. |

The `/track` and `/ready` messages are also generated automatically inside the
staff panel with the real Tracking ID already filled in — open the application
and use **Message the client**. These quick replies are for when you are
answering from your phone instead.

---

## Labels

WhatsApp Business labels mirror the statuses in your panel, so a chat and a
record tell the same story:

- **New enquiry** — has not been priced yet
- **Waiting for booking** — priced, 10% not received
- **In progress** — booking received, work under way
- **Waiting for balance** — document ready, 90% pending
- **Delivered** — released and downloaded

---

## One thing to avoid

Do not put your prices in the WhatsApp catalogue. The website deliberately does
not publish rates, because the real cost depends on the state, the category and
which papers the client already has. Quoting a number before you have seen the
case is how you end up honouring a price that does not cover the work.
