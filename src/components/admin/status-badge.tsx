import { Badge } from "@/components/ui/primitives";
import { STATUS_META, type ApplicationStatus } from "@/lib/constants";
import { LEAD_STATUS_META, type LeadStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status];
  if (!meta) return <Badge tone="neutral">{status}</Badge>;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const meta = LEAD_STATUS_META[status];
  if (!meta) return <Badge tone="neutral">{status}</Badge>;
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

const LEAD_TYPE_LABEL = {
  CALLBACK: "Call back",
  DEMO: "Demo",
  CONTACT: "Enquiry",
} as const;

export function LeadTypeBadge({
  type,
}: {
  type: "CALLBACK" | "DEMO" | "CONTACT";
}) {
  const tones = {
    CALLBACK: "info",
    DEMO: "gold",
    CONTACT: "neutral",
  } as const;
  return <Badge tone={tones[type]}>{LEAD_TYPE_LABEL[type]}</Badge>;
}
