"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeIndianRupee,
  ExternalLink,
  FileStack,
  LayoutDashboard,
  LogOut,
  Menu,
  PhoneCall,
  Settings,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { siteConfig } from "@/config/site";
import { cn, initials } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: FileStack },
  { href: "/admin/collections", label: "Money", icon: BadgeIndianRupee },
  { href: "/admin/leads", label: "Calls & demos", icon: PhoneCall },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  name,
  email,
  role,
  children,
}: {
  name: string;
  email: string;
  role: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function isActive(item: (typeof NAV)[number]) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="space-y-1" aria-label="Admin">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14.5px] font-semibold transition-colors",
            isActive(item)
              ? "bg-brand-600 text-white"
              : "text-navy-200 hover:bg-navy-800 hover:text-white"
          )}
        >
          <item.icon className="h-4.5 w-4.5" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const account = (
    <div className="space-y-3 border-t border-navy-800 pt-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[13px] font-bold text-white">
          {initials(name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold text-white">
            {name}
          </span>
          <span className="block truncate text-[12px] text-navy-400">
            {email} · {role}
          </span>
        </span>
      </div>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-[13px] font-medium text-navy-300 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        Open the website
      </Link>
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-[13px] font-semibold text-danger-500 hover:text-danger-500/80 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        {signingOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-navy-900 p-4 lg:flex">
        <div>
          <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-1">
            <LogoMark />
            <span>
              <span className="block font-display text-[16px] font-extrabold text-white">
                {siteConfig.name}
              </span>
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-navy-400">
                Staff panel
              </span>
            </span>
          </Link>
          {nav}
        </div>
        {account}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-navy-950/60 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col justify-between bg-navy-900 p-4 transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <LogoMark />
                <span className="font-display text-[16px] font-extrabold text-white">
                  {siteConfig.name}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-700 text-navy-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {nav}
          </div>
          {account}
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-200 text-navy-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <span className="font-display text-[15px] font-extrabold text-navy-900">
            {NAV.find(isActive)?.label ?? "Staff panel"}
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
