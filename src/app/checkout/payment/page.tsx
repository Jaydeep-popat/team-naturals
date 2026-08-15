'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, Loader2, LockIcon } from 'lucide-react';
import { orders } from '@/src/lib/api';
import toast from 'react-hot-toast';

import { Suspense } from 'react';

const COD_FEE = 30;

function PaymentContent() {
  const { lines, subtotal, originalSubtotal, promoDiscountAmount, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const shipping = originalSubtotal === 0 || originalSubtotal >= 499 ? 0 : 49;
  const codFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const total = Math.max(0, subtotal - (promoDiscountAmount || 0)) + shipping + codFee;

  const handlePayment = async () => {
    setCheckoutError(null);
    if (!addressId) {
      toast.error("Please select a delivery address first.");
      router.push('/checkout/address');
      return;
    }

    setLoading(true);
    try {
      const res = await orders.checkout(Number(addressId), paymentMethod);
      const { order } = res.data;

      if (paymentMethod === 'cod') {
        await clearCart();
        router.push(`/order-confirmation?orderId=${order.orderId}`);
        return;
      }
      toast.error('Online payment is not enabled yet. Please use Cash on Delivery.');
    } catch (error) {
      console.error("Checkout failed", error);
      const message = error instanceof Error ? error.message : 'Failed to initiate checkout. Please try again.';
      setCheckoutError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

            <div className="space-y-8">
              <div className="rounded-[24px] border border-forest/8 bg-white shadow-sm overflow-hidden p-6 md:p-8 text-left">
                <h2 className="text-lg font-medium text-forest mb-4">Select Payment Method</h2>
                
                <div className="space-y-4 mb-8">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-forest/10 hover:border-forest/30'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-5 h-5 text-forest border-forest/30 focus:ring-forest"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-forest">Cash on Delivery</h3>
                      <p className="text-sm text-forest/70">Pay when your order arrives. COD fee: â‚¹{COD_FEE}</p>
                    </div>
                  </label>

                  <label className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-forest/10 bg-gray-50 p-4 opacity-70">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      disabled
                      className="w-5 h-5 text-forest border-forest/30 focus:ring-forest"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-forest">Online Payment</h3>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest/50">Coming soon</span>
                      </div>
                      <p className="text-sm text-forest/70">UPI, cards, and net banking will be enabled after Razorpay setup.</p>
                    </div>
                  </label>
                </div>

                <div className="text-center">
                  <motion.button
                    onClick={handlePayment}
                    disabled={lines.length === 0 || loading || !addressId}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full bg-forest px-10 py-4 w-full max-w-md text-[16px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift disabled:opacity-50"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? 'Processing...' : `Place Order · ₹${total}`}
                    </span>
                  </motion.button>
                  {checkoutError && (
                    <p className="mt-3 text-sm font-medium text-terracotta">
                      {checkoutError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 pt-2">
                <Link href="/checkout/address" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                  <ArrowLeftIcon size={16} /> Return to delivery
                </Link>
                <div className="flex items-center gap-2 text-[12px] text-muted mt-2">
                  <LockIcon size={14} strokeWidth={2} className="text-forest/60" />
                  <span>SSL secured checkout. Cash on Delivery is available now.</span>
                </div>
              </div>
            </div>
          </div>

          <CheckoutSummary codFee={codFee} />
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-forest/60">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
