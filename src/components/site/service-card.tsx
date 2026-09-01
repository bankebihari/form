import Link from "next/link";
import { ArrowRight, Clock3, MessageSquareQuote } from "lucide-react";
import { ServiceIcon } from "@/components/site/service-icon";
import { Badge } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/utils";
import type { PlainService } from "@/types";

export function ServiceCard({ service }: { service: PlainService }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
          <ServiceIcon name={service.icon} className="h-5 w-5" />
        </span>
        {service.popular ? <Badge tone="gold">Most requested</Badge> : null}
      </div>

      <h3 className="mt-4 text-[16.5px] font-bold text-navy-900">
        {service.title}
      </h3>
      <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted">
        {service.shortDescription}
      </p>

      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <div>
          {siteConfig.showPublicPrices ? (
            <>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted">
                Starting from
              </p>
              <p className="font-display text-lg font-extrabold text-navy-900">
                {formatINR(service.startingPrice)}
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-navy-900">
                <MessageSquareQuote
                  className="h-4 w-4 text-brand-600"
                  aria-hidden
                />
                Price on review
              </p>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Quoted after we see your case
              </p>
            </>
          )}
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-[12px] text-muted">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            {service.estimatedDays}
          </p>
          <p className="mt-1 flex items-center justify-end gap-1 text-[13px] font-semibold text-brand-700">
            View details
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </p>
        </div>
      </div>
    </Link>
  );
}
