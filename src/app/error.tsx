"use client";

import { useEffect } from "react";
import { AlertTriangle, MessageCircle, Phone, RotateCw } from "lucide-react";
import { AnchorButton, Button } from "@/components/ui/button";
import { callLink, siteConfig, whatsappLink } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warn-50">
          <AlertTriangle className="h-7 w-7 text-warn-600" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-[24px] font-extrabold text-navy-900">
          Something went wrong at our end
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
          Your request has not been lost. Try again, and if it keeps happening
          call or message us — we will take your details directly.
        </p>

        <div className="mt-7 space-y-2.5">
          <Button onClick={reset} size="lg" className="w-full">
            <RotateCw className="h-4.5 w-4.5" aria-hidden />
            Try again
          </Button>
          <AnchorButton
            href={whatsappLink(
              `Hello ${siteConfig.name}, your website showed an error. Please help me.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="w-full"
          >
            <MessageCircle className="h-4.5 w-4.5" aria-hidden />
            Message us on WhatsApp
          </AnchorButton>
          <AnchorButton
            href={callLink}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call {siteConfig.phoneNumber}
          </AnchorButton>
        </div>

        {error.digest ? (
          <p className="mt-5 text-[12px] text-navy-400">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
