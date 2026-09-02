import {
  BadgeIndianRupee,
  Eye,
  FileCheck2,
  Lock,
  Star,
  UserCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const badges = [
  {
    icon: BadgeIndianRupee,
    title: "Only 10% of our fee to start",
    body: "The government fee is paid in full because it goes to the department. Our own charge splits 10 now, 90 at the end.",
  },
  {
    icon: Eye,
    title: "Nothing hidden in the price",
    body: "The government fee is shown separately at actuals and never marked up. One number, agreed before you pay anything.",
  },
  {
    icon: Lock,
    title: "Documents stay private",
    body: "Files are stored encrypted and are visible only to you and our verified staff.",
  },
  {
    icon: UserCheck,
    title: "A real person on call",
    body: `Talk to our team on WhatsApp or phone, ${siteConfig.hours.toLowerCase()}.`,
  },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="rounded-[14px] border border-line bg-white p-5 shadow-soft"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <badge.icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
          </span>
          <h3 className="mt-3.5 text-[15px] font-bold text-navy-900">
            {badge.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            {badge.body}
          </p>
        </div>
      ))}
    </div>
  );
}

const stats = [
  { value: siteConfig.stats.applications, label: "Applications handled" },
  { value: `${siteConfig.stats.yearsActive} yrs`, label: "Serving families" },
  { value: `${siteConfig.stats.avgDays} days`, label: "Typical turnaround" },
  { value: siteConfig.stats.rating, label: "Average client rating" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 divide-line rounded-[14px] border border-line bg-white shadow-soft sm:grid-cols-4 sm:divide-x">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "px-4 py-5 text-center",
            index < 2 && "border-b border-line sm:border-b-0",
            index % 2 === 0 && "border-r border-line sm:border-r-0"
          )}
        >
          <p className="font-display text-2xl font-extrabold text-navy-900 sm:text-[28px]">
            {stat.value}
          </p>
          <p className="mt-1 text-[12.5px] font-medium text-muted">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export type Testimonial = {
  name: string;
  city: string;
  service: string;
  quote: string;
};

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-[14px] border border-line bg-white p-5 shadow-soft">
      <div className="flex gap-0.5 text-gold-500" aria-label="5 out of 5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" aria-hidden />
        ))}
      </div>
      <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-navy-800">
        {item.quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-[13px] font-bold text-navy-700">
          {item.name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] font-semibold text-navy-900">
            {item.name}
          </span>
          <span className="block text-[12.5px] text-muted">
            {item.city} &middot; {item.service}
          </span>
        </span>
        <span className="ml-auto flex items-center gap-1 text-[11.5px] font-semibold text-success-600">
          <FileCheck2 className="h-3.5 w-3.5" aria-hidden />
          Verified
        </span>
      </figcaption>
    </figure>
  );
}
