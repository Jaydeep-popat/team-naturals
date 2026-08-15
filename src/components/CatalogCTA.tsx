'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDownToLineIcon, BuildingIcon, PackageIcon, TagIcon } from 'lucide-react';
import { Reveal } from './Reveal';

const dealerPerks = [
  {
    icon: PackageIcon,
    title: 'Bulk Supply',
    desc: 'Flexible MOQ for retail and distribution partners',
  },
  {
    icon: TagIcon,
    title: 'Private Labeling',
    desc: 'Your brand identity, our proven formulations',
  },
  {
    icon: BuildingIcon,
    title: 'Dealer Program',
    desc: 'Exclusive pricing tiers for registered distributors',
  },
];

export function CatalogCTA() {
  return (
    <Reveal>
      <section
        aria-labelledby="catalog-heading"
        className="overflow-hidden rounded-3xl bg-forest"
      >
        <div className="grid items-center gap-0 sm:grid-cols-5">
          {/* Left — content */}
          <div className="col-span-3 p-8 sm:p-12">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cream/60">
              For distributors & retailers
            </p>
            <h2
              id="catalog-heading"
              className="mt-3 font-display text-3xl leading-tight text-cream sm:text-4xl"
            >
              Partner with
              <br />
              Team Naturals
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              We supply distributors, retail chains, and salon partners across India. Explore our
              full range — soaps, face wash, private label options, and wholesale pricing — in our
              product catalog.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  href="#"
                  aria-label="Download Team Naturals product catalog PDF"
                  className="inline-flex items-center gap-2.5 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-forest transition-colors hover:bg-cream/90"
                >
                  <ArrowDownToLineIcon size={16} strokeWidth={2} />
                  Download Catalog
                </Link>
              </motion.div>
              <Link
                href="/contact"
                className="rounded-full border border-cream/25 px-6 py-3.5 text-sm text-cream/90 transition-colors hover:border-cream/50 hover:text-cream"
              >
                Contact for wholesale
              </Link>
            </div>
          </div>

          {/* Right — perks */}
          <div className="col-span-2 border-t border-cream/10 p-8 sm:border-l sm:border-t-0 sm:p-10">
            <ul className="space-y-6">
              {dealerPerks.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream">
                    <Icon size={17} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-cream">{title}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-cream/60">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] leading-relaxed text-cream/45">
              Interested in stocking Team Naturals? Write to us at{' '}
              <a
                href="mailto:info@teamnaturals.com"
                className="text-cream/60 underline-offset-2 hover:underline"
              >
                info@teamnaturals.com
              </a>{' '}
              or use the contact form.
            </p>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
