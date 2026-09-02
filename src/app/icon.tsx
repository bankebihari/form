import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2f6fe4 0%, #0e2440 100%)",
          borderRadius: 14,
          color: "white",
          fontSize: 38,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        {/* Derived from the brand name so a rename cannot leave a stale letter. */}
        {siteConfig.name.charAt(0)}
      </div>
    ),
    size
  );
}
