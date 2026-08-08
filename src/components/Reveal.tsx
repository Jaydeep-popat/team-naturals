'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/** Fade + direction section reveal on scroll. */
export function Reveal({ children, delay = 0, className, as = 'div', direction = 'up' }: RevealProps) {
  const MotionTag = motion[as];
  
  let initialX = 0;
  let initialY = 0;

  switch (direction) {
    case 'up':
      initialY = 28;
      break;
    case 'down':
      initialY = -28;
      break;
    case 'left':
      initialX = 28;
      break;
    case 'right':
      initialX = -28;
      break;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};