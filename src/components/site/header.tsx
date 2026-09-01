"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Clock,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track application" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 no-print">
      {/* Trust bar — the details people check before handing over documents */}
      <div className="hidden border-b border-line bg-brand-50 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12.5px]">
          <p className="flex items-center gap-2 text-navy-700">
            <ShieldCheck className="h-3.5 w-3.5 text-success-600" aria-hidden />
            Documents handled by a verified local team. Your papers are never
            shared with anyone.
          </p>
          <div className="flex items-center gap-5 text-navy-600">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {siteConfig.hours}
            </span>
            <a
              href={callLink}
              className="flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {siteConfig.phoneNumber}
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-line shadow-soft" : "border-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[14.5px] font-semibold transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-navy-700 hover:bg-navy-50 hover:text-navy-900"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <AnchorButton
              href={callLink}
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call now
            </AnchorButton>
            <LinkButton
              href="/request"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Raise a request
            </LinkButton>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 text-navy-800 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

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
            "absolute inset-0 bg-navy-950/50 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-lift transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-navy-200 text-navy-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[16px] font-semibold text-navy-800 hover:bg-navy-50"
              >
                {item.label}
                <ChevronRight className="h-4 w-4 text-navy-300" aria-hidden />
              </Link>
            ))}
          </nav>

          <div className="space-y-2.5 border-t border-line p-4">
            <LinkButton
              href="/request"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Raise a request
            </LinkButton>
            <AnchorButton
              href={whatsappLink(
                `Hello ${siteConfig.name}, I need help with a document.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="w-full"
            >
              Chat on WhatsApp
            </AnchorButton>
            <AnchorButton
              href={callLink}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {siteConfig.phoneNumber}
            </AnchorButton>
            <p className="pt-1 text-center text-[12px] text-muted">
              {siteConfig.hours}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
