"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, Loader2, Plus, Zap } from "lucide-react";
import { createApplicationAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { LEAD_SOURCES } from "@/lib/constants";
import { NAME_MAX, cleanName, phoneInputValue } from "@/lib/sanitize";
import { cn, formatINR } from "@/lib/utils";
import type { PlainService } from "@/types";

const idle: ActionState = { ok: false, message: "" };

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: "Website",
  YOUTUBE: "YouTube",
  WHATSAPP: "WhatsApp",
  REFERRAL: "Referral",
  WALK_IN: "Walk-in",
  OTHER: "Other",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
          Creating...
        </>
      ) : (
        <>
          <Plus className="h-4.5 w-4.5" aria-hidden />
          Create and get Tracking ID
        </>
      )}
    </Button>
  );
}

export function NewApplicationForm({ services }: { services: PlainService[] }) {
  const [state, action] = useActionState(createApplicationAction, idle);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [urgent, setUrgent] = useState(false);

  const total = Number(amount) || 0;
  const advance = Math.round((total * siteConfig.advancePercent) / 100);

  const grouped = Array.from(
    services.reduce((map, service) => {
      const list = map.get(service.category) ?? [];
      list.push(service);
      map.set(service.category, list);
      return map;
    }, new Map<string, PlainService[]>())
  );

  return (
    <form action={action}>
      <Card>
        <CardHeader
          title="New request"
          subtitle="For someone who called, walked in or messaged you. Only a mobile number and a title are needed."
        />
        <CardBody className="space-y-5">
          {state.message && !state.ok ? (
            <Alert
              tone="danger"
              icon={<AlertTriangle className="h-5 w-5 text-danger-600" aria-hidden />}
            >
              {state.message}
            </Alert>
          ) : null}

          <Field
            label="Mobile number"
            htmlFor="phone"
            required
            help="This is what the client uses with the Tracking ID to open their status page. Get it right."
          >
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3.5 text-[15px] font-semibold text-navy-700">
                +91
              </span>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={12}
                value={phone}
                onChange={(event) => setPhone(phoneInputValue(event.target.value))}
                placeholder="98765 43210"
                className="rounded-l-none"
                required
              />
            </div>
          </Field>

          <Field
            label="What is the work?"
            htmlFor="title"
            required
            help="Shown to the client on their tracking page, so write it the way they would recognise it."
          >
            <Input
              id="title"
              name="title"
              maxLength={120}
              placeholder="e.g. Caste Certificate for son"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client name" htmlFor="name" hint="Optional">
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(cleanName(event.target.value))}
                maxLength={NAME_MAX}
                placeholder="Leave blank if you do not know it yet"
              />
            </Field>

            <Field label="Where did they come from?" htmlFor="source">
              <Select id="source" name="source" defaultValue="WHATSAPP">
                {LEAD_SOURCES.map((value) => (
                  <option key={value} value={value}>
                    {SOURCE_LABELS[value] ?? value}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field
            label="Link to a service"
            htmlFor="serviceSlug"
            hint="Optional"
            help="Only ties the record to your catalogue. The title above is what the client sees."
          >
            <Select id="serviceSlug" name="serviceSlug" defaultValue="">
              <option value="">Not linked</option>
              {grouped.map(([category, items]) => (
                <optgroup key={category} label={category}>
                  {items.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Field>

          <Field
            label="Price"
            htmlFor="totalAmount"
            hint="Optional"
            help="If you already agreed a price, put it here and the 10/90 split is set up straight away."
          >
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 1500"
            />
          </Field>

          {total > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-3.5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-700">
                  Booking ({siteConfig.advancePercent}%)
                </p>
                <p className="mt-1 font-display text-[20px] font-extrabold text-navy-900">
                  {formatINR(advance)}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-canvas p-3.5">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                  Balance ({siteConfig.balancePercent}%)
                </p>
                <p className="mt-1 font-display text-[20px] font-extrabold text-navy-900">
                  {formatINR(Math.max(total - advance, 0))}
                </p>
              </div>
            </div>
          ) : null}

          <Field label="Notes" htmlFor="note" hint="Optional">
            <Textarea
              id="note"
              name="note"
              placeholder="Anything they told you on the call."
              className="min-h-20"
            />
          </Field>

          <label
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
              urgent ? "border-warn-500 bg-warn-50" : "border-navy-200 bg-white"
            )}
          >
            <input
              type="checkbox"
              name="urgent"
              checked={urgent}
              onChange={(event) => setUrgent(event.target.checked)}
              className="sr-only"
            />
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                urgent ? "bg-warn-500 text-white" : "bg-navy-100 text-navy-600"
              )}
            >
              <Zap className="h-4.5 w-4.5" aria-hidden />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-navy-900">
                Mark as urgent
              </span>
              <span className="block text-[13px] text-muted">
                Flags it at the top of your applications list.
              </span>
            </span>
          </label>
        </CardBody>

        <div className="flex flex-col gap-3 border-t border-line bg-canvas px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[12.5px] leading-relaxed text-muted">
            A Tracking ID is generated on save. The next screen has a ready
            WhatsApp message to send it to them.
          </p>
          <SubmitButton />
        </div>
      </Card>
    </form>
  );
}
