"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { replyToClientAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Badge, Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { cn, formatDateTime } from "@/lib/utils";
import type { PlainApplication } from "@/types";

const idle: ActionState = { ok: false, message: "" };

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Sending...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" aria-hidden />
          Send reply
        </>
      )}
    </Button>
  );
}

/** The staff side of the same conversation the client sees. */
export function ReplyThread({ application }: { application: PlainApplication }) {
  const [state, action] = useActionState(replyToClientAction, idle);

  const messages = application.messages ?? [];
  const unread = messages.filter(
    (message) => message.from === "CLIENT" && !message.readAt
  ).length;

  return (
    <Card>
      <CardHeader
        title="Conversation"
        subtitle="What the client wrote, and your replies. They see this on their tracking page."
        action={unread ? <Badge tone="warn">{unread} new</Badge> : null}
      />
      <CardBody className="space-y-4">
        {messages.length ? (
          <ol className="space-y-3">
            {messages.map((message, index) => {
              const staff = message.from === "STAFF";
              return (
                <li
                  key={`${message.at}-${index}`}
                  className={cn("flex", staff ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      staff
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
                        staff ? "text-brand-100" : "text-muted"
                      )}
                    >
                      {staff
                        ? message.byName || "Our team"
                        : application.applicant.name}{" "}
                      · {formatDateTime(message.at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="rounded-xl border border-dashed border-navy-200 bg-canvas p-6 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-navy-300" aria-hidden />
            <p className="mt-2 text-[13.5px] text-muted">
              Nothing written yet. A reply here appears on their tracking page.
            </p>
          </div>
        )}

        <form action={action} className="space-y-2.5 border-t border-line pt-4">
          <input type="hidden" name="id" value={application._id} />
          <Textarea
            name="body"
            placeholder="Write your reply. The client sees this on their tracking page."
            className="min-h-20"
            maxLength={1200}
            aria-label="Your reply"
          />
          <SendButton />
        </form>

        {state.message ? (
          <p
            className={cn(
              "text-[13px] font-medium",
              state.ok ? "text-success-700" : "text-danger-600"
            )}
          >
            {state.message}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
