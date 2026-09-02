import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeIndianRupee,
  Landmark,
  MessageCircle,
  Unlock,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqList } from "@/components/site/faq";
import { PageHero } from "@/components/site/page-hero";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import {
  Alert,
  Card,
  CardBody,
  Section,
  SectionHeading,
} from "@/components/ui/primitives";
import { siteConfig, whatsappLink } from "@/config/site";
import { HOW_IT_WORKS } from "@/data/site-content";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, howToJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How It Works — Raise, Track, Pay and Download",
  description:
    "The full process explained: raise a request in 2 minutes, get a call, pay the government fee plus 10% of our charge, watch the status live, then clear the balance and download.",
  alternates: { canonical: absoluteUrl("/how-it-works") },
};

const paymentFaqs = [
  {
    question: "Why do you take 10% before starting?",
    answer:
      "It is a small commitment from both sides. Filing costs us time from day one, and a tenth of our charge is deliberately little enough that you risk almost nothing.",
  },
  {
    question: "Why is the government fee not split too?",
    answer:
      "Because it is not ours. We have to hand the full amount to the department before your application can be filed, so splitting it would mean funding the government out of our own pocket on every job. It is charged at actuals, never marked up.",
  },
  {
    question: "When exactly is the 90% due?",
    answer:
      "Only once your document is finished and marked ready on your tracking page. Not a day earlier.",
  },
  {
    question: "How do I actually pay?",
    answer:
      "Our team shares payment details with you on the call or on WhatsApp — UPI, bank transfer or cash at our office. There is no payment button on this website and we never ask for card, CVV or OTP details.",
  },
  {
    question: "How do you confirm my payment?",
    answer:
      "Our team verifies the money in our account and then records it against your Tracking ID. You will see the payment marked as received on your tracking page, with the date and reference.",
  },
  {
    question: "What if I change my mind after paying to start?",
    answer:
      "If we have not yet paid the government fee or filed the application, we refund what you gave us. Once the fee is paid to the department it cannot come back to us, so it cannot come back to you either. This is written out in full on our refund policy page.",
  },
  {
    question: "Do I need to install an app or make an account?",
    answer:
      "No. You get a Tracking ID after raising your request. That ID plus your phone number is all you need to check status, and WhatsApp opens directly without any registration with us.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="The process"
        title="How your application actually moves"
        subtitle="No jargon. Here is exactly what happens after you press the button, who does what, and when money changes hands."
        crumbs={[{ name: "How it works", path: "/how-it-works" }]}
      />

      <Section tone="white">
        <ol className="mx-auto max-w-3xl space-y-4">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title} className="relative flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 font-display text-[16px] font-extrabold text-white">
                  {index + 1}
                </span>
                {index < HOW_IT_WORKS.length - 1 ? (
                  <span
                    className="mt-1 w-px flex-1 bg-line"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="flex-1 pb-6">
                <h2 className="text-[17px] font-bold text-navy-900">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Money, in plain words"
          title="The government fee in full, then 10% of our own charge"
          subtitle="Two separate amounts make up a job, and only one of them is ever split. This is the whole structure — there is nothing else."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                <Landmark className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                1. Government fee &mdash; in full
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Whatever the department charges, at actuals, never marked up. We
                have to hand it over before your application can be filed, so it
                is payable up front and is never split.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BadgeIndianRupee className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                2. {siteConfig.advancePercent}% of our service charge
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Our fee for doing the work is the only part that splits. A tenth
                of it starts the job, recorded against your Tracking ID the same
                day.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600">
                <Unlock className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                3. The remaining {siteConfig.balancePercent}%
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Due once your document is finished. The moment we confirm it,
                the file unlocks on your tracking page and stays downloadable
                there for 90 days.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* The arithmetic, because a percentage of one part of a bill is the
            single thing people most often misread. */}
        <div className="mx-auto mt-6 max-w-2xl rounded-[14px] border border-navy-200 bg-navy-50 p-5">
          <p className="text-[13px] font-bold uppercase tracking-wide text-navy-700">
            A worked example: PAN card
          </p>
          <dl className="mt-3 space-y-2 text-[14.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Government fee</dt>
              <dd className="font-semibold text-navy-900">&#8377;100</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Our service charge</dt>
              <dd className="font-semibold text-navy-900">&#8377;50</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-navy-200 pt-2">
              <dt className="font-semibold text-navy-900">
                Payable to start &mdash; &#8377;100 + &#8377;5
              </dt>
              <dd className="font-display text-[18px] font-extrabold text-brand-700">
                &#8377;105
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">
                Payable when the document is ready
              </dt>
              <dd className="font-semibold text-navy-900">&#8377;45</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-navy-200 pt-2">
              <dt className="font-semibold text-navy-900">Total</dt>
              <dd className="font-semibold text-navy-900">&#8377;150</dd>
            </div>
          </dl>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            The &#8377;5 is a tenth of <em>our</em> &#8377;50, not a tenth of the
            whole bill. We never take a percentage of the government fee.
          </p>
        </div>

        <Alert
          tone="info"
          className="mt-6"
          title="We never take payments on this website"
        >
          There is no card form, no payment gateway and no wallet on this site.
          We will never ask you for a card number, CVV, UPI PIN or OTP. If
          anyone claiming to be from {siteConfig.name} asks for those, stop and
          call us on {siteConfig.phoneNumber}.
        </Alert>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Questions about payment"
          title="The things people ask before sending the first rupee"
        />
        <div className="mx-auto max-w-3xl">
          <FaqList items={paymentFaqs} />
        </div>

        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
          <LinkButton href="/request" size="lg">
            Raise a request
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
          <AnchorButton
            href={whatsappLink(
              `Hello ${siteConfig.name}, I have a question about how the process works.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <MessageCircle className="h-4.5 w-4.5" aria-hidden />
            Ask a question
          </AnchorButton>
        </div>
      </Section>

      <JsonLd
        data={[
          howToJsonLd(
            HOW_IT_WORKS.map((step) => step.title),
            `How ${siteConfig.name} processes your document request`
          ),
          faqJsonLd(paymentFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "How it works", path: "/how-it-works" },
          ]),
        ]}
      />
    </>
  );
}
