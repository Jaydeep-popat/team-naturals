'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { SparklesIcon, LeafIcon, RabbitIcon, DropletIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';

const reasons = [
  {
    title: '100% Natural',
    description: 'No synthetic fragrances, artificial colors, or cheap fillers. Just plant-based ingredients your skin recognizes and thrives on.',
    icon: LeafIcon,
    accent: '#16a34a',
    accentBg: '#f0fdf4',
    accentBorder: '#bbf7d0',
    gradientFrom: '#f0fdf4',
    gradientTo: '#dcfce7',
    stat: '0',
    statLabel: 'synthetic ingredients',
  },
  {
    title: 'Cold-Processed',
    description: 'Slow-cured for 42 days to lock in natural glycerin and every active nutrient — not destroyed by heat like most commercial bars.',
    icon: DropletIcon,
    accent: '#0e7490',
    accentBg: '#ecfeff',
    accentBorder: '#a5f3fc',
    gradientFrom: '#ecfeff',
    gradientTo: '#cffafe',
    stat: '42',
    statLabel: 'days minimum cure',
  },
  {
    title: 'Cruelty-Free',
    description: 'Tested on real people, never on animals. Ingredients ethically sourced from farms we actually visit and vet ourselves.',
    icon: RabbitIcon,
    accent: '#b45309',
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
    gradientFrom: '#fffbeb',
    gradientTo: '#fef3c7',
    stat: '100%',
    statLabel: 'cruelty-free always',
  },
  {
    title: 'Handmade in Small Batches',
    description: 'Poured, cut, and wrapped by hand. Every bar is traceable to its exact production batch — no factory floor involved.',
    icon: SparklesIcon,
    accent: '#be185d',
    accentBg: '#fdf2f8',
    accentBorder: '#fbcfe8',
    gradientFrom: '#fdf2f8',
    gradientTo: '#fce7f3',
    stat: '703+',
    statLabel: 'bars hand-cut to date',
  },
];

function Card({ reason, idx }: { reason: typeof reasons[0]; idx: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = reason.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{ borderColor: reason.accentBorder }}
    >
      {/* Gradient fill from bottom on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[28px]"
        style={{ background: `linear-gradient(160deg, ${reason.gradientFrom}, ${reason.gradientTo})` }}
        aria-hidden
      />

      {/* Decorative large icon watermark */}
      <div
        className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]"
        aria-hidden
      >
        <Icon size={100} strokeWidth={1} style={{ color: reason.accent }} />
      </div>

      {/* Icon badge */}
      <div
        className="relative z-10 mb-5 flex h-13 w-13 h-[52px] w-[52px] items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: reason.accentBg, boxShadow: `0 2px 12px ${reason.accent}22` }}
      >
        <Icon size={22} strokeWidth={1.6} style={{ color: reason.accent }} />
      </div>

      {/* Stat */}
      <p
        className="relative z-10 font-display text-4xl font-bold leading-none tracking-tight"
        style={{ color: reason.accent }}
      >
        {reason.stat}
      </p>
      <p className="relative z-10 mt-1 text-[10px] uppercase tracking-[0.2em] text-muted/70">{reason.statLabel}</p>

      {/* Separator */}
      <div
        className="relative z-10 my-4 h-[1.5px] w-10 rounded-full"
        style={{ backgroundColor: reason.accentBorder }}
      />

      {/* Text */}
      <h3 className="relative z-10 font-display text-[18px] font-semibold leading-snug text-forest">
        {reason.title}
      </h3>
      <p className="relative z-10 mt-2.5 text-[13px] leading-relaxed text-muted/90">
        {reason.description}
      </p>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="w-full">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">The difference</p>
        <SectionHeading className="mt-2" id="why-heading">
          Why Choose Us
        </SectionHeading>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted/80">
          Skincare that earns trust through ingredients and process, not promises.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((reason, idx) => (
          <Card key={reason.title} reason={reason} idx={idx} />
        ))}
      </div>
    </section>
  );
}
