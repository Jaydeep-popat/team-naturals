'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  PhoneIcon,
  ArrowRightIcon,
  ShieldAlertIcon,
  CreditCardIcon,
  PackageXIcon,
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

const RETURN_CONDITIONS = [
  'Items must be unused and in their original packaging',
  'Return request must be raised within 7 days of delivery',
  'Original receipt or proof of purchase is required',
  'Products bought on sale or using a promotional code are non-refundable unless damaged',
];

const NON_RETURNABLE = [
  'Used or opened soaps and face wash',
  'Items without original packaging or tags',
  'Products damaged due to misuse or neglect',
];

const STEPS = [
  { num: '01', label: 'Raise a Request', desc: 'Contact us via email or WhatsApp within 7 days with photos of the issue.' },
  { num: '02', label: 'Approval & Pickup', desc: 'Once approved, we will arrange a reverse pickup from your delivery address.' },
  { num: '03', label: 'Inspection', desc: 'Our team will inspect the returned item upon arrival at our facility.' },
  { num: '04', label: 'Refund Processed', desc: 'Refund initiated to your original payment method within 5–7 working days.' },
];

export function ReturnsPageClient() {
  return (
    <div className="w-full bg-cream overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-[#1a3526] to-[#0f2219] pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 15% 80%, rgba(212,169,106,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(139,191,159,0.15) 0%, transparent 55%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <nav className="mb-6 flex items-center gap-2 text-xs text-cream/50 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cream/80">Returns & Refunds</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
              <RefreshCwIcon size={12} /> Easy Returns
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              Returns &<br />Refunds
            </h1>
            <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-cream/65 sm:text-base">
              We stand by the quality of our handmade products. If something isn&apos;t right with your order, we&apos;re here to help make it right.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── HIGHLIGHTS / STATS ─── */}
      <section className="bg-white border-b border-forest/8">
        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
          <div className="grid grid-cols-1 divide-y divide-forest/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: AlertCircleIcon, title: '7-Day Window', desc: 'Raise a request within 7 days' },
              { icon: ShieldAlertIcon, title: 'Damaged Items', desc: 'Free replacement for transit damage' },
              { icon: CreditCardIcon, title: 'Fast Refunds', desc: 'Processed within 5–7 working days' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-4 py-4 px-2 sm:px-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest/8 text-forest">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-forest">{stat.title}</p>
                    <p className="text-xs text-muted">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CONDITIONS SPLIT ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Eligible */}
          <Reveal direction="left">
            <div className="rounded-[2rem] border border-forest/10 bg-white p-8 sm:p-10 h-full shadow-soft">
              <div className="mb-6 flex items-center gap-3">
                <CheckCircle2Icon size={28} className="text-forest" strokeWidth={2} />
                <h3 className="font-display text-2xl font-bold text-forest">Eligible for Return</h3>
              </div>
              <ul className="space-y-4">
                {RETURN_CONDITIONS.map((cond, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <p className="text-sm leading-relaxed text-forest/80 sm:text-base">{cond}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-cream-soft p-5 border border-forest/5">
                <p className="text-sm font-semibold text-forest">Note on Handmade Variations:</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Since our soaps are handmade in small batches, slight variations in color, texture, or scent are natural and not considered defects.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right: Non-Eligible */}
          <Reveal direction="right">
            <div className="rounded-[2rem] border border-terracotta/20 bg-terracotta/5 p-8 sm:p-10 h-full">
              <div className="mb-6 flex items-center gap-3">
                <PackageXIcon size={28} className="text-terracotta" strokeWidth={2} />
                <h3 className="font-display text-2xl font-bold text-terracotta">Not Eligible</h3>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-terracotta/80">
                For hygiene reasons, certain items cannot be returned once delivered:
              </p>
              <ul className="space-y-4">
                {NON_RETURNABLE.map((cond, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                    <p className="text-sm leading-relaxed text-terracotta/90">{cond}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── RETURN PROCESS ─── */}
      <section className="bg-cream-soft border-y border-forest/8 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">The Process</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-forest sm:text-4xl">How to Return</h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex flex-col rounded-2xl bg-white p-6 shadow-sm border border-forest/5 h-full">
                  <span className="font-display text-5xl font-extrabold text-forest/10 select-none leading-none mb-4">
                    {s.num}
                  </span>
                  <h4 className="font-display text-lg font-bold text-forest">{s.label}</h4>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CANCELLATIONS ─── */}
      <section className="mx-auto max-w-4xl px-5 py-14 sm:py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl">Order Cancellations</h2>
          <p className="mx-auto mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Orders can be cancelled before they are dispatched. Once an order is shipped, the standard return policy applies. If you need to cancel, please reach out to us immediately on WhatsApp.
          </p>
        </Reveal>
      </section>

      {/* ─── CTA ─── */}
      <Reveal>
        <section className="relative overflow-hidden bg-forest py-16 sm:py-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #D4A96A, transparent 60%)' }}
          />
          <div className="relative mx-auto max-w-xl px-5">
            <PhoneIcon size={36} className="mx-auto text-cream/40" strokeWidth={1.5} />
            <h2 className="mt-5 font-display text-3xl font-extrabold text-cream sm:text-4xl">Need to Start a Return?</h2>
            <p className="mx-auto mt-3 text-sm text-cream/60 sm:text-base">
              Reach out to our support team with your order details.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/919313010084"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-white"
              >
                WhatsApp Us <ArrowRightIcon size={14} strokeWidth={2.5} />
              </a>
              <a
                href="mailto:info@teamnaturals.com"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-8 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10"
              >
                Email Support
              </a>
            </div>
          </div>
        </section>
      </Reveal>

    </div>
  );
}
