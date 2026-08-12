import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/src/lib/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/account', '/checkout', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
