'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { products } from "@/src/data/products";
import { ProductCard } from "@/src/components/ProductCard";

export default function OrderConfirmationPage() {
  const dummyOrder = {
    id: '#TN-' + Math.floor(100000 + Math.random() * 900000),
    date: '3-5 business days',
    items: [
      { product: products[0], quantity: 2 },
      { product: products[1], quantity: 1 },
    ],
    address: 'Jane Doe, 123 Natural Lane, Green City, 400001',
    total: products[0].price * 2 + products[1].price,
  };

  const relatedProducts = products.slice(2, 5);

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
          Thank you for choosing Team Naturals. We've received your order and are getting it ready.
        </p>

        {/* Order Details Card */}
        <div className="mt-10 rounded-[28px] border border-forest/8 bg-gradient-to-b from-cream-soft/50 to-white p-6 sm:p-8 text-left shadow-soft">
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-forest/8 pb-6">
            <div>
              <span className="block text-[13px] text-muted">Order ID</span>
              <span className="font-display text-lg font-medium text-forest">{dummyOrder.id}</span>
            </div>
            <div>
              <span className="block text-[13px] text-muted">Estimated Delivery</span>
              <span className="font-display text-lg font-medium text-forest">{dummyOrder.date}</span>
            </div>
          </div>

          <div className="py-6 space-y-4 border-b border-forest/8">
            <h3 className="font-display text-lg font-medium text-forest mb-2">Items ordered</h3>
            {dummyOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img src={item.product.images[0]} alt="" className="h-16 w-16 rounded-2xl object-cover shadow-sm bg-cream" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-forest">{item.product.name}</p>
                  <p className="text-[13px] text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="text-[15px] font-medium text-forest">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-2 border-t border-forest/5">
              <span className="font-medium text-forest">Total Paid</span>
              <span className="font-display text-xl font-semibold text-forest">₹{dummyOrder.total}</span>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="font-display text-lg font-medium text-forest mb-2">Shipping to</h3>
            <p className="text-[14px] text-forest leading-relaxed">
              {dummyOrder.address}
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            className="rounded-full border border-forest/15 px-8 py-3.5 text-[15px] font-medium text-forest transition-colors hover:bg-forest/5"
          >
            Track Order
          </button>
          <Link
            href="/shop"
            className="rounded-full bg-forest px-8 py-3.5 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>

      {/* You May Also Like */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mx-auto max-w-6xl px-5 mt-24"
      >
        <h2 className="font-display text-2xl font-medium text-forest text-center mb-10">You may also like</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
