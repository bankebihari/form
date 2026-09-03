import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Landmark,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqList } from "@/components/site/faq";
import { ServiceCard } from "@/components/site/service-card";
import {
  StatsBar,
  TestimonialCard,
  TrustBadges,
} from "@/components/site/trust";
import {
  AnchorButton,
  LinkButton,
} from "@/components/ui/button";
import { Badge, Section, SectionHeading } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import {
  HOME_FAQS,
  HOW_IT_WORKS,
  TESTIMONIALS,
  WHY_US,
} from "@/data/site-content";
import { getPopularServices } from "@/lib/services";
import { absoluteUrl, faqJsonLd, howToJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  // absolute: the home page is the one title that should not get the
  // brand suffix appended by the root template.
  title: {
    absolute: `${siteConfig.name} — Apply for Government Documents Online, Pay Only 10% to Start`,
  },
  description:
    "Caste, income, domicile, birth, PAN and more, filed and followed up for you. Pay the government fee plus a tenth of our charge to begin. Raise a request in 2 minutes and talk to a real person on WhatsApp or phone.",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: `${siteConfig.name} — Government documents, done for you`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

const heroChips = [
  "No account needed",
  "Only 10% of our fee to start",
  "Government fee never marked up",
];

export default async function HomePage() {
  const services = await getPopularServices(6);
  const whatsappHref = whatsappLink(
    `Hello ${siteConfig.name}, I want to apply for a document. Please guide me.`
  );

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-canvas">
        <div className="bg-grid-ink absolute inset-0" aria-hidden />
        <div
          className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-200/45 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -left-40 top-32 h-[360px] w-[360px] rounded-full bg-success-100/50 blur-3xl"
          aria-hidden
        />
        {/* Less padding above than below: the header already sits on top, and a
            deep top inset just pushes the headline under the fold. */}
        <div className="container-page relative pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          {/* items-start, not items-center: the payment card is taller than the
              copy beside it, and centring the shorter column left a dead band
              across the top of the section. */}
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-navy-800 shadow-soft">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-success-600"
                  aria-hidden
                />
                Trusted by {siteConfig.stats.applications} applicants since{" "}
                {new Date().getFullYear() - Number(siteConfig.stats.yearsActive)}
              </span>

              <h1 className="mt-5 font-display text-[32px] font-extrabold leading-[1.1] text-navy-900 sm:text-[44px] lg:text-[52px]">
                Government documents,
                <span className="block text-brand-700">
                  without the queue.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted sm:text-[17px]">
                Caste, income, domicile, birth, PAN, affidavits and more. We
                fill the forms, file them and follow up, so you never queue at a
                government office. Raise a request in two minutes and track
                every stage from your phone.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                {heroChips.map((chip) => (
                  <li
                    key={chip}
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold text-navy-800"
                  >
                    <CheckCircle2
                      className="h-4 w-4 text-success-600"
                      aria-hidden
                    />
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/request" size="lg" className="sm:w-auto">
                  Raise a request
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LinkButton>
                <AnchorButton
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                >
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                  Chat on WhatsApp
                </AnchorButton>
              </div>

              <p className="mt-4 text-[13px] text-muted">
                Prefer talking?{" "}
                <a
                  href={callLink}
                  className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
                >
                  Call {siteConfig.phoneNumber}
                </a>{" "}
                &middot;{" "}
                <Link
                  href="/request-a-call"
                  className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
                >
                  Ask us to call you
                </Link>
              </p>
            </div>

            {/* Payment ladder — the promise that makes people trust the site */}
            <div className="relative">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-700">
                    How payment works
                  </p>
                  <Badge tone="success">Safe for you</Badge>
                </div>

                <ol className="mt-5 space-y-3">
                  <li className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-white">
                      <Landmark className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        Government fee, in full
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        This goes straight to the department, not to us. We have
                        to pay it before anything can be filed, so it is never
                        split and never marked up.
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-display text-[15px] font-extrabold text-white">
                      10%
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        A tenth of our own charge
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        That is all we ask to begin. Work starts the same day.
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-600 font-display text-[15px] font-extrabold text-white">
                      90%
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        The rest, at the end
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        Payable once your document is ready. It unlocks for
                        download the moment we confirm it.
                      </span>
                    </span>
                  </li>
                </ol>

                <p className="mt-4 flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50 p-3.5 text-[12.5px] leading-relaxed text-navy-700">
                  <Lock
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
                    aria-hidden
                  />
                  <span>
                    We take{" "}
                    <strong className="text-navy-900">no payments</strong> on
                    this website and store no card details. Everything is
                    settled directly with our team.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <StatsBar />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <Section tone="white" id="services">
        <SectionHeading
          eyebrow="What we do"
          title="The documents people ask us for most"
          subtitle="Every service below is handled end to end — preparation, filing, follow-up and delivery. Your price is quoted after our team reviews your case, and confirmed on a call before any money moves."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/services" variant="outline" size="lg">
            See all services
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </div>
      </Section>

      {/* -------------------------------------------------------- How it works */}
      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="Six steps, and you never move from your chair"
          subtitle="No forms to download, no office to visit, no account to create."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-[14px] border border-line bg-white p-5 shadow-soft"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 font-display text-[15px] font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3.5 text-[16px] font-bold text-navy-900">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* --------------------------------------------------------- Why trust us */}
      <Section>
        <SectionHeading
          eyebrow="Why people trust us"
          title="Built to remove every reason to worry"
        />
        <TrustBadges />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="rounded-[14px] border border-line bg-white p-5 shadow-soft"
            >
              <h3 className="flex items-start gap-2 text-[15.5px] font-bold text-navy-900">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-success-600"
                  aria-hidden
                />
                {item.title}
              </h3>
              <p className="mt-2 pl-7 text-[14px] leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- Testimonials */}
      <Section>
        <SectionHeading
          eyebrow="Client stories"
          title="What people say after their document arrives"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ FAQ */}
      <Section tone="white" id="faq">
        <SectionHeading
          eyebrow="Questions"
          title="Everything people ask before starting"
        />
        <div className="mx-auto max-w-3xl">
          <FaqList items={HOME_FAQS} />
        </div>
      </Section>

      {/* ------------------------------------------------------------ Final CTA */}
      <section className="relative overflow-hidden border-t border-line bg-gradient-to-b from-white to-brand-50 py-14 sm:py-20">
        <div className="bg-grid-ink absolute inset-0" aria-hidden />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-2xl font-display text-[26px] font-extrabold leading-tight text-navy-900 sm:text-[34px]">
            Tell us what you need. We will take it from there.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Two minutes to raise a request. A real person calls you back the
            same working day.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row sm:justify-center">
            <LinkButton href="/request" size="lg">
              Raise a request
              <ArrowRight className="h-4 w-4" aria-hidden />
            </LinkButton>
            <AnchorButton
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
              WhatsApp us
            </AnchorButton>
            <AnchorButton href={callLink} variant="outline" size="lg">
              <Phone className="h-4 w-4" aria-hidden />
              Call now
            </AnchorButton>
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          faqJsonLd(HOME_FAQS),
          howToJsonLd(
            HOW_IT_WORKS.map((step) => step.title),
            `How to apply for a document through ${siteConfig.name}`
          ),
        ]}
      />
    </>
  );
}
