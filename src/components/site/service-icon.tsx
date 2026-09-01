import {
  Baby,
  BadgeCheck,
  CreditCard,
  Factory,
  FileHeart,
  FileText,
  Fingerprint,
  HeartHandshake,
  Home,
  IndianRupee,
  Plane,
  ReceiptIndianRupee,
  ScrollText,
  ShoppingBasket,
  Stamp,
  Store,
  Vote,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit map instead of a dynamic lookup: it keeps tree-shaking working, so
 * we ship ~17 icons instead of the whole lucide library to every phone.
 */
const ICONS: Record<string, LucideIcon> = {
  Baby,
  BadgeCheck,
  CreditCard,
  Factory,
  FileHeart,
  FileText,
  Fingerprint,
  HeartHandshake,
  Home,
  IndianRupee,
  Plane,
  ReceiptIndianRupee,
  ScrollText,
  ShoppingBasket,
  Stamp,
  Store,
  Vote,
};

export function ServiceIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || FileText;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
