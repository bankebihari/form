import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { name: string; path: string };

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50 to-white">
      <div className="bg-grid-ink absolute inset-0" aria-hidden />
      <div
        className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div className="container-page relative py-10 sm:py-14">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-muted">
              <li>
                <Link href="/" className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  {index === crumbs.length - 1 ? (
                    <span className="font-semibold text-navy-800">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-brand-700">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-brand-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl font-display text-[28px] font-extrabold leading-tight text-navy-900 sm:text-[38px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
