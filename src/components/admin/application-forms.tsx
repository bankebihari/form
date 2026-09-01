"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  Lock,
  Send,
  Unlock,
  Upload,
} from "lucide-react";
import {
  addNoteAction,
  clearPaymentAction,
  lockDocumentAction,
  recordPaymentAction,
  releaseDocumentAction,
  setQuoteAction,
  updateStatusAction,
  uploadDeliverableAction,
  type ActionState,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import {
  ALL_STATUSES,
  PAYMENT_METHODS,
  STATUS_META,
  type ApplicationStatus,
} from "@/lib/constants";
import { formatDateTime, formatINR } from "@/lib/utils";
import type { PlainApplication } from "@/types";

const idle: ActionState = { ok: false, message: "" };

function Submit({
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Saving...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

function Result({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <Alert
      tone={state.ok ? "success" : "danger"}
      className="mt-4"
      icon={
        state.ok ? (
          <CheckCircle2 className="h-5 w-5 text-success-600" aria-hidden />
        ) : (
          <AlertTriangle className="h-5 w-5 text-danger-600" aria-hidden />
        )
      }
    >
      {state.message}
    </Alert>
  );
}

/* ------------------------------------------------------------------ quote */

export function QuoteForm({ application }: { application: PlainApplication }) {
  const [state, action] = useActionState(setQuoteAction, idle);
  const [total, setTotal] = useState(
    application.quote?.totalAmount ? String(application.quote.totalAmount) : ""
  );

  const amount = Number(total) || 0;
  const advance = Math.round((amount * siteConfig.advancePercent) / 100);
  const balance = Math.max(amount - advance, 0);

  return (
    <Card>
      <CardHeader
        title="Set the price"
        subtitle="This is what the client sees on their tracking page. Nothing is shown publicly."
      />
      <CardBody>
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={application._id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Total price (INR)"
              htmlFor="totalAmount"
              required
              help="Your full charge for this job, including any government fee."
            >
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={total}
                onChange={(event) => setTotal(event.target.value)}
                placeholder="e.g. 1500"
                required
              />
            </Field>

            <Field
              label="Of which government fee"
              htmlFor="governmentFee"
              hint="Optional"
              help="Shown to the client as charged at actuals."
            >
              <Input
                id="governmentFee"
                name="governmentFee"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                defaultValue={application.quote?.governmentFee || ""}
                placeholder="0"
              />
            </Field>
          </div>

          {amount > 0 ? (
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
                  {formatINR(balance)}
                </p>
              </div>
            </div>
          ) : null}

          <Field
            label="Note for the client"
            htmlFor="notes"
            hint="Optional"
            help="Appears under the price on their tracking page."
          >
            <Textarea
              id="notes"
              name="notes"
              defaultValue={application.quote?.notes ?? ""}
              placeholder="e.g. Includes notary and stamp paper. Government fee of 50 is charged at actuals."
              className="min-h-20"
            />
          </Field>

          <Submit>
            <Send className="h-4 w-4" aria-hidden />
            {application.quote?.totalAmount ? "Update price" : "Save price"}
          </Submit>
        </form>
        <Result state={state} />
      </CardBody>
    </Card>
  );
}

/* --------------------------------------------------------------- payments */

export function PaymentPanel({ application }: { application: PlainApplication }) {
  return (
    <Card>
      <CardHeader
        title="Payments"
        subtitle="Record money you have actually received. Nothing is charged through this website."
      />
      <CardBody className="space-y-5">
        <PaymentBlock
          application={application}
          which="advance"
          label={`Booking (${siteConfig.advancePercent}%)`}
        />
        <div className="border-t border-line pt-5">
          <PaymentBlock
            application={application}
            which="balance"
            label={`Balance (${siteConfig.balancePercent}%)`}
          />
        </div>
      </CardBody>
    </Card>
  );
}

function PaymentBlock({
  application,
  which,
  label,
}: {
  application: PlainApplication;
  which: "advance" | "balance";
  label: string;
}) {
  const [state, action] = useActionState(recordPaymentAction, idle);
  const [clearState, clearAction] = useActionState(clearPaymentAction, idle);
  const payment = application.payments[which];
  const received = payment.status === "RECEIVED";
  const blocked =
    which === "balance" && application.payments.advance.status === "PENDING";

  if (received) {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-success-100 bg-success-50 p-4">
          <div>
            <p className="flex items-center gap-1.5 text-[14px] font-bold text-success-700">
              <CheckCircle2 className="h-4.5 w-4.5" aria-hidden />
              {label} received
            </p>
            <p className="mt-1 text-[13px] text-navy-700">
              {formatINR(payment.amount)} by {payment.method}
              {payment.reference ? ` · ref ${payment.reference}` : ""}
              {payment.receivedAt
                ? ` · ${formatDateTime(payment.receivedAt)}`
                : ""}
            </p>
          </div>
          <form action={clearAction}>
            <input type="hidden" name="id" value={application._id} />
            <input type="hidden" name="which" value={which} />
            <Submit variant="ghost" size="sm">
              Undo
            </Submit>
          </form>
        </div>
        <Result state={clearState} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[14.5px] font-bold text-navy-900">{label}</p>
        <p className="font-display text-[18px] font-extrabold text-navy-900">
          {payment.amount ? formatINR(payment.amount) : "—"}
        </p>
      </div>

      {blocked ? (
        <p className="rounded-xl border border-line bg-canvas p-3.5 text-[13px] text-muted">
          Record the booking amount first.
        </p>
      ) : !application.quote?.totalAmount ? (
        <p className="rounded-xl border border-line bg-canvas p-3.5 text-[13px] text-muted">
          Set the price above before recording a payment.
        </p>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="id" value={application._id} />
          <input type="hidden" name="which" value={which} />

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Amount received" htmlFor={`${which}-amount`} required>
              <Input
                id={`${which}-amount`}
                name="amount"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                defaultValue={payment.amount || ""}
                required
              />
            </Field>
            <Field label="Method" htmlFor={`${which}-method`} required>
              <Select id={`${which}-method`} name="method" defaultValue="UPI">
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label="Reference"
              htmlFor={`${which}-reference`}
              hint="Optional"
            >
              <Input
                id={`${which}-reference`}
                name="reference"
                placeholder="UPI ref / receipt no."
              />
            </Field>
          </div>

          <Submit>
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Mark as received
          </Submit>
        </form>
      )}
      <Result state={state} />
    </div>
  );
}

/* ----------------------------------------------------------------- status */

export function StatusForm({ application }: { application: PlainApplication }) {
  const [state, action] = useActionState(updateStatusAction, idle);
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [note, setNote] = useState("");

  const preview = STATUS_META[status];

  return (
    <Card>
      <CardHeader
        title="Status"
        subtitle="These are the same steps, in the same words, that the client sees."
      />
      <CardBody>
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={application._id} />

          <Field label="Set status to" htmlFor="status" required>
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ApplicationStatus)
              }
            >
              {ALL_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_META[value].label}
                </option>
              ))}
            </Select>
          </Field>

          {/* The exact words the client will read, so there are no surprises. */}
          <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-700">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              What the client will see
            </p>
            <p className="mt-2 text-[14.5px] font-bold text-navy-900">
              {preview.label}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-navy-700">
              {preview.description}
            </p>
            {note.trim() ? (
              <p className="mt-2 border-t border-brand-200 pt-2 text-[13px] leading-relaxed text-navy-700">
                <span className="font-semibold">Your note: </span>
                {note.trim()}
              </p>
            ) : null}
          </div>

          <Field
            label="Note for the client"
            htmlFor="statusNote"
            hint="Optional"
            help="Shown under this step in their history."
          >
            <Textarea
              id="statusNote"
              name="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. Application submitted at the tehsil office, receipt no. 4821."
              className="min-h-20"
            />
          </Field>

          <Submit>Update status</Submit>
        </form>
        <Result state={state} />
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------- note */

export function NoteForm({ application }: { application: PlainApplication }) {
  const [state, action] = useActionState(addNoteAction, idle);

  return (
    <Card>
      <CardHeader
        title="Add an update"
        subtitle="Keeps the client informed without changing the status."
      />
      <CardBody>
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={application._id} />

          <Field label="Title" htmlFor="noteTitle" required>
            <Input
              id="noteTitle"
              name="title"
              placeholder="e.g. Verification officer visit scheduled"
              required
            />
          </Field>

          <Field label="Details" htmlFor="noteBody" hint="Optional">
            <Textarea
              id="noteBody"
              name="note"
              placeholder="Anything the client should know."
              className="min-h-20"
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-navy-700">
            <input
              type="checkbox"
              name="internal"
              className="h-4.5 w-4.5 rounded border-navy-300 accent-brand-600"
            />
            Internal note — do not show this to the client
          </label>

          <Submit variant="outline">Add update</Submit>
        </form>
        <Result state={state} />
      </CardBody>
    </Card>
  );
}

/* -------------------------------------------------------------- documents */

export function DocumentPanel({
  application,
}: {
  application: PlainApplication;
}) {
  const [uploadState, uploadAction] = useActionState(
    uploadDeliverableAction,
    idle
  );
  const [releaseState, releaseAction] = useActionState(
    releaseDocumentAction,
    idle
  );
  const [lockState, lockAction] = useActionState(lockDocumentAction, idle);

  const deliverable = application.deliverable;
  const balancePaid = application.payments.balance.status !== "PENDING";

  return (
    <Card>
      <CardHeader
        title="Finished document"
        subtitle="Upload it, the client sees a watermarked preview. Release it only after the balance is in."
      />
      <CardBody className="space-y-5">
        {deliverable?.fileId ? (
          <div className="rounded-xl border border-line bg-canvas p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-semibold text-navy-900">
                  {deliverable.filename}
                </p>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  {((deliverable.size ?? 0) / 1024 / 1024).toFixed(2)} MB ·
                  uploaded {formatDateTime(deliverable.uploadedAt)}
                  {deliverable.previewFileId
                    ? " · preview generated"
                    : " · no preview for this file type"}
                </p>
                {deliverable.released ? (
                  <p className="mt-1 text-[12.5px] font-semibold text-success-700">
                    Released {formatDateTime(deliverable.releasedAt)} ·
                    downloaded {deliverable.downloadCount ?? 0} time
                    {deliverable.downloadCount === 1 ? "" : "s"}
                  </p>
                ) : null}
              </div>
              <a
                href={`/api/admin/files/${deliverable.fileId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-2 text-[13px] font-semibold text-navy-800 hover:bg-navy-50"
              >
                <Download className="h-4 w-4" aria-hidden />
                Open original
              </a>
            </div>
          </div>
        ) : null}

        {/* Release / lock */}
        {deliverable?.fileId ? (
          deliverable.released ? (
            <div>
              <Alert tone="success" title="Client can download the original">
                The document is unlocked on their tracking page.
              </Alert>
              <form action={lockAction} className="mt-3">
                <input type="hidden" name="id" value={application._id} />
                <Submit variant="outline" size="sm">
                  <Lock className="h-4 w-4" aria-hidden />
                  Lock the download again
                </Submit>
              </form>
              <Result state={lockState} />
            </div>
          ) : (
            <div>
              <Alert
                tone={balancePaid ? "warn" : "info"}
                title={
                  balancePaid
                    ? "Balance received — ready to release"
                    : "Balance still pending"
                }
              >
                {balancePaid
                  ? "The client has paid in full. Release the document to unlock their download."
                  : "The client can see the watermarked preview but cannot download the original until you release it."}
              </Alert>

              <form action={releaseAction} className="mt-3 space-y-3">
                <input type="hidden" name="id" value={application._id} />
                {!balancePaid ? (
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-warn-100 bg-warn-50 p-3.5 text-[13px] text-navy-800">
                    <input
                      type="checkbox"
                      name="force"
                      className="mt-0.5 h-4.5 w-4.5 rounded border-navy-300 accent-warn-500"
                    />
                    Release anyway, without recording the balance payment.
                  </label>
                ) : null}
                <Submit>
                  <Unlock className="h-4 w-4" aria-hidden />
                  Release to the client
                </Submit>
              </form>
              <Result state={releaseState} />
            </div>
          )
        ) : null}

        {/* Upload */}
        <form action={uploadAction} className="space-y-3 border-t border-line pt-5">
          <input type="hidden" name="id" value={application._id} />
          <Field
            label={deliverable?.fileId ? "Replace the document" : "Upload the finished document"}
            htmlFor="file"
            help="PDF or a photo. A watermarked preview is generated automatically, and a new upload always starts locked."
          >
            <input
              id="file"
              name="file"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              required
              className="w-full cursor-pointer rounded-xl border border-navy-200 bg-white p-2.5 text-[14px] file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3.5 file:py-2 file:text-[13px] file:font-semibold file:text-white"
            />
          </Field>
          <Submit variant="secondary">
            <Upload className="h-4 w-4" aria-hidden />
            Upload
          </Submit>
        </form>
        <Result state={uploadState} />
      </CardBody>
    </Card>
  );
}
