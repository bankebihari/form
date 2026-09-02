import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircle,
  MessageSquareQuote,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqList } from "@/components/site/faq";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { ServiceIcon } from "@/components/site/service-icon";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { Alert, Badge, Card, CardBody, Section } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { bundledServiceSlugs, getServiceBySlug, getServices } from "@/lib/services";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return bundledServiceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };

  const title =
    service.seoTitle ||
    `${service.title} Online — Apply, Track and Get It Delivered`;
  const description =
    service.seoDescription ||
    `${service.shortDescription} Get a clear price on one call. Pay the government fee plus 10% of our service charge to begin, and the rest once it is ready.`;

  return {
    title,
    description,
    keywords: service.keywords,
    alternates: { canonical: absoluteUrl(`/services/${service.slug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/services/${service.slug}`),
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const all = await getServices();
  const related = all
    .filter((item) => item.slug !== service.slug && item.category === service.category)
    .slice(0, 3);
  const fallbackRelated = all
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  const relatedServices = related.length ? related : fallbackRelated;

  const whatsappHref = whatsappLink(
    `Hello ${siteConfig.name}, I want to apply for a ${service.title}. Please tell me the process.`
  );

  return (
    <>
      <PageHero
        eyebrow={service.category}
        title={service.title}
        subtitle={service.shortDescription}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800 shadow-soft">
            <MessageSquareQuote className="h-4 w-4 text-brand-700" aria-hidden />
            Price confirmed on one call
          </span>
          <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800 shadow-soft">
            <Clock3 className="h-4 w-4 text-brand-700" aria-hidden />
            {service.estimatedDays}
          </span>
          <span className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800 shadow-soft">
            <ShieldCheck className="h-4 w-4 text-success-600" aria-hidden />
Only {siteConfig.advancePercent}% of our charge to start
          </span>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* ------------------------------------------------------- Content */}
          <div className="min-w-0 space-y-10">
            <div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-[22px] font-extrabold text-navy-900">
                    About this service
                  </h2>
                  {service.popular ? (
                    <Badge tone="gold" className="mt-1.5">
                      Most requested
                    </Badge>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 text-[15.5px] leading-relaxed text-navy-800">
                {service.description || service.shortDescription}
              </p>
            </div>

            {service.documentsRequired.length ? (
              <div>
                <h2 className="font-display text-[22px] font-extrabold text-navy-900">
                  Documents you need to keep ready
                </h2>
                <p className="mt-2 text-[14px] text-muted">
                  Photos taken on your phone are fine. Send them on WhatsApp or
                  upload them with your request.
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {service.documentsRequired.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas p-3.5 text-[14px] text-navy-800"
                    >
                      <FileText
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.eligibility.length ? (
              <div>
                <h2 className="font-display text-[22px] font-extrabold text-navy-900">
                  Who can apply
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {service.eligibility.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[15px] text-navy-800"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success-600"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.steps.length ? (
              <div>
                <h2 className="font-display text-[22px] font-extrabold text-navy-900">
                  How we process it
                </h2>
                <ol className="mt-4 space-y-3">
                  {service.steps.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-4 rounded-xl border border-line bg-white p-4 shadow-soft"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 font-display text-[13px] font-extrabold text-white">
                        {index + 1}
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-navy-800">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <Alert tone="warn" title="How the price is decided">
              We do not publish a fixed rate for{" "}
              {service.title.toLowerCase()}, because the real cost depends on
              your state, the category of application and which papers you
              already have. Raise a request or send us a message — our team
              reviews your case and gives you one final price on a call, before
              you pay anything. {service.governmentFeeNote}
            </Alert>

            {service.faqs.length ? (
              <div>
                <h2 className="font-display text-[22px] font-extrabold text-navy-900">
                  {service.title} — common questions
                </h2>
                <div className="mt-4">
                  <FaqList items={service.faqs} />
                </div>
              </div>
            ) : null}
          </div>

          {/* --------------------------------------------------- Sticky CTA */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card className="overflow-hidden">
              <div className="bg-navy-900 p-5 text-white">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-300">
                  Start this application
                </p>
                <p className="mt-2 font-display text-[24px] font-extrabold leading-tight">
                  Get your exact price today
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-navy-300">
                  Raise a request and our team reviews your case, then confirms
                  one final price on a call.
                </p>
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-2 text-[13px]">
                  <ShieldCheck
                    className="h-4 w-4 shrink-0 text-success-500"
                    aria-hidden
                  />
                  Government fee + {siteConfig.advancePercent}% of our charge to
                  begin
                </p>
              </div>

              <CardBody className="space-y-3">
                <LinkButton
                  href={`/request?service=${service.slug}`}
                  size="lg"
                  className="w-full"
                >
                  Raise a request
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LinkButton>
                <AnchorButton
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                >
                  <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                  Ask on WhatsApp
                </AnchorButton>
                <AnchorButton
                  href={callLink}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {siteConfig.phoneNumber}
                </AnchorButton>

                <ul className="space-y-2 border-t border-line pt-4 text-[13px] text-muted">
                  <li className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-navy-400" aria-hidden />
                    Usual time: {service.estimatedDays}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck
                      className="h-4 w-4 text-navy-400"
                      aria-hidden
                    />
                    No account or password needed
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageSquareQuote
                      className="h-4 w-4 text-navy-400"
                      aria-hidden
                    />
                    No payment is taken on this website
                  </li>
                </ul>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>

      {relatedServices.length ? (
        <Section>
          <h2 className="mb-6 font-display text-[22px] font-extrabold text-navy-900 sm:text-[26px]">
            People who applied for this also asked about
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((item) => (
              <ServiceCard key={item.slug} service={item} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-700 hover:text-brand-800"
            >
              Browse all services
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Section>
      ) : null}

      <JsonLd
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          ...(service.faqs.length ? [faqJsonLd(service.faqs)] : []),
        ]}
      />
    </>
  );
}
