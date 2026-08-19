import type { Metadata } from 'next';
import { optimizeCloudinaryUrl } from './cloudinary';
import { absoluteUrl, getSiteUrl } from './site';
import { getSocialSameAs } from './site-contact';

export const SITE_URL = 'https://teamnaturals.in';
export const SITE_NAME = 'Team Naturals';
export const DEFAULT_OG_IMAGE = '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp';
export const DEFAULT_OG_IMAGE_ALT = 'Team Naturals handmade soap bars and multani mitti face wash on a natural stone tray';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-trimmed.png`,
  sameAs: getSocialSameAs(),
};

export const REVALIDATE_SECONDS = 3600;

const FILTER_QUERY_KEYS = ['sort', 'color', 'size', 'price', 'concern', 'category', 'q', 'search'];

export function truncate(text: string, max = 160): string {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

export function hasSeoFilterParams(searchParams: Record<string, string | string[] | undefined>): boolean {
  return FILTER_QUERY_KEYS.some((key) => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  });
}

export function productPageTitle(product: { metaTitle?: string | null; name: string }): string {
  return product.metaTitle?.trim() || `${product.name} | Team Naturals`;
}

export function productPageDescription(product: {
  metaDescription?: string | null;
  shortDescription?: string | null;
  description?: string | null;
}): string {
  return (
    product.metaDescription?.trim() ||
    product.shortDescription?.trim() ||
    truncate(product.description || '', 160) ||
    'Handmade natural skincare by Team Naturals.'
  );
}

export function categoryPageTitle(category: { metaTitle?: string | null; name: string }): string {
  return category.metaTitle?.trim() || `${category.name} | Team Naturals`;
}

export function categoryPageDescription(category: {
  metaDescription?: string | null;
  description?: string | null;
  name: string;
}): string {
  return (
    category.metaDescription?.trim() ||
    category.description?.trim() ||
    `Shop ${category.name} — handmade natural skincare by Team Naturals.`
  );
}

export function extractProductImageUrls(
  images: Array<string | { url?: string; altText?: string | null }> | undefined
): string[] {
  if (!images?.length) return [];
  return images
    .map((img) => (typeof img === 'string' ? img : img.url || ''))
    .filter(Boolean)
    .map((url) => optimizeCloudinaryUrl(url));
}

export function extractProductImageAlt(
  images: Array<string | { url?: string; altText?: string | null }> | undefined,
  index: number,
  productName: string
): string {
  const img = images?.[index];
  if (img && typeof img === 'object' && img.altText?.trim()) {
    return img.altText.trim();
  }
  return productName;
}

export function productOpenGraphImages(
  images: Array<string | { url?: string }> | undefined
): NonNullable<Metadata['openGraph']>['images'] {
  const urls = extractProductImageUrls(images);
  if (!urls.length) {
    return [{ url: '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp', width: 1200, height: 630 }];
  }
  return urls.slice(0, 1).map((url) => ({ url, width: 1200, height: 1200 }));
}

export function buildProductMetadata(product: {
  slug: string;
  name: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  images?: Array<string | { url?: string }>;
}): Metadata {
  const title = productPageTitle(product);
  const description = productPageDescription(product);
  const url = absoluteUrl(`/product/${product.slug}`);

  const ogImages = productOpenGraphImages(product.images);
  const twitterImages = extractProductImageUrls(product.images).slice(0, 1);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: twitterImages,
    },
    other: {
      'og:type': 'product',
    },
  };
}

export function buildCategoryMetadata(
  category: {
    slug: string;
    name: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    description?: string | null;
    imageUrl?: string | null;
  },
  options?: { filtered?: boolean }
): Metadata {
  const title = categoryPageTitle(category);
  const description = categoryPageDescription(category);
  const canonicalPath = `/shop/${category.slug}`;
  const url = absoluteUrl(canonicalPath);
  const ogImage = category.imageUrl
    ? optimizeCloudinaryUrl(category.imageUrl)
    : '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp';

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };

  if (options?.filtered) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Team Naturals',
    url: siteUrl,
    logo: absoluteUrl('/full_logo.webp'),
  };
}

export function buildProductJsonLd(product: {
  slug: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  sku?: string | null;
  price: number | string;
  stockQty?: number | null;
  images?: Array<string | { url?: string }>;
}) {
  const images = extractProductImageUrls(product.images);
  const price = Number(product.price);
  const inStock = (product.stockQty ?? 0) > 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: productPageDescription(product),
    sku: product.sku || undefined,
    image: images.length ? images : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Team Naturals',
    },
    offers: {
      '@type': 'Offer',
      price: Number.isFinite(price) ? price.toFixed(2) : String(product.price),
      priceCurrency: 'INR',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.slug}`),
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(item.path) : undefined,
    })),
  };
}

export function getCategoryFromProduct(product: {
  category?: { name?: string; slug?: string } | string | null;
}): { name: string; slug: string } | null {
  if (product.category && typeof product.category === 'object') {
    if (product.category.slug && product.category.name) {
      return { name: product.category.name, slug: product.category.slug };
    }
    return null;
  }
  if (typeof product.category === 'string') {
    const slug = product.category;
    const name = slug === 'face-wash' ? 'Face Wash' : slug === 'soaps' ? 'Soaps' : slug;
    return { name, slug };
  }
  return null;
}

export function isActiveProduct(product: { status?: string | null }): boolean {
  const status = product.status?.toLowerCase();
  return status !== 'draft' && status !== 'archived';
}
