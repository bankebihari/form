import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-static";

/** Social share card. Kept text-only so it renders without any font fetch. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #08182d 0%, #0d3379 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#1552c4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            {siteConfig.name.charAt(0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>
              {siteConfig.name}
            </span>
            <span style={{ fontSize: 16, color: "#93aecd", letterSpacing: 3 }}>
              DOCUMENT SERVICES
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Government documents, without the queue.
          </span>
          <span style={{ fontSize: 26, color: "#c7d6e8", maxWidth: 860 }}>
            Raise a request in 2 minutes. Track it live. Pay only{" "}
            {siteConfig.advancePercent}% to start, and see your document before
            paying the rest.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {siteConfig.phoneNumber}
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 22px",
              borderRadius: 999,
              background: "#12a35c",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            WhatsApp us
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
