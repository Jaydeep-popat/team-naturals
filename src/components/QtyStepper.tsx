'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon } from 'lucide-react';

export function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (q: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center rounded-full border border-forest/15 bg-white">
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease quantity of ${label}`}
        className="p-2 text-forest transition-colors hover:text-terracotta"
      >
        <MinusIcon size={14} strokeWidth={2} />
      </motion.button>
      <span className="min-w-[28px] text-center text-sm font-medium text-forest" aria-live="polite">
        {value}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase quantity of ${label}`}
        className="p-2 text-forest transition-colors hover:text-forest-soft"
      >
        <PlusIcon size={14} strokeWidth={2} />
      </motion.button>
    </div>
  );
}
