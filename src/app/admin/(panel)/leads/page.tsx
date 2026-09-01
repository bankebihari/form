import Link from "next/link";
import { ChevronLeft, ChevronRight, PhoneCall } from "lucide-react";
import { LeadCard } from "@/components/admin/lead-card";
import { Card, CardBody } from "@/components/ui/primitives";
import { listLeads } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONVERTED", label: "Converted" },
  { value: "CLOSED", label: "Closed" },
];

const TYPE_TABS = [
  { value: "ALL", label: "All types" },
  { value: "CALLBACK", label: "Call backs" },
  { value: "DEMO", label: "Demos" },
  { value: "CONTACT", label: "Enquiries" },
];

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "ALL";
  const type = params.type ?? "ALL";
  const page = Number(params.page ?? 1) || 1;

  const result = await listLeads({ status, type, page });

  function href(next: Record<string, string | number>) {
    const search = new URLSearchParams();
    const merged = { status, type, page: 1, ...next };
    if (merged.status !== "ALL") search.set("status", String(merged.status));
    if (merged.type !== "ALL") search.set("type", String(merged.type));
    if (Number(merged.page) > 1) search.set("page", String(merged.page));
    const query = search.toString();
    return `/admin/leads${query ? `?${query}` : ""}`;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
          Calls &amp; demos
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          {result.total} request{result.total === 1 ? "" : "s"} from the website
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={href({ status: tab.value })}
              className={cn(
                "rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                status === tab.value
                  ? "bg-navy-900 text-white"
                  : "border border-navy-200 bg-white text-navy-700 hover:bg-navy-50"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={href({ type: tab.value })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                type === tab.value
                  ? "bg-brand-600 text-white"
                  : "border border-navy-200 bg-white text-navy-600 hover:bg-navy-50"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {result.items.length ? (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            {result.items.map((lead) => (
              <LeadCard key={lead._id} lead={lead} />
            ))}
          </div>

          {result.pages > 1 ? (
            <div className="flex items-center justify-between">
              <Link
                href={href({ page: Math.max(1, result.page - 1) })}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800",
                  result.page === 1 && "pointer-events-none opacity-50"
                )}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </Link>
              <span className="text-[13px] text-muted">
                Page {result.page} of {result.pages}
              </span>
              <Link
                href={href({ page: Math.min(result.pages, result.page + 1) })}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800",
                  result.page === result.pages && "pointer-events-none opacity-50"
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <Card>
          <CardBody className="py-16 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-navy-400">
              <PhoneCall className="h-7 w-7" aria-hidden />
            </span>
            <p className="mt-4 text-[16px] font-bold text-navy-900">
              No requests here
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-muted">
              Call-back requests, demo bookings and contact-form messages all
              land on this page.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
