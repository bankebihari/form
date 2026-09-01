"use client";

import { useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { cn, formatDateTime } from "@/lib/utils";
import type { PlainMessage } from "@/types";

/**
 * The client's side of the conversation, on their own tracking page.
 *
 * Their signed lookup token is what authorises a reply, so there is still no
 * account and no password anywhere in this flow.
 */
export function MessageThread({
  token,
  messages: initial,
}: {
  token: string;
  messages: PlainMessage[];
}) {
  const [messages, setMessages] = useState(initial);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const text = body.trim();
    if (text.length < 2) {
      setError("Write your message first.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/track/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, body: text }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "We could not send that. Please try again.");
        return;
      }

      // Shown straight away; the server has the same record.
      setMessages((prev) => [
        ...prev,
        { from: "CLIENT", body: text, at: new Date().toISOString() },
      ]);
      setBody("");
    } catch {
      setError("We could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Messages"
        subtitle="Ask us anything about this request. We reply here and on WhatsApp."
      />
      <CardBody className="space-y-4">
        {messages.length ? (
          <ol className="space-y-3">
            {messages.map((message, index) => {
              const mine = message.from === "CLIENT";
              return (
                <li
                  key={`${message.at}-${index}`}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      mine
                        ? "rounded-br-sm bg-brand-600 text-white"
                        : "rounded-bl-sm border border-line bg-canvas text-navy-900"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-[14px] leading-relaxed">
                      {message.body}
                    </p>
                    <p
                      className={cn(
                        "mt-1.5 text-[11.5px]",
                        mine ? "text-brand-100" : "text-muted"
                      )}
                    >
                      {mine ? "You" : message.byName || siteConfig.name} ·{" "}
                      {formatDateTime(message.at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-navy-200 bg-canvas p-6 text-center">
            <MessageSquare
              className="mx-auto h-6 w-6 text-navy-300"
              aria-hidden
            />
            <p className="mt-2 text-[13.5px] text-muted">
              No messages yet. Write below if you need anything.
            </p>
          </div>
        )}

        <form onSubmit={send} className="space-y-2.5 border-t border-line pt-4">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Type your message here. Hindi or English, both are fine."
            className="min-h-20"
            maxLength={1200}
            aria-label="Your message"
            invalid={Boolean(error)}
          />
          {error ? (
            <p className="text-[13px] font-medium text-danger-600">{error}</p>
          ) : null}
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Send message
              </>
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
