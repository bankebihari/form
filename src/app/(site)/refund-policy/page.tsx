import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Alert, Section } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Refund & Payment Policy",
  description:
    "The government fee in full plus 10% of our service charge to start, the remaining 90% when the document is ready, and exactly when a refund is given. No payments are taken on this website.",
  alternates: { canonical: absoluteUrl("/refund-policy") },
};

const updated = "1 September 2026";

export default function RefundPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Refund & payment policy"
        subtitle={`Last updated ${updated}. Exactly when money is due, how it is recorded, and when it comes back to you.`}
        crumbs={[{ name: "Refund policy", path: "/refund-policy" }]}
      />

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <Alert tone="info" title="No payments are processed on this website">
            There is no payment gateway, card form or wallet on this site. Every
            payment is arranged directly with our team over a phone call or
            WhatsApp, and recorded manually against your Tracking ID. We will
            never ask for your card number, CVV, UPI PIN or OTP.
          </Alert>

          <div className="prose-doc mt-8">
            <h2>1. How payment is split</h2>
            <table>
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Amount</th>
                  <th>When it is due</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Government fee</td>
                  <td>In full, at actuals</td>
                  <td>
                    Up front. We must pay the department before filing, so this
                    part is never split and never marked up.
                  </td>
                </tr>
                <tr>
                  <td>Booking</td>
                  <td>
                    {siteConfig.advancePercent}% of <em>our service charge</em>
                  </td>
                  <td>
                    With the government fee, after the price is confirmed on a
                    call and before work starts
                  </td>
                </tr>
                <tr>
                  <td>Balance</td>
                  <td>
                    {siteConfig.balancePercent}% of <em>our service charge</em>
                  </td>
                  <td>Once the document is finished and marked ready</td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>An example.</strong> A PAN card with a government fee of
              &#8377;100 and our service charge of &#8377;50: you pay
              &#8377;105 to start, which is the &#8377;100 fee in full plus
              &#8377;5, a tenth of our &#8377;50. The remaining &#8377;45 is due
              when the document is ready. Total &#8377;150.
            </p>

            <h2>2. Accepted payment methods</h2>
            <ul>
              <li>UPI transfer to our business account</li>
              <li>Bank transfer (NEFT / IMPS / RTGS)</li>
              <li>Cash at our office, against a receipt</li>
            </ul>
            <p>
              Our team shares the payment details with you directly. Always
              confirm the account details by calling {siteConfig.phoneNumber}{" "}
              before transferring money.
            </p>

            <h2>3. How a payment is confirmed</h2>
            <p>
              Once we verify the money in our account, we record it against your
              Tracking ID with the date, method and reference number. It then
              appears as received on your tracking page. If you have paid and it
              is not showing within a few working hours, call us — do not pay
              again.
            </p>

            <h2>4. Refund of what you paid to start</h2>
            <ul>
              <li>
                <strong>Full refund</strong> — if you cancel before we have
                started work, or if we tell you after taking the booking that
                your case cannot be done.
              </li>
              <li>
                <strong>Partial refund</strong> — if work has started but the
                application has not yet been filed, we refund the booking amount
                less the documented cost of work already done (for example
                drafting or notary charges already paid). The government fee is
                refunded only if we have not yet paid it to the department.
              </li>
              <li>
                <strong>No refund</strong> — once the application has been filed
                with the department, or once a government fee has been paid on
                your behalf. Government fees are never refundable to us and so
                cannot be refunded to you.
              </li>
            </ul>

            <h2>5. Balance payment and the finished document</h2>
            <p>
              The balance is due only after your document is ready and visible to
              you as ready. If the document contains an error caused by us, tell
              us and we correct it at no extra charge.
              Once the balance is confirmed, the original file is released to
              your tracking page immediately and stays available there for 90
              days.
            </p>
            <p>
              If you choose not to pay the balance, the document is not released
              and the booking amount is not refunded, since the work has been
              completed.
            </p>

            <h2>6. Delays</h2>
            <p>
              Issuing timelines are controlled by the government department. A
              delay by the department is not by itself a ground for refund. If
              we have not started work at all and there has been no progress
              within 15 working days of your booking, you may cancel and we will
              refund the booking amount in full.
            </p>

            <h2>7. How to request a refund</h2>
            <p>
              Call {siteConfig.phoneNumber} or email{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with
              your Tracking ID and the reason. We respond within 3 working days,
              and approved refunds are transferred back to the same account you
              paid from within 7 working days.
            </p>

            <h2>8. Disputes</h2>
            <p>
              Your tracking page holds a dated record of every status change and
              every payment recorded against your request. That record is the
              basis on which any dispute is settled. If you disagree with
              something on it, raise it with us in writing within 30 days.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
