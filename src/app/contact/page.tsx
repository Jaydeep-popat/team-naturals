'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react';
import { Breadcrumb } from '@/src/components/Breadcrumb';
import { Reveal } from '@/src/components/Reveal';
import { usePageLoad } from '@/src/hooks/usePageLoad';
import { PageSkeleton } from '@/src/components/Skeletons';
import { WhatsAppIcon } from '@/src/components/icons/WhatsAppIcon';
import {
  SITE_CONTACT,
  SOCIAL_LINKS,
  getEmailMailtoUrl,
  getPhoneTelUrl,
  getWhatsAppChatUrl,
} from '@/src/lib/site-contact';

const channels = [
  {
    icon: PhoneIcon,
    label: 'Call us',
    value: SITE_CONTACT.phoneDisplay,
    href: getPhoneTelUrl(),
    external: false,
  },
  {
    icon: MailIcon,
    label: 'Email',
    value: SITE_CONTACT.email,
    href: getEmailMailtoUrl(),
    external: false,
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp',
    value: 'Chat with us — 9am – 7pm IST',
    href: getWhatsAppChatUrl(),
    external: true,
    isWhatsApp: true,
  },
  {
    icon: ClockIcon,
    label: 'Response time',
    value: 'Usually within a day',
    href: null,
    external: false,
  },
];

export default function ContactPage() {
  const loading = usePageLoad(600);
  const [sent, setSent] = useState(false);

  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-white pb-8">
      <header className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center lg:px-8">
          <h1 className="font-display text-4xl text-forest">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Questions about ingredients, bulk orders or a skin concern? We read every message.
          </p>
          <div className="mt-4 flex justify-center">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_360px] lg:px-8">
        <Reveal>
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-forest/8 bg-cream-soft p-10 text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream"
              >
                <CheckIcon size={24} strokeWidth={2} />
              </motion.span>
              <h2 className="mt-5 font-display text-2xl text-forest">Message sent</h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                Demo form — nothing was actually delivered. For a faster reply,{' '}
                <a
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-forest underline-offset-2 hover:underline"
                >
                  message us on WhatsApp
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-full border border-forest/15 px-6 py-3 text-sm text-forest hover:bg-white"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="space-y-4 rounded-3xl border border-forest/8 p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <h2 className="font-display text-xl text-forest">Send us a message</h2>
              <p className="text-sm text-muted">
                Or email{' '}
                <a href={getEmailMailtoUrl()} className="font-medium text-forest hover:underline">
                  {SITE_CONTACT.email}
                </a>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactField id="c-name" label="Name" placeholder="Your name" />
                <ContactField
                  id="c-email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              <ContactField id="c-subject" label="Subject" placeholder="What is this about?" />
              <div>
                <label htmlFor="c-message" className="mb-1.5 block text-xs text-muted">
                  Message
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  required
                  placeholder="Tell us a bit more..."
                  className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full bg-forest px-6 py-3.5 text-sm text-cream transition-colors hover:bg-forest-deep sm:w-auto sm:px-10"
              >
                Send message
              </motion.button>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <ul className="space-y-3 rounded-3xl border border-forest/8 bg-cream-soft p-6">
            {channels.map(({ icon: Icon, label, value, href, external, isWhatsApp }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest">
                  <Icon size={isWhatsApp ? 18 : 16} strokeWidth={isWhatsApp ? undefined : 1.5} />
                </span>
                <span>
                  <span className="block text-xs text-muted">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block text-sm text-forest transition-colors hover:text-forest-soft"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="block text-sm text-forest">{value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={SOCIAL_LINKS.whatsappChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-3xl border border-forest/8 bg-[#25D366]/10 p-5 transition-colors hover:bg-[#25D366]/15"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppIcon size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-forest">WhatsApp Channel</p>
              <p className="text-xs text-muted">Updates, restocks & behind-the-scenes</p>
            </div>
          </a>

          <a
            href={SOCIAL_LINKS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-3xl border border-forest/8 bg-white p-5 transition-colors hover:bg-cream-soft"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-mist text-forest">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-forest">{SOCIAL_LINKS.instagram.handle}</p>
              <p className="text-xs text-muted">Follow on Instagram</p>
            </div>
          </a>

          <div className="overflow-hidden rounded-3xl border border-forest/8">
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-forest-mist text-center p-6">
              <MapPinIcon size={26} strokeWidth={1.3} className="text-forest" />
              <p className="text-sm font-medium text-forest">Morbi, Gujarat</p>
              <p className="max-w-[220px] text-xs text-muted">
                Handmade at our farmhouse. [NEEDS INPUT: full street address for visits]
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactField({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
      />
    </div>
  );
}
