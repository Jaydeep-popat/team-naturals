'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DropletsIcon,
  FlaskConicalOffIcon,
  HandHeartIcon,
  LeafIcon,
  PaletteIcon,
  RabbitIcon,
} from 'lucide-react';
import { staggerContainer, staggerItem } from './Reveal';

const promises = [
  { icon: HandHeartIcon, label: 'Handmade' },
  { icon: LeafIcon, label: 'Natural Ingredients' },
  { icon: FlaskConicalOffIcon, label: 'No Harsh Chemicals' },
  { icon: RabbitIcon, label: 'Cruelty Free' },
  { icon: DropletsIcon, label: 'Skin Friendly' },
  { icon: PaletteIcon, label: 'No Artificial Colors' },
];

export function PromiseBanner({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`rounded-3xl bg-forest px-5 text-cream ${compact ? 'py-8' : 'py-12 sm:py-16'}`}
      aria-labelledby="promise-heading"
    >
      {!compact && (
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cream/60">Our Promise</p>
          <h2 id="promise-heading" className="mt-3 font-display text-3xl sm:text-4xl">
            Made the slow way, always
          </h2>
        </div>
      )}
      {compact && (
        <h2 id="promise-heading" className="sr-only">
          Our promise
        </h2>
      )}
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mx-auto grid max-w-5xl grid-cols-3 gap-y-8 sm:grid-cols-6"
      >
        {promises.map(({ icon: Icon, label }) => (
          <motion.li
            key={label}
            variants={staggerItem}
            className="flex flex-col items-center gap-3 px-2 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/25">
              <Icon size={20} strokeWidth={1.3} />
            </span>
            <span className="text-[11px] leading-tight text-cream/85 sm:text-xs">{label}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}