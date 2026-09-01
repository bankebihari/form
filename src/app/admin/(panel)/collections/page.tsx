import Link from "next/link";
import {
  BadgeIndianRupee,
  CalendarDays,
  Hourglass,
  MessageCircle,
  Phone,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge, Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { callTo, siteConfig, whatsappTo } from "@/config/site";
import { getCollections, type PendingRow } from "@/lib/admin-data";
import { formatDateTime, formatINR, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const money = await getCollections();

  const pendingBookingTotal = money.pendingBooking.reduce(
    (sum, row) => sum + row.amount,
    0
  );
  const pendingBalanceTotal = money.pendingBalance.reduce(
    (sum, row) => sum + row.amount,
    0
  );

  const tiles = [
    {
      label: "Collected today",
      value: formatINR(money.collectedToday),
      icon: CalendarDays,
      tone: "bg-success-50 text-success-600",
      hint: "Payments you recorded since midnight",
    },
    {
      label: "Collected this month",
      value: formatINR(money.collectedMonth),
      icon: TrendingUp,
      tone: "bg-brand-50 text-brand-700",
      hint: "From the 1st to today",
    },
    {
      label: "Collected all time",
      value: formatINR(money.collectedTotal),
      icon: BadgeIndianRupee,
      tone: "bg-navy-100 text-navy-700",
      hint: "Every confirmed payment on record",
    },
    {
      label: "Still to collect",
      value: formatINR(money.outstanding),
      icon: Wallet,
      tone: "bg-warn-50 text-warn-600",
      hint: `Quoted ${formatINR(money.quotedTotal)} minus what has come in`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
          Money
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Every figure here was entered by a staff member after the money
          actually arrived. This website processes no payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label}>
            <CardBody>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile.tone}`}
              >
                <tile.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3.5 text-[12.5px] font-semibold uppercase tracking-wide text-muted">
                {tile.label}
              </p>
              <p className="mt-1 font-display text-[24px] font-extrabold text-navy-900">
                {tile.value}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-muted">
                {tile.hint}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ------------------------------------------------------- To collect */}
      <div className="grid gap-4 xl:grid-cols-2">
        <PendingList
          title={`Booking pending (${siteConfig.advancePercent}%)`}
          subtitle="Priced, but work has not started because the booking amount has not come in"
          rows={money.pendingBooking}
          total={pendingBookingTotal}
          emptyText="Nothing waiting. Every priced job has its booking amount."
        />
        <PendingList
          title={`Balance pending (${siteConfig.balancePercent}%)`}
          subtitle="Document is finished and waiting behind the paywall"
          rows={money.pendingBalance}
          total={pendingBalanceTotal}
          emptyText="No balances outstanding."
          urgent
        />
      </div>

      {/* ----------------------------------------------------------- Ledger */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Payment ledger"
          subtitle={`${money.ledger.length} confirmed payment${
            money.ledger.length === 1 ? "" : "s"
          }, newest first`}
        />
        {money.ledger.length ? (
          <>
            {/* Mobile */}
            <ul className="divide-y divide-line lg:hidden">
              {money.ledger.map((row, index) => (
                <li key={`${row.trackingId}-${row.stage}-${index}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-[13px] font-extrabold tracking-[0.04em] text-navy-900">
                        {row.trackingId}
                      </p>
                      <p className="mt-0.5 truncate text-[14px] font-semibold text-navy-900">
                        {row.name}
                      </p>
                      <p className="truncate text-[12.5px] text-muted">
                        {row.service}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-[17px] font-extrabold text-success-700">
                        {formatINR(row.amount)}
                      </p>
                      <Badge tone={row.stage === "Booking" ? "info" : "success"}>
                        {row.stage}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] text-muted">
                    {formatDateTime(row.receivedAt)} · {row.method}
                    {row.reference ? ` · ${row.reference}` : ""}
                    {row.recordedBy ? ` · by ${row.recordedBy}` : ""}
                  </p>
                </li>
              ))}
            </ul>

            {/* Desktop */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-[14px]">
                <thead className="border-b border-line bg-canvas text-[12.5px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Received</th>
                    <th className="px-5 py-3 font-semibold">Tracking ID</th>
                    <th className="px-5 py-3 font-semibold">Client</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Stage</th>
                    <th className="px-5 py-3 font-semibold">Method</th>
                    <th className="px-5 py-3 font-semibold">Reference</th>
                    <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {money.ledger.map((row, index) => (
                    <tr
                      key={`${row.trackingId}-${row.stage}-${index}`}
                      className="hover:bg-navy-50"
                    >
                      <td className="px-5 py-3 text-[13px] text-muted">
                        {formatDateTime(row.receivedAt)}
                      </td>
                      <td className="px-5 py-3 font-display text-[13px] font-extrabold tracking-[0.04em] text-navy-900">
                        {row.trackingId}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-navy-900">
                          {row.name}
                        </span>
                        <span className="block text-[12.5px] text-muted">
                          +91 {row.phone}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-navy-800">{row.service}</td>
                      <td className="px-5 py-3">
                        <Badge tone={row.stage === "Booking" ? "info" : "success"}>
                          {row.stage}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-navy-800">
                        {row.method?.replace("_", " ")}
                      </td>
                      <td className="px-5 py-3 text-[13px] text-muted">
                        {row.reference || "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-display text-[15px] font-extrabold text-success-700">
                        {formatINR(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-line bg-canvas">
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-3 text-right text-[13px] font-semibold text-muted"
                    >
                      Total shown
                    </td>
                    <td className="px-5 py-3 text-right font-display text-[16px] font-extrabold text-navy-900">
                      {formatINR(money.collectedTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <CardBody className="py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-100 text-navy-400">
              <Receipt className="h-7 w-7" aria-hidden />
            </span>
            <p className="mt-4 text-[16px] font-bold text-navy-900">
              No payments recorded yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[13.5px] text-muted">
              Open an application, price it, and mark the booking amount as
              received. It will appear here.
            </p>
          </CardBody>
        )}
      </Card>
    </div>
  );
}

function PendingList({
  title,
  subtitle,
  rows,
  total,
  emptyText,
  urgent,
}: {
  title: string;
  subtitle: string;
  rows: PendingRow[];
  total: number;
  emptyText: string;
  urgent?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title={title}
        subtitle={subtitle}
        action={
          rows.length ? (
            <Badge tone={urgent ? "warn" : "info"}>{formatINR(total)}</Badge>
          ) : null
        }
      />
      {rows.length ? (
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={`${row._id}-${row.stage}`} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/admin/applications/${row._id}`}
                    className="font-display text-[13px] font-extrabold tracking-[0.04em] text-brand-700 hover:underline"
                  >
                    {row.trackingId}
                  </Link>
                  <p className="mt-0.5 truncate text-[14.5px] font-semibold text-navy-900">
                    {row.name}
                  </p>
                  <p className="truncate text-[12.5px] text-muted">
                    {row.service} · raised {relativeTime(row.since)}
                  </p>
                </div>
                <p className="font-display text-[18px] font-extrabold text-navy-900">
                  {formatINR(row.amount)}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <a
                  href={callTo(row.phone)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 text-[12.5px] font-semibold text-navy-800 hover:bg-navy-50"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  Call
                </a>
                <a
                  href={whatsappTo(
                    row.phone,
                    `Namaste ${row.name}, this is ${siteConfig.name}.\n\nRegarding your ${row.service} (${row.trackingId}), an amount of ${formatINR(row.amount)} is pending.\n\nYou can see the details on your tracking page: ${siteConfig.url}/track?id=${row.trackingId}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 text-[12.5px] font-bold text-[#062e18] hover:bg-[#1fbe5b]"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  Remind
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <CardBody className="py-10 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy-100 text-navy-400">
            <Hourglass className="h-5 w-5" aria-hidden />
          </span>
          <p className="mt-3 text-[13.5px] text-muted">{emptyText}</p>
        </CardBody>
      )}
    </Card>
  );
}
