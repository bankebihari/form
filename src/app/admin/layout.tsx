import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Staff panel",
    template: "%s | Staff panel",
  },
  // The panel must never appear in search results or be followed by crawlers.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-canvas">{children}</div>;
}
