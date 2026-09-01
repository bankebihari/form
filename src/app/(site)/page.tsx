import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileCheck2,
  Lock,
  MessageCircle,
  Phone,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Unlock,
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
  // "| DocSeva" suffix appended by the root template.
  title: {
    absolute: `${siteConfig.name} — Apply for Government Documents Online, Pay Only 10% to Start`,
  },
  description:
    "Caste, income, domicile, birth, PAN and more. Raise a request in 2 minutes, track it live, see your document before you pay the balance. Talk to a real person on WhatsApp or phone.",
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
  "Only 10% to start",
  "See the document before you pay",
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
        <div className="container-page relative py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
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
                Caste, income, domicile, birth, PAN, affidavits and more. Raise
                your request in two minutes, track every stage on your phone,
                and pay the balance only after you have seen the finished
                document.
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
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-display text-[15px] font-extrabold text-white">
                      10%
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        Booking amount
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        Paid over call or WhatsApp. We start work the same day.
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700">
                      <Eye className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        Preview, locked
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        Your finished document appears on your tracking page as
                        a watermarked preview. Check it carefully.
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-3.5 rounded-xl border border-line bg-canvas p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-600 font-display text-[15px] font-extrabold text-white">
                      90%
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-navy-900">
                        Balance, then download
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                        Once the balance is confirmed, the original file unlocks
                        instantly for download.
                      </span>
                    </span>
                  </li>
                </ol>

                <p className="mt-5 flex items-start gap-2 rounded-xl border border-brand-100 bg-brand-50 p-3.5 text-[12.5px] leading-relaxed text-navy-700">
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

      {/* ---------------------------------------------------- Preview / release */}
      <Section tone="white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="The part that protects you"
              title="You see the document before you pay the balance"
              subtitle="This is the single biggest worry people have with document agents: paying up front and then chasing someone for weeks. We removed it."
            />
            <ul className="space-y-4">
              {[
                {
                  icon: FileCheck2,
                  title: "We finish the work first",
                  body: "The full document is prepared and uploaded to your private tracking page.",
                },
                {
                  icon: Eye,
                  title: "You review a watermarked preview",
                  body: "Names, dates, spellings — check everything. Wrong detail? We correct it before any balance is due.",
                },
                {
                  icon: Unlock,
                  title: "Balance cleared, file unlocked",
                  body: "The moment our team confirms your payment, the original downloads with one tap.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <item.icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-bold text-navy-900">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-muted">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Locked-document mock */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-line bg-white p-4 shadow-lift">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[12.5px] font-bold text-navy-900">
                  DS-2609-0184
                </span>
                <Badge tone="warn">Awaiting balance</Badge>
              </div>
              <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-navy-50">
                <div className="space-y-2.5 p-5 blur-[2px]">
                  <div className="h-3 w-2/3 rounded bg-navy-200" />
                  <div className="h-2.5 w-full rounded bg-navy-100" />
                  <div className="h-2.5 w-5/6 rounded bg-navy-100" />
                  <div className="h-2.5 w-full rounded bg-navy-100" />
                  <div className="h-2.5 w-3/4 rounded bg-navy-100" />
                  <div className="mt-4 h-16 rounded bg-navy-100" />
                  <div className="h-2.5 w-1/2 rounded bg-navy-100" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="-rotate-12 select-none font-display text-[26px] font-extrabold tracking-[0.2em] text-navy-900/15">
                    PREVIEW
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-navy-900 p-3.5 text-white">
                <Lock className="h-5 w-5 text-gold-500" aria-hidden />
                <span className="text-[12.5px] leading-snug">
                  Original download unlocks after the balance is confirmed by
                  our team.
                </span>
              </div>
            </div>
          </div>
        </div>
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

      {/* ----------------------------------------------------------- Video / YT */}
      <Section tone="white">
        <div className="grid items-center gap-8 rounded-[18px] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-soft sm:p-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-navy-800">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" aria-hidden />
              Watch before you decide
            </span>
            <h2 className="mt-4 font-display text-[26px] font-extrabold leading-tight text-navy-900 sm:text-[32px]">
              See a real application, start to finish
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              We record the whole process on YouTube — the form, the call, the
              10% booking, the preview and the final download. Watch it once and
              you will know exactly what to expect.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AnchorButton
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
                <PlayCircle className="h-5 w-5" aria-hidden />
                Watch on YouTube
              </AnchorButton>
              <LinkButton href="/book-a-demo" variant="outline" size="lg">
                Book a free demo call
              </LinkButton>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-navy-800 bg-navy-950 shadow-lift">
            <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <PlayCircle className="h-14 w-14 text-white/90" aria-hidden />
              <p className="text-[13px] font-semibold text-navy-200">
                Full walkthrough &middot; 6 min
              </p>
            </div>
          </div>
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
