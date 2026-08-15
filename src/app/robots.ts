import type { MetadataRoute } from 'next';
<<<<<<< HEAD
import { SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
=======
import { getSiteUrl } from '@/src/lib/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

>>>>>>> origin/yugal
  return {
    rules: {
      userAgent: '*',
      allow: '/',
<<<<<<< HEAD
      disallow: ['/admin', '/api', '/cart', '/checkout', '/account', '/wishlist', '/order-confirmation'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
=======
      disallow: ['/cart', '/account', '/checkout', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
>>>>>>> origin/yugal
  };
}
