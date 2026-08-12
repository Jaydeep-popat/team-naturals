import type { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Offers & Promotions | Team Naturals' },
  description:
    'Discover seasonal offers and limited-time promotions on Team Naturals handmade soaps and natural skincare.',
  alternates: { canonical: absoluteUrl('/offers') },
  openGraph: {
    title: 'Offers & Promotions | Team Naturals',
    description: 'Seasonal offers on handmade natural skincare from Team Naturals.',
    url: absoluteUrl('/offers'),
    type: 'website',
  },
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
