import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/primitives";
import { siteConfig, whatsappLink } from "@/config/site";
import { getServices, groupByCategory } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Document Services — Certificates, Identity, Business & Legal",
  description:
    "Caste, income, domicile, EWS, birth, death, marriage, PAN, passport, Aadhaar, voter ID, ration card, affidavits, Gumasta, Udyam and GST. Apply online and pay only 10% to start.",
  alternates: { canonical: absoluteUrl("/services") },
  openGraph: {
    title: `All services | ${siteConfig.name}`,
    description:
      "Every document service we handle, with typical timelines and what we need from you.",
    url: absoluteUrl("/services"),
  },
};

export default async function ServicesPage() {
  const services = await getServices();
  const groups = groupByCategory(services);

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Every document we handle, in one place"
        subtitle="Typical timelines are shown for each service. We do not publish fixed rates: our team reviews your case and gives you one final price on a short call, and you pay only 10% to begin."
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/request" size="lg">
            Raise a request
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
          <AnchorButton
            href={whatsappLink(
              `Hello ${siteConfig.name}, I am not sure which service I need. Can you help?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
          >
            <MessageCircle className="h-4.5 w-4.5" aria-hidden />
            Not sure? Ask on WhatsApp
          </AnchorButton>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="space-y-14">
          {groups.map((group) => (
            <div key={group.category} id={group.category.toLowerCase()}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
                <h2 className="font-display text-[22px] font-extrabold text-navy-900 sm:text-[26px]">
                  {group.category}
                </h2>
                <span className="text-[13px] font-medium text-muted">
                  {group.items.length} service
                  {group.items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[18px] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-soft sm:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-[22px] font-extrabold text-navy-900 sm:text-[28px]">
                Do not see your document listed?
              </h2>
              <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-muted">
                We handle many more state-specific certificates, licences and
                legal drafts than we can list here. Send us one message
                describing what you need and we will tell you straight away
                whether we can do it, what it costs and how long it takes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <AnchorButton
                href={whatsappLink(
                  `Hello ${siteConfig.name}, I need a document that is not listed on your website.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
              >
                <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                Ask on WhatsApp
              </AnchorButton>
              <LinkButton href="/request-a-call" variant="outline" size="lg">
                Request a call back
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: service.title,
              url: absoluteUrl(`/services/${service.slug}`),
            })),
          },
        ]}
      />
    </>
  );
}
