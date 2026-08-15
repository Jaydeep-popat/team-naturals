import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cart', '/checkout', '/account', '/wishlist', '/order-confirmation'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
