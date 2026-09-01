import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} - ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#0e2440",
    orientation: "portrait",
    categories: ["business", "government", "productivity"],
    icons: [
      { src: "/icon", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
