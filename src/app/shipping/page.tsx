'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

export default function ShippingPage() {
  return (
    <>
      <head>
        <title>Shipping & Delivery | Team Naturals – Pan-India Delivery</title>
        <meta
          name="description"
          content="Team Naturals delivers handmade natural soaps and face wash Pan-India in 3–5 working days. Learn about our packaging, delivery zones, tracking, and free shipping threshold."
        />
      </head>

      <div className="w-full bg-cream">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest to-forest-deep pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 60%, #D4A96A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8BBF9F 0%, transparent 50%)' }}
          />
          <div className="relative mx-auto max-w-4xl px-5 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                <TruckIcon size={13} /> Delivery Information
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl lg:text-6xl">
                Shipping & Delivery
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-cream/70 sm:text-base">
                We take care packing your order the same way we craft our soaps — with attention to every detail. Here&apos;s everything you need to know.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key metrics */}
        <section className="relative -mt-8 px-5 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { icon: ClockIcon, label: 'Delivery Time', value: '3–5 Working Days', color: 'text-forest' },
                { icon: MapPinIcon, label: 'Coverage', value: 'Pan-India', color: 'text-terracotta' },
                { icon: PackageIcon, label: 'Free Shipping', value: 'On orders ₹499+', color: 'text-forest' },
                { icon: ShieldCheckIcon, label: 'Packaging', value: 'Eco-Friendly', color: 'text-terracotta' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    variants={staggerItem}
                    className="flex flex-col items-center rounded-2xl border border-forest/10 bg-white p-5 text-center shadow-soft"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-forest/8 ${item.color}`}>
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <p className="mt-3 text-lg font-extrabold text-forest sm:text-xl">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold text-muted">{item.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8 space-y-10">
          {/* Processing */}
          <Reveal>
            <div className="rounded-3xl border border-forest/10 bg-white p-7 sm:p-10 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <ClockIcon size={20} strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold text-forest">Order Processing</h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-forest/80 sm:text-base">
                <p>
                  All orders are <strong>processed and dispatched within 1–2 business days</strong> of payment confirmation. You&apos;ll receive a shipment confirmation with tracking details via email or WhatsApp as soon as your parcel leaves our workshop in Morbi, Gujarat.
                </p>
                <p>
                  Orders placed on <strong>Saturdays, Sundays, or national holidays</strong> are processed on the next working day.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { step: '01', label: 'Order Confirmed', desc: 'Payment verified & order logged' },
                  { step: '02', label: 'Packed by Hand', desc: 'Carefully wrapped in eco-material' },
                  { step: '03', label: 'Dispatched', desc: 'Tracking link sent to you' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 rounded-2xl bg-cream-soft p-4">
                    <span className="text-2xl font-extrabold text-forest/15 font-display">{s.step}</span>
                    <div>
                      <p className="text-sm font-bold text-forest">{s.label}</p>
                      <p className="mt-0.5 text-xs text-muted">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Delivery Timeline */}
          <Reveal>
            <div className="rounded-3xl border border-forest/10 bg-white p-7 sm:p-10 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                  <TruckIcon size={20} strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold text-forest">Delivery Timeline</h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-forest/8">
                <table className="w-full text-sm">
                  <thead className="bg-forest text-cream">
                    <tr>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Location</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Estimated Delivery</th>
                      <th className="px-5 py-3 text-left font-bold text-xs uppercase tracking-wider">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/8">
                    {[
                      { location: 'Gujarat (local)', days: '1–2 Working Days', note: 'Fastest delivery' },
                      { location: 'Metro Cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune)', days: '2–4 Working Days', note: 'Standard' },
                      { location: 'Tier-2 & Tier-3 Cities', days: '3–5 Working Days', note: 'Standard' },
                      { location: 'Remote / Rural Areas', days: '5–7 Working Days', note: 'Depends on PIN code serviceability' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-cream-soft/40' : 'bg-white'}>
                        <td className="px-5 py-3.5 font-medium text-forest">{row.location}</td>
                        <td className="px-5 py-3.5 font-bold text-forest">{row.days}</td>
                        <td className="px-5 py-3.5 text-xs text-muted">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted">* Delivery timelines are estimates and may vary during peak seasons, public holidays, or due to unforeseen logistics delays.</p>
            </div>
          </Reveal>

          {/* Shipping Charges */}
          <Reveal>
            <div className="rounded-3xl border border-forest/10 bg-white p-7 sm:p-10 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <PackageIcon size={20} strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold text-forest">Shipping Charges</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-forest p-6 text-cream">
                  <p className="text-xs font-bold uppercase tracking-widest text-cream/60">Orders ₹499 & Above</p>
                  <p className="mt-2 font-display text-4xl font-extrabold">FREE</p>
                  <p className="mt-2 text-sm text-cream/80">No additional shipping charges — we cover the cost on qualifying orders.</p>
                </div>
                <div className="rounded-2xl border border-forest/10 bg-cream-soft p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">Orders Below ₹499</p>
                  <p className="mt-2 font-display text-4xl font-extrabold text-forest">₹49</p>
                  <p className="mt-2 text-sm text-muted">Flat shipping fee. Tracked, insured delivery to your door.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Packaging */}
          <Reveal>
            <div className="rounded-3xl border border-forest/10 bg-white p-7 sm:p-10 shadow-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                  <ShieldCheckIcon size={20} strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold text-forest">How We Pack Your Order</h2>
              </div>
              <p className="text-sm leading-relaxed text-forest/80 sm:text-base">
                Since our soaps are handcrafted and contain active botanicals, packaging is done with care. Each bar is wrapped individually, secured inside a padded box, and sealed properly to prevent damage in transit. We use minimal but protective packaging — no unnecessary plastic.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  'Each soap is individually wrapped to preserve fragrance and bar shape',
                  'Orders are placed in sturdy, crush-resistant mailer boxes',
                  'No unnecessary plastic — we use kraft paper and biodegradable wrap',
                  'Fragile items are bubble-wrapped for added safety',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-forest/80">
                    <CheckCircle2Icon size={16} className="mt-0.5 shrink-0 text-forest" strokeWidth={2.5} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Important notes */}
          <Reveal>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 sm:p-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <AlertCircleIcon size={20} strokeWidth={2} />
                </span>
                <h2 className="font-display text-2xl font-bold text-forest">Important Notes</h2>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed text-forest/80 sm:text-base">
                {[
                  'Please ensure your delivery address is complete, including flat/house number, street, city, state, and PIN code.',
                  'If a delivery attempt fails due to an incorrect address or unavailability of recipient, a re-delivery fee may apply.',
                  'We currently ship within India only. International orders are not supported at this time.',
                  'For bulk or wholesale orders, please contact us directly for custom shipping arrangements.',
                ].map((note) => (
                  <li key={note} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <div className="rounded-3xl bg-forest p-8 text-center sm:p-12">
              <PhoneIcon size={32} className="mx-auto text-cream/60" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl font-bold text-cream sm:text-3xl">Have a Shipping Query?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
                Reach out to us directly — we typically respond within a few hours on working days.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-white"
              >
                Contact Support
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
