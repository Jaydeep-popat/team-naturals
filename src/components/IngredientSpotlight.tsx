'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';

const ingredients = [
  {
    id: '01',
    name: 'Neem Extract',
    tagline: "Nature's Deep Purifier",
    badge: 'Acne Control',
    benefit: 'Purifies skin pores and combats acne-causing bacteria naturally without stripping essential oils.',
    gradient: 'from-emerald-900/90 via-emerald-800 to-teal-900',
    lightBg: 'bg-emerald-50',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.18)',
    productSlug: 'neem-soap',
    productName: 'Neem Soap',
  },
  {
    id: '02',
    name: 'Multani Mitti',
    tagline: 'Mineral Clay Cleanser',
    badge: 'Oil Balancing',
    benefit: 'Absorbs excess sebum, flushes out urban pollutants, and gives skin an all-day matte velvety feel.',
    gradient: 'from-amber-900/90 via-amber-800 to-yellow-900',
    lightBg: 'bg-amber-50',
    accentColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.18)',
    productSlug: 'multani-mitti-soap',
    productName: 'Multani Mitti Soap',
  },
  {
    id: '03',
    name: 'Orange Peel',
    tagline: 'Natural Vitamin C Boost',
    badge: 'Brightening',
    benefit: 'Packed with bioactive Vitamin C to gently lighten dark spots, revive dull skin, and restore glow.',
    gradient: 'from-orange-900/90 via-orange-800 to-amber-900',
    lightBg: 'bg-orange-50',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.18)',
    productSlug: 'orange-soap',
    productName: 'Orange Soap',
  },
  {
    id: '04',
    name: 'Artisanal Coffee',
    tagline: 'Circulation & Scrub',
    badge: 'Exfoliation',
    benefit: 'Finely roasted coffee granules buff away dead skin layers while caffeine stimulates micro-circulation.',
    gradient: 'from-stone-900/90 via-stone-800 to-zinc-900',
    lightBg: 'bg-stone-50',
    accentColor: '#876e5d',
    glowColor: 'rgba(135, 110, 93, 0.18)',
    productSlug: 'coffee-soap',
    productName: 'Coffee Soap',
  },
  {
    id: '05',
    name: 'Rice Bran',
    tagline: 'Gentle Smoothing Milk',
    badge: 'Softening',
    benefit: 'Enriched with gamma-oryzanol to nourish delicate skin barriers and leave texture silky soft.',
    gradient: 'from-yellow-900/90 via-amber-700 to-yellow-800',
    lightBg: 'bg-yellow-50',
    accentColor: '#ca8a04',
    glowColor: 'rgba(202, 138, 4, 0.18)',
    productSlug: 'rice-soap',
    productName: 'Rice Soap',
  },
  {
    id: '06',
    name: 'French Rose',
    tagline: 'Floral Moisture Lock',
    badge: 'Deep Hydration',
    benefit: 'Pure rose distillate calms redness, locks in hydration, and leaves a subtle, elegant natural scent.',
    gradient: 'from-rose-900/90 via-rose-800 to-pink-900',
    lightBg: 'bg-rose-50',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.18)',
    productSlug: 'rose-soap',
    productName: 'Rose Soap',
  },
];

export function IngredientSpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section aria-labelledby="ingredients-heading" className="relative w-full overflow-hidden py-4">
      {/* Header with Navigation Controls */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-forest">
            <SparklesIcon size={12} className="text-terracotta" />
            Pure &amp; Bioactive
          </div>
          <SectionHeading id="ingredients-heading" className="mt-2">
            Our Key Ingredients
          </SectionHeading>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="group hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest transition-colors hover:text-terracotta sm:inline-flex"
          >
            See All Products <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 bg-white text-forest transition-all shadow-sm ${
                !canScrollLeft ? 'opacity-40 cursor-not-allowed' : 'hover:bg-forest hover:text-white hover:border-forest active:scale-95'
              }`}
              aria-label="Previous ingredients"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 bg-white text-forest transition-all shadow-sm ${
                !canScrollRight ? 'opacity-40 cursor-not-allowed' : 'hover:bg-forest hover:text-white hover:border-forest active:scale-95'
              }`}
              aria-label="Next ingredients"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Colorful Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none"
      >
        {ingredients.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative flex w-[300px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[2.2rem] bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-forest/8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] sm:w-[340px]"
          >
            {/* Top Glow Background accent on hover */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ backgroundColor: item.accentColor }}
            />

            <div>
              {/* Top Row: Index Badge & Feature Pill */}
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${item.accentColor}15`, color: item.accentColor }}
                >
                  {item.id}
                </span>

                <span
                  className="rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors"
                  style={{ backgroundColor: `${item.accentColor}12`, color: item.accentColor }}
                >
                  {item.badge}
                </span>
              </div>

              {/* Title Card Header */}
              <div className="mt-6">
                <h3 className="font-display text-2xl font-bold tracking-tight text-forest transition-colors group-hover:text-terracotta">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs font-semibold tracking-wide" style={{ color: item.accentColor }}>
                  {item.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs leading-relaxed text-forest/75 font-medium">
                {item.benefit}
              </p>
            </div>

            {/* Bottom Card Action */}
            <div className="mt-8 pt-4 border-t border-forest/8">
              <Link
                href={`/product/${item.productSlug}`}
                className="group/link flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-300"
                style={{ backgroundColor: `${item.accentColor}10`, color: item.accentColor }}
              >
                <span>Found in {item.productName}</span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover/link:translate-x-1"
                  style={{ backgroundColor: item.accentColor }}
                >
                  <ArrowRightIcon size={12} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
