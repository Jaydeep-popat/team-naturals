'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ShieldCheckIcon } from 'lucide-react';
import type { CartLine } from '../types/product';

interface CheckoutSummaryProps {
  lines: CartLine[];
  subtotal: number;
}

export function CheckoutSummary({ lines, subtotal }: CheckoutSummaryProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const content = (
    <div className="space-y-5 lg:space-y-6">
      {lines.length === 0 ? (
        <p className="text-[15px] text-muted">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.product.id} className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={l.product.images[0]}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover shadow-sm bg-cream"
                />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-cream shadow-sm">
                  {l.quantity}
                </span>
              </div>
              <span className="min-w-0 flex-1 text-[15px] font-medium text-forest">
                {l.product.name}
                <span className="block text-[13px] font-normal text-muted mt-0.5">{l.product.weight}</span>
              </span>
              <span className="text-[15px] font-medium text-forest">₹{l.product.price * l.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      
      <dl className="space-y-3 border-t border-forest/8 pt-5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-forest">₹{subtotal}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-medium text-forest">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
        </div>
        <div className="flex justify-between border-t border-forest/8 pt-4 mt-2">
          <dt className="font-medium text-forest text-lg">Total</dt>
          <dd className="font-display text-2xl font-semibold text-forest">₹{total}</dd>
        </div>
      </dl>
      <p className="flex items-center gap-1.5 text-[12px] text-muted pt-2">
        <ShieldCheckIcon size={14} strokeWidth={1.8} /> 7-day easy returns
      </p>
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-28">
      {/* Mobile Accordion */}
      <div className="lg:hidden rounded-[24px] border border-forest/8 bg-gradient-to-b from-cream-soft/50 to-white overflow-hidden mb-6 shadow-sm">
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex w-full items-center justify-between p-5 text-forest"
        >
          <span className="font-display text-lg font-medium flex items-center gap-2">
            Order Summary
            <motion.span
              animate={{ rotate: mobileExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon size={18} />
            </motion.span>
          </span>
          <span className="font-display text-lg font-semibold">₹{total}</span>
        </button>
        <AnimatePresence initial={false}>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden px-5 pb-5"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Panel */}
      <div className="hidden lg:block rounded-[28px] border border-forest/8 bg-gradient-to-b from-cream-soft/50 to-white p-7 shadow-soft">
        <h2 className="font-display text-xl font-medium text-forest mb-6">Order summary</h2>
        {content}
      </div>
    </aside>
  );
}
