import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewApplicationForm } from "@/components/admin/new-application-form";
import { getServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All applications
      </Link>

      <div>
        <h1 className="font-display text-[24px] font-extrabold text-navy-900 sm:text-[28px]">
          Raise a request for someone
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Take the details over the phone or WhatsApp, and send them the
          Tracking ID that comes back.
        </p>
      </div>

      <NewApplicationForm services={services} />
    </div>
  );
}
