'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';

const ingredients = [
  {
    name: 'Neem',
    tagline: "Nature's antibiotic",
    benefit: 'Purifies skin & fights acne-causing bacteria without stripping moisture.',
    emoji: '🌿',
    color: '#16a34a',
    lightBg: '#f0fdf4',
    border: '#bbf7d0',
    productSlug: 'neem-soap',
    productName: 'Neem Soap',
  },
  {
    name: 'Multani Mitti',
    tagline: 'Ancient clay cleanser',
    benefit: 'Draws out excess oil & impurities, leaves skin genuinely matte all day.',
    emoji: '🪨',
    color: '#b45309',
    lightBg: '#fffbeb',
    border: '#fde68a',
    productSlug: 'multani-mitti-soap',
    productName: 'Multani Mitti Soap',
  },
  {
    name: 'Orange',
    tagline: 'Citrus brightness boost',
    benefit: 'Vitamin C lifts tiredness and evens tone — real peel, not synthetic scent.',
    emoji: '🍊',
    color: '#ea580c',
    lightBg: '#fff7ed',
    border: '#fed7aa',
    productSlug: 'orange-soap',
    productName: 'Orange Soap',
  },
  {
    name: 'Coffee',
    tagline: 'Gentle exfoliator',
    benefit: 'Freshly ground coffee buffs away dead skin, boosting circulation as it goes.',
    emoji: '☕',
    color: '#78716c',
    lightBg: '#fafaf9',
    border: '#d6d3d1',
    productSlug: 'coffee-soap',
    productName: 'Coffee Soap',
  },
  {
    name: 'Rice Bran',
    tagline: 'Traditional softener',
    benefit: 'Inspired by rice-water rituals — gently brightens without irritating sensitive skin.',
    emoji: '🌾',
    color: '#ca8a04',
    lightBg: '#fefce8',
    border: '#fef08a',
    productSlug: 'rice-soap',
    productName: 'Rice Soap',
  },
  {
    name: 'Rose',
    tagline: 'Hydration & glow',
    benefit: 'Rosehip oil restores suppleness while real rose extract calms and softens.',
    emoji: '🌹',
    color: '#e11d48',
    lightBg: '#fff1f2',
    border: '#fecdd3',
    productSlug: 'rose-soap',
    productName: 'Rose Soap',
  },
];

const AUTO_INTERVAL = 3200;

export function IngredientSpotlight() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ing = ingredients[active];

  const next = useCallback(() => {
    setActive((a) => (a + 1) % ingredients.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section aria-labelledby="ingredients-heading" className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">What goes inside</p>
          <SectionHeading id="ingredients-heading" className="mt-2">
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

      {/* Desktop: two-panel */}
      <div
        className="hidden lg:grid lg:grid-cols-5 gap-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Selector list */}
        <div className="col-span-2 flex flex-col gap-2">
          {ingredients.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 ${
                active === i
                  ? 'border-current shadow-soft ring-2'
                  : 'border-forest/6 bg-white hover:border-forest/12 hover:bg-cream-soft/60'
              }`}
              style={
                active === i
                  ? {
                      backgroundColor: item.lightBg,
                      borderColor: item.border,
                      boxShadow: `0 0 0 2px ${item.border}`,
                    }
                  : {}
              }
            >
              {/* Active fill progress bar */}
              {active === i && !paused && (
                <motion.div
                  key={`${i}-progress`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                style={active === i ? { backgroundColor: item.border } : { backgroundColor: '#f0f4f0' }}
              >
                {item.emoji}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-forest">{item.name}</p>
                <p className="text-[11px] text-muted" style={active === i ? { color: item.color } : {}}>
                  {item.tagline}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail card */}
        <div className="col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-8"
              style={{ backgroundColor: ing.lightBg, borderColor: ing.border }}
            >
              <div>
                <span className="text-6xl" style={{ willChange: 'auto' }}>{ing.emoji}</span>
                <h3 className="mt-4 font-display text-3xl font-bold text-forest">{ing.name}</h3>
                <p className="mt-1 text-sm font-medium" style={{ color: ing.color }}>{ing.tagline}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{ing.benefit}</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Found in</p>
                  <p className="mt-0.5 font-display text-[17px] text-forest">{ing.productName}</p>
                </div>
                <Link
                  href={`/product/${ing.productSlug}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all hover:shadow-soft"
                  style={{ backgroundColor: ing.border, color: ing.color }}
                >
                  View Product <ArrowRightIcon size={13} strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: horizontal snap */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-none lg:hidden">
        {ingredients.map((item, i) => (
          <div
            key={item.name}
            className="flex w-52 flex-none snap-start flex-col gap-3 rounded-3xl border p-5"
            style={{ backgroundColor: item.lightBg, borderColor: item.border }}
          >
            <span className="text-3xl">{item.emoji}</span>
            <div>
              <p className="font-display text-[16px] font-bold text-forest">{item.name}</p>
              <p className="text-[11px] font-medium" style={{ color: item.color }}>{item.tagline}</p>
              <p className="mt-2 text-[12px] leading-snug text-muted">{item.benefit}</p>
            </div>
            <Link
              href={`/product/${item.productSlug}`}
              className="mt-auto inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: item.color }}
            >
              {item.productName} <ArrowRightIcon size={11} strokeWidth={2.2} />
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile dot indicator */}
      <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
        {ingredients.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-5 bg-forest' : 'w-1.5 bg-forest/20'
            }`}
            aria-label={`Show ingredient ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
