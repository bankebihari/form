import type { Metadata } from "next";
import { Eye, Lock, RefreshCw } from "lucide-react";
import { TrackLookup } from "@/components/track/track-lookup";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Track Your Application — Live Status, Preview and Download",
  description:
    "Enter your Tracking ID and mobile number to see exactly where your document is, view the preview once it is ready, and download the original after the balance is cleared.",
  alternates: { canonical: absoluteUrl("/track") },
};

const points = [
  {
    icon: RefreshCw,
    title: "Live status",
    body: "Every stage is posted here with a date, from the day you raise the request to the day it is delivered.",
  },
  {
    icon: Eye,
    title: "Preview first",
    body: "When your document is ready you see a watermarked copy here, before any balance is due.",
  },
  {
    icon: Lock,
    title: "Secure download",
    body: `The original unlocks only after our team confirms your ${siteConfig.balancePercent}% payment.`,
  },
];

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Track application"
        title="Where is my document?"
        subtitle="Your Tracking ID and mobile number are all you need. No account, no password."
        crumbs={[{ name: "Track", path: "/track" }]}
      />

      <Section tone="white">
        <TrackLookup initialId={id ?? ""} />

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-[14px] border border-line bg-canvas p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <point.icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
              </span>
              <h2 className="mt-3.5 text-[15px] font-bold text-navy-900">
                {point.title}
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
