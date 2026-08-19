'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  PackageIcon,
  ShieldCheckIcon,
  PhoneIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  HomeIcon,
  BuildingIcon,
  TreesIcon,
  PackageCheckIcon,
  ArrowRightIcon,
  HelpCircleIcon,
  LeafIcon,
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';
import { InlineAccordion } from '@/src/components/InlineAccordion';

const SHIPPING_FAQS = [
  {
    q: 'Do you ship internationally?',
    a: 'No — we currently ship within India only. International shipping is something we are exploring for the future.',
  },
  {
    q: 'How do I track my order?',
    a: (
      <>
        Once your order is dispatched, you will receive a tracking link via email or WhatsApp. You can also check your{' '}
        <Link href="/account/orders" className="font-medium text-forest underline underline-offset-2">
          order history
        </Link>{' '}
        in your account for real-time status updates.
      </>
    ),
  },
  {
    q: 'What if I am not available at the time of delivery?',
    a: 'The courier will typically attempt delivery 1–2 times. If a delivery attempt fails due to your unavailability or an incorrect address, a re-delivery fee may apply. Please ensure your delivery address and phone number are accurate at checkout.',
  },
  {
    q: 'Can I change my delivery address after placing an order?',
    a: (
      <>
        Address changes are possible only before your order is dispatched. Contact us immediately via{' '}
        <a href="https://wa.me/919313010084" className="font-medium text-forest underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>{' '}
        or at{' '}
        <a href="mailto:info@teamnaturals.com" className="font-medium text-forest underline underline-offset-2">
          info@teamnaturals.com
        </a>.
      </>
    ),
  },
  {
    q: 'Is my order insured and tracked?',
    a: 'Yes. All orders are shipped with tracking. Standard orders include basic carrier insurance; any damage or loss in transit should be reported to us within 48 hours of the expected delivery date.',
  },
];

const REGIONS = [
  { icon: HomeIcon,     location: 'Gujarat',         days: '1–2',  note: 'Shipped from Morbi directly',                   accent: 'bg-forest text-cream' },
  { icon: BuildingIcon, location: 'Metro Cities',     days: '2–4',  note: 'Mumbai, Delhi, Bangalore, Pune + more',         accent: 'bg-terracotta text-cream' },
  { icon: MapPinIcon,   location: 'Tier-2 & Tier-3', days: '3–5',  note: 'Standard tracked delivery to smaller cities',    accent: 'bg-forest/80 text-cream' },
  { icon: TreesIcon,    location: 'Remote Areas',     days: '5–7',  note: 'Confirmed on order by PIN serviceability',      accent: 'bg-amber-600 text-white' },
];

const STEPS = [
  { num: '01', label: 'Order Confirmed',  desc: 'Payment verified & order logged in our system' },
  { num: '02', label: 'Packed by Hand',   desc: 'Carefully wrapped in eco-friendly material' },
  { num: '03', label: 'Dispatched',       desc: 'Tracking link sent via email & WhatsApp' },
];

const PACKAGING_POINTS = [
  'Each soap is individually wrapped to preserve fragrance and bar shape',
  'Placed in sturdy, crush-resistant kraft mailer boxes',
  'No unnecessary plastic — biodegradable wrap throughout',
  'Fragile items are bubble-wrapped for added protection',
];

const NOTES = [
  'Ensure your address is complete — flat/house number, street, city, state, PIN.',
  'Failed delivery attempts due to unavailability may incur a re-delivery fee.',
  'India-only shipping. International orders are not supported at this time.',
  'Bulk/wholesale orders — contact us directly for custom shipping terms.',
];

export function ShippingPageClient() {
  return (
    <div className="w-full bg-cream overflow-hidden">

      {/* ─── HERO — full bleed green with inline stats ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-[#1a3526] to-[#0f2219] pt-20 pb-0 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 15% 80%, rgba(212,169,106,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(139,191,159,0.15) 0%, transparent 55%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-cream/50 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cream/80">Shipping & Delivery</span>
          </nav>

          <div className="grid gap-10 pb-0 lg:grid-cols-2 lg:items-end">
            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pb-12 sm:pb-16"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                <TruckIcon size={12} /> Delivery Information
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
                Shipping<br />& Delivery
              </h1>
              <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-cream/65 sm:text-base">
                We pack every order the same way we craft our soaps — with care and attention to every detail.
              </p>

              {/* Track order inline */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-bold text-forest shadow-md transition-colors hover:bg-white"
                >
                  <PackageCheckIcon size={15} strokeWidth={2} /> Track Your Order
                </Link>
                <span className="text-xs text-cream/50">Already placed an order? Check live status →</span>
              </div>
            </motion.div>

            {/* Right: large stat bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-px overflow-hidden rounded-t-3xl border border-cream-soft bg-forest/5 lg:rounded-t-[2rem]"
            >
              {[
                { label: 'Dispatch In', value: '1–2 Days', sub: 'Business days' },
                { label: 'Delivery', value: '3–5 Days', sub: 'Pan-India average' },
                { label: 'Free Shipping', value: '₹499+', sub: 'Order value threshold' },
                { label: 'Packaging', value: 'Eco', sub: 'No unnecessary plastic' },
              ].map((s) => (
                <div key={s.label} className="group flex flex-col gap-1 bg-cream-soft px-6 py-8 transition-colors hover:bg-white cursor-default">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-forest/50 transition-colors group-hover:text-forest/70">{s.label}</p>
                  <p className="font-display text-3xl font-extrabold text-forest sm:text-4xl transition-transform group-hover:scale-105 origin-left">{s.value}</p>
                  <p className="text-xs text-forest/60 mt-1">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── DELIVERY TIMELINE — horizontal scroll band ─── */}
      <section className="bg-cream-soft border-b border-forest/8">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-10">
          <Reveal>
            <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Zone by Zone</p>
                <h2 className="mt-1 font-display text-3xl font-extrabold text-forest sm:text-4xl">Delivery Timeline</h2>
              </div>
              <p className="text-xs text-muted">* Estimates — may vary during peak seasons or holidays</p>
            </div>
          </Reveal>

          {/* Region rows — not cards, table-row style */}
          <div className="space-y-0 divide-y divide-forest/8 overflow-hidden rounded-2xl border border-forest/10 bg-white">
            {REGIONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <Reveal key={r.location} delay={i * 0.08}>
                  <div className="group flex items-center gap-5 px-5 py-5 sm:px-8 sm:py-6 hover:bg-cream-soft/60 transition-colors">
                    {/* Accent number */}
                    <span className="hidden shrink-0 font-display text-5xl font-extrabold text-forest/8 sm:block select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {/* Icon badge */}
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.accent}`}>
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    {/* Location */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-forest sm:text-base">{r.location}</p>
                      <p className="mt-0.5 text-xs text-muted leading-relaxed">{r.note}</p>
                    </div>
                    {/* Days — big & right */}
                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl font-extrabold text-forest sm:text-3xl">
                        {r.days}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Working Days</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SHIPPING CHARGES — full-width bold typography ─── */}
      <section className="relative overflow-hidden">
        <Reveal>
          <div className="flex flex-col divide-y divide-forest/8 sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Free */}
            <div className="relative flex-1 overflow-hidden bg-forest px-8 py-14 sm:px-12 sm:py-20 min-h-[300px] flex flex-col">
              <p className="relative z-10 text-[11px] font-bold uppercase tracking-widest text-cream/50">Orders ₹499 & Above</p>
              <p
                className="absolute -right-4 -bottom-4 font-display font-extrabold leading-none text-cream/10 select-none pointer-events-none"
                style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
                aria-hidden="true"
              >
                FREE
              </p>
              <div className="relative z-10 mt-auto pt-16">
                <p className="font-display text-4xl font-extrabold text-cream sm:text-5xl">FREE</p>
                <p className="mt-2 max-w-xs text-sm text-cream/65">No additional charges. We cover the cost on all qualifying orders.</p>
              </div>
            </div>
            {/* Flat fee */}
            <div className="relative flex-1 overflow-hidden bg-cream px-8 py-14 sm:px-12 sm:py-20 min-h-[300px] flex flex-col">
              <p className="relative z-10 text-[11px] font-bold uppercase tracking-widest text-muted">Orders Below ₹499</p>
              <p
                className="absolute -right-4 -bottom-6 font-display font-extrabold leading-none text-forest/5 select-none pointer-events-none"
                style={{ fontSize: 'clamp(6rem, 18vw, 16rem)' }}
                aria-hidden="true"
              >
                49
              </p>
              <div className="relative z-10 mt-auto pt-16">
                <p className="font-display text-4xl font-extrabold text-forest sm:text-5xl">₹49</p>
                <p className="mt-2 max-w-xs text-sm text-muted">Flat shipping fee. Tracked, insured delivery right to your door.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── ORDER PROCESS — side-by-side editorial ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: text */}
          <Reveal direction="left">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">How It Works</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-forest sm:text-5xl">From Order<br />to Your Door</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-forest/70 sm:text-base">
              All orders are <strong>processed and dispatched within 1–2 business days</strong> of payment confirmation. Orders placed on weekends or national holidays are processed the next working day.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-forest/70 sm:text-base">
              You&apos;ll receive a shipment confirmation with a tracking link via email or WhatsApp the moment your parcel leaves our workshop in Morbi, Gujarat.
            </p>
          </Reveal>

          {/* Right: numbered steps — vertical timeline style */}
          <Reveal direction="right">
            <div className="space-y-0">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-6"
                >
                  {/* Step column */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-cream font-display font-extrabold text-sm shadow-soft">
                      {s.num}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mt-1 w-px flex-1 min-h-[2.5rem] bg-forest/15" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 pt-2 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                    <p className="text-base font-bold text-forest">{s.label}</p>
                    <p className="mt-1 text-sm text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── PACKAGING — full-width green band ─── */}
      <section className="bg-forest py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                <LeafIcon size={12} /> Eco-First Packaging
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold text-cream sm:text-5xl">
                Packed with<br />the Same Care
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
                Since our soaps are handcrafted and contain active botanicals, packaging is done with the same mindfulness. No unnecessary plastic, no shortcuts.
              </p>
            </Reveal>

            <Reveal direction="right">
              <ul className="space-y-4">
                {PACKAGING_POINTS.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2Icon size={18} className="mt-0.5 shrink-0 text-cream/60" strokeWidth={2} />
                    <span className="text-sm font-medium text-cream/85 sm:text-base">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── IMPORTANT NOTES — editorial inline list ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-10">
        <Reveal>
          <div className="flex flex-col gap-2 border-b border-forest/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircleIcon size={20} className="shrink-0 text-amber-600" strokeWidth={2} />
              <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl">Important Notes</h2>
            </div>
          </div>
        </Reveal>
        <ul className="mt-8 space-y-0 divide-y divide-forest/8">
          {NOTES.map((note, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <li className="flex items-start gap-6 py-5 sm:py-6">
                <span className="shrink-0 font-display text-3xl font-extrabold text-forest/10 leading-none select-none pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed text-forest/75 sm:text-base">{note}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-cream-soft border-t border-forest/8 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="mb-8 text-center">
            <HelpCircleIcon size={28} className="mx-auto text-forest/40" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-3xl font-extrabold text-forest sm:text-4xl">Shipping Questions</h2>
            <p className="mt-2 text-sm text-muted">Quick answers to the most common questions about our delivery.</p>
          </Reveal>
          <Reveal>
            <InlineAccordion items={SHIPPING_FAQS} />
          </Reveal>
        </div>
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
            <h2 className="mt-5 font-display text-3xl font-extrabold text-cream sm:text-4xl">Still Have Questions?</h2>
            <p className="mx-auto mt-3 text-sm text-cream/60 sm:text-base">
              Reach out — we typically respond within a few hours on working days.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-white"
            >
              Contact Support <ArrowRightIcon size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </section>
      </Reveal>

    </div>
  );
}
