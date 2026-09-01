import { ImageResponse } from "next/og";

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
        D
      </div>
    ),
    size
  );
}
