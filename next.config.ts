import type { NextConfig } from "next";

/**
 * Conservative headers. The site handles people's identity documents, so the
 * defaults lean towards "share nothing" rather than "make embedding easy".
 */
/**
 * Next injects small inline bootstrap scripts, so a nonce-free policy needs
 * 'unsafe-inline' for scripts. Everything else is locked to our own origin:
 * no third-party scripts, no remote frames, and forms can only post to us.
 * The dev server additionally needs 'unsafe-eval' for fast refresh.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // The tracking page embeds the watermarked preview from our own API.
  "object-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Nothing under the staff panel or the file APIs may be cached anywhere.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  async redirects() {
    return [
      // Friendly aliases people guess or that get printed on flyers.
      { source: "/apply", destination: "/request", permanent: true },
      { source: "/status", destination: "/track", permanent: true },
      { source: "/tracking", destination: "/track", permanent: true },
      { source: "/call", destination: "/request-a-call", permanent: true },
      { source: "/demo", destination: "/book-a-demo", permanent: true },
    ];
  },
};

export default nextConfig;
