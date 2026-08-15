import type { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'About Us | Team Naturals' },
  description:
    'Learn how Team Naturals crafts cold-processed soaps and natural face wash in small batches — rooted in nature, made with care, and free from harsh chemicals.',
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: 'About Us | Team Naturals',
    description:
      'Handmade natural skincare crafted in small batches with ingredients you can pronounce.',
    url: absoluteUrl('/about'),
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
