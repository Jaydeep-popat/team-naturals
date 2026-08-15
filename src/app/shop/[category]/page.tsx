import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/src/components/JsonLd';
import { fetchCategoryBySlug } from '@/src/lib/server-data';
import {
  buildBreadcrumbJsonLd,
  buildCategoryMetadata,
  hasSeoFilterParams,
} from '@/src/lib/seo';
import ShopPageClient from '../ShopPageClient';

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const query = await searchParams;
  const filtered = hasSeoFilterParams(query);

  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }

  return buildCategoryMetadata(
    category as Parameters<typeof buildCategoryMetadata>[0],
    { filtered }
  );
}

export default async function CategoryShopPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryName = String(category.name);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
          { name: categoryName },
        ])}
      />
      <ShopPageClient
        categoryMeta={{
          name: categoryName,
          slug,
          description: (category.description as string | null | undefined) ?? null,
        }}
      />
    </>
  );
}
