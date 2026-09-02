import type { Metadata } from "next";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { StatsBar, TrustBadges } from "@/components/site/trust";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { Card, CardBody, Section, SectionHeading } from "@/components/ui/primitives";
import { fullAddress, siteConfig, whatsappLink } from "@/config/site";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — A Local Document Team You Can Actually Reach",
  description: `${siteConfig.legalName} helps families and small businesses get government documents without losing a day of work. Real people, one clear price, and only 10% of our fee to begin.`,
  alternates: { canonical: absoluteUrl("/about") },
};

const principles = [
  {
    title: "We tell you the price once",
    body: "The number agreed on your first call is the number you pay. If a government fee applies, it is shown separately at actuals, with the receipt.",
  },
  {
    title: "We do not hold documents hostage",
    body: "The moment your balance is confirmed the document is released. No delays, no bargaining at the end, no extra charge that appears only once the work is done.",
  },
  {
    title: "We say no when we cannot help",
    body: "If your case needs a court order, a different department or simply is not possible, we tell you on the first call instead of taking a booking amount.",
  },
  {
    title: "We answer the phone",
    body: `A real person picks up during working hours, ${siteConfig.hours.toLowerCase()}. Not a bot, not a ticket queue.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Paperwork is our job, so it stops being yours"
        subtitle={`${siteConfig.legalName} is a document assistance service run by a small local team. We prepare, file and follow up on government applications for people who cannot afford to lose a working day at a government office.`}
        crumbs={[{ name: "About", path: "/about" }]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="prose-doc">
            <h2>Why we started</h2>
            <p>
              A caste certificate for a college admission. An income certificate
              for a scholarship whose last date is in four days. A birth
              certificate that was never registered twenty years ago. These are
              small pieces of paper that decide big things, and getting them
              usually means three visits to an office that is open exactly when
              you are supposed to be at work.
            </p>
            <p>
              We built this service around one simple idea: the running around
              should be done by someone whose job it is. You should be able to
              send a message from your phone, get a straight answer about the
              price and the timeline, and then get on with your day.
            </p>

            <h2>What makes us different from an agent on the corner</h2>
            <p>
              Most people have had at least one bad experience with a document
              agent — money paid up front, then weeks of unanswered calls. That
              is the specific problem this service is designed around.
            </p>
            <ul>
              <li>
                <strong>Only 10% of our fee to start.</strong> Not half, not
                full, and never a percentage of the government fee. The risk you
                take at the beginning is deliberately small.
              </li>
              <li>
                <strong>The government fee is never marked up.</strong> You pay
                the department exactly what they charge, shown separately from
                our own fee, with the receipt.
              </li>
              <li>
                <strong>Every stage is on record.</strong> Your tracking page
                shows what happened and when, so there is never a gap where you
                are wondering what is going on.
              </li>
              <li>
                <strong>Nothing is taken on this website.</strong> No payment
                gateway, no stored cards. Money is settled directly with our
                team, and we record it against your Tracking ID.
              </li>
            </ul>

            <h2>What we are not</h2>
            <p>
              We are a private service. We are not a government office and we
              are not affiliated with any department. We cannot change a
              department decision or jump an official queue. What we can do is
              make sure your file is complete, correctly formatted and followed
              up on properly — which is what most rejections and delays actually
              come down to.
            </p>

            <h2>Where we work</h2>
            <p>
              Our office is at {fullAddress}. Most work is handled remotely over
              WhatsApp and phone, and we serve clients across India. Certificate
              procedures are state-specific, so tell us your state and district
              on the first call and we will confirm the exact process, price and
              timeline for you.
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardBody>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ShieldCheck className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-[17px] font-bold text-navy-900">
                  Talk to us first
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  You do not have to commit to anything to ask a question. Tell
                  us what you need and we will tell you honestly whether we can
                  help, what it costs and how long it takes.
                </p>
                <div className="mt-5 space-y-2.5">
                  <AnchorButton
                    href={whatsappLink(
                      `Hello ${siteConfig.name}, I have a question about your service.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    size="lg"
                    className="w-full"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                    Message on WhatsApp
                  </AnchorButton>
                  <LinkButton
                    href="/request-a-call"
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Request a call back
                  </LinkButton>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-[17px] font-bold text-navy-900">
                  How we work
                </h2>
                <ul className="mt-4 space-y-4">
                  {principles.map((item) => (
                    <li key={item.title}>
                      <p className="text-[14.5px] font-semibold text-navy-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>

      <Section>
        <StatsBar />
        <div className="mt-8">
          <SectionHeading
            eyebrow="Our commitments"
            title="Four promises we hold ourselves to"
          />
          <TrustBadges />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/request" size="lg">
            Raise a request
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
