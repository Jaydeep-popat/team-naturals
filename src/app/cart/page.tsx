'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LockIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  Trash2Icon,
  TruckIcon,
} from 'lucide-react';
import { useCart } from "@/src/contexts/CartContext";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { QtyStepper } from "@/src/components/QtyStepper";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { SkeletonBlock } from "@/src/components/Skeletons";

export default function CartPage() {
  const { lines, setQuantity, removeFromCart, subtotal } = useCart();
  const loading = usePageLoad(500);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="w-full bg-white pb-16">
      <div className="bg-gradient-to-b from-cream-soft to-white">
        <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-medium tracking-tight text-forest">Checkout</h1>
          <div className="mt-4">
            <CheckoutStepper currentStep={1} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-10 lg:px-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28 w-full rounded-3xl" />
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-5 py-32 text-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-cream-soft text-forest shadow-sm"
          >
            <ShoppingBagIcon size={32} strokeWidth={1.5} />
          </motion.span>
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-medium text-forest">Nothing here yet</h2>
            <p className="text-[15px] text-muted">You can shop as a guest — no account required.</p>
          </div>
          <Link
            href="/shop"
            className="mt-4 rounded-full bg-forest px-8 py-3.5 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift active:scale-95"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px] lg:px-8">
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {lines.map((line) => {
                const productId = (line.product as any).productId || line.product.id;
                return (
                <motion.li
                  key={productId}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="flex gap-3 sm:gap-4 rounded-3xl border border-forest/8 bg-white p-3 sm:p-4 shadow-soft"
                >
                  <Link href={`/product/${line.product.slug}`} className="flex-shrink-0 group/img">
                    <div className="overflow-hidden rounded-2xl bg-cream">
                      <img
                        src={typeof line.product.images?.[0] === 'string' ? line.product.images[0] : ((line.product.images?.[0] as any)?.url || '/placeholder.png')}
                        alt={line.product.name}
                        className="h-24 w-24 sm:h-32 sm:w-32 object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${line.product.slug}`}>
                          <h2 className="truncate font-display text-[15px] sm:text-lg leading-tight text-forest">
                            {line.product.name}
                          </h2>
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {line.product.weight} · ₹{line.product.price}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(String(productId))}
                        aria-label={`Remove ${line.product.name}`}
                        className="flex-shrink-0 rounded-full p-1.5 sm:p-2 text-muted transition-colors hover:bg-forest/5 hover:text-terracotta"
                      >
                        <Trash2Icon size={16} strokeWidth={1.6} />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <QtyStepper
                        value={line.quantity}
                        onChange={(q) => setQuantity(String(productId), q)}
                        label={line.product.name}
                      />
                      <span className="font-display text-[15px] sm:text-lg text-forest">
                        ₹{line.product.price * line.quantity}
                      </span>
                    </div>
                  </div>
                </motion.li>
              )})}
            </AnimatePresence>
          </ul>

          <aside className="h-fit space-y-6 rounded-[28px] border border-forest/8 bg-gradient-to-b from-cream-soft/50 to-white p-6 shadow-soft lg:sticky lg:top-28 lg:p-8">
            <h2 className="font-display text-2xl font-medium text-forest">Order summary</h2>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPromoApplied(promo.trim().length > 0);
              }}
            >
              <label htmlFor="promo" className="sr-only">
                Promo code
              </label>
              <div className="flex flex-1 items-center gap-2 rounded-full border border-forest/12 bg-white px-4 py-2.5">
                <TagIcon size={15} strokeWidth={1.6} className="text-muted" />
                <input
                  id="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Promo code"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="rounded-full border border-forest/15 px-4 text-sm text-forest transition-colors hover:bg-white"
              >
                Apply
              </motion.button>
            </form>
            {promoApplied && (
              <p className="text-xs text-forest-soft">Code applied — 10% off (demo only).</p>
            )}

            <dl className="space-y-2.5 border-t border-forest/8 pt-4 text-sm">
              <CartLine label="Subtotal" value={`₹${subtotal}`} />
              <CartLine label="Shipping" value={shipping === 0 ? 'Free' : `₹${shipping}`} />
              {discount > 0 && <CartLine label="Discount" value={`− ₹${discount}`} accent />}
              <div className="flex items-center justify-between border-t border-forest/8 pt-3">
                <dt className="text-forest">Total</dt>
                <dd className="font-display text-2xl text-forest">₹{total}</dd>
              </div>
            </dl>

            <Link
              href="/checkout/address"
              className="block w-full rounded-full bg-forest px-6 py-4 text-center text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>

            <div className="space-y-2 pt-1 text-[11px] text-muted">
              <p className="flex items-center gap-1.5">
                <LockIcon size={12} strokeWidth={1.8} /> SSL secured checkout
              </p>
              <p className="flex items-center gap-1.5">
                <TruckIcon size={12} strokeWidth={1.8} /> Free shipping over ₹499
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheckIcon size={12} strokeWidth={1.8} /> 7-day easy returns
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function CartLine({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? 'text-terracotta' : 'text-forest'}>{value}</dd>
    </div>
  );
}