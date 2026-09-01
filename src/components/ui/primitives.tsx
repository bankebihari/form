import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-white shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

type Tone = "neutral" | "info" | "warn" | "success" | "danger" | "gold";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-navy-100 text-navy-700 ring-navy-200",
  info: "bg-brand-50 text-brand-700 ring-brand-200",
  warn: "bg-warn-50 text-warn-700 ring-warn-100",
  success: "bg-success-50 text-success-700 ring-success-100",
  danger: "bg-danger-50 text-danger-600 ring-danger-100",
  gold: "bg-gold-100 text-gold-600 ring-gold-300",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset",
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
  icon,
  className,
}: {
  tone?: Tone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  const border: Record<Tone, string> = {
    neutral: "border-navy-200 bg-navy-50",
    info: "border-brand-200 bg-brand-50",
    warn: "border-warn-100 bg-warn-50",
    success: "border-success-100 bg-success-50",
    danger: "border-danger-100 bg-danger-50",
    gold: "border-gold-300 bg-gold-100",
  };
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-[14px] leading-relaxed",
        border[tone],
        className
      )}
      role={tone === "danger" ? "alert" : undefined}
    >
      {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
      <div className="min-w-0">
        {title ? (
          <p className="font-semibold text-navy-900">{title}</p>
        ) : null}
        {children ? (
          <div className={cn("text-navy-700", title && "mt-1")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Section({
  className,
  children,
  id,
  tone = "canvas",
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  tone?: "canvas" | "white" | "navy";
}) {
  const tones = {
    canvas: "bg-canvas",
    white: "bg-white",
    navy: "bg-navy-900 text-white",
  };
  return (
    <section id={id} className={cn("py-14 sm:py-20", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl sm:mb-12",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2.5 text-[12px] font-bold uppercase tracking-[0.14em]",
            invert ? "text-brand-300" : "text-brand-600"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-[26px] font-extrabold leading-tight sm:text-[34px]",
          invert ? "text-white" : "text-navy-900"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-[15px] leading-relaxed sm:text-base",
            invert ? "text-navy-200" : "text-muted"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
