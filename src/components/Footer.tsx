'use client';

import React from 'react';
import Link from 'next/link';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  LeafIcon,
} from 'lucide-react';
import { Logo } from './Logo';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Products', href: '/shop' },
  { label: 'Categories', href: '/shop/categories' },
  { label: 'Our Story', href: '/story' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const helpLinks = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Shipping & Delivery', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-forest text-white/80">
      {/* Background Leaves */}
      <div className="absolute -right-32 -top-32 pointer-events-none rotate-12">
        <LeafIcon size={450} strokeWidth={0.3} className="text-white opacity-[0.04]" />
      </div>
      <div className="absolute -left-32 -bottom-32 pointer-events-none -rotate-[120deg]">
        <LeafIcon size={450} strokeWidth={0.3} className="text-white opacity-[0.04]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="brightness-0 invert">
              <Logo useImage={true} disableLayoutAnimation={true} />
            </div>
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-white/70">
              Team Naturals brings you the finest naturally sourced products for a healthier and better tomorrow.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: FacebookIcon, href: '#' },
                { Icon: InstagramIcon, href: '#' },
                { Icon: LinkedinIcon, href: '#' },
                { Icon: YoutubeIcon, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label="Social link"
                  className="rounded-full border border-white/20 p-2.5 text-white transition-colors hover:bg-white hover:text-forest"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links" links={quickLinks} />

          {/* Customer Support */}
          <FooterColumn title="Customer Support" links={helpLinks} />

          {/* Contact Info */}
          <div>
            <h3 className="text-[15px] font-semibold text-white">Contact Us</h3>
            <ul className="mt-6 space-y-5 text-[13px] text-white/70">
              <li className="flex items-start gap-3">
                <MapPinIcon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <span>123 Green Avenue,<br/>Nature City, India - 360001</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon size={18} strokeWidth={1.5} className="shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon size={18} strokeWidth={1.5} className="shrink-0" />
                <span>info@teamnaturals.com</span>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon size={18} strokeWidth={1.5} className="shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-[12px] text-white/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} Team Naturals. All Rights Reserved. &nbsp;|&nbsp; Designed with ♥ for a better tomorrow.
          </p>
          <div className="flex items-center gap-2">
            {/* Mock Payment Icons */}
            <div className="flex h-7 items-center justify-center rounded bg-white px-2.5 font-bold text-[#1434CB] text-[10px]">VISA</div>
            <div className="flex h-7 items-center justify-center gap-0.5 rounded bg-white px-2.5">
               <div className="h-3 w-3 rounded-full bg-[#EB001B]"></div>
               <div className="-ml-1 h-3 w-3 rounded-full bg-[#F79E1B]"></div>
            </div>
            <div className="flex h-7 items-center justify-center rounded bg-white px-2.5 font-bold italic text-[#2563EB] text-[10px]">RuPay</div>
            <div className="flex h-7 items-center justify-center rounded bg-white px-2.5 font-bold text-gray-800 text-[10px]">UPI</div>
          </div>
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
      <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      <ul className="mt-6 space-y-3.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="group flex items-center text-[13px] text-white/70 transition-colors hover:text-white">
              <ChevronRightIcon size={14} strokeWidth={2} className="mr-2 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}