import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileStack,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Badge, Card, CardBody } from "@/components/ui/primitives";
import { callTo, whatsappTo } from "@/config/site";
import { listApplications } from "@/lib/admin-data";
import { ALL_STATUSES, STATUS_META } from "@/lib/constants";
import { formatINR, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "ALL";
  const q = params.q ?? "";
  const page = Number(params.page ?? 1) || 1;

  const result = await listApplications({ status, q, page });

  function pageHref(next: number) {
    const search = new URLSearchParams();
    if (status !== "ALL") search.set("status", status);
    if (q) search.set("q", q);
    if (next > 1) search.set("page", String(next));
    const query = search.toString();
    return `/admin/applications${query ? `?${query}` : ""}`;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
          Applications
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          {result.total} record{result.total === 1 ? "" : "s"}
          {status !== "ALL"
            ? ` · ${STATUS_META[status as keyof typeof STATUS_META]?.label ?? status}`
            : ""}
        </p>
      </div>

      {/* Filters work without JavaScript: a plain GET form. */}
      <Card>
        <CardBody className="p-4 sm:p-4">
          <form method="get" className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400"
                aria-hidden
              />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Search tracking ID, name, phone or service"
                className="pl-11"
                aria-label="Search applications"
              />
            </div>
            <Select
              name="status"
              defaultValue={status}
              className="sm:w-56"
              aria-label="Filter by status"
            >
              <option value="ALL">All statuses</option>
              {ALL_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_META[value].label}
                </option>
              ))}
            </Select>
            <Button type="submit" className="sm:w-auto">
              Apply
            </Button>
          </form>
        </CardBody>
      </Card>

      {result.items.length ? (
        <>
          {/* Mobile: cards. Desktop: table. */}
          <div className="space-y-3 lg:hidden">
            {result.items.map((application) => (
              <Link
                key={application._id}
                href={`/admin/applications/${application._id}`}
                className="block rounded-[14px] border border-line bg-white p-4 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[14px] font-extrabold tracking-[0.04em] text-navy-900">
                      {application.trackingId}
                    </p>
                    <p className="mt-1 truncate text-[15px] font-semibold text-navy-900">
                      {application.applicant.name}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] text-muted">
                      {application.service.title}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[12.5px]">
                  <span className="text-muted">
                    {relativeTime(application.createdAt)}
                  </span>
                  <span className="font-semibold text-navy-900">
                    {application.quote?.totalAmount
                      ? formatINR(application.quote.totalAmount)
                      : "Not priced"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Card className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead className="border-b border-line bg-canvas text-[12.5px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Tracking ID</th>
                    <th className="px-5 py-3 font-semibold">Applicant</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Price</th>
                    <th className="px-5 py-3 font-semibold">Raised</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {result.items.map((application) => (
                    <tr key={application._id} className="hover:bg-navy-50">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/applications/${application._id}`}
                          className="font-display text-[13.5px] font-extrabold tracking-[0.04em] text-brand-700 hover:underline"
                        >
                          {application.trackingId}
                        </Link>
                        {application.priority === "URGENT" ? (
                          <Badge tone="danger" className="ml-2">
                            <AlertTriangle className="h-3 w-3" aria-hidden />
                            Urgent
                          </Badge>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/applications/${application._id}`}
                          className="font-semibold text-navy-900 hover:underline"
                        >
                          {application.applicant.name}
                        </Link>
                        <p className="text-[12.5px] text-muted">
                          +91 {application.applicant.phone}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-navy-800">
                        {application.service.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-navy-900">
                        {application.quote?.totalAmount
                          ? formatINR(application.quote.totalAmount)
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-muted">
                        {relativeTime(application.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex gap-1.5">
                          <a
                            href={callTo(application.applicant.phone)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-700 hover:bg-navy-100"
                            aria-label={`Call ${application.applicant.name}`}
                          >
                            <Phone className="h-4 w-4" aria-hidden />
                          </a>
                          <a
                            href={whatsappTo(
                              application.applicant.phone,
                              `Hello ${application.applicant.name}, regarding your application ${application.trackingId} (${application.service.title}).`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-[#128C7E] hover:bg-navy-100"
                            aria-label={`WhatsApp ${application.applicant.name}`}
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden />
                          </a>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {result.pages > 1 ? (
            <div className="flex items-center justify-between">
              <Link
                href={pageHref(Math.max(1, result.page - 1))}
                aria-disabled={result.page === 1}
                className={`inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800 ${
                  result.page === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </Link>
              <span className="text-[13px] text-muted">
                Page {result.page} of {result.pages}
              </span>
              <Link
                href={pageHref(Math.min(result.pages, result.page + 1))}
                aria-disabled={result.page === result.pages}
                className={`inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-navy-800 ${
                  result.page === result.pages
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
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
              <FileStack className="h-7 w-7" aria-hidden />
            </span>
            <p className="mt-4 text-[16px] font-bold text-navy-900">
              Nothing here
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-muted">
              {q || status !== "ALL"
                ? "No application matches these filters. Try clearing the search."
                : "New requests from the website will appear here automatically."}
            </p>
            {q || status !== "ALL" ? (
              <Link
                href="/admin/applications"
                className="mt-4 inline-block text-[14px] font-semibold text-brand-700 hover:underline"
              >
                Clear filters
              </Link>
            ) : null}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
