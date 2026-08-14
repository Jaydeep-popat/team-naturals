import { getSocialSameAs } from './site-contact';

export const SITE_URL = 'https://teamnaturals.in';

export const SITE_NAME = 'Team Naturals';

export const DEFAULT_OG_IMAGE = '/6ecc3cac-18f0-4044-856c-cc50daf9ac26.webp';

export const DEFAULT_OG_IMAGE_ALT =
  'Team Naturals handmade soap bars and multani mitti face wash on a natural stone tray';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-trimmed.png`,
  sameAs: getSocialSameAs(),
};
