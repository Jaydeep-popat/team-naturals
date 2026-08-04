'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoMarkProps {
  className?: string;
  animate?: boolean;
  layoutId?: string;
  useImage?: boolean;
}

/** Thin-line botanical leaf mark, drawn as a stroke path so it can animate. */
export function LogoMark({ className = 'h-8 w-8', animate = false, layoutId, useImage = false }: LogoMarkProps) {
  if (useImage) {
    return (
      <motion.img 
        layoutId={layoutId}
        src="/full_logo.png"
        alt="Team Naturals"
        className={`object-contain object-left -ml-3 lg:-ml-5 ${className}`}
      />
    );
  }

  const draw = {
    hidden: { pathLength: 0, opacity: 0, fill: 'rgba(31, 61, 43, 0)' },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      fill: i > 0 ? 'rgba(31, 61, 43, 1)' : 'rgba(31, 61, 43, 0)',
      transition: {
        pathLength: { delay: i * 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
        opacity: { delay: i * 0.25, duration: 0.15 },
        fill: { delay: i * 0.25 + 0.5, duration: 0.6, ease: 'easeOut' },
      },
    }),
  };

  return (
    <motion.svg layoutId={layoutId} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M24 44V18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        variants={animate ? draw : undefined}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
        custom={0}
      />
      <motion.path
        d="M24 26C24 15 31 6 42 4c1 11-6 20-18 22Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        variants={animate ? draw : undefined}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
        custom={1}
      />
      <motion.path
        d="M23 33C23 25 17 18 7 17c-1 8 5 15 16 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        variants={animate ? draw : undefined}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
        custom={2}
      />
    </motion.svg>
  );
}

export function Logo({ compact = false, useImage = false, disableLayoutAnimation = false, hideTextOnMobile = false, isNavbar = false }: { compact?: boolean, useImage?: boolean, disableLayoutAnimation?: boolean, hideTextOnMobile?: boolean, isNavbar?: boolean }) {
  return (
    <span className="flex items-center gap-3 text-forest">
      <LogoMark 
        className={compact ? 'w-40 sm:w-52 h-auto transition-all duration-300 ease-out' : 'w-52 sm:w-64 h-auto transition-all duration-300 ease-out'} 
        layoutId={disableLayoutAnimation ? undefined : "logo-mark"} 
        useImage={useImage} 
      />
      {!useImage && (
        <span className={`leading-none ${hideTextOnMobile ? 'hidden sm:block' : ''}`}>
        <motion.span layoutId={disableLayoutAnimation ? undefined : "logo-text"} className="block font-display text-[19px] font-medium tracking-tight text-forest">
          Team Naturals
        </motion.span>
        <motion.span layoutId={disableLayoutAnimation ? undefined : "logo-subtext"} className="mt-0.5 block text-[9px] uppercase tracking-[0.24em] text-muted">
          Rooted in Nature
        </motion.span>
      </span>
      )}
    </span>
  );
}