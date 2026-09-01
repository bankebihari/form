import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import {
  callLink,
  fullAddress,
  siteConfig,
  whatsappLink,
} from "@/config/site";

const serviceLinks = [
  { href: "/services/caste-certificate", label: "Caste Certificate" },
  { href: "/services/income-certificate", label: "Income Certificate" },
  { href: "/services/domicile-certificate", label: "Domicile Certificate" },
  { href: "/services/pan-card", label: "PAN Card" },
  { href: "/services/birth-certificate", label: "Birth Certificate" },
  { href: "/services/affidavit-notary", label: "Affidavit & Notary" },
];

const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/track", label: "Track your application" },
  { href: "/book-a-demo", label: "Book a demo" },
  { href: "/request-a-call", label: "Request a call back" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/refund-policy", label: "Refund & payment policy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-navy-200 no-print">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display text-[19px] font-extrabold text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-navy-800 p-3 text-[13px]">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-500"
                aria-hidden
              />
              <span>
                Your documents stay with our team only. We never sell or share
                your data.
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              Popular services
            </h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="font-semibold text-brand-300 hover:text-white"
                >
                  View all services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-white">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3.5 text-[14px]">
              <li>
                <a
                  href={callLink}
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.phoneNumber}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(`Hello ${siteConfig.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <MessageCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden
                  />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-2.5 hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{fullAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-navy-800 bg-navy-950/60 p-4 text-[12.5px] leading-relaxed text-navy-300">
          <strong className="text-navy-100">Disclaimer:</strong>{" "}
          {siteConfig.legalName} is a private document assistance service. We are
          not a government body and we are not affiliated with any government
          department. Government fees, where applicable, are charged at actuals
          and are separate from our service charge. Issuance timelines are
          decided by the concerned department.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-navy-800 pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          {/* No staff login link anywhere on the public site: the panel is
              reached only by typing /admin directly. */}
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
