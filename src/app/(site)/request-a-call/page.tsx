import type { Metadata } from "next";
import { Clock, MessageCircle, Phone, PhoneCall } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/site/page-hero";
import { AnchorButton } from "@/components/ui/button";
import { Card, CardBody, Section } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { getServices } from "@/lib/services";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Request a Call Back — Talk to a Real Person",
  description:
    "Leave your number and we call you back. Ask anything about documents, timelines or the process. No obligation, no payment.",
  alternates: { canonical: absoluteUrl("/request-a-call") },
};

export default async function RequestACallPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Get connected"
        title="Ask us to call you"
        subtitle="Leave your number and a short note. A real person from our team calls you back — usually the same working day."
        crumbs={[{ name: "Request a call", path: "/request-a-call" }]}
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <LeadForm
              type="CALLBACK"
              heading="Request a call back"
              description="Tell us when suits you and what it is about. Nothing is charged for a call."
              services={services}
              withSchedule
              messageLabel="What is it about?"
              messagePlaceholder="e.g. I need a caste certificate for my son's admission and I am not sure which papers I have."
              submitLabel="Request the call"
              successTitle="Call requested"
              successBody="We have your number and your preferred time. Our team will call you then — and if you want to start right now, use WhatsApp below."
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardBody>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <PhoneCall className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-[16px] font-bold text-navy-900">
                  Do not want to wait?
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  Call us directly or send a WhatsApp message — both reach the
                  same team.
                </p>
                <div className="mt-4 space-y-2.5">
                  <AnchorButton href={callLink} className="w-full">
                    <Phone className="h-4 w-4" aria-hidden />
                    Call {siteConfig.phoneNumber}
                  </AnchorButton>
                  <AnchorButton
                    href={whatsappLink(
                      `Hello ${siteConfig.name}, please call me back about a document.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="w-full"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                    WhatsApp us
                  </AnchorButton>
                </div>
                <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[13px] text-muted">
                  <Clock className="h-4 w-4 text-navy-400" aria-hidden />
                  {siteConfig.hours}
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-[16px] font-bold text-navy-900">
                  What we will ask you
                </h2>
                <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-muted">
                  <li>Which document you need, and what it is for</li>
                  <li>Your state and district, since rules differ</li>
                  <li>Which papers you already have</li>
                  <li>How soon you need it</li>
                </ul>
                <p className="mt-3 text-[13px] text-muted">
                  That is enough for us to give you one final price on the same
                  call.
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </Section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Request a call", path: "/request-a-call" },
        ])}
      />
    </>
  );
}
