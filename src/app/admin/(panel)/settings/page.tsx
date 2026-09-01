import { FileCode2, Phone, ShieldCheck } from "lucide-react";
import { PasswordForm } from "@/components/admin/password-form";
import { Card, CardBody, CardHeader } from "@/components/ui/primitives";
import { fullAddress, siteConfig } from "@/config/site";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireAdmin();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
          Settings
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Signed in as {session.name} ({session.email})
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <PasswordForm />

        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Business details"
              subtitle="Edit these in src/config/site.ts and redeploy"
            />
            <CardBody className="space-y-2.5 text-[14px]">
              <Row label="Business name" value={siteConfig.legalName} />
              <Row label="Phone shown" value={siteConfig.phoneNumber} />
              <Row
                label="WhatsApp number"
                value={`+${siteConfig.whatsappNumber}`}
              />
              <Row label="Email" value={siteConfig.email} />
              <Row label="Working hours" value={siteConfig.hours} />
              <Row label="Address" value={fullAddress} />
              <Row
                label="Payment split"
                value={`${siteConfig.advancePercent}% booking / ${siteConfig.balancePercent}% balance`}
              />
              <Row
                label="Public prices"
                value={siteConfig.showPublicPrices ? "Shown" : "Hidden"}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="How this system works" />
            <CardBody>
              <ul className="space-y-3.5 text-[13.5px] leading-relaxed text-navy-700">
                <li className="flex gap-3">
                  <ShieldCheck
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success-600"
                    aria-hidden
                  />
                  <span>
                    No payment gateway is connected. Every amount you see was
                    entered by a staff member after the money actually arrived.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  <span>
                    Clients reach you by call or WhatsApp on{" "}
                    {siteConfig.phoneNumber}. Every button on the website points
                    at that one number.
                  </span>
                </li>
                <li className="flex gap-3">
                  <FileCode2
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-navy-500"
                    aria-hidden
                  />
                  <span>
                    Prices are never published on the website. Each application
                    is priced here, and only that client sees their amount.
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-right font-semibold text-navy-900">{value}</span>
    </div>
  );
}
