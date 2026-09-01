import Link from "next/link";
import { ArrowRight, Home, MessageCircle, Search } from "lucide-react";
import { AnchorButton, LinkButton } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <p className="font-display text-[64px] font-extrabold leading-none text-navy-200">
          404
        </p>
        <h1 className="mt-3 font-display text-[26px] font-extrabold text-navy-900">
          We could not find that page
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
          The link may be old or mistyped. Everything we do is listed under
          services — or just message us and we will point you to the right place.
        </p>

        <div className="mt-7 space-y-2.5">
          <LinkButton href="/" size="lg" className="w-full">
            <Home className="h-4.5 w-4.5" aria-hidden />
            Back to home
          </LinkButton>
          <LinkButton
            href="/services"
            variant="outline"
            size="lg"
            className="w-full"
          >
            Browse all services
            <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
          <AnchorButton
            href={whatsappLink(
              `Hello ${siteConfig.name}, I could not find what I was looking for on your website.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            className="w-full"
          >
            <MessageCircle className="h-4.5 w-4.5" aria-hidden />
            Ask us on WhatsApp
          </AnchorButton>
        </div>

        <Link
          href="/track"
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-700 hover:text-brand-800"
        >
          <Search className="h-4 w-4" aria-hidden />
          Track an existing application
        </Link>
      </div>
    </div>
  );
}
