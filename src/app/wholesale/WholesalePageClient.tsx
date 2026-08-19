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
  HelpCircleIcon,
  LayersIcon,
  ZapIcon,
  BriefcaseIcon,
  BuildingIcon,
} from 'lucide-react';
import { Reveal } from '@/src/components/Reveal';
import { InlineAccordion } from '@/src/components/InlineAccordion';

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
    title: 'Private Labelling (Soon)',
    desc: "Interested in branding our products under your own label? Reach out — we're working on private label options for established resellers.",
  },
  {
    icon: StarIcon,
    title: 'Consistent Quality',
    desc: 'Every batch is made to the same high standard — same ingredients, same cold-process method, same Morbi farmhouse. No shortcuts.',
  },
];

const WHY_ITEMS = [
  "No palm oil, sulfates, or synthetic fragrances — sell what you're proud of",
  'Goat milk cold-process soaps — a unique, premium category',
  'Made in small batches — genuinely artisanal, not factory-packaged',
  'Transparent ingredient list — great for educated, health-conscious buyers',
  'Eco-friendly packaging — aligns with sustainable retail branding',
  'Pan-India supply chain — ready to serve your customer base wherever they are',
];

const PRICING_TIERS = [
  {
    icon: LayersIcon,
    label: 'Starter',
    range: '50–100 units',
    badge: 'Entry level',
    highlight: false,
  },
  {
    icon: ZapIcon,
    label: 'Growth',
    range: '100–300 units',
    badge: 'Most popular',
    highlight: true,
  },
  {
    icon: BriefcaseIcon,
    label: 'Business',
    range: '300–500 units',
    badge: 'Best value',
    highlight: false,
  },
  {
    icon: BuildingIcon,
    label: 'Enterprise',
    range: '500+ units',
    badge: 'Custom pricing',
    highlight: false,
  },
];

const WHOLESALE_FAQS = [
  {
    q: "What's the minimum order quantity?",
    a: 'Our minimum order quantity starts from 50 units. Mix and match between soap variants and face wash — contact us to discuss what works for your business.',
  },
  {
    q: 'Do you offer private labelling?',
    a: "Private labelling is coming soon! We're actively developing this for established resellers. Register your interest via the enquiry form and we'll notify you as soon as it's available.",
  },
  {
    q: 'What are the payment terms for wholesale orders?',
    a: 'Payment terms are discussed at the time of order confirmation. For first-time partners, we typically require full payment upfront. Repeat partners may be eligible for partial advance arrangements — enquire to know more.',
  },
  {
    q: 'How long does a bulk order take to ship?',
    a: 'Bulk orders are processed within 3–5 business days after payment confirmation (depending on quantity and availability). Delivery timelines mirror our standard shipping estimates — Gujarat (1–2 days), metros (2–4 days), rest of India (3–7 days).',
  },
  {
    q: 'Do you offer sample kits before a bulk order?',
    a: 'Yes! We recommend trying our products before committing to a bulk order. You can purchase standard retail quantities from our shop, or get in touch to discuss a sample kit arrangement.',
  },
];

export function WholesalePageClient() {
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Your name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!formData.city.trim()) newErrors.city = 'City / State is required.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-cream overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-[#1a3526] to-[#0f2219] pt-20 pb-0 sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 15% 80%, rgba(212,169,106,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 10%, rgba(139,191,159,0.15) 0%, transparent 55%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <nav className="mb-6 flex items-center gap-2 text-xs text-cream/50 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cream/80">Wholesale</span>
          </nav>

          <div className="grid gap-10 pb-0 lg:grid-cols-2 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="pb-12 sm:pb-16"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                <PackageIcon size={12} /> Wholesale & Bulk Supply
              </span>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
                Sell Natural.<br /><span className="text-gold">Scale Naturally.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-cream/65 sm:text-base">
                Partner with Team Naturals to resell genuinely handmade, palm-oil-free soaps and face wash. Premium quality, honest pricing, Pan-India delivery.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#enquiry"
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-forest shadow-md transition-colors hover:bg-white"
                >
                  Enquire Now <ArrowRightIcon size={16} strokeWidth={2.5} />
                </a>
                <a
                  href="https://wa.me/919313010084"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10"
                >
                  <PhoneIcon size={15} strokeWidth={2} /> WhatsApp Us
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[2rem] border-t border-cream/10">
                <Image
                  src="/wholesale.jpg"
                  alt="Bulk handmade natural soap bars ready for wholesale supply"
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

      {/* ─── BENEFITS — Unified Ledger Panel ─── */}
      <section className="bg-cream-soft border-b border-forest/8 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal>
            <div className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-forest/10 pb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Why Partner</p>
                <h2 className="mt-2 font-display text-4xl font-extrabold text-forest sm:text-5xl">What You Get</h2>
              </div>
              <p className="text-sm text-muted max-w-xs sm:text-right">A seamless wholesale experience built for modern retailers and wellness brands.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 divide-y divide-forest/8 rounded-[2rem] border border-forest/10 bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3 overflow-hidden">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="group flex flex-col gap-4 p-8 transition-colors hover:bg-forest/[0.025]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/8 text-forest transition-colors group-hover:bg-forest group-hover:text-cream">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-forest">{b.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHY SELL — Dark Band Split ─── */}
      <section className="bg-forest py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
                <StarIcon size={12} /> Premium Appeal
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold text-cream sm:text-5xl">
                Why Your Customers Will Love It
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
                Selling Team Naturals products means offering your customers something genuinely different — not just another &quot;natural&quot; label on a mass-produced bar.
              </p>
            </Reveal>

            <Reveal direction="right">
              <ul className="space-y-5 border-l border-cream/10 pl-6">
                {WHY_ITEMS.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2Icon size={20} className="mt-0.5 shrink-0 text-gold" strokeWidth={2} />
                    <span className="text-sm font-medium text-cream/85 sm:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PRICING TIERS — Volume Ladder ─── */}
      <section className="bg-cream-soft py-14 sm:py-20 border-b border-forest/8">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <div className="flex flex-col gap-2 border-b border-forest/10 pb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Wholesale Pricing</p>
              <h2 className="mt-2 font-display text-4xl font-extrabold text-forest sm:text-5xl">Pricing Scales With Volume</h2>
              <p className="mt-2 text-sm text-muted max-w-md">Exact rates are shared on enquiry — the bar fills as the tier grows, so does the saving.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-forest/10 bg-white shadow-soft">
              {PRICING_TIERS.map((tier, i) => {
                const Icon = tier.icon;
                const fill = ((i + 1) / PRICING_TIERS.length) * 100;
                const isLast = i === PRICING_TIERS.length - 1;
                return (
                  <a
                    key={tier.label}
                    href="#enquiry"
                    className={`group flex flex-col gap-4 px-6 py-6 transition-colors hover:bg-forest/[0.03] sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-7 ${
                      !isLast ? 'border-b border-forest/8' : ''
                    } ${tier.highlight ? 'bg-terracotta/[0.04]' : ''}`}
                  >
                    <div className="flex shrink-0 items-center gap-4 sm:w-60">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/8 text-forest">
                        <Icon size={19} strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold text-forest">{tier.label}</h3>
                        <p className="text-xs font-bold uppercase tracking-wide text-terracotta">{tier.badge}</p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-forest/8">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${fill}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full ${isLast ? 'bg-forest' : 'bg-terracotta'}`}
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-forest/70">{tier.range}</p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-forest opacity-70 transition-all group-hover:gap-2.5 group-hover:opacity-100">
                      Enquire <ArrowRightIcon size={14} strokeWidth={2.5} />
                    </span>
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── DELIVERY MAP — Side Split ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal direction="left">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-forest/10 bg-forest/5 p-10 sm:aspect-auto sm:h-96">
              <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #1F3D2B 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative text-center">
                <MapPinIcon size={64} className="mx-auto mb-4 text-forest" strokeWidth={1} />
                <h3 className="font-display text-4xl font-extrabold text-forest">Pan-India<br />Coverage</h3>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Logistics</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold text-forest sm:text-5xl">We Ship Wherever<br />Your Business Is</h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-forest/70 sm:text-base">
              Team Naturals delivers wholesale orders across all 28 states and 8 union territories of India. From Gujarat to the Northeast, your bulk stock arrives safely packaged and tracked every step of the way. Custom logistics arrangements are available for very large orders.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Rajasthan', '+ All States'].map((s) => (
                <span key={s} className="rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold text-forest shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TRUSTED BY — Wordmark Strip ─── */}
      <section className="bg-cream-soft border-t border-b border-forest/8 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl">
              Trusted by Wellness Brands
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Join a growing network of retailers who stock Team Naturals products across India.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center justify-center divide-forest/10 sm:flex-nowrap sm:divide-x">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-8 py-3 first:pl-0 last:pr-0">
                  <p className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-forest/25">
                    Partner {i}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-xs italic text-muted/60">
              Partner logos will be added here — contact us to be featured.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-14 sm:py-20 border-b border-forest/8">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="mb-8 text-center">
            <HelpCircleIcon size={28} className="mx-auto text-forest/40" strokeWidth={1.5} />
            <h2 className="mt-4 font-display text-3xl font-extrabold text-forest sm:text-4xl">Wholesale FAQs</h2>
          </Reveal>
          <Reveal>
            <InlineAccordion items={WHOLESALE_FAQS} />
          </Reveal>
        </div>
      </section>

      {/* ─── ENQUIRY FORM — Editorial Split ─── */}
      <section id="enquiry" className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Get Started</p>
              <h2 className="mt-2 font-display text-4xl font-extrabold text-forest sm:text-5xl">Wholesale<br />Enquiry</h2>
              <p className="mt-5 text-sm leading-relaxed text-forest/70 sm:text-base max-w-sm">
                Fill in your details and we&apos;ll get back to you with pricing, MOQs, and next steps within 24 hours.
              </p>
              <div className="mt-8 p-6 rounded-2xl bg-forest/5 border border-forest/10">
                <h4 className="font-display text-lg font-bold text-forest mb-2">Need immediate assistance?</h4>
                <a href="https://wa.me/919313010084" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-terracotta transition-colors">
                  <PhoneIcon size={16} /> WhatsApp Us
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[2rem] border border-forest/15 bg-white p-12 text-center shadow-soft h-full flex flex-col justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle2Icon size={64} className="mx-auto text-forest" strokeWidth={1.5} />
                </motion.div>
                <h3 className="mt-6 font-display text-3xl font-extrabold text-forest">Enquiry Received!</h3>
                <p className="mx-auto mt-4 max-w-sm text-sm sm:text-base text-muted leading-relaxed">
                  Thank you for your interest in becoming a Team Naturals wholesale partner. We&apos;ll be in touch <strong>within 24 hours</strong>.
                </p>
                <Link
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-bold text-cream hover:bg-forest-deep transition-colors"
                >
                  Back to Home <ArrowRightIcon size={16} strokeWidth={2.5} />
                </Link>
              </motion.div>
            ) : (
              <Reveal>
                <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-forest/10 bg-white p-6 sm:p-10 shadow-soft space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="wh-name" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        Your Name <span className="text-terracotta">*</span>
                      </label>
                      <input
                        id="wh-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:ring-1 transition bg-cream-soft ${
                          errors.name ? 'border-terracotta focus:border-terracotta focus:ring-terracotta/20' : 'border-forest/10 focus:border-forest focus:ring-forest/20'
                        }`}
                      />
                      {errors.name && <p className="mt-1.5 text-xs text-terracotta">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="wh-biz" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        Business Name
                      </label>
                      <input
                        id="wh-biz"
                        name="businessName"
                        type="text"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Store or brand name"
                        className="w-full rounded-xl border border-forest/10 bg-cream-soft px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="wh-phone" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        Phone / WhatsApp <span className="text-terracotta">*</span>
                      </label>
                      <input
                        id="wh-phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:ring-1 transition bg-cream-soft ${
                          errors.phone ? 'border-terracotta focus:border-terracotta focus:ring-terracotta/20' : 'border-forest/10 focus:border-forest focus:ring-forest/20'
                        }`}
                      />
                      {errors.phone && <p className="mt-1.5 text-xs text-terracotta">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="wh-email" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        Email Address
                      </label>
                      <input
                        id="wh-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-forest/10 bg-cream-soft px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="wh-city" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        City / State <span className="text-terracotta">*</span>
                      </label>
                      <input
                        id="wh-city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Your city"
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:ring-1 transition bg-cream-soft ${
                          errors.city ? 'border-terracotta focus:border-terracotta focus:ring-terracotta/20' : 'border-forest/10 focus:border-forest focus:ring-forest/20'
                        }`}
                      />
                      {errors.city && <p className="mt-1.5 text-xs text-terracotta">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="wh-qty" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                        Monthly Quantity
                      </label>
                      <select
                        id="wh-qty"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-forest/10 bg-cream-soft px-4 py-3.5 text-sm font-medium text-forest outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                      >
                        <option value="">Select range</option>
                        <option value="50-100">50–100 units (Starter)</option>
                        <option value="100-300">100–300 units (Growth)</option>
                        <option value="300-500">300–500 units (Business)</option>
                        <option value="500+">500+ units (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="wh-products" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                      Products of Interest
                    </label>
                    <input
                      id="wh-products"
                      name="products"
                      type="text"
                      value={formData.products}
                      onChange={handleChange}
                      placeholder="e.g. Neem soap, Coffee soap, Face wash"
                      className="w-full rounded-xl border border-forest/10 bg-cream-soft px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="wh-message" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                      Anything Else?
                    </label>
                    <textarea
                      id="wh-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your business, any specific requirements, questions..."
                      className="w-full resize-none rounded-xl border border-forest/10 bg-cream-soft px-4 py-3.5 text-sm font-medium text-forest placeholder:text-muted/50 outline-none focus:border-forest focus:ring-1 focus:ring-forest/20 transition"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-forest py-4 text-sm font-bold text-cream shadow-md transition-all hover:bg-forest-deep hover:shadow-lg"
                    >
                      Submit Wholesale Enquiry
                    </button>
                  </div>
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}