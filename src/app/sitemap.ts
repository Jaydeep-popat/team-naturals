import type { MetadataRoute } from 'next';
<<<<<<< HEAD
import { getSitemapEntries } from '@/src/lib/sitemap-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
=======
import { fetchAllCategories, fetchAllProducts } from '@/src/lib/server-data';
import { isActiveProduct } from '@/src/lib/seo';
import { getSiteUrl } from '@/src/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/offers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    const [products, categories] = await Promise.all([fetchAllProducts(), fetchAllCategories()]);

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((product) => isActiveProduct(product as { status?: string | null }))
      .filter((product) => typeof product.slug === 'string')
      .map((product) => ({
        url: `${siteUrl}/product/${product.slug}`,
        lastModified: product.updatedAt ? new Date(String(product.updatedAt)) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((category) => typeof category.slug === 'string')
      .map((category) => ({
        url: `${siteUrl}/shop/${category.slug}`,
        lastModified: category.updatedAt ? new Date(String(category.updatedAt)) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
>>>>>>> origin/yugal
}
