'use client';

import React from 'react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, QuoteIcon } from 'lucide-react';
import { StarRating } from './StarRating';

// NOTE: Seed/mock data — fictional UI placeholders only.
const testimonials = [
  {
    id: 't1',
    name: 'Ananya S.',
    location: 'Mumbai',
    rating: 5,
    product: 'Neem Soap',
    quote:
      'Switched to the neem bar and breakouts calmed down. Skin feels clean, not tight.',
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
    quote:
      'Does not foam much, but my face feels actually clean. Neck looks more even after two months.',
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
    quote:
      'Coffee scent is real, not synthetic. Gentle scrub — my family keeps reordering.',
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
    quote:
      'Only bar my sensitive skin tolerates. Soft finish, no reaction — I have repurchased three times.',
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
    quote:
      'Rose scent from actual rose, not perfume. Skin stays comfortable through the day.',
    initials: 'SL',
    avatarBg: 'bg-rose-100',
    avatarText: 'text-rose-600',
    accentBar: 'bg-rose-400',
    tagBg: 'bg-rose-50',
    tagText: 'text-rose-600',
  },
];

const AUTOPLAY_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function TestimonialsCarousel() {
  const [[index, dir], setPage] = React.useState([0, 0]);
  const t = testimonials[index];

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">From customers</p>
          <SectionHeading className="mt-2" id="reviews-heading">
            Reviews on our soaps and face wash
          </SectionHeading>
        </div>
        <p className="text-[12px] text-muted sm:text-right">
          [NEEDS INPUT: verified review count]
        </p>
      </div>

      {/* Mobile: single featured card */}
      <div className="mt-5 lg:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-forest px-5 py-6">
          <QuoteIcon
            size={48}
            strokeWidth={0.8}
            className="absolute right-4 top-4 text-cream/10"
            aria-hidden="true"
          />
          <motion.div
            key={t.id + '-bar-mobile'}
            className={`mb-4 h-1 w-12 rounded-full ${t.accentBar}`}
          />
          <AnimatePresence custom={dir} mode="wait">
            <motion.blockquote
              key={t.id + '-mobile'}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[17px] leading-[1.55] text-cream"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-5 flex items-center gap-3">
            <span
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${t.avatarBg} ${t.avatarText}`}
            >
              {t.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-cream">{t.name}</p>
              <p className="text-[11px] text-cream/55">{t.location}</p>
            </div>
            <StarRating rating={t.rating} size={12} className="opacity-90" />
          </div>
          <span
            className={`mt-4 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${t.tagBg} ${t.tagText}`}
          >
            {t.product}
          </span>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous review"
                onClick={() => paginate(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 text-cream/80"
              >
                <ChevronLeftIcon size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Next review"
                onClick={() => paginate(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/25 text-cream/80"
              >
                <ChevronRightIcon size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => setPage([i, i > index ? 1 : -1])}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-5 bg-cream' : 'w-1.5 bg-cream/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: horizontal strip of other reviews */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage([i, i > index ? 1 : -1])}
              className={`flex min-w-[140px] max-w-[160px] flex-shrink-0 flex-col rounded-xl border p-3 text-left transition-colors ${
                i === index
                  ? 'border-forest/20 bg-forest/5'
                  : 'border-forest/8 bg-cream-soft/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${item.avatarBg} ${item.avatarText}`}
                >
                  {item.initials}
                </span>
                <p className="text-[12px] font-semibold text-forest">{item.name}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">
                {item.quote}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: split layout */}
      <div className="mt-8 hidden gap-6 lg:grid lg:grid-cols-5">
        <div className="relative col-span-3 overflow-hidden rounded-3xl bg-forest px-10 py-10">
          <QuoteIcon
            size={64}
            strokeWidth={0.8}
            className="absolute right-8 top-6 text-cream/8"
            aria-hidden="true"
          />
          <motion.div
            key={t.id + '-bar'}
            layoutId="accent-bar"
            className={`mb-6 h-1 w-14 rounded-full ${t.accentBar}`}
          />
          <div className="relative min-h-[120px]">
            <AnimatePresence custom={dir} mode="wait">
              <motion.blockquote
                key={t.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[22px] leading-[1.6] text-cream"
              >
                &ldquo;{t.quote}&rdquo;
              </motion.blockquote>
            </AnimatePresence>
          </div>
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
            <span className="ml-auto text-[12px] tabular-nums text-cream/40">
              {index + 1} / {testimonials.length}
            </span>
          </div>
        </div>

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
                    <p
                      className={`text-[13px] font-semibold ${
                        i === index ? 'text-forest' : 'text-ink'
                      }`}
                    >
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
                    {item.product}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
