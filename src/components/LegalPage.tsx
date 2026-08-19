'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, PhoneIcon, ArrowRightIcon } from 'lucide-react';
import { Reveal } from '@/src/components/Reveal';

interface Section {
  id: string;
  label: string;
}

interface LegalPageProps {
  title: string;
  badge: string;
  description: string;
  sections: Section[];
  children: React.ReactNode;
}

export function LegalPage({ title, description, sections, children }: LegalPageProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const entries: Record<string, number> = {};
    observerRef.current = new IntersectionObserver(
      (observed) => {
        observed.forEach((entry) => {
          entries[entry.target.id] = entry.intersectionRatio;
        });
        const top = Object.entries(entries).sort((a, b) => b[1] - a[1])[0];
        if (top && top[1] > 0) setActiveId(top[0]);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const handleJump = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-cream overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest via-[#1a3526] to-[#0f2219] pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 10% 80%, rgba(212,169,106,0.15) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(139,191,159,0.12) 0%, transparent 55%)' }}
        />
        {/* Large decorative letter */}
        <p
          className="pointer-events-none absolute -bottom-10 right-0 select-none font-display font-extrabold leading-none text-white/[0.03]"
          style={{ fontSize: 'clamp(8rem, 25vw, 22rem)' }}
          aria-hidden="true"
        >
          {title.charAt(0)}
        </p>

        <div className="relative mx-auto max-w-5xl px-5 lg:px-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-cream/50 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cream/80">{title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-sm font-medium leading-relaxed text-cream/60 sm:text-base">
              {description}
            </p>
          </motion.div>

          {/* Section count badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/8 px-4 py-2 text-xs font-semibold text-cream/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cream/50" />
            {sections.length} sections
          </motion.div>
        </div>
      </section>

      {/* ─── Mobile TOC ─── */}
      <div className="sticky top-[64px] z-30 border-b border-forest/8 bg-white/95 backdrop-blur px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-forest/12 bg-cream-soft px-4 py-2.5 text-sm font-semibold text-forest"
          aria-expanded={mobileOpen}
        >
          <span>Jump to section</span>
          <motion.span animate={{ rotate: mobileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDownIcon size={16} strokeWidth={2} />
          </motion.span>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="mt-2 rounded-xl border border-forest/8 bg-white overflow-hidden divide-y divide-forest/5 shadow-soft">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => handleJump(s.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-forest/75 hover:bg-forest/5 hover:text-forest text-left transition-colors"
                    >
                      <span className="w-5 text-[11px] font-bold text-forest/25">{String(i + 1).padStart(2, '0')}</span>
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Main 2-column layout ─── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="flex gap-12 xl:gap-20">

          {/* Sticky sidebar TOC — desktop */}
          <aside className="hidden lg:block w-52 xl:w-60 shrink-0">
            <div className="sticky top-28">
              <div className="mb-5 flex items-center gap-2">
                <div className="h-px flex-1 bg-forest/10" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Contents</p>
                <div className="h-px flex-1 bg-forest/10" />
              </div>
              <ul className="space-y-0.5">
                {sections.map((s, i) => {
                  const isActive = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => handleJump(s.id)}
                        className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                          isActive ? 'bg-forest text-cream' : 'text-muted hover:text-forest hover:bg-forest/5'
                        }`}
                      >
                        <span className={`mt-px shrink-0 text-[10px] font-bold ${isActive ? 'text-cream/60' : 'text-muted/35 group-hover:text-forest/40'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="leading-snug">{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Content area */}
          <div className="min-w-0 flex-1">
            {/* Section divider style */}
            <div className="space-y-0">
              {children}
            </div>

            {/* CTA */}
            <Reveal className="mt-20">
              <div className="relative overflow-hidden rounded-3xl bg-forest px-8 py-12 text-center sm:px-12">
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #D4A96A, transparent 60%)' }}
                />
                <PhoneIcon size={32} className="relative mx-auto text-cream/40" strokeWidth={1.5} />
                <h2 className="relative mt-4 font-display text-2xl font-bold text-cream sm:text-3xl">Have a Question?</h2>
                <p className="relative mx-auto mt-3 max-w-sm text-sm text-cream/60">
                  Reach out to us directly — we typically respond within a few hours on working days.
                </p>
                <Link
                  href="/contact"
                  className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-white"
                >
                  Contact Support <ArrowRightIcon size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
}

/** A single legal section — editorial style with large faded number + left accent border */
export function LegalSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section
        id={id}
        className="scroll-mt-32 border-b border-forest/8 py-10 first:pt-0 last:border-0"
      >
        <div className="flex items-start gap-4 mb-5">
          {/* Large faded section number */}
          {number && (
            <span className="hidden shrink-0 font-display text-6xl font-extrabold leading-none text-forest/8 select-none sm:block" aria-hidden="true">
              {number}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {/* Left-border accent heading */}
            <div className="border-l-4 border-forest pl-4">
              <h2 className="font-display text-xl font-bold text-forest sm:text-2xl">{title}</h2>
            </div>
          </div>
        </div>

        <div className="ml-0 sm:ml-[4.5rem] space-y-3 text-sm leading-relaxed text-forest/70 sm:text-[15px]">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

/** Highlighted TODO placeholder */
export function TodoPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[13px] font-semibold text-amber-700">
      ⚠ {children}
    </span>
  );
}
