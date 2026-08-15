'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, PackageIcon } from 'lucide-react';
import { orders } from '@/src/lib/api';
import { StatusPill } from '@/src/components/account/StatusPill';
import { useCart } from '@/src/contexts/CartContext';
import toast from 'react-hot-toast';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      if (!orderId) {
        router.replace('/account/orders');
        return;
      }

      try {
        const res = await orders.get(orderId);
        if (!mounted) return;
        setOrder(res.data.order);
        await clearCart();
      } catch (error) {
        console.error('Failed to load order confirmation:', error);
        toast.error('Could not load the order details. Redirecting to your orders.');
        router.replace('/account/orders');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [orderId, router, clearCart]);

  React.useEffect(() => {
    if (!order) return;
    const timer = window.setTimeout(() => {
      router.replace('/account/orders');
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [order, router]);

  if (isLoading || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-forest" />
          <p className="text-sm text-muted">Fetching your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-24 pt-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-2xl px-5 text-center"
      >
        {/* Animated Checkmark */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-forest/5">
          <svg className="h-12 w-12 text-forest" fill="none" viewBox="0 0 24 24">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
        </div>

        <h1 className="font-display text-4xl text-forest">Order placed!</h1>
        <p className="mt-3 text-[15px] text-muted leading-relaxed">
          Thank you for choosing Team Naturals. We&apos;ve received your order and are getting it ready.
        </p>

        {/* Order Details Card */}
        <div className="mt-10 rounded-[28px] border border-forest/8 bg-gradient-to-b from-cream-soft/50 to-white p-6 sm:p-8 text-left shadow-soft">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-forest/8 pb-6">
            <div>
              <span className="block text-[13px] text-muted">Order ID</span>
              <span className="font-display text-lg font-medium text-forest">#{order.orderNumber}</span>
            </div>
            <div>
              <span className="block text-[13px] text-muted">Status</span>
              <StatusPill status={order.status} />
            </div>
          </div>

          <div className="py-6 space-y-4 border-b border-forest/8">
            <h3 className="font-display text-lg font-medium text-forest mb-2">Items ordered</h3>
            {order.items?.map((item: any) => (
              <div key={item.orderItemId} className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-cream shadow-sm">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-forest/20">
                      <PackageIcon size={28} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-forest">{item.productName}</p>
                  <p className="text-[13px] text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="text-[15px] font-medium text-forest">₹{Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-2 border-t border-forest/5">
              <span className="font-medium text-forest">Total Paid</span>
              <span className="font-display text-xl font-semibold text-forest">₹{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="font-display text-lg font-medium text-forest mb-2">Shipping to</h3>
            <p className="text-[14px] text-forest leading-relaxed">
              {order.shipping?.name}<br />
              {order.shipping?.line1}{order.shipping?.line2 ? `, ${order.shipping.line2}` : ''}<br />
              {order.shipping?.city}, {order.shipping?.state} {order.shipping?.postalCode}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/account/orders"
            className="rounded-full bg-forest px-8 py-3.5 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift"
          >
            View Order History
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-forest" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </React.Suspense>
  );
}
