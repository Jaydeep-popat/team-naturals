import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/src/contexts/CartContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { JsonLd } from '@/src/components/JsonLd';
import { buildOrganizationJsonLd } from '@/src/lib/seo';
import { getSiteUrl } from '@/src/lib/site';

import dynamic from 'next/dynamic';
import { LayoutWrapper } from '@/src/components/LayoutWrapper';

const Preloader = dynamic(() => import('@/src/components/Preloader').then(mod => mod.Preloader));
const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster));
const BackToTop = dynamic(() => import('@/src/components/BackToTop').then(mod => mod.BackToTop));
export const metadata: Metadata = {
  title: {
    default: 'Team Naturals — Handmade Natural Skincare',
    template: '%s | Team Naturals',
  },
  description:
    'Cold-processed soaps and a clay face wash, built from ingredients you can actually pronounce. Handmade in small batches. Cruelty-free. No harsh chemicals.',
  keywords: ['natural skincare', 'handmade soap', 'neem soap', 'multani mitti', 'face wash', 'cruelty free', 'cold processed soap', 'natural soap india'],
  metadataBase: new URL(getSiteUrl()),
  openGraph: {
    title: 'Team Naturals — Handmade Natural Skincare',
    description: 'Rooted in Nature. Made with Care. Cold-processed soaps and a clay face wash from small batches — cruelty-free, no harsh chemicals.',
    type: 'website',
    url: getSiteUrl(),
    images: [
      {
        url: '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp',
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
    images: ['/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon-trimmed.png',
    shortcut: '/favicon-trimmed.png',
    apple: '/favicon-trimmed.png',
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
        <JsonLd data={buildOrganizationJsonLd()} />
        <AuthProvider>
          <CartProvider>
            <Preloader />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster position="top-right" />
            <BackToTop />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
