import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeIndianRupee,
  Eye,
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
  title: "How It Works — Raise, Track, Preview, Pay 90% and Download",
  description:
    "The full process explained: raise a request in 2 minutes, get a call, pay 10% to start, watch the status live, preview your finished document and pay the balance only then.",
  alternates: { canonical: absoluteUrl("/how-it-works") },
};

const paymentFaqs = [
  {
    question: "Why do you take 10% before starting?",
    answer:
      "Filing an application costs us time and, in many cases, government fees paid on your behalf on day one. The 10% covers that commitment from both sides. It is deliberately small so you risk very little.",
  },
  {
    question: "When exactly is the 90% due?",
    answer:
      "Only after your finished document is uploaded and you have seen the watermarked preview on your tracking page. Not a day earlier.",
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
    question: "What if I change my mind after paying the 10%?",
    answer:
      "If we have not yet paid a government fee or filed the application, we refund the booking amount. Once filing has started, the booking amount covers work already done. This is written out in full on our refund policy page.",
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
          title="10% to start. 90% only after you have seen the document."
          subtitle="This is the whole payment structure. There is nothing else, and nothing hidden."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <BadgeIndianRupee className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                1. Booking — {siteConfig.advancePercent}%
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Paid over UPI, bank transfer or cash after the price is agreed
                on a call. Recorded against your Tracking ID the same day, and
                work starts immediately.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warn-50 text-warn-600">
                <Eye className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                2. Preview — free
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Your finished document appears on your tracking page as a
                watermarked preview. You can read every line. You cannot
                download it yet — and neither can anyone else.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-600">
                <Unlock className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
                3. Balance — {siteConfig.balancePercent}%
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Once our team confirms the balance, the original file is
                released to your tracking page and stays downloadable there for
                90 days.
              </p>
            </CardBody>
          </Card>
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
