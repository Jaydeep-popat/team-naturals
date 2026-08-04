'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, LockIcon } from 'lucide-react';
import { orders } from '@/src/lib/api';
import { useRazorpay } from "react-razorpay";

import { Suspense } from 'react';

function PaymentContent() {
  const { lines, subtotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const { Razorpay } = useRazorpay();

  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    if (!addressId) {
      alert("Please select a delivery address first.");
      router.push('/checkout/address');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order on backend (creates a pending order)
      const res = await orders.checkout(Number(addressId));
      const { razorpay, order } = res.data;

      if (paymentMethod === 'cod') {
        // For COD, we just clear the cart and redirect. The order remains pending in backend.
        await clearCart();
        router.push('/order-confirmation');
        return;
      }

      // 2. Initialize Razorpay options
      const options = {
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: razorpay.name,
        description: razorpay.description,
        order_id: razorpay.orderId,
        handler: async (response: any) => {
          try {
            // 3. Verify payment on backend
            await orders.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await clearCart();
            router.push('/order-confirmation');
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: order.shippingName,
          contact: order.shippingPhone,
        },
        theme: {
          color: "#1F3D2B", // Forest green
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.on("payment.failed", function (response: any) {
        console.error("Payment Failed", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      
      rzpay.open();
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Failed to initiate checkout. Please try again.");
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
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-forest bg-forest/5' : 'border-forest/10 hover:border-forest/30'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="w-5 h-5 text-forest border-forest/30 focus:ring-forest"
                    />
                    <div>
                      <h3 className="font-medium text-forest">Razorpay (Online Payment)</h3>
                      <p className="text-sm text-forest/70">UPI, Credit/Debit cards, Net Banking</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-forest/10 hover:border-forest/30'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-5 h-5 text-forest border-forest/30 focus:ring-forest"
                    />
                    <div>
                      <h3 className="font-medium text-forest">Cash on Delivery</h3>
                      <p className="text-sm text-forest/70">Pay in cash when your order arrives</p>
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
                    {loading ? 'Processing...' : paymentMethod === 'razorpay' ? `Pay Securely · ₹${total}` : `Place Order · ₹${total}`}
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 pt-2">
                <Link href="/checkout/address" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                  <ArrowLeftIcon size={16} /> Return to delivery
                </Link>
                <div className="flex items-center gap-2 text-[12px] text-muted mt-2">
                  <LockIcon size={14} strokeWidth={2} className="text-forest/60" />
                  <span>SSL secured checkout. Your payment information is encrypted by Razorpay.</span>
                </div>
              </div>
            </div>
          </div>

          <CheckoutSummary lines={lines} subtotal={subtotal} />
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
