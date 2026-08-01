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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-label="Loading Team Naturals"
        >
          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-forest z-10"
          >
            <LogoMark className="h-20 w-20" animate layoutId="logo-mark" />
          </motion.div>

          <motion.p
            layoutId="logo-text"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="mt-6 font-display text-xl text-forest z-10"
          >
            Team Naturals
          </motion.p>
          <motion.p
            layoutId="logo-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="mt-1 text-[10px] uppercase tracking-[0.32em] text-muted z-10"
          >
            Rooted in Nature. Made with Care.
          </motion.p>

          <div className="mt-8 h-px w-40 overflow-hidden bg-forest/10">
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