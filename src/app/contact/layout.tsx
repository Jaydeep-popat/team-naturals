import type { Metadata } from 'next';
import { absoluteUrl } from '@/src/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | Team Naturals' },
  description:
    'Get in touch with Team Naturals for product questions, order support, or wholesale enquiries. We usually reply within a day.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: 'Contact Us | Team Naturals',
    description: 'Reach the Team Naturals support team by phone, email, or WhatsApp.',
    url: absoluteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
