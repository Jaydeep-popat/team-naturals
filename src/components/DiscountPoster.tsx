'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, SparklesIcon, TagIcon, ZapIcon } from 'lucide-react';

// Countdown hook — starts at zeros on server to avoid hydration mismatch,
// then switches to real values after client mount.
function useCountdown(targetDate: Date) {
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    function calc() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { h: 0, m: 0, s: 0 };
      return {
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      };
    }
    // Set immediately on mount, then every second
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center gap-1">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={display}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 14, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-[22px] font-bold text-cream backdrop-blur-sm sm:h-14 sm:w-14 sm:text-[26px]"
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/60">{label}</span>
    </div>
  );
}

const offers = [
  {
    id: 'o1',
    badge: 'Special Offer',
    headline: 'Up to 30% Off',
    sub: 'On all Soap Bars',
    code: 'SOAP30',
    href: '/shop/soaps',
    accent: 'bg-terracotta',
    icon: TagIcon,
  },
  {
    id: 'o2',
    badge: 'New Arrivals',
    headline: 'Face Wash Bundle',
    sub: 'Buy 2, Get 1 Free',
    code: 'FW3FOR2',
    href: '/shop/face-wash',
    accent: 'bg-forest-soft',
    icon: SparklesIcon,
  },
];

export function DiscountPoster() {
  // End of day sale — resets every 24 hours
  const target = React.useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  }, []);
  const { h, m, s } = useCountdown(target);

  return (
    <section aria-labelledby="discount-heading" className="w-full overflow-hidden">
      {/* Main banner */}
      <div className="relative overflow-hidden rounded-3xl bg-forest">
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-forest-soft/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-terracotta/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cream/5"
        />

        <div className="relative grid gap-0 sm:grid-cols-2">
          {/* Left — headline + countdown */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold"
            >
              <ZapIcon size={10} strokeWidth={2.5} className="fill-gold" />
              Today Only
            </motion.span>

            <motion.h2
              id="discount-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-display text-[38px] font-bold leading-[1.05] text-cream sm:text-[48px]"
            >
              Big Naturals
              <br />
              <span className="text-gold">Sale Event</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70"
            >
              Up to 30% off handmade soaps and our clay face wash. All natural, all on sale — for
              today only.
            </motion.p>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-cream/50">
                Sale ends in
              </p>
              <div className="flex items-end gap-2">
                <CountdownUnit value={h} label="Hrs" />
                <span className="mb-3 text-xl font-bold text-cream/40">:</span>
                <CountdownUnit value={m} label="Min" />
                <span className="mb-3 text-xl font-bold text-cream/40">:</span>
                <CountdownUnit value={s} label="Sec" />
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-cream/90"
              >
                Shop the Sale <ArrowRightIcon size={15} strokeWidth={2} />
              </Link>
            </motion.div>
          </div>

          {/* Right — offer mini-cards */}
          <div className="flex flex-col justify-center gap-4 border-t border-cream/8 p-8 sm:border-l sm:border-t-0 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50">Active deals</p>
            {offers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={offer.href}
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-cream/10 bg-white/8 p-4 backdrop-blur-sm transition-colors hover:bg-white/12"
                >
                  {/* Icon circle */}
                  <span
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${offer.accent} text-cream`}
                  >
                    <offer.icon size={18} strokeWidth={1.6} />
                  </span>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-cream/50">
                      {offer.badge}
                    </p>
                    <p className="font-display text-[17px] font-semibold leading-tight text-cream">
                      {offer.headline}
                    </p>
                    <p className="text-[12px] text-cream/65">{offer.sub}</p>
                  </div>
                  {/* Coupon code */}
                  <div className="flex-shrink-0 text-right">
                    <span className="inline-block rounded-lg border border-dashed border-cream/25 px-2.5 py-1 font-mono text-[11px] font-bold text-gold tracking-wider">
                      {offer.code}
                    </span>
                    <ArrowRightIcon
                      size={14}
                      strokeWidth={2}
                      className="mt-1 ml-auto text-cream/40 transition-transform group-hover:translate-x-0.5 group-hover:text-cream/70"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Bottom note */}
            <p className="text-[11px] leading-relaxed text-cream/35">
              Offers valid on select items. No minimum order. Use code at checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
