"use client";

import { useState } from "react";
import { AlertCircle, Loader2, MessageCircle, Search } from "lucide-react";
import { TrackResult } from "@/components/track/track-result";
import { AnchorButton, Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card, CardBody } from "@/components/ui/primitives";
import { siteConfig, whatsappLink } from "@/config/site";
import {
  TRACKING_ID_MAX,
  cleanTrackingId,
  isValidPhone,
  phoneInputValue,
} from "@/lib/sanitize";
import type { TrackingView } from "@/types";

export function TrackLookup({ initialId = "" }: { initialId?: string }) {
  const [trackingId, setTrackingId] = useState(cleanTrackingId(initialId));
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    view: TrackingView;
    token: string;
  } | null>(null);

  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setFormError("");

    const next: Record<string, string> = {};
    if (cleanTrackingId(trackingId).length < 6) {
      next.trackingId = "Enter the Tracking ID we sent you (e.g. DS-2609-0042)";
    }
    if (!isValidPhone(phone)) {
      next.phone = "Enter the 10-digit mobile number used on the request";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId: trackingId.trim(), phone }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setFormError(payload.message ?? "We could not find that application.");
        return;
      }

      setResult({ view: payload.data.view, token: payload.data.token });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(
        "We could not reach the server. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <TrackResult
        view={result.view}
        token={result.token}
        onReset={() => {
          setResult(null);
          setPhone("");
          setTrackingId("");
        }}
      />
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardBody>
        <h2 className="text-[18px] font-bold text-navy-900">
          Check your application
        </h2>
        <p className="mt-1 text-[14px] text-muted">
          Enter the Tracking ID we gave you along with the mobile number you
          used. No password needed.
        </p>

        {formError ? (
          <Alert
            tone="danger"
            className="mt-4"
            icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
          >
            {formError}
          </Alert>
        ) : null}

        <form onSubmit={lookup} className="mt-5 space-y-4" noValidate>
          <Field
            label="Tracking ID"
            htmlFor="trackingId"
            required
            error={errors.trackingId}
          >
            <Input
              id="trackingId"
              name="trackingId"
              value={trackingId}
              onChange={(event) =>
                setTrackingId(cleanTrackingId(event.target.value))
              }
              maxLength={TRACKING_ID_MAX}
              placeholder="DS-2609-0042"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              className="font-display tracking-[0.08em]"
              invalid={Boolean(errors.trackingId)}
            />
          </Field>

          <Field
            label="Mobile number"
            htmlFor="trackPhone"
            required
            error={errors.phone}
            help="The number you gave when raising the request."
          >
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3.5 text-[15px] font-semibold text-navy-700">
                +91
              </span>
              <Input
                id="trackPhone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={12}
                value={phone}
                onChange={(event) => setPhone(phoneInputValue(event.target.value))}
                placeholder="98765 43210"
                className="rounded-l-none"
                invalid={Boolean(errors.phone)}
              />
            </div>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
                Checking...
              </>
            ) : (
              <>
                <Search className="h-4.5 w-4.5" aria-hidden />
                Check status
              </>
            )}
          </Button>
        </form>

        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[13px] text-muted">
            Lost your Tracking ID? Message us with your name and mobile number
            and we will find it for you.
          </p>
          <AnchorButton
            href={whatsappLink(
              `Hello ${siteConfig.name}, I have lost my Tracking ID. Please help me find my application.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="mt-3 w-full"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask on WhatsApp
          </AnchorButton>
        </div>
      </CardBody>
    </Card>
  );
}
