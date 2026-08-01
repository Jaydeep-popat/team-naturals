'use client';

import React from 'react';
import { HeadphonesIcon, LockIcon, RotateCcwIcon, TruckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './Reveal';

const items = [
  { icon: TruckIcon, title: 'Free Shipping', copy: 'On orders over ₹499' },
  { icon: RotateCcwIcon, title: 'Easy Returns', copy: '7-day return window' },
  { icon: LockIcon, title: 'Secure Payments', copy: '100% protected checkout' },
  { icon: HeadphonesIcon, title: 'Customer Support', copy: 'Here to help anytime' },
];

export function TrustStrip() {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 divide-forest/8 rounded-3xl border border-forest/8 bg-white p-2 shadow-lift sm:grid-cols-4 sm:divide-x"
    >
      {items.map(({ icon: Icon, title, copy }) => (
        <motion.li
          key={title}
          variants={staggerItem}
          className="flex flex-col items-center gap-2 px-3 py-5 text-center"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-mist text-forest">
            <Icon size={18} strokeWidth={1.5} />
          </span>
          <span className="text-[13px] font-semibold text-forest">{title}</span>
          <span className="text-[11px] leading-tight text-muted">{copy}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}