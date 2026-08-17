'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoMark } from './Logo';

export function Preloader() {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, filter: 'blur(6px)', pointerEvents: 'none' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Loading Team Naturals"
        >
          <motion.div
            initial={{ scale: 1.25 }}
            animate={{ scale: 1.35 }}
            exit={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-forest z-10"
          >
            <LogoMark className="h-32 w-32 sm:h-36 sm:w-36" animate layoutId="logo-mark" />
          </motion.div>

          <motion.p
            layoutId="logo-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-8 font-display text-3xl sm:text-4xl font-bold text-forest z-10"
          >
            Team Naturals
          </motion.p>
          <motion.p
            layoutId="logo-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-muted z-10"
          >
            Rooted in Nature. Made with Care.
          </motion.p>

          <div className="mt-10 h-1.5 w-60 sm:w-72 overflow-hidden rounded-full bg-forest/10">
            <motion.div
              className="h-full bg-forest"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}