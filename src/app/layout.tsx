import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/src/contexts/CartContext';
import { MobileTabBar } from '@/src/components/MobileTabBar';
import { Preloader } from '@/src/components/Preloader';
import { LayoutWrapper } from '@/src/components/LayoutWrapper';

export const metadata: Metadata = {
  title: {
    default: 'Team Naturals — Handmade Natural Skincare',
    template: '%s | Team Naturals',
  },
  description:
    'Cold-processed soaps and a clay face wash, built from ingredients you can actually pronounce. Handmade in small batches. Cruelty-free. No harsh chemicals.',
  keywords: ['natural skincare', 'handmade soap', 'neem soap', 'multani mitti', 'face wash', 'cruelty free', 'cold processed soap', 'natural soap india'],
  metadataBase: new URL('https://teamnaturals.in'),
  openGraph: {
    title: 'Team Naturals — Handmade Natural Skincare',
    description: 'Rooted in Nature. Made with Care. Cold-processed soaps and a clay face wash from small batches — cruelty-free, no harsh chemicals.',
    type: 'website',
    url: 'https://teamnaturals.in',
    images: [
      {
        url: '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.jpg',
        width: 1200,
        height: 630,
        alt: 'Team Naturals handmade soaps and face wash on a natural stone tray',
      },
    ],
    siteName: 'Team Naturals',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Team Naturals — Handmade Natural Skincare',
    description: 'Rooted in Nature. Made with Care.',
    images: ['/6ecc3cac-18f0-4044-856c-cc50daf9ac26.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Preloader />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
