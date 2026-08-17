'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  PackageIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  TruckIcon,
  UsersIcon,
  BadgeIndianRupeeIcon,
  SparklesIcon,
  StarIcon,
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

const BENEFITS = [
  {
    icon: PackageIcon,
    title: 'Custom Bulk Packs',
    desc: 'Order in quantities that suit your business — mix and match soap varieties or face wash with flexible minimum order quantities.',
  },
  {
    icon: BadgeIndianRupeeIcon,
    title: 'Wholesale Pricing',
    desc: 'Unlock tiered pricing that scales with your order size. The more you order, the better the value. Ideal for resellers and wellness brands.',
  },
  {
    icon: TruckIcon,
    title: 'Pan-India Delivery',
    desc: 'We ship to every corner of India. Whether your store is in Mumbai or a Tier-3 town, your bulk order reaches you safely.',
  },
  {
    icon: UsersIcon,
    title: 'Dedicated Support',
    desc: 'Every wholesale partner gets a dedicated point of contact for order management, restocking, and any queries.',
  },
  {
    icon: SparklesIcon,
    title: 'Private Labelling (Coming Soon)',
    desc: 'Interested in branding our products under your own label? Reach out — we\'re working on private label options for established resellers.',
  },
  {
    icon: StarIcon,
    title: 'Consistent Quality',
    desc: 'Every batch is made to the same high standard — same ingredients, same cold-process method, same Morbi farmhouse. No shortcuts.',
  },
];

const WHY_ITEMS = [
  'No palm oil, sulfates, or synthetic fragrances — sell what you\'re proud of',
  'Goat milk cold-process soaps — a unique, premium category',
  'Made in small batches — genuinely artisanal, not factory-packaged',
  'Transparent ingredient list — great for educated, health-conscious buyers',
  'Eco-friendly packaging — aligns with sustainable retail branding',
  'Pan-India supply chain — ready to serve your customer base wherever they are',
];

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    quantity: '',
    products: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <head>
        <title>Wholesale & Bulk Orders | Team Naturals – Partner with Us</title>
        <meta
          name="description"
          content="Partner with Team Naturals for wholesale and bulk supply of handmade natural soaps and face wash. Resell premium cold-process soaps Pan-India. Enquire now for pricing."
        />
      </head>

      <div className="w-full bg-cream overflow-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-deep pt-20 pb-0 sm:pt-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 10% 80%, #D4A96A 0%, transparent 40%), radial-gradient(circle at 90% 10%, #8BBF9F 0%, transparent 40%)',
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 pb-0 lg:px-10">
            <div className="grid items-end gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="pb-12 sm:pb-16"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                  <PackageIcon size={13} /> Wholesale & Bulk Supply
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-cream sm:text-5xl lg:text-6xl">
                  Sell Natural.{' '}
                  <span className="text-gold">Scale Naturally.</span>
                </h1>
                <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-cream/75 sm:text-base">
                  Partner with Team Naturals to resell genuinely handmade, palm-oil-free soaps and face wash. Premium quality, honest pricing, Pan-India delivery for your retail or wellness business.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-forest shadow-md transition-colors hover:bg-white"
                  >
                    Enquire Now <ArrowRightIcon size={16} strokeWidth={2.5} />
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10"
                  >
                    <PhoneIcon size={15} strokeWidth={2} /> WhatsApp Us
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-6">
                  {[
                    { label: 'Delivery', value: 'Pan-India' },
                    { label: 'Min Order', value: 'Flexible MOQ' },
                    { label: 'Pricing', value: 'Tiered Wholesale' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-lg font-extrabold text-cream font-display">{s.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-cream/50">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative hidden lg:block"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[2rem]">
                  <Image
                    src="/wholesale.jpg"
                    alt="Bulk handmade natural soap bars ready for wholesale supply from Team Naturals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mobile hero image */}
        <div className="lg:hidden relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src="/wholesale.jpg"
            alt="Bulk handmade natural soap bars ready for wholesale"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest/30" />
        </div>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 sm:px-8 lg:px-10">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
              Why Partner With Us
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-forest sm:text-4xl">
              What You Get as a Wholesale Partner
            </h2>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  variants={staggerItem}
                  className="rounded-3xl border border-forest/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest/8 text-forest">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-forest">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Why sell our products */}
        <section className="bg-forest py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
            <Reveal className="text-center">
              <h2 className="font-display text-3xl font-extrabold text-cream sm:text-4xl">
                Why Your Customers Will Love It
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-cream/70">
                Selling Team Naturals products means offering your customers something genuinely different — not just another &#34;natural&#34; label on a mass-produced bar.
              </p>
            </Reveal>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              {WHY_ITEMS.map((item) => (
                <motion.li
                  key={item}
                  variants={staggerItem}
                  className="flex items-start gap-3 rounded-2xl border border-cream/10 bg-cream/5 p-4"
                >
                  <CheckCircle2Icon size={18} className="mt-0.5 shrink-0 text-cream/60" strokeWidth={2.5} />
                  <span className="text-sm font-medium text-cream/85">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Delivery map visual */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-forest/10 bg-white p-8 shadow-soft sm:flex-row sm:gap-10 sm:p-12">
              <div className="flex shrink-0 flex-col items-center gap-3">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/8 text-forest">
                  <MapPinIcon size={38} strokeWidth={1.5} />
                </span>
                <p className="font-display text-2xl font-extrabold text-forest">Pan-India</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Delivery Coverage</p>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-forest sm:text-3xl">
                  We Ship Wherever Your Business Is
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Team Naturals delivers wholesale orders across all 28 states and 8 union territories of India. From Gujarat to the Northeast, your bulk stock arrives safely packaged and tracked every step of the way. Custom logistics arrangements are available for very large orders.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Rajasthan', '+ All States'].map((s) => (
                    <span key={s} className="rounded-full border border-forest/12 bg-cream-soft px-3 py-1 text-xs font-semibold text-forest">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Enquiry Form */}
        <section id="enquiry" className="bg-cream-soft py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
                Get Started
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-forest sm:text-4xl">
                Wholesale Enquiry
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
                Fill in your details and we&apos;ll get back to you with pricing, MOQs, and next steps within 24 hours.
              </p>
            </Reveal>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 rounded-3xl border border-forest/15 bg-white p-12 text-center shadow-soft"
              >
                <CheckCircle2Icon size={52} className="mx-auto text-forest" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-2xl font-bold text-forest">Enquiry Received!</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
                  Thank you for your interest in becoming a Team Naturals wholesale partner. We&apos;ll reach out within 24 hours with all the details.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-bold text-cream"
                >
                  Back to Home <ArrowRightIcon size={15} strokeWidth={2.5} />
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-forest/10 bg-white p-7 shadow-soft sm:p-10 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="wh-name" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="wh-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-biz" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      Business Name
                    </label>
                    <input
                      id="wh-biz"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Store or brand name"
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-phone" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="wh-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-email" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="wh-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-city" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      City / State *
                    </label>
                    <input
                      id="wh-city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-qty" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                      Estimated Monthly Quantity
                    </label>
                    <select
                      id="wh-qty"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    >
                      <option value="">Select range</option>
                      <option value="50-100">50–100 units</option>
                      <option value="100-300">100–300 units</option>
                      <option value="300-500">300–500 units</option>
                      <option value="500+">500+ units</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="wh-products" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Products of Interest
                  </label>
                  <input
                    id="wh-products"
                    name="products"
                    type="text"
                    value={formData.products}
                    onChange={handleChange}
                    placeholder="e.g. Neem soap, Coffee soap, Face wash"
                    className="w-full rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                  />
                </div>

                <div>
                  <label htmlFor="wh-message" className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Anything Else?
                  </label>
                  <textarea
                    id="wh-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business, any specific requirements, questions..."
                    className="w-full resize-none rounded-xl border border-forest/15 bg-cream-soft px-4 py-3 text-sm font-medium text-forest placeholder:text-muted/60 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-forest py-4 text-sm font-bold text-cream shadow-md transition-colors hover:bg-forest-deep"
                >
                  Submit Wholesale Enquiry
                </button>

                <p className="text-center text-xs text-muted">
                  We typically respond within 24 hours on working days. For urgent queries, WhatsApp us directly.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
