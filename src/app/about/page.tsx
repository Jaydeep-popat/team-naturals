import type { Metadata } from 'next';
import AboutPageClient from '@/src/components/AboutPageClient';
import { SITE_NAME, SITE_URL } from '@/src/lib/seo';

const ABOUT_TITLE = 'Our Story — Handmade Soap from Morbi | Team Naturals';
const ABOUT_DESCRIPTION =
  'Vraj Kasundra makes Team Naturals soap at home in Morbi, Gujarat — goat milk base, farmhouse ingredients, no palm oil.';

const ABOUT_OG_IMAGE = '/Owner/owner1.webp';

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [
      {
        url: ABOUT_OG_IMAGE,
        width: 1200,
        height: 800,
        alt: 'Vraj Kasundra, founder of Team Naturals, at the Morbi farmhouse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [ABOUT_OG_IMAGE],
  },
};

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  url: `${SITE_URL}/about`,
  mainEntity: {
    '@type': 'Person',
    name: 'Vraj Kasundra',
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <AboutPageClient />
    </>
  );
}
