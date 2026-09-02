"use client";

import {
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  Lock,
  MessageCircle,
  Pause,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { MessageThread } from "@/components/track/message-thread";
import { AnchorButton } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import {
  APPLICATION_STATUSES,
  STATUS_META,
  statusStepIndex,
} from "@/lib/constants";
import { cn, formatDate, formatDateTime, formatINR } from "@/lib/utils";
import type { TrackingView } from "@/types";

const toneToBadge = {
  neutral: "neutral",
  info: "info",
  warn: "warn",
  success: "success",
  danger: "danger",
} as const;

export function TrackResult({
  view,
  token,
  onReset,
}: {
  view: TrackingView;
  token: string;
  onReset: () => void;
}) {
  const meta = STATUS_META[view.status];
  const currentStep = statusStepIndex(view.status);
  const stopped = view.status === "ON_HOLD" || view.status === "CANCELLED";

  const downloadUrl = `/api/track/file?token=${encodeURIComponent(token)}`;

  const advance = view.payments.advance;
  const balance = view.payments.balance;

  function payMessage(label: string, amount: number) {
    return whatsappLink(
      `Hello ${siteConfig.name}, I want to pay the ${label} for my application.\nTracking ID: ${view.trackingId}\nAmount: ${formatINR(amount)}\nPlease share the payment details.`
    );
  }

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------ Summary */}
      <Card className="overflow-hidden">
        <div className="bg-navy-900 px-5 py-5 text-white sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-300">
                Tracking ID
              </p>
              <p className="mt-1 font-display text-[26px] font-extrabold tracking-[0.05em] sm:text-[30px]">
                {view.trackingId}
              </p>
            </div>
            <Badge tone={toneToBadge[meta.tone]}>{meta.label}</Badge>
          </div>

          <dl className="mt-4 grid gap-3 border-t border-navy-700 pt-4 text-[13px] sm:grid-cols-3">
            <div>
              <dt className="text-navy-400">Service</dt>
              <dd className="mt-0.5 font-semibold">{view.serviceTitle}</dd>
            </div>
            <div>
              <dt className="text-navy-400">Applicant</dt>
              <dd className="mt-0.5 font-semibold">{view.applicantName}</dd>
            </div>
            <div>
              <dt className="text-navy-400">Raised on</dt>
              <dd className="mt-0.5 font-semibold">
                {formatDate(view.createdAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CopyButton
              value={view.trackingId}
              label="Copy ID"
              className="border-navy-700 bg-navy-800 text-white hover:bg-navy-700"
            />
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-[13px] font-semibold text-navy-100 hover:bg-navy-700"
            >
              Check another
            </button>
          </div>
        </div>

        <CardBody>
          <Alert
            tone={meta.tone === "danger" ? "danger" : meta.tone === "success" ? "success" : meta.tone === "warn" ? "warn" : "info"}
            title={meta.label}
            icon={
              stopped ? (
                view.status === "CANCELLED" ? (
                  <XCircle className="h-5 w-5 text-danger-600" aria-hidden />
                ) : (
                  <Pause className="h-5 w-5 text-warn-600" aria-hidden />
                )
              ) : (
                <Clock className="h-5 w-5 text-brand-600" aria-hidden />
              )
            }
          >
            {meta.description}
          </Alert>

          <p className="mt-3 text-[12.5px] text-muted">
            Last updated {formatDateTime(view.updatedAt)}
          </p>
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------ Progress */}
      {!stopped ? (
        <Card>
          <CardHeader title="Progress" subtitle="Where your file is right now" />
          <CardBody>
            <ol className="space-y-0">
              {APPLICATION_STATUSES.map((status, index) => {
                const done = index < currentStep;
                const active = index === currentStep;
                const entry = view.timeline.find(
                  (item) => item.status === status
                );
                return (
                  <li key={status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                          done && "border-success-600 bg-success-600 text-white",
                          active &&
                            "border-brand-600 bg-brand-50 text-brand-700 ring-4 ring-brand-100",
                          !done && !active && "border-navy-200 bg-white text-navy-300"
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4.5 w-4.5" aria-hidden />
                        ) : (
                          <Circle className="h-3 w-3 fill-current" aria-hidden />
                        )}
                      </span>
                      {index < APPLICATION_STATUSES.length - 1 ? (
                        <span
                          className={cn(
                            "w-0.5 flex-1",
                            done ? "bg-success-600" : "bg-line"
                          )}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div className={cn("pb-6", index === APPLICATION_STATUSES.length - 1 && "pb-0")}>
                      <p
                        className={cn(
                          "text-[14.5px] font-semibold",
                          done || active ? "text-navy-900" : "text-navy-400"
                        )}
                      >
                        {STATUS_META[status].label}
                      </p>
                      {entry ? (
                        <p className="mt-0.5 text-[12.5px] text-muted">
                          {formatDateTime(entry.at)}
                          {entry.note ? ` — ${entry.note}` : ""}
                        </p>
                      ) : active ? (
                        <p className="mt-0.5 text-[12.5px] text-muted">
                          In progress
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardBody>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------ Payments */}
      <Card>
        <CardHeader
          title="Payment"
          subtitle={`The government fee in full, plus ${siteConfig.advancePercent}% of our service charge, to start`}
        />
        <CardBody className="space-y-4">
          {view.quote.totalAmount > 0 ? (
            /* The split is the thing people query, so the arithmetic is shown
               rather than just the two totals. */
            <div className="rounded-xl border border-line bg-canvas p-4">
              <dl className="space-y-2 text-[13.5px]">
                {view.quote.governmentFee > 0 ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">
                      Government fee (at actuals, never marked up)
                    </dt>
                    <dd className="font-semibold text-navy-900">
                      {formatINR(view.quote.governmentFee)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Our service charge</dt>
                  <dd className="font-semibold text-navy-900">
                    {formatINR(view.quote.serviceCharge)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2">
                  <dt className="font-semibold text-navy-900">Total</dt>
                  <dd className="font-display text-[20px] font-extrabold text-navy-900">
                    {formatINR(view.quote.totalAmount)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <Alert tone="info">
              Your price has not been set yet. Our team will call you to confirm
              it — nothing is payable until then.
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentTile
              label="To start"
              amount={advance.amount}
              status={advance.status}
              receivedAt={advance.receivedAt}
              reference={advance.reference}
              payHref={payMessage("amount to start", advance.amount)}
              disabled={view.quote.totalAmount === 0}
              note={
                view.quote.governmentFee > 0
                  ? `${formatINR(view.quote.governmentFee)} government fee + ${siteConfig.advancePercent}% of our charge`
                  : `${siteConfig.advancePercent}% of our service charge`
              }
            />
            <PaymentTile
              label="Balance"
              amount={balance.amount}
              status={balance.status}
              receivedAt={balance.receivedAt}
              reference={balance.reference}
              payHref={payMessage("balance amount", balance.amount)}
              disabled={
                view.quote.totalAmount === 0 || advance.status === "PENDING"
              }
              note={`The remaining ${siteConfig.balancePercent}% of our service charge`}
              lockedNote={
                advance.status === "PENDING"
                  ? "Due once the first payment is recorded"
                  : undefined
              }
            />
          </div>

          {view.quote.notes ? (
            <p className="rounded-xl border border-line bg-canvas p-3.5 text-[13.5px] leading-relaxed text-navy-700">
              <strong className="text-navy-900">Note from our team:</strong>{" "}
              {view.quote.notes}
            </p>
          ) : null}

          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
              aria-hidden
            />
            Payments are arranged directly with our team. We never ask for card
            numbers, CVV, UPI PIN or OTP.
          </p>
        </CardBody>
      </Card>

      {/* ------------------------------------------------------------ Document */}
      <Card>
        <CardHeader
          title="Your document"
          subtitle={
            view.document.released
              ? "Released — download it below"
              : "Locked until the balance is confirmed"
          }
          action={
            view.document.released ? (
              <Badge tone="success">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Released
              </Badge>
            ) : view.document.exists ? (
              <Badge tone="warn">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                Locked
              </Badge>
            ) : (
              <Badge tone="neutral">Not ready</Badge>
            )
          }
        />
        <CardBody>
          {!view.document.exists ? (
            <div className="rounded-xl border border-dashed border-navy-200 bg-canvas p-8 text-center">
              <FileText
                className="mx-auto h-8 w-8 text-navy-300"
                aria-hidden
              />
              <p className="mt-3 text-[14.5px] font-semibold text-navy-900">
                Your document is not ready yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-[13.5px] leading-relaxed text-muted">
                We will message you on WhatsApp the moment it is prepared, and
                it will appear here.
              </p>
            </div>
          ) : view.document.released ? (
            <div className="space-y-4">
              <Alert tone="success" title="Payment complete — document released">
                Download and save your original document. It stays available
                here for 90 days.
              </Alert>
              <AnchorButton
                href={downloadUrl}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Download className="h-4.5 w-4.5" aria-hidden />
                Download original
              </AnchorButton>
              {view.document.filename ? (
                /* Filenames can be long, so they sit outside the button where
                   they are free to truncate instead of overflowing the card. */
                <p className="flex items-center gap-1.5 truncate text-[13px] text-muted">
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{view.document.filename}</span>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-canvas p-6 text-center">
                <Lock className="mx-auto h-7 w-7 text-navy-400" aria-hidden />
                <p className="mt-2.5 text-[15px] font-semibold text-navy-900">
                  Your document is ready and held securely
                </p>
                <p className="mx-auto mt-1 max-w-sm text-[13.5px] leading-relaxed text-muted">
                  It downloads from this page as soon as our team confirms your
                  balance payment.
                </p>
              </div>

              <div className="rounded-xl border border-navy-800 bg-navy-900 p-4 text-white">
                <p className="flex items-start gap-2.5 text-[13.5px] leading-relaxed">
                  <Lock
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-500"
                    aria-hidden
                  />
                  <span>
                    The original download unlocks the moment our team confirms
                    your balance payment of{" "}
                    <strong>{formatINR(balance.amount)}</strong>.
                  </span>
                </p>
                <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
                  <AnchorButton
                    href={payMessage("balance amount", balance.amount)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="whatsapp"
                    className="sm:w-auto"
                  >
                    <MessageCircle className="h-4.5 w-4.5" aria-hidden />
                    Pay balance on WhatsApp
                  </AnchorButton>
                  <AnchorButton
                    href={callLink}
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Call to pay
                  </AnchorButton>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* --------------------------------------------------------- Messages */}
      <MessageThread token={token} messages={view.messages ?? []} />

      {/* ---------------------------------------------------------- History */}
      {view.timeline.length ? (
        <Card>
          <CardHeader title="History" subtitle="Everything that has happened so far" />
          <CardBody>
            <ol className="space-y-4">
              {[...view.timeline].reverse().map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="flex gap-3.5">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" />
                  <div>
                    <p className="text-[14px] font-semibold text-navy-900">
                      {entry.title}
                    </p>
                    {entry.note ? (
                      <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
                        {entry.note}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-[12px] text-navy-400">
                      {formatDateTime(entry.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------- Help */}
      <Card>
        <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-bold text-navy-900">
              Something not clear?
            </p>
            <p className="mt-1 text-[13.5px] text-muted">
              Message us with your Tracking ID and we will answer the same day.
            </p>
          </div>
          <div className="flex w-full gap-2.5 sm:w-auto">
            <AnchorButton
              href={whatsappLink(
                `Hello ${siteConfig.name}, I have a question about my application.\nTracking ID: ${view.trackingId}`
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="flex-1 sm:flex-none"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
              WhatsApp
            </AnchorButton>
            <AnchorButton
              href={callLink}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </AnchorButton>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function PaymentTile({
  label,
  amount,
  status,
  receivedAt,
  reference,
  payHref,
  disabled,
  lockedNote,
  note,
}: {
  label: string;
  amount: number;
  status: string;
  receivedAt?: string;
  reference?: string;
  payHref: string;
  disabled?: boolean;
  lockedNote?: string;
  note?: string;
}) {
  const received = status === "RECEIVED" || status === "WAIVED";

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        received ? "border-success-100 bg-success-50" : "border-line bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold text-navy-800">{label}</p>
        {received ? (
          <Badge tone="success">
            {status === "WAIVED" ? "Waived" : "Received"}
          </Badge>
        ) : (
          <Badge tone="warn">Pending</Badge>
        )}
      </div>

      <p className="mt-2 font-display text-[22px] font-extrabold text-navy-900">
        {amount > 0 ? formatINR(amount) : "—"}
      </p>

      {note && !received ? (
        <p className="mt-1 text-[12px] leading-snug text-muted">{note}</p>
      ) : null}

      {received ? (
        <p className="mt-1 text-[12.5px] text-success-700">
          {receivedAt ? `Recorded ${formatDate(receivedAt)}` : "Recorded"}
          {reference ? ` · Ref ${reference}` : ""}
        </p>
      ) : lockedNote ? (
        <p className="mt-1 text-[12.5px] text-muted">{lockedNote}</p>
      ) : disabled ? (
        <p className="mt-1 text-[12.5px] text-muted">
          Payable once the price is confirmed
        </p>
      ) : (
        <AnchorButton
          href={payHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="sm"
          className="mt-3 w-full"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Pay this now
        </AnchorButton>
      )}
    </div>
  );
}
