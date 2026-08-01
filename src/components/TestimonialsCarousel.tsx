'use client';

import React from 'react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react';
import { StarRating } from './StarRating';

// NOTE: Seed/mock data -- fictional UI placeholders only.
const testimonials = [
  {
    id: 't1',
    name: 'Ananya S.',
    location: 'Mumbai',
    rating: 5,
    product: 'Neem Soap',
    productEmoji: '🌿',
    quote:
      'My skin cleared up within two weeks of switching. The neem actually works -- no harsh stripping, just genuinely clean skin. I have tried so many products and this is the first one that delivered real results.',
    initials: 'AS',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-700',
    accentBar: 'bg-emerald-400',
    tagBg: 'bg-emerald-50',
    tagText: 'text-emerald-700',
  },
  {
    id: 't2',
    name: 'Vikram S.',
    location: 'Bangalore',
    rating: 5,
    product: 'Multani Mitti Face Wash',
    productEmoji: '🪨',
    quote:
      "Doesn't foam aggressively but face feels genuinely clean. The de-tanning effect is real -- two months in and my neck is visibly more even. I was skeptical about a clay wash but this converted me.",
    initials: 'VS',
    avatarBg: 'bg-amber-100',
    avatarText: 'text-amber-700',
    accentBar: 'bg-amber-400',
    tagBg: 'bg-amber-50',
    tagText: 'text-amber-700',
  },
  {
    id: 't3',
    name: 'Tanya D.',
    location: 'Delhi',
    rating: 5,
    product: 'Coffee Soap',
    productEmoji: '☕',
    quote:
      'Smells like a cafe and leaves skin polished. The scrub is gentle -- not scratchy at all. My whole family uses it now. Even my husband, who never cared about skincare, asks me to reorder.',
    initials: 'TD',
    avatarBg: 'bg-stone-200',
    avatarText: 'text-stone-700',
    accentBar: 'bg-stone-500',
    tagBg: 'bg-stone-50',
    tagText: 'text-stone-700',
  },
  {
    id: 't4',
    name: 'Ishita G.',
    location: 'Pune',
    rating: 5,
    product: 'Rice Soap',
    productEmoji: '🌾',
    quote:
      "The only bar my sensitive skin tolerates without any reaction. Skin feels like silk and I've been repurchasing for 3 months straight. It doesn't dry out my face at all -- absolute game changer.",
    initials: 'IG',
    avatarBg: 'bg-yellow-100',
    avatarText: 'text-yellow-700',
    accentBar: 'bg-yellow-400',
    tagBg: 'bg-yellow-50',
    tagText: 'text-yellow-700',
  },
  {
    id: 't5',
    name: 'Shreya L.',
    location: 'Chennai',
    rating: 5,
    product: 'Rose Soap',
    productEmoji: '🌹',
    quote:
      'Feels like a spa bar at a fraction of the price. Real rose scent, not synthetic -- and skin stays soft all day. I gifted one to my mother and she immediately ordered four more for herself.',
    initials: 'SL',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-600',
    accentBar: 'bg-rose-400',
    tagBg: 'bg-rose-50',
    tagText: 'text-rose-600',
  },
];

const AUTOPLAY_MS = 4500;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function TestimonialsCarousel() {
  const [[index, dir], setPage] = React.useState([0, 0]);
  const t = testimonials[index];

  // Auto-play
  React.useEffect(() => {
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index]);

  function paginate(newDir: number) {
    setPage(([prev]) => [
      (prev + newDir + testimonials.length) % testimonials.length,
      newDir,
    ]);
  }

  return (
    <section aria-labelledby="reviews-heading" className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">What people say</p>
          <SectionHeading className="mt-2" id="reviews-heading">
            Customer Reviews
          </SectionHeading>
        </div>

        {/* Aggregate rating pill */}
        <div className="flex items-center gap-3 rounded-full border border-forest/8 bg-cream-soft px-4 py-2 shadow-soft">
          <StarRating rating={4.8} size={14} />
          <div className="h-4 w-px bg-forest/10" />
          <span className="font-display text-[15px] font-semibold text-forest">4.8</span>
          <span className="text-[12px] text-muted">/ 5 &nbsp;&middot;&nbsp; 703 reviews</span>
        </div>
      </div>

      {/* ── Main carousel ── */}
      <div className="mt-10 grid gap-6 lg:grid-cols-5">

        {/* Large featured quote panel */}
        <div className="relative col-span-3 overflow-hidden rounded-3xl bg-forest px-8 py-10 sm:px-12">
          {/* Decorative quote mark */}
          <QuoteIcon
            size={64}
            strokeWidth={0.8}
            className="absolute right-8 top-6 text-cream/8"
            aria-hidden="true"
          />

          {/* Accent bar (colour per reviewer) */}
          <motion.div
            key={t.id + '-bar'}
            layoutId="accent-bar"
            className={`mb-6 h-1 w-14 rounded-full ${t.accentBar}`}
          />

          {/* Animated quote */}
          <div className="relative min-h-[140px]">
            <AnimatePresence custom={dir} mode="wait">
              <motion.blockquote
                key={t.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[19px] leading-[1.6] text-cream sm:text-[22px]"
              >
                &ldquo;{t.quote}&rdquo;
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Reviewer info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id + '-info'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="mt-8 flex items-center gap-4"
            >
              <span
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${t.avatarBg} ${t.avatarText}`}
              >
                {t.initials}
              </span>
              <div>
                <p className="text-[14px] font-semibold text-cream">{t.name}</p>
                <p className="text-[12px] text-cream/55">{t.location}</p>
              </div>
              <div className="ml-auto">
                <StarRating rating={t.rating} size={13} className="opacity-90" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next arrows */}
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => paginate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-cream/50 hover:text-cream"
            >
              <ChevronLeftIcon size={17} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => paginate(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-cream/50 hover:text-cream"
            >
              <ChevronRightIcon size={17} strokeWidth={2} />
            </button>

            {/* Dot indicators */}
            <div className="ml-2 flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setPage([i, i > index ? 1 : -1])}
                  className="relative h-1.5 overflow-hidden rounded-full transition-all duration-300"
                  style={{ width: i === index ? 24 : 6 }}
                >
                  <span className="absolute inset-0 rounded-full bg-cream/25" />
                  {i === index && (
                    <motion.span
                      layoutId="dot-fill"
                      className="absolute inset-0 rounded-full bg-cream"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Counter */}
            <span className="ml-auto text-[12px] tabular-nums text-cream/40">
              {index + 1} / {testimonials.length}
            </span>
          </div>
        </div>

        {/* Right — stacked mini cards */}
        <div className="col-span-2 flex flex-col gap-3">
          {testimonials.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setPage([i, i > index ? 1 : -1])}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                i === index
                  ? 'border-forest/15 bg-forest/5 shadow-soft'
                  : 'border-transparent bg-cream-soft/60 hover:border-forest/8 hover:bg-cream-soft'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${item.avatarBg} ${item.avatarText}`}
                >
                  {item.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[13px] font-semibold ${i === index ? 'text-forest' : 'text-ink'}`}>
                      {item.name}
                    </p>
                    <StarRating rating={item.rating} size={10} />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
                    {item.quote}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.tagBg} ${item.tagText}`}
                  >
                    {item.productEmoji} {item.product}
                  </span>
                </div>
              </div>
              {/* Active left border accent */}
              {i === index && (
                <motion.div
                  layoutId="mini-card-accent"
                  className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${item.accentBar}`}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
