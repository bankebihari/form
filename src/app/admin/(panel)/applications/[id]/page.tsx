import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  DocumentPanel,
  NoteForm,
  PaymentPanel,
  QuoteForm,
  StatusForm,
} from "@/components/admin/application-forms";
import { StatusBadge } from "@/components/admin/status-badge";
import { WhatsappTemplates } from "@/components/admin/whatsapp-templates";
import { AnchorButton } from "@/components/ui/button";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
} from "@/components/ui/primitives";
import { callTo, whatsappTo } from "@/config/site";
import { getApplication } from "@/lib/admin-data";
import { STATUS_META } from "@/lib/constants";
import { formatDateTime, formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);
  if (!application) notFound();

  const applicant = application.applicant;
  const whatsappHref = whatsappTo(
    applicant.phone,
    `Hello ${applicant.name}, this is regarding your ${application.service.title} application (${application.trackingId}).`
  );

  return (
    <div className="space-y-5">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All applications
      </Link>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-navy-900 px-5 py-5 text-white sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-[24px] font-extrabold tracking-[0.05em]">
                  {application.trackingId}
                </p>
                {application.priority === "URGENT" ? (
                  <Badge tone="danger">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                    Urgent
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1.5 text-[15px] font-semibold text-navy-100">
                {applicant.name} · {application.service.title}
              </p>
              <p className="mt-0.5 text-[12.5px] text-navy-400">
                Raised {formatDateTime(application.createdAt)}
                {application.lastViewedAt
                  ? ` · client last checked ${formatDateTime(application.lastViewedAt)}`
                  : " · client has not opened the tracking page yet"}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <AnchorButton
              href={callTo(applicant.phone)}
              variant="outline"
              size="sm"
              className="border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" aria-hidden />
              +91 {applicant.phone}
            </AnchorButton>
            <AnchorButton
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </AnchorButton>
          </div>
        </div>

        <CardBody>
          <p className="text-[13.5px] leading-relaxed text-muted">
            <strong className="text-navy-900">Client sees:</strong>{" "}
            {STATUS_META[application.status].description}
          </p>
        </CardBody>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <QuoteForm application={application} />
          <PaymentPanel application={application} />
          <DocumentPanel application={application} />

          {/* History */}
          <Card>
            <CardHeader
              title="History"
              subtitle="Everything recorded on this application"
            />
            <CardBody>
              {application.timeline.length ? (
                <ol className="space-y-4">
                  {[...application.timeline].reverse().map((entry, index) => (
                    <li key={`${entry.at}-${index}`} className="flex gap-3.5">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                          entry.internal ? "bg-navy-300" : "bg-brand-600"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-navy-900">
                          {entry.title}
                          {entry.internal ? (
                            <Badge tone="neutral">Internal</Badge>
                          ) : null}
                        </p>
                        {entry.note ? (
                          <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
                            {entry.note}
                          </p>
                        ) : null}
                        <p className="mt-0.5 text-[12px] text-navy-400">
                          {formatDateTime(entry.at)} · {entry.by}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-[13.5px] text-muted">Nothing recorded yet.</p>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <StatusForm application={application} />

          <WhatsappTemplates application={application} />

          {/* Applicant */}
          <Card>
            <CardHeader title="Applicant" />
            <CardBody className="space-y-3 text-[14px]">
              <Row label="Name" value={applicant.name} />
              <Row
                label="Mobile"
                value={
                  <a
                    href={callTo(applicant.phone)}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    +91 {applicant.phone}
                  </a>
                }
              />
              {applicant.email ? (
                <Row
                  label="Email"
                  value={
                    <a
                      href={`mailto:${applicant.email}`}
                      className="inline-flex items-center gap-1.5 break-all font-semibold text-brand-700 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                      {applicant.email}
                    </a>
                  }
                />
              ) : null}
              {applicant.city || applicant.state ? (
                <Row
                  label="Location"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-navy-400" aria-hidden />
                      {[applicant.city, applicant.state].filter(Boolean).join(", ")}
                    </span>
                  }
                />
              ) : null}
              <Row label="Source" value={application.source} />
              {application.extra?.purpose ? (
                <Row label="Purpose" value={application.extra.purpose} />
              ) : null}
              {application.requirement ? (
                <div>
                  <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">
                    What they wrote
                  </p>
                  <p className="mt-1 rounded-xl border border-line bg-canvas p-3.5 text-[13.5px] leading-relaxed text-navy-800">
                    {application.requirement}
                  </p>
                </div>
              ) : null}
            </CardBody>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader
              title="Documents from the client"
              subtitle={`${application.attachments.length} file${
                application.attachments.length === 1 ? "" : "s"
              }`}
            />
            <CardBody>
              {application.attachments.length ? (
                <ul className="space-y-2">
                  {application.attachments.map((file) => (
                    <li key={file.fileId}>
                      <a
                        href={`/api/admin/files/${file.fileId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 hover:bg-navy-50"
                      >
                        <FileText
                          className="h-4.5 w-4.5 shrink-0 text-brand-600"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium text-navy-900">
                            {file.filename}
                          </span>
                          <span className="block text-[12px] text-muted">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </span>
                        <Eye className="h-4 w-4 text-navy-400" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13.5px] text-muted">
                  Nothing uploaded. Ask on WhatsApp for the papers you need.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Money summary */}
          <Card>
            <CardHeader title="Money" />
            <CardBody className="space-y-2.5 text-[14px]">
              <Row
                label="Total price"
                value={
                  application.quote?.totalAmount
                    ? formatINR(application.quote.totalAmount)
                    : "Not set"
                }
              />
              <Row
                label="Booking"
                value={`${formatINR(application.payments.advance.amount)} · ${
                  application.payments.advance.status === "RECEIVED"
                    ? "received"
                    : "pending"
                }`}
              />
              <Row
                label="Balance"
                value={`${formatINR(application.payments.balance.amount)} · ${
                  application.payments.balance.status === "RECEIVED"
                    ? "received"
                    : "pending"
                }`}
              />
              {application.quote?.governmentFee ? (
                <Row
                  label="Government fee"
                  value={formatINR(application.quote.governmentFee)}
                />
              ) : null}
            </CardBody>
          </Card>

          <NoteForm application={application} />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-right font-semibold text-navy-900">{value}</span>
    </div>
  );
}
