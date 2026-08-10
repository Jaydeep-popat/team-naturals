'use client';

import React from 'react';
import { motion, useInView, useSpring, AnimatePresence } from 'framer-motion';
import {
  DropletsIcon,
  FlaskConicalOffIcon,
  HandHeartIcon,
  LeafIcon,
  PaletteIcon,
  RabbitIcon,
  RecycleIcon,
  PackageIcon,
  ShieldCheckIcon,
} from 'lucide-react';

const promises = [
  { icon: HandHeartIcon, label: 'Handmade', detail: 'By hand, every bar' },
  { icon: LeafIcon, label: 'Natural Ingredients', detail: 'Nothing synthetic' },
  { icon: FlaskConicalOffIcon, label: 'No Harsh Chemicals', detail: 'Safe for skin' },
  { icon: RabbitIcon, label: 'Cruelty Free', detail: 'Never on animals' },
  { icon: DropletsIcon, label: 'Skin Friendly', detail: 'Barrier-safe formula' },
  { icon: PaletteIcon, label: 'No Artificial Colors', detail: 'Natural pigments only' },
];

const ecoFacts = [
  { icon: RecycleIcon, label: 'Recyclable Packaging', sub: 'Zero unnecessary plastic' },
  { icon: PackageIcon, label: 'Small-Batch Traced', sub: 'Every bar has a production date' },
  { icon: ShieldCheckIcon, label: 'Ethically Sourced', sub: '12+ partner farms' },
];

export function PromiseBanner({ compact = false }: { compact?: boolean }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden rounded-3xl bg-forest px-5 text-cream ${compact ? 'py-8' : 'py-14 sm:py-20'}`}
      aria-labelledby="promise-heading"
    >
      {/* Ambient decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-terracotta/10 blur-[80px]" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cream/5 blur-[80px]" aria-hidden />

      {!compact && (
        <div className="relative z-10 mx-auto mb-12 max-w-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cream/50">Our Promise</p>
          <h2 id="promise-heading" className="mt-3 font-display text-3xl sm:text-4xl">
            Made the slow way, always.
          </h2>
          <p className="mt-3 text-sm text-cream/60 leading-relaxed max-w-sm mx-auto">
            Six commitments we make to every bar we produce — no exceptions, no shortcuts.
          </p>
        </div>
      )}
      {compact && <h2 id="promise-heading" className="sr-only">Our promise</h2>}

      {/* Promise icons — grid */}
      <ul className="relative z-10 mx-auto grid max-w-4xl grid-cols-3 gap-y-8 sm:grid-cols-6">
        {promises.map(({ icon: Icon, label, detail }, i) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center gap-3 px-2 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition-colors duration-300 group-hover:border-terracotta/60 group-hover:bg-terracotta/10">
              <Icon size={20} strokeWidth={1.3} />
            </span>
            <span className="text-[11px] leading-tight text-cream/85 sm:text-xs">{label}</span>
          </motion.li>
        ))}
      </ul>

      {/* Eco-friendly strip */}
      {!compact && (
        <div className="relative z-10 mx-auto mt-12 max-w-3xl">
          <div className="h-px w-full bg-cream/10 mb-8" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ecoFacts.map(({ icon: Icon, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 rounded-2xl border border-cream/10 bg-cream/5 px-5 py-4 backdrop-blur-sm"
              >
                <div className="mt-0.5 shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta/20 text-terracotta">
                  <Icon size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-cream">{label}</p>
                  <p className="text-[11px] text-cream/50 mt-0.5">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}