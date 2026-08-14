'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingUp = y < lastScrollY.current;
      // Show only when scrolled past 500px AND scrolling upward
      setIsVisible(y > 500 && scrollingUp);
      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          // Mobile layout (stacking from bottom up):
          //   0–64px   → tab bar
          //   88–148px → cart pill (bottom-[5.5rem], ~60px tall)
          //   184px+   → safe zone → button bottom edge at 184px = bottom-[11.5rem]
          // Right side: pill is centered so right-4 stays clear of it
          // Desktop: normal bottom-right, no tab bar or floating pill
          className="fixed right-4 z-[110] h-11 w-11 flex items-center justify-center rounded-full bg-forest text-cream shadow-xl ring-2 ring-forest/20 hover:bg-[#1a3d28] active:scale-95 transition-colors focus:outline-none
            bottom-[11.5rem]
            lg:bottom-24 lg:right-8 lg:h-12 lg:w-12"
        >
          <ArrowUp size={19} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
