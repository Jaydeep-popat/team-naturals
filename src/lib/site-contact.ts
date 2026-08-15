/**
 * Public contact & social profiles for Team Naturals.
 * Update missing entries when new profiles are created.
 */

export const SITE_CONTACT = {
  phoneDisplay: '+91 93130 10084',
  /** E.164 without + for wa.me links */
  phoneWhatsApp: '919313010084',
  email: 'info@teamnaturals.com',
  businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  whatsappDefaultMessage:
    'Hi Team Naturals! I have a question about your handmade soaps and face wash.',
} as const;

export const SOCIAL_LINKS = {
  instagram: {
    url: 'https://www.instagram.com/team.__naturals',
    handle: '@team.__naturals',
    label: 'Instagram',
  },
  whatsappChannel: {
    url: 'https://whatsapp.com/channel/0029Vb7z0FjHwXb9TGHUZ21b',
    label: 'WhatsApp Channel',
  },
  /** Not provided yet — set url when profile exists */
  facebook: null as { url: string; label: string } | null,
  linkedin: null as { url: string; label: string } | null,
  youtube: null as { url: string; label: string } | null,
  twitter: null as { url: string; label: string } | null,
} as const;

export function getWhatsAppChatUrl(message = SITE_CONTACT.whatsappDefaultMessage): string {
  return `https://wa.me/${SITE_CONTACT.phoneWhatsApp}?text=${encodeURIComponent(message)}`;
}

export function getPhoneTelUrl(): string {
  return `tel:+${SITE_CONTACT.phoneWhatsApp}`;
}

export function getEmailMailtoUrl(subject?: string): string {
  const base = `mailto:${SITE_CONTACT.email}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

/** Profiles with URLs for JSON-LD sameAs */
export function getSocialSameAs(): string[] {
  const urls: string[] = [SOCIAL_LINKS.instagram.url, SOCIAL_LINKS.whatsappChannel.url];
  if (SOCIAL_LINKS.facebook?.url) urls.push(SOCIAL_LINKS.facebook.url);
  if (SOCIAL_LINKS.linkedin?.url) urls.push(SOCIAL_LINKS.linkedin.url);
  if (SOCIAL_LINKS.youtube?.url) urls.push(SOCIAL_LINKS.youtube.url);
  if (SOCIAL_LINKS.twitter?.url) urls.push(SOCIAL_LINKS.twitter.url);
  return urls;
}
