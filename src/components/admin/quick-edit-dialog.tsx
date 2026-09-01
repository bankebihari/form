"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, X } from "lucide-react";
import { QuoteForm, StatusForm } from "@/components/admin/application-forms";
import { StatusBadge } from "@/components/admin/status-badge";
import type { PlainApplication } from "@/types";

/**
 * Price and status without leaving the list.
 *
 * It reuses the very same QuoteForm and StatusForm from the detail page rather
 * than reimplementing them, so the rules — the 10/90 split, the timeline entry,
 * what the client ends up seeing — cannot drift between the two places.
 */
export function QuickEditDialog({
  application,
}: {
  application: PlainApplication;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        aria-label={`Edit ${application.trackingId}`}
        title="Edit price and status"
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>

      {/* Rendered only while open: a closed dialog left in the tree still
          paints over the page, and one per row quickly stacks up. */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-canvas shadow-lift sm:max-w-lg sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${application.trackingId}`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-line bg-white px-5 py-4 sm:rounded-t-2xl">
              <div className="min-w-0">
                <p className="font-display text-[16px] font-extrabold tracking-[0.04em] text-navy-900">
                  {application.trackingId}
                </p>
                <p className="mt-0.5 truncate text-[13.5px] text-muted">
                  {application.applicant.name} · {application.service.title}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusBadge status={application.status} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-50"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" aria-hidden />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <QuoteForm application={application} />
              <StatusForm application={application} />

              <Link
                href={`/admin/applications/${application._id}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-4 py-3 text-[14px] font-semibold text-navy-800 hover:bg-navy-50"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                Open the full record
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
