"use client";

import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-navy-200 bg-white px-3.5 py-3 text-ink placeholder:text-navy-400 shadow-[inset_0_1px_2px_rgba(13,27,42,0.04)] transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-navy-50 disabled:text-navy-400";

const errorRing = "border-danger-500 focus:border-danger-500 focus:ring-danger-100";

export function Label({
  children,
  htmlFor,
  required,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-semibold text-navy-800"
    >
      <span>
        {children}
        {required ? <span className="ml-0.5 text-danger-500">*</span> : null}
      </span>
      {hint ? (
        <span className="text-xs font-normal text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1 text-[13px] font-medium text-danger-600">
      {children}
    </p>
  );
}

type FieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
};

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  help,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor} required={required} hint={hint}>
        {label}
      </Label>
      {children}
      {help && !error ? (
        <p className="mt-1.5 text-[13px] text-muted">{help}</p>
      ) : null}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cn(control, invalid && errorRing, className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(control, "min-h-28 resize-y", invalid && errorRing, className)}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(control, "appearance-none pr-10", invalid && errorRing, className)}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Big tappable radio card — the pattern that works best on phones. */
export function ChoiceCard({
  checked,
  title,
  subtitle,
  onSelect,
  icon,
}: {
  checked: boolean;
  title: string;
  subtitle?: string;
  onSelect: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
        checked
          ? "border-brand-500 bg-brand-50 ring-4 ring-brand-100"
          : "border-navy-200 bg-white hover:border-brand-300"
      )}
    >
      {icon ? (
        <span
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            checked ? "bg-brand-600 text-white" : "bg-navy-100 text-navy-600"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-navy-900">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-0.5 block text-[13px] leading-snug text-muted">
            {subtitle}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-brand-600 bg-brand-600" : "border-navy-300"
        )}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>
    </button>
  );
}
