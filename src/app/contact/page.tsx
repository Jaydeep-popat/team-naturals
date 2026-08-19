'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  SparklesIcon,
  InstagramIcon,
  MessageCircleIcon,
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
    label: 'Direct Phone',
    value: SITE_CONTACT.phoneDisplay,
    subtext: 'Mon – Sat (9am – 7pm IST)',
    href: getPhoneTelUrl(),
    external: false,
    color: 'bg-emerald-500/10 text-emerald-700',
  },
  {
    icon: MailIcon,
    label: 'Email Inquiry',
    value: SITE_CONTACT.email,
    subtext: 'Send us your questions anytime',
    href: getEmailMailtoUrl(),
    external: false,
    color: 'bg-blue-500/10 text-blue-700',
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp Support',
    value: 'Chat directly on WhatsApp',
    subtext: 'Fastest response time',
    href: getWhatsAppChatUrl(),
    external: true,
    isWhatsApp: true,
    color: 'bg-[#25D366]/15 text-[#128C7E]',
  },
  {
    icon: ClockIcon,
    label: 'Response Time',
    value: 'Within 2–4 Hours',
    subtext: 'We read and reply to every message',
    href: null,
    external: false,
    color: 'bg-amber-500/10 text-amber-700',
  },
];

export default function ContactPage() {
  const loading = usePageLoad(600);
  const [sent, setSent] = useState(false);

  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-white pb-16">
      {/* Header Banner */}
      <header className="relative overflow-hidden border-b border-forest/8 bg-gradient-to-b from-cream-soft via-white to-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-forest shadow-sm">
            <SparklesIcon size={14} className="text-terracotta" />
            We&apos;re Here to Help
          </div>
          <h1 className="font-display text-4xl font-extrabold text-forest sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-forest/80 sm:text-base">
            Have questions about ingredients, custom bulk soap orders, or skin concerns? Send us a message — our workshop team responds promptly!
          </p>
          <div className="mt-6 flex justify-center">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
          </div>
        </div>
      </header>

      {/* Main Grid: Form + Direct Contact Cards */}
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 lg:grid-cols-12 lg:px-8">
        {/* Left Column: Premium Contact Form (7 cols) */}
        <Reveal className="lg:col-span-7">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[460px] flex-col items-center justify-center rounded-[2.5rem] border border-emerald-200 bg-emerald-50/60 p-10 text-center shadow-lift"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md"
              >
                <CheckIcon size={32} strokeWidth={2.5} />
              </motion.span>
              <h2 className="mt-6 font-display text-3xl font-bold text-forest">Message Received!</h2>
              <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-forest/80">
                Thank you for reaching out to Team Naturals. We will review your note and respond within a few hours.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-8 rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream shadow-md transition-colors hover:bg-forest-deep"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form
              className="space-y-5 rounded-[2.5rem] border border-forest/10 bg-white p-7 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)]"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-forest sm:text-3xl">Send Us a Message</h2>
                <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
                  Fill out the form below or write directly to{' '}
                  <a href={getEmailMailtoUrl()} className="font-bold text-forest hover:text-terracotta transition-colors">
                    {SITE_CONTACT.email}
                  </a>
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <ContactField id="c-name" label="Your Name" placeholder="e.g. Rahul Sharma" />
                <ContactField
                  id="c-email"
                  label="Email Address"
                  type="email"
                  placeholder="rahul@example.com"
                />
              </div>

              <ContactField id="c-subject" label="Subject / Topic" placeholder="e.g. Neem Soap inquiry or bulk order" />

              <div>
                <label htmlFor="c-message" className="mb-2 block text-xs font-bold uppercase tracking-wider text-forest/80">
                  Your Message
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  required
                  placeholder="How can we help your skin today?"
                  className="w-full rounded-2xl border border-forest/15 bg-cream/20 px-4 py-3.5 text-sm font-medium text-forest outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/10 placeholder:text-muted/60"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-bold text-cream shadow-md transition-colors hover:bg-forest-deep sm:w-auto"
              >
                Send Message <SendIcon size={16} strokeWidth={2} />
              </motion.button>
            </form>
          )}
        </Reveal>

        {/* Right Column: Direct Channels & Social Cards (5 cols) */}
        <Reveal delay={0.15} className="space-y-4 lg:col-span-5">
          {/* Quick Channels List */}
          <div className="space-y-3 rounded-[2.5rem] border border-forest/10 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)]">
            <h3 className="mb-4 font-display text-lg font-bold text-forest">Direct Support</h3>
            {channels.map(({ icon: Icon, label, value, subtext, href, external, isWhatsApp, color }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-forest/6 p-3.5 transition-all hover:bg-cream/30">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                  <Icon size={isWhatsApp ? 20 : 18} strokeWidth={isWhatsApp ? undefined : 2} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted/80">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block truncate text-sm font-bold text-forest transition-colors hover:text-terracotta"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="block truncate text-sm font-bold text-forest">{value}</span>
                  )}
                  <span className="block text-[11px] font-medium text-muted">{subtext}</span>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Channel Card */}
          <a
            href={SOCIAL_LINKS.whatsappChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-3xl border border-[#25D366]/30 bg-emerald-50/70 p-5 shadow-sm transition-all hover:border-[#25D366] hover:shadow-soft"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md">
                <WhatsAppIcon size={22} />
              </span>
              <div>
                <p className="text-sm font-bold text-forest group-hover:text-emerald-800 transition-colors">WhatsApp Channel</p>
                <p className="text-xs font-medium text-muted">Join for restocks & behind-the-scenes</p>
              </div>
            </div>
            <MessageCircleIcon size={18} className="text-emerald-600 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Instagram Social Card */}
          <a
            href={SOCIAL_LINKS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-3xl border border-forest/10 bg-white p-5 shadow-sm transition-all hover:border-forest/30 hover:shadow-soft"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
                <InstagramIcon size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="text-sm font-bold text-forest group-hover:text-terracotta transition-colors">{SOCIAL_LINKS.instagram.handle}</p>
                <p className="text-xs font-medium text-muted">Follow our daily farmhouse updates</p>
              </div>
            </div>
            <SendIcon size={16} className="text-forest/40 transition-transform group-hover:translate-x-1" />
          </a>
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
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-forest/80">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-forest/15 bg-cream/20 px-4 py-3.5 text-sm font-medium text-forest outline-none transition-all focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/10 placeholder:text-muted/60"
      />
    </div>
  );
}
