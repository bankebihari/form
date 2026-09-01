import type { MetadataRoute } from "next";
import { getServices } from "@/lib/services";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes = [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/services"), priority: 0.9, changeFrequency: "weekly" },
    { url: absoluteUrl("/request"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/track"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("/how-it-works"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("/request-a-call"), priority: 0.7, changeFrequency: "monthly" },
    { url: absoluteUrl("/book-a-demo"), priority: 0.7, changeFrequency: "monthly" },
    { url: absoluteUrl("/contact"), priority: 0.7, changeFrequency: "monthly" },
    { url: absoluteUrl("/about"), priority: 0.6, changeFrequency: "yearly" },
    { url: absoluteUrl("/privacy"), priority: 0.3, changeFrequency: "yearly" },
    { url: absoluteUrl("/terms"), priority: 0.3, changeFrequency: "yearly" },
    { url: absoluteUrl("/refund-policy"), priority: 0.4, changeFrequency: "yearly" },
  ] as const;

  const staticPages: MetadataRoute.Sitemap = routes.map((entry) => ({
    ...entry,
    lastModified: now,
  }));

  const services = await getServices();
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: service.popular ? 0.9 : 0.8,
  }));

  return [...staticPages, ...servicePages];
}
