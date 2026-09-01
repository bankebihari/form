"use client";

import Link from "next/link";
import { MessageCircle, Phone, Search } from "lucide-react";
import { callLink, siteConfig, whatsappLink } from "@/config/site";

/**
 * Most visitors arrive on a phone with one question: how do I reach a human.
 * This bar keeps WhatsApp and a phone call one thumb-tap away on every page.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden no-print">
      <div className="grid grid-cols-3 gap-1.5 p-2">
        <a
          href={whatsappLink(
            `Hello ${siteConfig.name}, I need help with a document.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-[#25D366] text-[#062e18]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="text-[11.5px] font-bold">WhatsApp</span>
        </a>
        <a
          href={callLink}
          className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-700 text-white"
        >
          <Phone className="h-5 w-5" aria-hidden />
          <span className="text-[11.5px] font-bold">Call now</span>
        </a>
        <Link
          href="/track"
          className="flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border border-navy-200 text-navy-800"
        >
          <Search className="h-5 w-5" aria-hidden />
          <span className="text-[11.5px] font-bold">Track</span>
        </Link>
      </div>
    </div>
  );
}
