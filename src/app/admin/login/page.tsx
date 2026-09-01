import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/site/logo";
import { siteConfig } from "@/config/site";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Staff login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />

      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center">
            <span className="mx-auto flex w-fit items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-[20px] font-extrabold text-white">
                {siteConfig.name}
              </span>
            </span>
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-300">
              Staff panel
            </p>
          </div>

          <AdminLoginForm />

          <p className="mt-6 flex items-center justify-center gap-2 text-[12.5px] text-navy-400">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Authorised staff only. All actions are logged.
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to the website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
