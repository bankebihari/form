import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Alert, Card, CardBody, Section } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Request received",
  description: "Your request has been received. Save your Tracking ID.",
  robots: { index: false, follow: false },
};

export default async function RequestSuccessPage({
  params,
}: {
  params: Promise<{ trackingId: string }>;
}) {
  const { trackingId } = await params;
  const id = decodeURIComponent(trackingId).toUpperCase();

  const whatsappHref = whatsappLink(
    `Hello ${siteConfig.name}, I have raised a request on your website.\nMy Tracking ID is ${id}.\nPlease guide me on the next step.`
  );

  return (
    <Section tone="white" className="min-h-[70vh]">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2
              className="h-9 w-9 text-success-600"
              strokeWidth={1.8}
              aria-hidden
            />
          </span>
          <h1 className="mt-5 font-display text-[28px] font-extrabold text-navy-900 sm:text-[34px]">
            Request received
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
            Our team will call you on the number you gave us, usually within a
            few working hours, to confirm your details and give you one final
            price.
          </p>
        </div>

        {/* Tracking ID — the single most important thing on this page */}
        <Card className="mt-8 overflow-hidden">
          <div className="border-b border-line bg-navy-900 px-5 py-4 text-center text-white sm:px-6">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300">
              Your Tracking ID
            </p>
            <p className="mt-2 font-display text-[30px] font-extrabold tracking-[0.06em] sm:text-[38px]">
              {id}
            </p>
            <div className="mt-3 flex justify-center">
              <CopyButton value={id} label="Copy Tracking ID" />
            </div>
          </div>

          <CardBody>
            <Alert
              tone="warn"
              title="Save this ID somewhere safe"
              icon={<BellRing className="h-5 w-5 text-warn-600" aria-hidden />}
            >
              Enter this Tracking ID on our tracking page to see your status at any
              time. Your mobile number works too, if you lose the ID. Take a screenshot, or send it to yourself on
              WhatsApp using the button below.
            </Alert>

            <div className="mt-5 space-y-2.5">
              <AnchorButton
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                size="lg"
                className="w-full"
              >
                <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                Continue on WhatsApp
              </AnchorButton>
              <LinkButton
                href={`/track?id=${encodeURIComponent(id)}`}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Search className="h-4 w-4" aria-hidden />
                Track this application
              </LinkButton>
              <AnchorButton
                href={callLink}
                variant="ghost"
                size="lg"
                className="w-full"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call us on {siteConfig.phoneNumber}
              </AnchorButton>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-5">
          <CardBody>
            <h2 className="text-[16px] font-bold text-navy-900">
              What happens from here
            </h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  title: "Our team reviews your case",
                  body: "We check what you sent and work out exactly what is needed for your state and category.",
                },
                {
                  title: "You get a call with one final price",
                  body: "No estimates that change later. The price agreed on that call is the price you pay.",
                },
                {
                  title: `You pay ${siteConfig.advancePercent}% to start`,
                  body: "Arranged on the call or WhatsApp by UPI, bank transfer or cash. Work begins the same day.",
                },
                {
                  title: "You watch it progress here",
                  body: "Every stage is posted to your tracking page, so you always know where your file is.",
                },
                {
                  title: `You see the document, then pay ${siteConfig.balancePercent}%`,
                  body: "We tell you the moment it is ready. It unlocks for download once the balance is confirmed.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 font-display text-[13px] font-extrabold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold text-navy-900">
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-[13.5px] leading-relaxed text-muted">
                      {step.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                aria-hidden
              />
              We will never ask you for a card number, CVV, UPI PIN or OTP. If
              anyone does, call us on {siteConfig.phoneNumber}.
            </p>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-700 hover:text-brand-800"
          >
            Need another document? Browse services
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  );
}
