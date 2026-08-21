'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, Loader2, LockIcon } from 'lucide-react';
import { orders } from '@/src/lib/api';
import { loadRazorpayScript, RazorpayOptions } from '@/src/lib/razorpay';
import toast from 'react-hot-toast';

const COD_FEE = 30;

function PaymentContent() {
  const { lines, subtotal, originalSubtotal, promoDiscountAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
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
      // Step A: Initiate Checkout
      const res = await orders.checkout(Number(addressId), paymentMethod);
      const order = res.data.order;
      const paymentDetails = res.data.paymentDetails || res.data.razorpay;

      if (paymentMethod === 'cod') {
        await clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation?orderId=${order.orderId || order.id}`);
        return;
      }

      // Step B: Open Razorpay Modal & Process Payment
      if (paymentMethod === 'razorpay') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !window.Razorpay) {
          throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        }

        if (!paymentDetails) {
          throw new Error('Payment initialization details were not provided by the server.');
        }

        const key = paymentDetails.keyId || paymentDetails.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
        const amount = paymentDetails.amountPaise || paymentDetails.amount;
        const currency = paymentDetails.currency || 'INR';
        const razorpayOrderId = paymentDetails.razorpayOrderId || paymentDetails.id || paymentDetails.orderId;

        const options: RazorpayOptions = {
          key,
          amount,
          currency,
          name: "Team Naturals",
          description: `Order #${order.orderNumber || order.orderId || order.id}`,
          order_id: razorpayOrderId,
          prefill: {
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
            email: user?.email || "",
            contact: user?.phoneNo || "",
          },
          theme: { color: "#2C5E3B" },
          handler: async function (response) {
            try {
              // Step C: Verify Payment on Backend
              const verifyRes = await orders.verifyPayment({
                orderId: order.orderId || order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              toast.success(verifyRes.message || 'Payment verified successfully!');
              await clearCart();
              router.push(`/order-confirmation?orderId=${order.orderId || order.id}`);
            } catch (verifyErr: any) {
              console.error("Payment verification failed", verifyErr);
              const message = verifyErr?.message || 'Payment verification failed. Please contact support.';
              setCheckoutError(message);
              toast.error(message);
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              toast.error("Payment cancelled. You can retry from your checkout page.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      console.error("Checkout failed", error);
      const message = error instanceof Error ? error.message : 'Failed to initiate checkout. Please try again.';
      setCheckoutError(message);
      toast.error(message);
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
        <div className="flex flex-col lg:grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="order-2 lg:order-1">
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
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-forest">Online Payment (Razorpay)</h3>
                        <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">Recommended</span>
                      </div>
                      <p className="text-sm text-forest/70">UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking & Wallets.</p>
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
                    <div className="flex-1">
                      <h3 className="font-medium text-forest">Cash on Delivery</h3>
                      <p className="text-sm text-forest/70">Pay when your order arrives. COD fee: ₹{COD_FEE}</p>
                    </div>
                  </label>
                </div>

                <div className="hidden lg:block text-center mt-6">
                  <motion.button
                    onClick={handlePayment}
                    disabled={lines.length === 0 || loading || !addressId}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-sm bg-[#fb641b] px-10 py-4 w-full max-w-md text-[16px] font-medium text-white shadow-sm transition-all hover:bg-[#f3580a] disabled:opacity-50"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? 'Processing...' : paymentMethod === 'razorpay' ? `Pay & Place Order · ₹${total}` : `Place Order · ₹${total}`}
                    </span>
                  </motion.button>
                  {checkoutError && (
                    <p className="mt-3 text-sm font-medium text-red-500">
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
                  <span>256-bit SSL Encrypted & Secured Payment.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <CheckoutSummary codFee={codFee} />
          </div>
        </div>
      </motion.div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-gray-900">₹{total}</span>
          <span className="text-[12px] text-[#2874f0] font-medium cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>View price details</span>
        </div>
        <button
          onClick={handlePayment}
          disabled={lines.length === 0 || loading || !addressId}
          className="rounded-sm bg-[#fb641b] px-6 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-[#f3580a] disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Processing...' : paymentMethod === 'razorpay' ? 'Pay & Place Order' : 'Place Order'}
        </button>
      </div>
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
