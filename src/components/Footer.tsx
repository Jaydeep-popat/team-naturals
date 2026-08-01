'use client';

import React from 'react';
import Link from 'next/link';
import {
  FacebookIcon,
  InstagramIcon,
  LeafIcon,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SproutIcon,
  YoutubeIcon,
} from 'lucide-react';
import { Logo } from './Logo';

const quickLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Soaps', href: '/shop/soaps' },
  { label: 'Face Wash', href: '/shop/face-wash' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const helpLinks = [
  { label: 'Cart', href: '/cart' },
  { label: 'Sign in', href: '/login' },
  { label: 'Create account', href: '/register' },
  { label: 'Shipping & Returns', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-forest/8 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo useImage={true} disableLayoutAnimation={true} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Handmade natural skincare from small batches — rooted in nature, made with care.
            </p>
            <div className="mt-5 flex gap-2">
              {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="rounded-full border border-forest/12 p-2.5 text-forest transition-colors hover:bg-forest hover:text-cream"
                >
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={quickLinks} />
          <FooterColumn title="Help" links={helpLinks} />

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-forest">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <PhoneIcon size={15} strokeWidth={1.6} className="text-forest" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon size={15} strokeWidth={1.6} className="text-forest" />
                hello@teamnaturals.in
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircleIcon size={15} strokeWidth={1.6} className="text-forest" />
                WhatsApp us
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-forest/8 pt-8">
          {['Handmade', 'Cruelty Free', 'No Artificial Colors'].map((seal) => (
            <span
              key={seal}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/12 px-3 py-1.5 text-[11px] text-forest"
            >
              <SproutIcon size={13} strokeWidth={1.6} className="text-forest-soft" />
              {seal}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-mist px-3 py-1.5 text-[11px] text-forest">
            <ShieldCheckIcon size={13} strokeWidth={1.6} />
            SSL Secured
          </span>
          <div className="ml-auto flex items-center gap-2">
            {['UPI', 'Visa', 'RuPay', 'Mastercard'].map((pm) => (
              <span
                key={pm}
                className="rounded-lg border border-forest/12 bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-muted"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 text-[11px] text-muted sm:flex-row">
          <p className="flex items-center gap-1.5">
            <LeafIcon size={12} strokeWidth={1.6} /> © {new Date().getFullYear()} Team Naturals.
            All rights reserved.
          </p>
          <p>Demo store — seed data only, no live payments.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-forest">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-muted transition-colors hover:text-forest">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}