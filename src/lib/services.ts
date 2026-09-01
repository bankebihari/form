import { SERVICE_CATALOGUE, type ServiceSeed } from "@/data/services";
import { connectDB, hasDatabase, serialize } from "@/lib/db";
import { Service } from "@/models/Service";
import type { PlainService } from "@/types";

function fromSeed(seed: ServiceSeed): PlainService {
  return {
    _id: seed.slug,
    title: seed.title,
    slug: seed.slug,
    category: seed.category,
    icon: seed.icon,
    shortDescription: seed.shortDescription,
    description: seed.description,
    startingPrice: seed.startingPrice,
    governmentFeeNote:
      "Government fees, if any, are charged at actuals and are separate from our service charge.",
    estimatedDays: seed.estimatedDays,
    documentsRequired: seed.documentsRequired,
    eligibility: seed.eligibility,
    steps: seed.steps,
    faqs: seed.faqs,
    keywords: seed.keywords,
    popular: Boolean(seed.popular),
    active: true,
    order: seed.order,
  };
}

const fallbackServices = SERVICE_CATALOGUE.map(fromSeed).sort(
  (a, b) => a.order - b.order
);

/**
 * Reads the catalogue from MongoDB, falling back to the bundled catalogue when
 * the database is not configured or is temporarily unreachable. The public site
 * must never render an empty services page because of an infrastructure hiccup.
 */
export async function getServices(): Promise<PlainService[]> {
  if (!hasDatabase()) return fallbackServices;
  try {
    await connectDB();
    const docs = await Service.find({ active: true })
      .sort({ order: 1, title: 1 })
      .lean();
    if (!docs.length) return fallbackServices;
    return serialize(docs) as unknown as PlainService[];
  } catch (error) {
    console.error("[services] falling back to bundled catalogue:", error);
    return fallbackServices;
  }
}

export async function getServiceBySlug(
  slug: string
): Promise<PlainService | null> {
  const lookup = slug.toLowerCase();
  if (!hasDatabase()) {
    return fallbackServices.find((service) => service.slug === lookup) ?? null;
  }
  try {
    await connectDB();
    const doc = await Service.findOne({ slug: lookup, active: true }).lean();
    if (doc) return serialize(doc) as unknown as PlainService;
  } catch (error) {
    console.error("[services] lookup failed, using bundled catalogue:", error);
  }
  return fallbackServices.find((service) => service.slug === lookup) ?? null;
}

export async function getPopularServices(limit = 6) {
  const services = await getServices();
  const popular = services.filter((service) => service.popular);
  return (popular.length ? popular : services).slice(0, limit);
}

export function groupByCategory(services: PlainService[]) {
  const map = new Map<string, PlainService[]>();
  for (const service of services) {
    const list = map.get(service.category) ?? [];
    list.push(service);
    map.set(service.category, list);
  }
  return Array.from(map.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

export const bundledServiceSlugs = fallbackServices.map(
  (service) => service.slug
);
