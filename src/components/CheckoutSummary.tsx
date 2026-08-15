'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ShieldCheckIcon } from 'lucide-react';
import type { CartLine } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { Loader2, XIcon } from 'lucide-react';
import { discounts } from '@/src/lib/api';
import toast from 'react-hot-toast';

export function CheckoutSummary({ codFee = 0 }: { codFee?: number }) {
  const { lines, originalSubtotal, subtotal, promoCode, eventDiscountAmount, promoDiscountAmount, applyPromo, removePromo } = useCart();
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);

  const shipping = originalSubtotal === 0 || originalSubtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal - promoDiscountAmount) + shipping + codFee;

  useEffect(() => {
    let mounted = true;

    discounts.available()
      .then((res) => {
        if (!mounted) return;
        setAvailableDiscounts(res.data?.discounts || []);
      })
      .catch((error) => {
        console.error('Failed to fetch offers:', error);
        toast.error('Could not load promo offers');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setIsApplying(true);
    await applyPromo(promoInput.trim());
    setIsApplying(false);
    setPromoInput('');
  };

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
              <span className="text-[15px] font-medium text-forest text-right">
                {l.finalUnitPrice && l.finalUnitPrice < (l.product.price || 0) ? (
                  <div className="flex flex-col items-end">
                    <span className="text-[13px] text-muted line-through">₹{l.product.price * l.quantity}</span>
                    <span className="text-[#388E3C]">₹{l.finalUnitPrice * l.quantity}</span>
                    {l.appliedEventName && <span className="text-[10px] text-[#388E3C] uppercase">{l.appliedEventName}</span>}
                  </div>
                ) : (
                  <span>₹{l.product.price * l.quantity}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      
      <dl className="space-y-3 border-t border-forest/8 pt-5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal (Original)</dt>
          <dd className="font-medium text-forest">₹{originalSubtotal || subtotal}</dd>
        </div>

        {eventDiscountAmount > 0 && (
          <div className="flex justify-between text-[#388E3C]">
            <dt className="text-muted">Event Discounts</dt>
            <dd className="font-medium">-₹{eventDiscountAmount}</dd>
          </div>
        )}
        
        {promoCode && (
          <div className="flex justify-between text-terracotta">
            <dt className="flex items-center gap-2">
              Promo ({promoCode})
              <button onClick={() => removePromo()} className="hover:text-terracotta/70 p-0.5 rounded">
                <XIcon size={14} />
              </button>
            </dt>
            <dd className="font-medium">{promoDiscountAmount > 0 ? `-₹${promoDiscountAmount}` : 'Not eligible'}</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-medium text-forest">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">COD Fee</dt>
            <dd className="font-medium text-forest">₹{codFee}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-forest/8 pt-4 mt-2">
          <dt className="font-medium text-forest text-lg">Total</dt>
          <dd className="font-display text-2xl font-semibold text-forest">₹{total}</dd>
        </div>
      </dl>

      {/* Promo Code Input */}
      {!promoCode && (
        <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Discount code"
            className="flex-1 rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest"
          />
          <button
            type="submit"
            disabled={isApplying || !promoInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest/10 text-forest text-sm font-bold hover:bg-forest/20 transition-colors disabled:opacity-50"
          >
            {isApplying ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
          </button>
        </form>
      )}

      {!promoCode && availableDiscounts.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[12px] font-medium text-forest/70">Available offers</p>
          <div className="space-y-2">
            {availableDiscounts.slice(0, 3).map((offer) => (
              <button
                key={offer.discountId || offer.code}
                type="button"
                onClick={async () => {
                  setIsApplying(true);
                  await applyPromo(offer.code);
                  setIsApplying(false);
                }}
                disabled={isApplying}
                className="flex w-full items-center justify-between rounded-xl border border-forest/8 bg-white px-3.5 py-3 text-left transition-colors hover:border-forest/20 hover:bg-forest/5 disabled:opacity-50"
              >
                <span>
                  <span className="block text-sm font-semibold text-forest">{offer.code}</span>
                  <span className="block text-[11px] text-muted">{offer.type === 'percent' ? `${offer.value}% off` : `₹${offer.value} off`}</span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-forest/40">Apply</span>
              </button>
            ))}
          </div>
        </div>
      )}
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
