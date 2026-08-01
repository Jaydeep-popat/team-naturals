'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, CreditCardIcon, LockIcon, SmartphoneIcon, LandmarkIcon, TruckIcon } from 'lucide-react';

export default function PaymentPage() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    router.push('/order-confirmation');
  };

  const methods = [
    { id: 'UPI', label: 'UPI', icon: SmartphoneIcon },
    { id: 'Card', label: 'Credit/Debit Card', icon: CreditCardIcon },
    { id: 'Net Banking', label: 'Net Banking', icon: LandmarkIcon },
    { id: 'COD', label: 'Cash on Delivery', icon: TruckIcon },
  ];

  return (
    <div className="w-full bg-white pb-16 min-h-[80vh]">
      <div className="bg-gradient-to-b from-cream-soft to-white">
        <div className="mx-auto max-w-4xl px-5 py-6 lg:px-8 text-center">
          <CheckoutStepper currentStep={3} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl px-5 py-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="font-display text-3xl text-forest mb-6">Payment</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-[24px] border border-forest/8 bg-white shadow-sm overflow-hidden">
                <div className="p-6 lg:p-8 space-y-4 bg-cream-soft/30 border-b border-forest/8">
                  <p className="text-[14px] leading-relaxed text-muted font-medium">
                    Please select your preferred payment method. This is a prototype — no real payment will be processed.
                  </p>
                </div>

                <div className="p-6 lg:p-8 flex flex-col gap-4">
                  {methods.map((m) => {
                    const isSelected = selectedMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        className={`rounded-2xl border transition-colors overflow-hidden ${
                          isSelected ? 'border-forest bg-forest/5' : 'border-forest/15 hover:border-forest/30'
                        }`}
                      >
                        <label className="flex cursor-pointer items-center gap-4 p-5">
                          <input
                            type="radio"
                            name="payment_method"
                            value={m.id}
                            checked={isSelected}
                            onChange={() => setSelectedMethod(m.id)}
                            className="h-[18px] w-[18px] border-forest/30 text-forest focus:ring-forest bg-white"
                          />
                          <div className="flex items-center gap-3 text-forest">
                            <Icon size={20} strokeWidth={1.5} className={isSelected ? 'text-forest' : 'text-forest/60'} />
                            <span className="text-[15px] font-medium">{m.label}</span>
                          </div>
                        </label>
                        
                        <AnimatePresence initial={false}>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="px-5 pb-5 overflow-hidden"
                            >
                              <div className="pt-2 border-t border-forest/10 mt-1">
                                {m.id === 'UPI' && (
                                  <div className="mt-4">
                                    <label htmlFor="upi_id" className="mb-2 block text-[13px] font-medium text-forest/80">UPI ID</label>
                                    <input type="text" id="upi_id" placeholder="username@upi" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest" />
                                  </div>
                                )}
                                {m.id === 'Card' && (
                                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                      <label htmlFor="card_number" className="mb-2 block text-[13px] font-medium text-forest/80">Card Number</label>
                                      <input type="text" id="card_number" placeholder="0000 0000 0000 0000" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest" />
                                    </div>
                                    <div>
                                      <label htmlFor="card_expiry" className="mb-2 block text-[13px] font-medium text-forest/80">Expiry (MM/YY)</label>
                                      <input type="text" id="card_expiry" placeholder="MM/YY" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest" />
                                    </div>
                                    <div>
                                      <label htmlFor="card_cvv" className="mb-2 block text-[13px] font-medium text-forest/80">CVV</label>
                                      <input type="password" id="card_cvv" placeholder="123" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest" />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label htmlFor="card_name" className="mb-2 block text-[13px] font-medium text-forest/80">Name on Card</label>
                                      <input type="text" id="card_name" placeholder="Name" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest" />
                                    </div>
                                  </div>
                                )}
                                {m.id === 'Net Banking' && (
                                  <div className="mt-4">
                                    <label htmlFor="bank" className="mb-2 block text-[13px] font-medium text-forest/80">Select Bank</label>
                                    <select id="bank" className="w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-forest">
                                      <option>HDFC Bank</option>
                                      <option>ICICI Bank</option>
                                      <option>State Bank of India</option>
                                      <option>Axis Bank</option>
                                    </select>
                                  </div>
                                )}
                                {m.id === 'COD' && (
                                  <p className="mt-4 text-[13px] text-muted">
                                    Pay with cash upon delivery of your order.
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 pt-2">
                <div className="w-full flex items-center justify-between">
                  <Link href="/checkout/address" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                    <ArrowLeftIcon size={16} /> Return to delivery
                  </Link>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    disabled={lines.length === 0}
                    className="rounded-full bg-forest px-10 py-4 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift disabled:opacity-50"
                  >
                    Place Order · ₹{total}
                  </motion.button>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-muted">
                  <LockIcon size={14} strokeWidth={2} className="text-forest/60" />
                  <span>SSL secured checkout. Your payment information is encrypted.</span>
                </div>
              </div>
            </form>
          </div>

          <CheckoutSummary lines={lines} subtotal={subtotal} />
        </div>
      </motion.div>
    </div>
  );
}
