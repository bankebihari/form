import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-brand-500 to-navy-800 text-white shadow-[0_6px_16px_-8px_rgba(11,37,89,0.9)]",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M12 2.75 4.75 5.6v5.53c0 4.42 2.9 8.5 7.25 9.87 4.35-1.37 7.25-5.45 7.25-9.87V5.6L12 2.75Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="m8.9 12.1 2.1 2.1 4.1-4.3"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  invert,
  className,
}: {
  invert?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[19px] font-extrabold tracking-tight",
            invert ? "text-white" : "text-navy-900"
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-[10.5px] font-semibold uppercase tracking-[0.16em]",
            invert ? "text-navy-300" : "text-muted"
          )}
        >
          Document Services
        </span>
      </span>
    </Link>
  );
}
