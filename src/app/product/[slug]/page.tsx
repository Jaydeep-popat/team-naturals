import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/src/components/JsonLd';
import { ApiError } from '@/src/lib/api';
import { fetchProductBySlug } from '@/src/lib/server-data';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  buildProductMetadata,
  getCategoryFromProduct,
} from '@/src/lib/seo';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await fetchProductBySlug(slug);
    return buildProductMetadata(product as Parameters<typeof buildProductMetadata>[0]);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return { title: 'Product Not Found' };
    }
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product: Record<string, unknown>;
  try {
    product = await fetchProductBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const category = getCategoryFromProduct(product as Parameters<typeof getCategoryFromProduct>[0]);
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    ...(category ? [{ name: category.name, path: `/shop/${category.slug}` }] : []),
    { name: String(product.name) },
  ];

  return (
    <>
      <JsonLd data={buildProductJsonLd(product as Parameters<typeof buildProductJsonLd>[0])} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <ProductDetailClient />
    </>
  );
}
