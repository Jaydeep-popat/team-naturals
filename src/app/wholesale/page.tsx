import type { Metadata } from 'next';
import { WholesalePageClient } from './WholesalePageClient';

export const metadata: Metadata = {
  title: 'Wholesale & Bulk Orders | Team Naturals',
  description:
    'Partner with Team Naturals for wholesale soap and skincare supply — tiered pricing, Pan-India delivery, dedicated support.',
};

export default function WholesalePage() {
  return <WholesalePageClient />;
}
