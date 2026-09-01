import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/primitives";
import { fullAddress, siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.legalName} collects, stores, uses and deletes your personal documents and contact details.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

const updated = "1 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        subtitle={`Last updated ${updated}. This page explains, in plain language, what we do with your documents and your phone number.`}
        crumbs={[{ name: "Privacy", path: "/privacy" }]}
      />

      <Section tone="white">
        <div className="prose-doc mx-auto max-w-3xl">
          <h2>The short version</h2>
          <ul>
            <li>
              We collect only what is needed to prepare and file your
              application.
            </li>
            <li>
              Your documents are visible to the staff member handling your
              request and to nobody else.
            </li>
            <li>We never sell, rent or share your data for marketing.</li>
            <li>
              You can ask us to delete your documents at any time after your
              work is delivered.
            </li>
          </ul>

          <h2>1. What we collect</h2>
          <p>When you raise a request or contact us, we collect:</p>
          <ul>
            <li>
              <strong>Contact details</strong> — your name, phone number, and
              optionally your email address, city and state.
            </li>
            <li>
              <strong>Application details</strong> — the service you need and
              anything you tell us about your case.
            </li>
            <li>
              <strong>Supporting documents</strong> — files you upload or send
              to us on WhatsApp, such as Aadhaar, ration card, photographs or
              existing certificates.
            </li>
            <li>
              <strong>Payment records</strong> — the amount, date, method and
              reference number of payments you make to us. We do{" "}
              <strong>not</strong> collect or store card numbers, CVV, UPI PINs
              or OTPs, because no payment is ever processed on this website.
            </li>
            <li>
              <strong>Basic technical data</strong> — anonymised page-visit
              information used to keep the site fast and secure.
            </li>
          </ul>

          <h2>2. Why we collect it</h2>
          <ul>
            <li>To prepare, file and follow up on your application.</li>
            <li>To call or message you with updates about your request.</li>
            <li>
              To maintain a record of the work done and the payments received,
              which is also your protection in case of a dispute.
            </li>
            <li>To meet legal or regulatory obligations where they apply.</li>
          </ul>
          <p>
            We do not use your documents for any purpose other than the service
            you asked for.
          </p>

          <h2>3. How your documents are stored</h2>
          <p>
            Uploaded files are stored in our database with access restricted to
            authenticated staff accounts. Files are transferred over an
            encrypted connection. Your finished document is released to your
            tracking page only after our team marks your payment as complete,
            and only you, holding your Tracking ID and registered phone number,
            can open that page.
          </p>

          <h2>4. Who we share it with</h2>
          <p>
            We share your details only with the government department or
            authority to which your application is being submitted, and only to
            the extent that application requires. We do not sell your data. We
            do not share it with advertisers, lenders, insurers or any other
            third party.
          </p>
          <p>
            If you contact us on WhatsApp, that conversation is also subject to
            WhatsApp&apos;s own privacy terms, which are outside our control.
          </p>

          <h2>5. How long we keep it</h2>
          <ul>
            <li>
              <strong>Finished documents</strong> stay downloadable on your
              tracking page for 90 days after release.
            </li>
            <li>
              <strong>Supporting documents</strong> are retained while your
              application is active and for up to 12 months afterwards, in case
              a department raises a follow-up query.
            </li>
            <li>
              <strong>Payment and service records</strong> are retained as long
              as required for accounting and legal purposes.
            </li>
          </ul>

          <h2>6. Your rights</h2>
          <p>You can, at any time, ask us to:</p>
          <ul>
            <li>tell you what data of yours we hold;</li>
            <li>correct anything that is wrong;</li>
            <li>
              delete your uploaded documents once your work has been delivered;
            </li>
            <li>stop contacting you about anything other than active work.</li>
          </ul>
          <p>
            Write to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{" "}
            or call {siteConfig.phoneNumber} and we will act on it within 30
            days.
          </p>

          <h2>7. Security warning</h2>
          <p>
            We will <strong>never</strong> ask you for a card number, CVV, UPI
            PIN, net-banking password or OTP — not on the phone, not on
            WhatsApp, not on this website. If anyone claiming to represent us
            asks for those, end the conversation and call us on{" "}
            {siteConfig.phoneNumber}.
          </p>

          <h2>8. Children</h2>
          <p>
            Applications for minors are accepted only when raised by a parent or
            legal guardian, whose details we record as the applicant.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            If we change this policy we will update the date at the top of this
            page. Material changes affecting how we handle your documents will
            also be communicated to active clients.
          </p>

          <h2>10. Contact</h2>
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
