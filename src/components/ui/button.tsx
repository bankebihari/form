import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "whatsapp"
  | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-55 active:scale-[0.985] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_1px_2px_rgba(11,37,89,0.24),0_8px_20px_-10px_rgba(11,37,89,0.6)] hover:bg-brand-800",
  secondary: "bg-navy-800 text-white hover:bg-navy-900",
  outline:
    "border border-navy-200 bg-white text-navy-800 hover:border-brand-300 hover:bg-brand-50",
  ghost: "text-navy-700 hover:bg-navy-100",
  whatsapp:
    "bg-[#25D366] text-[#062e18] shadow-[0_8px_20px_-10px_rgba(37,211,102,0.9)] hover:bg-[#1fbe5b]",
  danger: "bg-danger-600 text-white hover:bg-danger-500",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-3.5 text-[13px]",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-6 text-base",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

type LinkButtonProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type AnchorButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

/** For tel: and wa.me links, which must not go through the Next router. */
export function AnchorButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorButtonProps) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}
