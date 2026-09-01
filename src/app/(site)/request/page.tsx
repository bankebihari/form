import type { Metadata } from "next";
import { Clock3, Lock, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { RequestForm } from "@/components/forms/request-form";
import { PageHero } from "@/components/site/page-hero";
import { AnchorButton } from "@/components/ui/button";
import { Card, CardBody, Section } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { getServices } from "@/lib/services";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Raise a Request — Start Your Document Application in 2 Minutes",
  description:
    "Tell us which document you need and how to reach you. No account, no password, no payment on this page. Our team calls you to confirm the price.",
  alternates: { canonical: absoluteUrl("/request") },
  robots: { index: true, follow: true },
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const services = await getServices();
  const initialService = services.some((item) => item.slug === service)
    ? service
    : "";

  return (
    <>
      <PageHero
        eyebrow="Raise a request"
        title="Tell us what you need"
        subtitle="Two minutes now, and a real person calls you back the same working day. Nothing is charged on this page."
        crumbs={[{ name: "Raise a request", path: "/request" }]}
      />

      <Section tone="white">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <RequestForm services={services} initialService={initialService} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardBody>
                <h2 className="text-[16px] font-bold text-navy-900">
                  What happens next
                </h2>
                <ol className="mt-4 space-y-3.5">
                  {[
                    {
                      icon: Phone,
                      title: "We call you",
                      body: "Usually within a few working hours, to confirm details and give you one final price.",
                    },
                    {
                      icon: Clock3,
                      title: "You get a Tracking ID",
                      body: "Save it. That ID opens your status page any time, and your mobile number works too."
                    },
                    {
                      icon: Lock,
                      title: "Nothing is paid yet",
                      body: `The ${siteConfig.advancePercent}% booking amount is arranged only after you agree the price.`,
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                        <item.icon className="h-4.5 w-4.5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold text-navy-900">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-[16px] font-bold text-navy-900">
                  Rather not fill a form?
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  Send one message and our team will take your details on
                  WhatsApp instead. No registration needed.
                </p>
                <div className="mt-4 space-y-2.5">
                  <AnchorButton
                    href={whatsappLink(
                      `Hello ${siteConfig.name}, I want to apply for a document. Please guide me.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="w-full"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                    Continue on WhatsApp
                  </AnchorButton>
                  <AnchorButton
                    href={callLink}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    {siteConfig.phoneNumber}
                  </AnchorButton>
                </div>
              </CardBody>
            </Card>

            <div className="flex items-start gap-2.5 rounded-xl border border-success-100 bg-success-50 p-4 text-[12.5px] leading-relaxed text-navy-700">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                aria-hidden
              />
              <span>
                Your documents are stored encrypted and are visible only to the
                staff member handling your request.
              </span>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
