"use client";

import { useState } from "react";
import { AlertCircle, ChevronRight, Loader2, MessageCircle, Search } from "lucide-react";
import { TrackResult } from "@/components/track/track-result";
import { AnchorButton, Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Badge, Card, CardBody } from "@/components/ui/primitives";
import { siteConfig, whatsappLink } from "@/config/site";
import { formatDate } from "@/lib/utils";
import type { TrackingMatch, TrackingView } from "@/types";

export function TrackLookup({ initialId = "" }: { initialId?: string }) {
  const [query, setQuery] = useState(initialId);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<TrackingMatch[] | null>(null);
  const [result, setResult] = useState<{
    view: TrackingView;
    token: string;
  } | null>(null);

  async function lookup(value: string) {
    setError("");
    setMatches(null);

    if (value.trim().length < 6) {
      setError("Enter your Tracking ID or the mobile number you gave us.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value.trim() }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "We could not find that.");
        return;
      }

      if (payload.data.matches) {
        setMatches(payload.data.matches);
      } else {
        setResult({ view: payload.data.view, token: payload.data.token });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
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
          setMatches(null);
          setQuery("");
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
          Enter your Tracking ID, or just the mobile number you gave us. Either
          one works — no password needed.
        </p>

        {error ? (
          <Alert
            tone="danger"
            className="mt-4"
            icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
          >
            {error}
          </Alert>
        ) : null}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void lookup(query);
          }}
          className="mt-5 space-y-4"
          noValidate
        >
          <Field
            label="Tracking ID or mobile number"
            htmlFor="trackQuery"
            required
            help="For example OCC-2609-K7Q3XM, or 98765 43210."
          >
            <Input
              id="trackQuery"
              name="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="OCC-2609-K7Q3XM  or  98765 43210"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              maxLength={40}
              className="font-display tracking-[0.04em]"
              invalid={Boolean(error)}
            />
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

        {/* One number can have several requests, so let them pick. */}
        {matches?.length ? (
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[14px] font-semibold text-navy-900">
              You have {matches.length} requests with us
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              Choose the one you want to see.
            </p>
            <ul className="mt-3 space-y-2">
              {matches.map((match) => (
                <li key={match.trackingId}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(match.trackingId);
                      void lookup(match.trackingId);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-white p-3.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[13px] font-extrabold tracking-[0.04em] text-navy-900">
                        {match.trackingId}
                      </span>
                      <span className="mt-0.5 block truncate text-[13.5px] text-navy-800">
                        {match.serviceTitle}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted">
                        Raised {formatDate(match.createdAt)}
                      </span>
                    </span>
                    <Badge tone="info">{match.statusLabel}</Badge>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-navy-300"
                      aria-hidden
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
