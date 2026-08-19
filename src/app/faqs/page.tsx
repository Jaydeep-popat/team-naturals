import type { Metadata } from 'next';
import { FAQsPageClient } from './FAQsPageClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Team Naturals',
  description:
    'Find answers to common questions about Team Naturals handmade soaps and face wash — ingredients, delivery, sensitive skin, shelf life, bulk orders, and more.',
};

export default function FAQsPage() {
  return <FAQsPageClient />;
}
