import type { Metadata } from 'next';
import { ShippingPageClient } from './ShippingPageClient';

export const metadata: Metadata = {
  title: 'Shipping & Delivery | Team Naturals',
  description:
    'Pan-India delivery timelines, shipping charges, and order tracking for Team Naturals handmade soaps and face wash.',
};

export default function ShippingPage() {
  return <ShippingPageClient />;
}
