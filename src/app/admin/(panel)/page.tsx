import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  ClipboardList,
  Clock,
  FileCheck2,
  Hourglass,
  PhoneCall,
  Wallet,
} from "lucide-react";
import {
  LeadStatusBadge,
  LeadTypeBadge,
  StatusBadge,
} from "@/components/admin/status-badge";
import { Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { getDashboardStats } from "@/lib/admin-data";
import { formatINR, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const tiles = [
    {
      label: "Needs a price",
      value: stats.awaitingQuote,
      hint: "Call the client and set the amount",
      icon: ClipboardList,
      href: "/admin/applications?status=SUBMITTED",
      tone: "bg-warn-50 text-warn-600",
    },
    {
      label: "Waiting for booking",
      value: stats.awaitingAdvance,
      hint: "Priced, 10% not received yet",
      icon: Hourglass,
      href: "/admin/applications?status=QUOTED",
      tone: "bg-brand-50 text-brand-700",
    },
    {
      label: "In progress",
      value: stats.inProgress,
      hint: "Paid and being worked on",
      icon: Clock,
      href: "/admin/applications?status=IN_PROGRESS",
      tone: "bg-navy-100 text-navy-700",
    },
    {
      label: "Waiting for balance",
      value: stats.awaitingBalance,
      hint: "Preview sent, 90% pending",
      icon: Wallet,
      href: "/admin/applications?status=READY_PREVIEW",
      tone: "bg-gold-100 text-gold-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            {stats.today} new request{stats.today === 1 ? "" : "s"} today ·{" "}
            {stats.total} in total
          </p>
        </div>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 hover:text-brand-800"
        >
          All applications
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {/* Action queues */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="rounded-[14px] border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile.tone}`}
              >
                <tile.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-[30px] font-extrabold leading-none text-navy-900">
                {tile.value}
              </span>
            </div>
            <p className="mt-3.5 text-[14.5px] font-bold text-navy-900">
              {tile.label}
            </p>
            <p className="mt-0.5 text-[12.5px] text-muted">{tile.hint}</p>
          </Link>
        ))}
      </div>

      {/* Money + leads */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardBody>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <BadgeIndianRupee className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
              Payments recorded
            </p>
            <p className="mt-1 font-display text-[26px] font-extrabold text-navy-900">
              {formatINR(stats.collected)}
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              Across all applications, as entered by staff
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warn-50 text-warn-600">
              <Wallet className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
              Still to collect
            </p>
            <p className="mt-1 font-display text-[26px] font-extrabold text-navy-900">
              {formatINR(stats.outstanding)}
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              Quoted amounts not yet marked as received
            </p>
          </CardBody>
        </Card>

        <Link
          href="/admin/leads?status=NEW"
          className="rounded-[14px] border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <PhoneCall className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted">
            New calls & demos
          </p>
          <p className="mt-1 font-display text-[26px] font-extrabold text-navy-900">
            {stats.newLeads}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            People waiting for a call back
          </p>
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Recent applications */}
        <Card>
          <CardHeader
            title="Latest requests"
            action={
              <Link
                href="/admin/applications"
                className="text-[13px] font-semibold text-brand-700 hover:text-brand-800"
              >
                View all
              </Link>
            }
          />
          <CardBody className="p-0 sm:p-0">
            {stats.recentApplications.length ? (
              <ul className="divide-y divide-line">
                {stats.recentApplications.map((application) => (
                  <li key={application._id}>
                    <Link
                      href={`/admin/applications/${application._id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-navy-50 sm:px-6"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-semibold text-navy-900">
                          {application.applicant.name}
                          <span className="ml-2 font-normal text-muted">
                            {application.service.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[12.5px] text-muted">
                          {application.trackingId} ·{" "}
                          {relativeTime(application.createdAt)}
                        </span>
                      </span>
                      <StatusBadge status={application.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyRow
                icon={<FileCheck2 className="h-6 w-6" aria-hidden />}
                title="No requests yet"
                body="They will appear here the moment someone submits the form."
              />
            )}
          </CardBody>
        </Card>

        {/* Recent leads */}
        <Card>
          <CardHeader
            title="Latest calls & demos"
            action={
              <Link
                href="/admin/leads"
                className="text-[13px] font-semibold text-brand-700 hover:text-brand-800"
              >
                View all
              </Link>
            }
          />
          <CardBody className="p-0 sm:p-0">
            {stats.recentLeads.length ? (
              <ul className="divide-y divide-line">
                {stats.recentLeads.map((lead) => (
                  <li
                    key={lead._id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px] font-semibold text-navy-900">
                        {lead.name}
                        <a
                          href={`tel:+91${lead.phone}`}
                          className="ml-2 font-normal text-brand-700 hover:underline"
                        >
                          +91 {lead.phone}
                        </a>
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-muted">
                        {lead.preferredDate
                          ? `${lead.preferredDate} ${lead.preferredSlot}`
                          : relativeTime(lead.createdAt)}
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-1.5">
                      <LeadTypeBadge type={lead.type} />
                      <LeadStatusBadge status={lead.status} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyRow
                icon={<PhoneCall className="h-6 w-6" aria-hidden />}
                title="No call requests yet"
                body="Call-back and demo requests land here."
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function EmptyRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-navy-400">
        {icon}
      </span>
      <p className="mt-3 text-[14.5px] font-semibold text-navy-900">{title}</p>
      <p className="mt-1 text-[13px] text-muted">{body}</p>
    </div>
  );
}
