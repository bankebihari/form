"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { siteConfig, whatsappTo } from "@/config/site";
import { cn, formatINR } from "@/lib/utils";
import type { PlainApplication } from "@/types";

/**
 * Ready-made WhatsApp messages, addressed to the client's own number.
 *
 * There is no WhatsApp API here on purpose: tapping a button opens WhatsApp
 * with the message already typed, and a human presses send. That keeps the
 * whole product on one number with no third-party service to pay for.
 */
export function WhatsappTemplates({
  application,
}: {
  application: PlainApplication;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const name = application.applicant.name;
  const service = application.service.title;
  const id = application.trackingId;
  const trackUrl = `${siteConfig.url}/track?id=${id}`;
  const total = application.quote?.totalAmount ?? 0;
  const advance = application.payments.advance;
  const balance = application.payments.balance;

  const templates = [
    {
      key: "tracking-id",
      label: "Send the Tracking ID",
      when: "Right after the request comes in",
      recommended: application.status === "SUBMITTED",
      body: [
        `Namaste ${name}, this is ${siteConfig.name}.`,
        ``,
        `We have received your request for ${service}.`,
        `Your Tracking ID is: ${id}`,
        ``,
        `You can check the live status any time here:`,
        trackUrl,
        `(Open the link and enter this Tracking ID with your mobile number ${application.applicant.phone}.)`,
        ``,
        `Please save this message. We will call you shortly to confirm the details and the final price.`,
      ].join("\n"),
    },
    {
      key: "quote",
      label: "Send the price",
      when: "After you have set the amount",
      recommended: application.status === "QUOTED",
      body: [
        `Namaste ${name},`,
        ``,
        `For your ${service} (Tracking ID ${id}) the total is ${formatINR(total)}.`,
        ``,
        `To begin, only ${siteConfig.advancePercent}% is payable now: ${formatINR(advance.amount)}`,
        `The remaining ${formatINR(balance.amount)} is due only after your document is ready and you have seen it.`,
        ``,
        `You can see this on your tracking page: ${trackUrl}`,
        ``,
        `Shall I share the payment details?`,
      ].join("\n"),
    },
    {
      key: "started",
      label: "Confirm work has started",
      when: "After the booking amount arrives",
      recommended: application.status === "ADVANCE_PAID",
      body: [
        `Thank you ${name}, we have received your booking amount of ${formatINR(advance.amount)}.`,
        ``,
        `Your ${service} (${id}) is now in our work queue and we have started on it.`,
        `Track it here: ${trackUrl}`,
      ].join("\n"),
    },
    {
      key: "ready",
      label: "Document is ready — preview",
      when: "After you upload the finished document",
      recommended: application.status === "READY_PREVIEW",
      body: [
        `Good news ${name}, your ${service} is ready.`,
        ``,
        `Open your tracking page to see it: ${trackUrl}`,
        `Tracking ID: ${id}`,
        ``,
        `Please check the name, spelling and dates carefully. If anything is wrong, tell me and we will correct it before you pay anything more.`,
        ``,
        `Once you are happy, the balance of ${formatINR(balance.amount)} is due and the original file unlocks for download immediately.`,
      ].join("\n"),
    },
    {
      key: "balance",
      label: "Remind about the balance",
      when: "When the balance is still pending",
      recommended:
        application.status === "READY_PREVIEW" && balance.status === "PENDING",
      body: [
        `Namaste ${name},`,
        ``,
        `Your ${service} (${id}) is finished and waiting on your tracking page.`,
        `Balance pending: ${formatINR(balance.amount)}`,
        ``,
        `As soon as we receive it, the original document unlocks for you to download here: ${trackUrl}`,
      ].join("\n"),
    },
    {
      key: "delivered",
      label: "Document released",
      when: "Right after you press Release",
      recommended: application.status === "DELIVERED",
      body: [
        `Thank you ${name}, your payment is complete.`,
        ``,
        `Your ${service} is now unlocked. Download the original here:`,
        trackUrl,
        `Tracking ID: ${id}`,
        ``,
        `It stays available for 90 days, so please save a copy. Thank you for trusting ${siteConfig.name}.`,
      ].join("\n"),
    },
  ];

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Card>
      <CardHeader
        title="Message the client"
        subtitle={`Opens WhatsApp to +91 ${application.applicant.phone} with the message already typed. You just press send.`}
      />
      <CardBody className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.key}
            className={cn(
              "rounded-xl border p-4",
              template.recommended
                ? "border-brand-300 bg-brand-50 ring-2 ring-brand-100"
                : "border-line bg-white"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[14.5px] font-bold text-navy-900">
                  {template.recommended ? (
                    <Sparkles
                      className="h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
                  ) : null}
                  {template.label}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  {template.when}
                </p>
              </div>
            </div>

            <details className="mt-2.5 group">
              <summary className="cursor-pointer list-none text-[12.5px] font-semibold text-brand-700 marker:hidden hover:text-brand-800">
                <span className="group-open:hidden">Preview the message</span>
                <span className="hidden group-open:inline">Hide message</span>
              </summary>
              <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-canvas p-3 font-sans text-[12.5px] leading-relaxed text-navy-800">
                {template.body}
              </pre>
            </details>

            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={whatsappTo(application.applicant.phone, template.body)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#25D366] px-3.5 text-[13px] font-bold text-[#062e18] transition-colors hover:bg-[#1fbe5b]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Send on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => copy(template.key, template.body)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-navy-200 bg-white px-3.5 text-[13px] font-semibold text-navy-800 transition-colors hover:bg-navy-50"
              >
                {copied === template.key ? (
                  <>
                    <Check className="h-4 w-4 text-success-600" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden />
                    Copy text
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
