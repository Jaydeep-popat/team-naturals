'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, LeafIcon, RabbitIcon, DropletIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from './Reveal';

const reasons = [
  {
    title: '100% Natural',
    description: 'No synthetic fragrances, artificial colors, or cheap fillers. Just plant-based ingredients your skin recognizes.',
    icon: LeafIcon,
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
  },
  {
    title: 'Cold-Processed',
    description: 'Cured slowly over 4 weeks to preserve the natural glycerin and active nutrients of every ingredient.',
    icon: DropletIcon,
    bg: 'bg-blue-50',
    color: 'text-blue-700',
  },
  {
    title: 'Cruelty-Free',
    description: 'Tested on real people, never on animals. We source ingredients ethically and responsibly.',
    icon: RabbitIcon,
    bg: 'bg-amber-50',
    color: 'text-amber-700',
  },
  {
    title: 'Handmade in Small Batches',
    description: 'Poured, cut, and wrapped by hand to ensure the highest quality in every single bar.',
    icon: SparklesIcon,
    bg: 'bg-rose-50',
    color: 'text-rose-700',
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="w-full">
      <Reveal className="text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">The difference</p>
          <SectionHeading className="mt-2" id="why-heading">
            Why Choose Us
          </SectionHeading>
        </div>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {reasons.map((reason) => (
          <motion.div
            key={reason.title}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-forest/8 bg-white p-6 text-center shadow-soft hover:shadow-lift"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full ${reason.bg} ${reason.color}`}
            >
              <reason.icon size={24} strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-display text-[17px] font-semibold text-forest">{reason.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{reason.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
