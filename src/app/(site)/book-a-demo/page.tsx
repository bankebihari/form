import type { Metadata } from "next";
import { CheckCircle2, MessageCircle, MonitorPlay, Phone } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/site/page-hero";
import { AnchorButton } from "@/components/ui/button";
import { Card, CardBody, Section } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { getServices } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Book a Free Demo — See the Whole Process Before You Commit",
  description:
    "A 15-minute walkthrough on WhatsApp or a call: how we file, how the tracking page works, how the 10/90 payment works, and what your document will look like.",
  alternates: { canonical: absoluteUrl("/book-a-demo") },
};

const covered = [
  "How your request moves from raised to delivered",
  "A live look at a real tracking page",
  "How the watermarked preview works, and why you see it before paying",
  "Exactly how the 10% and 90% payments are arranged and recorded",
  "What we need from you for your specific document",
  "An honest answer on timeline and price for your case",
];

export default async function BookADemoPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Book a demo"
        title="See how it works before you pay anything"
        subtitle="A free 15-minute walkthrough on a call or WhatsApp video. We show you a real application, the tracking page and the preview-before-payment step."
        crumbs={[{ name: "Book a demo", path: "/book-a-demo" }]}
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <LeadForm
              type="DEMO"
              heading="Pick a slot"
              description="Choose a day and a time window that suits you. We confirm on WhatsApp."
              services={services}
              withSchedule
              messageLabel="Anything specific you want to see?"
              messagePlaceholder="e.g. Show me how the preview looks for an income certificate."
              submitLabel="Book my demo"
              successTitle="Demo booked"
              successBody="We have your slot. Our team will confirm on WhatsApp shortly — you can also message us right now to lock it in."
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardBody>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <MonitorPlay className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-[16px] font-bold text-navy-900">
                  What the demo covers
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {covered.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13.5px] leading-relaxed text-muted"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-navy-700">
                  Free, about 15 minutes, and there is no obligation to book any
                  service afterwards.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-[16px] font-bold text-navy-900">
                  Want it right now instead?
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  If someone is free, we will walk you through it on the spot.
                </p>
                <div className="mt-4 space-y-2.5">
                  <AnchorButton
                    href={whatsappLink(
                      `Hello ${siteConfig.name}, I would like a quick demo of how your process works.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="w-full"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                    Demo on WhatsApp
                  </AnchorButton>
                  <AnchorButton
                    href={callLink}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {siteConfig.phoneNumber}
                  </AnchorButton>
                  <AnchorButton
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    className="w-full"
                  >
                    Watch the recorded walkthrough
                  </AnchorButton>
                </div>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Book a demo", path: "/book-a-demo" },
        ])}
      />
    </>
  );
}
