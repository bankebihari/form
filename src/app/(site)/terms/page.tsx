import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/primitives";
import { fullAddress, siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms on which ${siteConfig.legalName} provides document assistance: pricing, the 10/90 payment structure, timelines, responsibilities and limits.`,
  alternates: { canonical: absoluteUrl("/terms") },
};

const updated = "1 September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of service"
        subtitle={`Last updated ${updated}. By raising a request with us you agree to the terms below.`}
        crumbs={[{ name: "Terms", path: "/terms" }]}
      />

      <Section tone="white">
        <div className="prose-doc mx-auto max-w-3xl">
          <h2>1. Who we are</h2>
          <p>
            {siteConfig.legalName} (&quot;we&quot;, &quot;us&quot;) is a private
            document assistance service operating from {fullAddress}. We are{" "}
            <strong>not</strong> a government body and we are not affiliated
            with, endorsed by or acting on behalf of any government department.
            We act only as your authorised representative for preparing and
            filing applications.
          </p>

          <h2>2. What we provide</h2>
          <p>
            We prepare application forms and annexures, check your supporting
            documents, submit applications to the relevant authority, follow up
            on their progress, and deliver the issued document to you. We do not
            issue any certificate ourselves and cannot influence a department
            decision.
          </p>

          <h2>3. Pricing</h2>
          <ul>
            <li>
              Prices shown on this website are <strong>starting</strong> service
              charges. Your final price depends on your state, application
              category and the papers you already hold.
            </li>
            <li>
              The final price is confirmed with you on a call or on WhatsApp{" "}
              <strong>before</strong> any payment is requested. That agreed
              price does not change afterwards.
            </li>
            <li>
              Government fees, stamp duty and notary charges, where applicable,
              are separate and are charged at actuals.
            </li>
          </ul>

          <h2>4. Payment structure</h2>
          <ul>
            <li>
              <strong>{siteConfig.advancePercent}% booking amount</strong> is
              payable after the price is agreed. Work begins once we record it.
            </li>
            <li>
              <strong>{siteConfig.balancePercent}% balance</strong> is payable
              only after the finished document has been uploaded to your
              tracking page and you have viewed the preview.
            </li>
            <li>
              The original document is released for download once our team
              confirms the balance payment.
            </li>
            <li>
              <strong>No payment is processed on this website.</strong> Payments
              are made directly to us by UPI, bank transfer or cash and are
              recorded manually against your Tracking ID.
            </li>
          </ul>

          <h2>5. Timelines</h2>
          <p>
            All timelines shown are estimates based on our experience. The
            actual issuing time is controlled by the concerned government
            department and can be affected by verification visits, holidays,
            server downtime and policy changes. We keep your tracking page
            updated and follow up regularly, but we cannot guarantee a specific
            issue date.
          </p>

          <h2>6. Your responsibilities</h2>
          <ul>
            <li>
              Give us true, complete and accurate information. Applications
              based on false information are your responsibility alone.
            </li>
            <li>
              Provide clear copies of the documents we ask for, and respond to
              our calls or messages when we need something.
            </li>
            <li>
              Attend in person where the department requires it — for example
              biometric capture, registrar appointments or passport
              verification.
            </li>
            <li>
              Check the preview carefully and tell us about any error before
              paying the balance.
            </li>
          </ul>

          <h2>7. What we will not do</h2>
          <p>
            We do not prepare, submit or assist with any false, forged or
            fraudulent document or declaration, and we do not offer or pay
            anything to any official to influence a decision. We will decline or
            stop work on any request of that nature, and we may report it where
            the law requires.
          </p>

          <h2>8. Rejections and re-filing</h2>
          <p>
            If an application is rejected because of an error or omission on our
            side, we re-file it at no additional service charge. If it is
            rejected because information you gave us was incorrect or
            incomplete, or because you do not meet the eligibility criteria, the
            service charge for the work already done remains payable and any
            re-filing is chargeable. Government fees already paid are not
            refundable in either case.
          </p>

          <h2>9. Document retention and release</h2>
          <p>
            Your finished document stays downloadable on your tracking page for
            90 days after release. Please save a copy. We will provide a
            replacement copy after that period where we still hold the file, but
            we cannot guarantee availability indefinitely.
          </p>

          <h2>10. Limitation of liability</h2>
          <p>
            Our liability in connection with any request is limited to the
            service charge you paid us for that request. We are not liable for
            indirect or consequential losses, including missed admission dates,
            lost job opportunities or scheme deadlines, arising from delays or
            decisions of a government department.
          </p>

          <h2>11. Communication</h2>
          <p>
            By giving us your phone number you agree that we may contact you by
            call, SMS and WhatsApp about your request. We do not send marketing
            messages to clients who ask us not to.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These terms are governed by the laws of India. Disputes are subject
            to the exclusive jurisdiction of the courts at{" "}
            {siteConfig.address.city}, {siteConfig.address.state}.
          </p>

          <h2>13. Contact</h2>
          <p>
            {siteConfig.legalName}
            <br />
            {fullAddress}
            <br />
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <br />
            {siteConfig.phoneNumber}
          </p>
        </div>
      </Section>
    </>
  );
}
