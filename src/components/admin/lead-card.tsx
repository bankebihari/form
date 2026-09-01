"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  CalendarClock,
  Check,
  Loader2,
  MessageCircle,
  Phone,
} from "lucide-react";
import { updateLeadAction, type ActionState } from "@/app/admin/actions";
import { LeadStatusBadge, LeadTypeBadge } from "@/components/admin/status-badge";
import { AnchorButton, Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Card, CardBody } from "@/components/ui/primitives";
import { callTo, whatsappTo } from "@/config/site";
import { LEAD_STATUSES } from "@/lib/constants";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { LeadDocPlain } from "@/types";

const idle: ActionState = { ok: false, message: "" };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="outline" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Check className="h-4 w-4" aria-hidden />
      )}
      Save
    </Button>
  );
}

export function LeadCard({ lead }: { lead: LeadDocPlain }) {
  const [state, action] = useActionState(updateLeadAction, idle);

  const message = whatsappTo(
    lead.phone,
    lead.type === "DEMO"
      ? `Hello ${lead.name}, about the demo you booked with us.`
      : `Hello ${lead.name}, you asked us to get in touch.`
  );

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-navy-900">{lead.name}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {relativeTime(lead.createdAt)}
              {lead.city ? ` · ${lead.city}` : ""}
              {lead.serviceTitle ? ` · ${lead.serviceTitle}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <LeadTypeBadge type={lead.type} />
            <LeadStatusBadge status={lead.status} />
          </div>
        </div>

        {lead.preferredDate ? (
          <p className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2 text-[13px] font-semibold text-brand-800">
            <CalendarClock className="h-4 w-4" aria-hidden />
            {lead.preferredDate}
            {lead.preferredSlot ? `, ${lead.preferredSlot}` : ""}
          </p>
        ) : null}

        {lead.message ? (
          <p className="rounded-xl border border-line bg-canvas p-3.5 text-[13.5px] leading-relaxed text-navy-800">
            {lead.message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <AnchorButton href={callTo(lead.phone)} size="sm" variant="outline">
            <Phone className="h-4 w-4" aria-hidden />
            +91 {lead.phone}
          </AnchorButton>
          <AnchorButton
            href={message}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="whatsapp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </AnchorButton>
          {lead.email ? (
            <AnchorButton
              href={`mailto:${lead.email}`}
              size="sm"
              variant="ghost"
            >
              {lead.email}
            </AnchorButton>
          ) : null}
        </div>

        <form
          action={action}
          className="flex flex-col gap-2.5 border-t border-line pt-4 sm:flex-row"
        >
          <input type="hidden" name="id" value={lead._id} />
          <Select
            name="status"
            defaultValue={lead.status}
            className="sm:w-44"
            aria-label="Lead status"
          >
            {LEAD_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0) + value.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
          <Input
            name="adminNote"
            defaultValue={lead.adminNote ?? ""}
            placeholder="Note (e.g. called, will decide next week)"
            className="flex-1"
            aria-label="Internal note"
          />
          <SaveButton />
        </form>

        {state.message ? (
          <p
            className={`text-[13px] font-medium ${
              state.ok ? "text-success-700" : "text-danger-600"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        {lead.handledBy || lead.contactedAt ? (
          <p className="text-[12px] text-navy-400">
            {lead.handledBy ? `Handled by ${lead.handledBy}` : ""}
            {lead.contactedAt
              ? ` · last touched ${formatDateTime(lead.contactedAt)}`
              : ""}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
