import { SITE_URL } from './seo';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

type SitemapProduct = {
  slug: string;
  updatedAt?: string;
  updated_at?: string;
};

type SitemapCategory = {
  slug: string;
  updatedAt?: string;
  updated_at?: string;
};

type SitemapEvent = {
  slug: string;
  updatedAt?: string;
  updated_at?: string;
};

function resolveLastModified(entity: {
  updatedAt?: string;
  updated_at?: string;
}): Date {
  const raw = entity.updatedAt ?? entity.updated_at;
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getSitemapEntries() {
  const [productsPayload, categoriesPayload, eventsPayload] = await Promise.all([
    fetchJson<{ data?: { products?: SitemapProduct[] } }>('/api/products?limit=500'),
    fetchJson<{ data?: { categories?: SitemapCategory[] } }>('/api/categories'),
    fetchJson<{ data?: { events?: SitemapEvent[] } }>('/api/events/active'),
  ]);

  const products = productsPayload?.data?.products ?? [];
  const categories = categoriesPayload?.data?.categories ?? [];
  const events = eventsPayload?.data?.events ?? [];

  const staticRoutes = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    url: `${SITE_URL}/shop`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/offers`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
  ];

  const categoryRoutes = categories.map((category) => ({
    url: `${SITE_URL}/shop/${category.slug}`,
    lastModified: resolveLastModified(category),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: resolveLastModified(product),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const eventRoutes = events.map((event) => ({
    url: `${SITE_URL}/offers/${event.slug}`,
    lastModified: resolveLastModified(event),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...eventRoutes];
}
