'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronDownIcon,
  MessageCircleIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  PackageIcon,
  HeartIcon,
  DropletsIcon,
  AwardIcon,
} from 'lucide-react';
import { Reveal } from '@/src/components/Reveal';

const FAQS = [
  {
    id: 'handmade',
    icon: HeartIcon,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    category: 'Product Quality',
    question: 'Are Team Naturals soaps really handmade?',
    answer:
      'Yes. Every bar is handmade in small batches — no mass production, no automated lines. We measure, mix, and cut each batch by hand, which means small variations in shape and texture are normal, not a defect. That inconsistency is exactly how you know it\'s real.',
  },
  {
    id: 'palm-oil',
    icon: LeafIcon,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    category: 'Ingredients',
    question: 'Do your products contain palm oil?',
    answer:
      'No. None of our soaps or face washes use palm oil. We use alternative natural oils and butters that are kinder to your skin and don\'t rely on palm oil farming — which is a major driver of deforestation.',
  },
  {
    id: 'sensitive-skin',
    icon: ShieldCheckIcon,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    category: 'Skin Compatibility',
    question: 'Are your soaps safe for sensitive skin?',
    answer:
      'Our soaps are formulated without harsh chemicals, sulfates, or synthetic fragrances that typically irritate sensitive skin. That said, everyone\'s skin reacts differently — we recommend a patch test on your inner arm before regular use if you have known sensitivities.',
  },
  {
    id: 'tanning',
    icon: SparklesIcon,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    category: 'Product Benefits',
    question: 'Can Team Naturals soap help with tanning?',
    answer:
      'Our de-tanning range is formulated with natural ingredients traditionally used to gently exfoliate and brighten skin tone with regular use. Results vary by skin type and sun exposure, and it works best as part of a consistent skincare routine — not as an overnight fix.',
  },
  {
    id: 'shelf-life',
    icon: PackageIcon,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    category: 'Storage & Shelf Life',
    question: 'How long do the soaps last and how should I store them?',
    answer:
      'Our soaps typically last 6–12 months from the date of manufacture when stored properly. Keep them in a cool, dry place away from direct sunlight and water. Using a well-drained soap dish will significantly extend the life of your bar by allowing it to dry between uses.',
  },
  {
    id: 'kids',
    icon: HeartIcon,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50',
    category: 'Usage',
    question: 'Can children use these soaps?',
    answer:
      'Yes, our gentle formula soaps are suitable for children above 3 years. They are free from sulfates and synthetic fragrances that typically cause irritation. For very young children or babies, please consult a pediatrician first.',
  },
  {
    id: 'ingredients-sourcing',
    icon: LeafIcon,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    category: 'Ingredients',
    question: 'Where do you source your ingredients from?',
    answer:
      'Primarily from our own farmhouse in Morbi, Gujarat — the same land, every batch. Goat milk, neem, botanicals, and clay are sourced locally wherever possible. For ingredients we don\'t grow ourselves, we work with trusted Indian suppliers who share our quality standards.',
  },
  {
    id: 'returns',
    icon: PackageIcon,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    category: 'Orders & Returns',
    question: 'What if I receive a damaged or incorrect product?',
    answer:
      'We take full responsibility for damaged or wrong items. If your order arrives in poor condition, please contact us within 48 hours of delivery with photos of the packaging and product. We\'ll arrange a replacement or full refund promptly — no questions asked.',
  },
  {
    id: 'goat-milk',
    icon: DropletsIcon,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    category: 'Product Quality',
    question: 'Why do you use goat milk in your soaps?',
    answer:
      'Goat milk is rich in alpha-hydroxy acids, vitamins A, B2, B3, B6, and C, and fatty acids that deeply nourish and moisturise the skin. It helps maintain the skin\'s natural pH balance and is gentle enough for daily use. Our farm-fresh goat milk is what makes our soaps distinctly different from most natural alternatives.',
  },
  {
    id: 'bulk',
    icon: AwardIcon,
    iconColor: 'text-forest',
    iconBg: 'bg-forest/8',
    category: 'Wholesale',
    question: 'Do you offer bulk or wholesale pricing?',
    answer:
      'Yes! We offer special pricing for bulk orders, resellers, and wellness businesses. Minimum order quantities and pricing vary by product. Contact us through our Wholesale Enquiry page or directly via WhatsApp for a custom quote.',
  },
];

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = React.useState(false);
  const Icon = faq.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border transition-all duration-300 ${
        open
          ? 'border-forest/20 bg-white shadow-soft'
          : 'border-forest/8 bg-white hover:border-forest/15 hover:shadow-sm'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-4 p-5 sm:p-6 text-left"
        aria-expanded={open}
      >
        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${faq.iconBg} ${faq.iconColor}`}>
          <Icon size={17} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{faq.category}</p>
          <p className="mt-1 text-sm font-bold text-forest sm:text-base">{faq.question}</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1 shrink-0 text-forest/40"
        >
          <ChevronDownIcon size={20} strokeWidth={2} />
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pl-[3.75rem] sm:pl-[4.5rem]">
          <p className="text-sm leading-relaxed text-forest/75 sm:text-base">{faq.answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FAQsPage() {
  return (
    <>
      <head>
        <title>Frequently Asked Questions | Team Naturals</title>
        <meta
          name="description"
          content="Find answers to common questions about Team Naturals handmade soaps and face wash — ingredients, delivery, sensitive skin, shelf life, bulk orders, and more."
        />
      </head>

      <div className="w-full bg-cream">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest to-forest-deep pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #D4A96A 0%, transparent 50%), radial-gradient(circle at 70% 30%, #8BBF9F 0%, transparent 50%)' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl px-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
              <MessageCircleIcon size={13} /> Got Questions?
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-cream/70 sm:text-base">
              Everything you need to know about our handmade soaps, ingredients, delivery, and more.
            </p>
          </motion.div>
        </section>

        {/* Stats bar */}
        <div className="border-b border-forest/8 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
              {[
                { label: '10 Questions Answered', value: '10' },
                { label: 'Response Time', value: '< 24h' },
                { label: 'Customer Satisfaction', value: '4.8★' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="font-display text-xl font-extrabold text-forest">{s.value}</span>
                  <span className="text-xs font-semibold text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ list */}
        <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20 sm:px-8">
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.id} faq={faq} index={i} />
            ))}
          </div>

          {/* Still have questions */}
          <Reveal>
            <div className="mt-14 rounded-3xl bg-forest p-8 text-center sm:p-12">
              <MessageCircleIcon size={36} className="mx-auto text-cream/50" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl font-bold text-cream">Still Have Questions?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-cream/70">
                We&apos;re always happy to help. Reach us via our contact page or WhatsApp — we usually reply within a few hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-white"
                >
                  Contact Us
                </Link>
                <Link
                  href="/wholesale"
                  className="rounded-full border border-cream/30 px-8 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10"
                >
                  Wholesale Enquiry
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
