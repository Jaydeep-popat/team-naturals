'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeartOffIcon } from 'lucide-react';
import Link from 'next/link';
import { products } from "@/src/data/products";
import { ProductCard } from "@/src/components/ProductCard";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { staggerContainer, staggerItem } from "@/src/components/Reveal";
import { useCart } from "@/src/contexts/CartContext";

export default function WishlistPage() {
  const { wishlist } = useCart();

  // Find all actual product objects that match the IDs saved in the wishlist
  const savedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div className="w-full bg-white">
      {/* Header Area */}
      <header className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center lg:px-8">
          <h1 className="font-display text-3xl text-forest sm:text-4xl">
            Your Wishlist
          </h1>
          <div className="mt-3 flex justify-center">
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                { label: 'Wishlist' },
              ]}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {savedProducts.length === 0 ? (
          <EmptyWishlistState />
        ) : (
          <div className="min-w-0 flex-1">
            <div className="mb-8 flex items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {savedProducts.length} product{savedProducts.length === 1 ? '' : 's'} saved
              </p>
            </div>

            <motion.div
              key="wishlist-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6"
            >
              {savedProducts.map((p) => (
                <motion.div key={p.id} variants={staggerItem}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyWishlistState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-dashed border-forest/15 bg-cream-soft px-6 py-20 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-forest shadow-sm">
        <HeartOffIcon size={24} strokeWidth={1.4} />
      </span>
      <h2 className="mt-2 font-display text-2xl text-forest">Your wishlist is empty</h2>
      <p className="max-w-xs text-sm leading-relaxed text-muted">
        Tap the heart icon on any product to save it here for later.
      </p>
      <Link
        href="/shop"
        className="mt-4 rounded-full bg-forest px-8 py-3.5 text-sm text-cream transition-colors hover:bg-forest-deep shadow-soft"
      >
        Start shopping
      </Link>
    </motion.div>
  );
}
