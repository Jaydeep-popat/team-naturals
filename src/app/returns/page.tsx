import type { Metadata } from 'next';
import { ReturnsPageClient } from './ReturnsPageClient';

export const metadata: Metadata = {
  title: 'Returns & Refunds | Team Naturals',
  description:
    'Our returns and refunds policy for Team Naturals handmade skincare products. Information on eligibility, timelines, and the refund process.',
};

export default function ReturnsPage() {
  return <ReturnsPageClient />;
}
