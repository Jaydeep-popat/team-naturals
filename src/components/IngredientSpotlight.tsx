'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { staggerContainer, staggerItem } from './Reveal';

const ingredients = [
  {
    name: 'Neem',
    tagline: 'Nature\'s antibiotic',
    benefit: 'Purifies skin & fights acne-causing bacteria without stripping moisture',
    emoji: '🌿',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200/70',
    ring: 'ring-emerald-300/50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    accent: 'text-emerald-600',
    bar: 'bg-emerald-400',
    productSlug: 'neem-soap',
    productName: 'Neem Soap',
  },
  {
    name: 'Multani Mitti',
    tagline: 'Ancient clay cleanser',
    benefit: 'Draws out excess oil & impurities, leaves skin genuinely matte',
    emoji: '🪨',
    bg: 'bg-amber-50',
    border: 'border-amber-200/70',
    ring: 'ring-amber-300/50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    accent: 'text-amber-600',
    bar: 'bg-amber-400',
    productSlug: 'multani-mitti-soap',
    productName: 'Multani Mitti Soap',
  },
  {
    name: 'Orange',
    tagline: 'Citrus brightness boost',
    benefit: 'Vitamin C lifts tiredness and evens tone — real peel, not synthetic scent',
    emoji: '🍊',
    bg: 'bg-orange-50',
    border: 'border-orange-200/70',
    ring: 'ring-orange-300/50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    accent: 'text-orange-600',
    bar: 'bg-orange-400',
    productSlug: 'orange-soap',
    productName: 'Orange Soap',
  },
  {
    name: 'Coffee',
    tagline: 'Gentle exfoliator',
    benefit: 'Freshly ground coffee buffs away dead skin, boosting circulation as it goes',
    emoji: '☕',
    bg: 'bg-stone-50',
    border: 'border-stone-200/70',
    ring: 'ring-stone-300/50',
    iconBg: 'bg-stone-200',
    iconColor: 'text-stone-700',
    accent: 'text-stone-600',
    bar: 'bg-stone-500',
    productSlug: 'coffee-soap',
    productName: 'Coffee Soap',
  },
  {
    name: 'Rice Bran',
    tagline: 'Traditional softener',
    benefit: 'Inspired by rice-water rituals — gently brightens without irritating sensitive skin',
    emoji: '🌾',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200/70',
    ring: 'ring-yellow-300/50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
    accent: 'text-yellow-600',
    bar: 'bg-yellow-400',
    productSlug: 'rice-soap',
    productName: 'Rice Soap',
  },
  {
    name: 'Rose',
    tagline: 'Hydration & glow',
    benefit: 'Rosehip oil restores suppleness while real rose extract calms and softens',
    emoji: '🌹',
    bg: 'bg-rose-50',
    border: 'border-rose-200/70',
    ring: 'ring-rose-300/50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    accent: 'text-rose-600',
    bar: 'bg-rose-400',
    productSlug: 'rose-soap',
    productName: 'Rose Soap',
  },
];

export function IngredientSpotlight() {
  const [active, setActive] = React.useState(0);
  const ing = ingredients[active];

  return (
    <section aria-labelledby="ingredients-heading" className="w-full">
      {/* Section header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">What goes inside</p>
          <SectionHeading id="ingredients-heading" className="mt-2 text-center lg:text-left">
            Our Key Ingredients
          </SectionHeading>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-1 text-sm text-forest transition-colors hover:text-forest-soft"
        >
          See all products <ArrowRightIcon size={14} strokeWidth={1.8} />
        </Link>
      </div>

      {/* Desktop: two-panel interactive layout */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-5">
        {/* Left — ingredient selector list */}
        <div className="col-span-2 flex flex-col gap-2">
          {ingredients.map((item, i) => (
            <motion.button
              key={item.name}
              type="button"
              onClick={() => setActive(i)}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                active === i
                  ? `${item.bg} ${item.border} shadow-soft ring-2 ${item.ring}`
                  : 'border-forest/6 bg-white hover:border-forest/12 hover:bg-cream-soft/60'
              }`}
            >

              <span
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xl transition-colors ${
                  active === i ? item.iconBg : 'bg-forest-mist/60'
                }`}
              >
                {item.emoji}
              </span>
              <div className="min-w-0">
                <p className={`text-[14px] font-semibold transition-colors ${active === i ? 'text-forest' : 'text-ink'}`}>
                  {item.name}
                </p>
                <p className={`text-[11px] transition-colors ${active === i ? item.accent : 'text-muted'}`}>
                  {item.tagline}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right — detail card */}
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl border ${ing.border} ${ing.bg} p-8`}
        >
          {/* Top */}
          <div>
            <span className={`text-6xl`}>{ing.emoji}</span>
            <h3 className="mt-4 font-display text-3xl font-bold text-forest">{ing.name}</h3>
            <p className={`mt-1 text-sm font-medium ${ing.accent}`}>{ing.tagline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{ing.benefit}</p>
          </div>

          {/* Bottom — link to product */}
          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Found in</p>
              <p className="mt-0.5 font-display text-[17px] text-forest">{ing.productName}</p>
            </div>
            <Link
              href={`/product/${ing.productSlug}`}
              className={`inline-flex items-center gap-2 rounded-full ${ing.iconBg} px-5 py-2.5 text-[13px] font-semibold ${ing.iconColor} transition-all hover:shadow-soft`}
            >
              View Product <ArrowRightIcon size={13} strokeWidth={2} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Mobile: horizontal scroll-snap cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-none lg:hidden"
      >
        {ingredients.map((item) => (
          <motion.div
            key={item.name}
            variants={staggerItem}
            className={`flex w-52 flex-none snap-start flex-col gap-3 rounded-3xl border p-5 ${item.bg} ${item.border}`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <p className="font-display text-[16px] font-bold text-forest">{item.name}</p>
              <p className={`text-[11px] font-medium ${item.accent}`}>{item.tagline}</p>
              <p className="mt-2 text-[12px] leading-snug text-muted">{item.benefit}</p>
            </div>
            <Link
              href={`/product/${item.productSlug}`}
              className={`mt-auto inline-flex items-center gap-1 text-[12px] font-semibold ${item.iconColor}`}
            >
              {item.productName} <ArrowRightIcon size={11} strokeWidth={2.2} />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
