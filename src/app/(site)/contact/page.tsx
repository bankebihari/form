import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/site/page-hero";
import { AnchorButton } from "@/components/ui/button";
import { Card, CardBody, Section } from "@/components/ui/primitives";
import {
  callLink,
  fullAddress,
  siteConfig,
  whatsappLink,
} from "@/config/site";
import { getServices } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us — Call, WhatsApp or Visit Our Office",
  description: `Reach ${siteConfig.legalName} on ${siteConfig.phoneNumber}, on WhatsApp, by email or at our office. ${siteConfig.hours}.`,
  alternates: { canonical: absoluteUrl("/contact") },
};

export default async function ContactPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        subtitle="Call, WhatsApp, email or walk in. Whichever is easiest for you — it reaches the same team."
        crumbs={[{ name: "Contact", path: "/contact" }]}
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="space-y-4">
            <Card>
              <CardBody className="space-y-4">
                <a
                  href={callLink}
                  className="flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-navy-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-muted">
                      Call us
                    </span>
                    <span className="mt-0.5 block text-[16px] font-bold text-navy-900">
                      {siteConfig.phoneNumber}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-muted">
                      Opens your phone dialer
                    </span>
                  </span>
                </a>

                <a
                  href={whatsappLink(`Hello ${siteConfig.name}, I need some help.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-navy-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#128C7E]">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-muted">
                      WhatsApp
                    </span>
                    <span className="mt-0.5 block text-[16px] font-bold text-navy-900">
                      {siteConfig.phoneNumber}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-muted">
                      Opens a chat with our team
                    </span>
                  </span>
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-navy-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-muted">
                      Email
                    </span>
                    <span className="mt-0.5 block break-all text-[15px] font-bold text-navy-900">
                      {siteConfig.email}
                    </span>
                  </span>
                </a>

                <div className="flex items-start gap-3.5 rounded-xl p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-muted">
                      Office
                    </span>
                    <span className="mt-0.5 block text-[14.5px] font-semibold leading-relaxed text-navy-900">
                      {fullAddress}
                    </span>
                  </span>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700">
                    <Clock className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold uppercase tracking-wide text-muted">
                      Working hours
                    </span>
                    <span className="mt-0.5 block text-[14.5px] font-semibold text-navy-900">
                      {siteConfig.hours}
                    </span>
                  </span>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-[16px] font-bold text-navy-900">
                  Already raised a request?
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  Check the live status of your application instead of waiting
                  for a reply.
                </p>
                <Link
                  href="/track"
                  className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 hover:text-brand-800"
                >
                  <Search className="h-4 w-4" aria-hidden />
                  Track your application
                </Link>
              </CardBody>
            </Card>

            <AnchorButton
              href={whatsappLink(`Hello ${siteConfig.name}, I need some help.`)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="w-full"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
              Message us on WhatsApp
            </AnchorButton>
          </div>

          <div className="min-w-0">
            <LeadForm
              type="CONTACT"
              heading="Send us a message"
              description="Write your question here and we will reply on WhatsApp or call you back."
              services={services}
              messageLabel="Your question"
              messagePlaceholder="Describe what you need. Hindi or English, both are fine."
              submitLabel="Send message"
              successTitle="Message sent"
              successBody="Our team will get back to you shortly. If it is urgent, message us on WhatsApp and we will pick it up faster."
            />
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${siteConfig.name}`,
            url: absoluteUrl("/contact"),
            mainEntity: { "@id": absoluteUrl("/#organization") },
          },
        ]}
      />
    </>
  );
}
