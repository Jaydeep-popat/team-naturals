import type { Metadata } from 'next';
import { hasSeoFilterParams } from '@/src/lib/seo';
import { absoluteUrl } from '@/src/lib/site';
import ShopPageClient from './ShopPageClient';

export const revalidate = 3600;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const filtered = hasSeoFilterParams(query);
  const canonical = absoluteUrl('/shop');

  const metadata: Metadata = {
    title: { absolute: 'Shop All Natural Skincare | Team Naturals' },
    description:
      'Browse our full collection of handmade cold-processed soaps, clay face wash, and natural skincare — cruelty-free, small-batch, and made with ingredients you can pronounce.',
    alternates: { canonical },
    openGraph: {
      title: 'Shop All Natural Skincare | Team Naturals',
      description:
        'Browse handmade cold-processed soaps, clay face wash, and natural skincare from Team Naturals.',
      url: canonical,
      type: 'website',
    },
  };

  if (filtered) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default function ShopPage() {
  return <ShopPageClient />;
}
