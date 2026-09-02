import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * The shield from the logo, not a letter. A tab favicon renders at about 16px,
 * so the strokes are thicker than the on-page mark and the shield is given room
 * inside the tile.
 */
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
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.75 4.75 5.6v5.53c0 4.42 2.9 8.5 7.25 9.87 4.35-1.37 7.25-5.45 7.25-9.87V5.6L12 2.75Z"
            stroke="#ffffff"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          <path
            d="m8.9 12.1 2.1 2.1 4.1-4.3"
            stroke="#ffffff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
