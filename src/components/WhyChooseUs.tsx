'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { HandHeartIcon, LeafIcon, DropletIcon, SparklesIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';

const reasons = [
  {
    title: 'No palm oil',
    description:
      'Our soaps and face wash are made without palm oil — a choice we made for how the bars feel on skin, not for a label.',
    icon: LeafIcon,
    accent: '#16a34a',
    accentBg: '#f0fdf4',
    accentBorder: '#bbf7d0',
    gradientFrom: '#f0fdf4',
    gradientTo: '#dcfce7',
  },
  {
    title: 'No harsh chemicals',
    description:
      'No synthetic fragrance overload or aggressive surfactants. Cleansing that does not leave skin tight or stripped.',
    icon: DropletIcon,
    accent: '#0e7490',
    accentBg: '#ecfeff',
    accentBorder: '#a5f3fc',
    gradientFrom: '#ecfeff',
    gradientTo: '#cffafe',
  },
  {
    title: 'Handmade in small batches',
    description:
      'Poured, cut, and wrapped by hand. Each run is small enough that we know exactly what went into every bar.',
    icon: HandHeartIcon,
    accent: '#b45309',
    accentBg: '#fffbeb',
    accentBorder: '#fde68a',
    gradientFrom: '#fffbeb',
    gradientTo: '#fef3c7',
  },
  {
    title: 'Ingredients you can name',
    description:
      'Neem, rose, multani mitti, coffee, rice — plus a clay face wash for daily cleansing and de-tanning.',
    icon: SparklesIcon,
    accent: '#be185d',
    accentBg: '#fdf2f8',
    accentBorder: '#fbcfe8',
    gradientFrom: '#fdf2f8',
    gradientTo: '#fce7f3',
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
      className="group relative flex flex-col overflow-hidden rounded-[24px] border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:rounded-[28px] sm:p-7"
      style={{ borderColor: reason.accentBorder }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[24px] sm:rounded-[28px]"
        style={{ background: `linear-gradient(160deg, ${reason.gradientFrom}, ${reason.gradientTo})` }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]"
        aria-hidden
      >
        <Icon size={100} strokeWidth={1} style={{ color: reason.accent }} />
      </div>

      <div
        className="relative z-10 mb-4 flex h-[48px] w-[48px] items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-[52px] sm:w-[52px]"
        style={{ backgroundColor: reason.accentBg, boxShadow: `0 2px 12px ${reason.accent}22` }}
      >
        <Icon size={22} strokeWidth={1.6} style={{ color: reason.accent }} />
      </div>

      <div
        className="relative z-10 mb-4 h-[1.5px] w-10 rounded-full sm:my-4"
        style={{ backgroundColor: reason.accentBorder }}
      />

      <h3 className="relative z-10 font-display text-[17px] font-semibold leading-snug text-forest sm:text-[18px]">
        {reason.title}
      </h3>
      <p className="relative z-10 mt-2 text-[13px] leading-relaxed text-muted/90">
        {reason.description}
      </p>
    </motion.div>
  );
}

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="w-full">
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Why Team Naturals</p>
        <SectionHeading className="mt-2" id="why-heading">
          What goes into every batch
        </SectionHeading>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted/80">
          No palm oil. No harsh chemicals. Handmade soaps and a clay face wash — nothing we cannot
          explain in plain words.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {reasons.map((reason, idx) => (
          <Card key={reason.title} reason={reason} idx={idx} />
        ))}
      </div>
    </section>
  );
}
