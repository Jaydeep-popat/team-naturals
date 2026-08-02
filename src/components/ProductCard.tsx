'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingBagIcon, ZapIcon } from 'lucide-react';
import type { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from './StarRating';
import { AuthModal } from './AuthModal';


export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const wished = wishlist.includes(product.id);
  const [added, setAdded] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  function handleAddToCart() {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const categoryLabel = product.category === 'face-wash' ? 'Face Wash' : 'Soap';

  return (
    <>
      <motion.article
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group relative flex flex-col overflow-hidden rounded-[28px] border border-forest/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift"
    >
      {/* ── Image area ── */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: '4/5' }}
        tabIndex={0}
      >
        <img
          src={product.images[0]}
          alt={`${product.name} — handmade natural ${categoryLabel.toLowerCase()} by Team Naturals`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream shadow-sm">
              <ZapIcon size={9} strokeWidth={2.5} className="fill-gold text-gold" />
              Best Seller
            </span>
          )}
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-forest/70 backdrop-blur-sm">
            {categoryLabel}
          </span>
        </div>

        {/* Quick-view concern tags — slide up on hover */}
        {product.concerns.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full transition-transform duration-400 ease-out group-hover:translate-y-0">
            <div className="flex flex-wrap gap-1.5 p-3">
              {product.concerns.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] text-forest/80 backdrop-blur-sm"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* ── Wishlist button ── */}
      <motion.button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={wished}
        whileTap={{ scale: 0.85 }}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 shadow-soft backdrop-blur transition-all hover:bg-white hover:shadow-lift"
      >
        <HeartIcon
          size={15}
          strokeWidth={1.8}
          className={`transition-colors duration-200 ${
            wished ? 'fill-terracotta text-terracotta' : 'text-forest/60'
          }`}
        />
      </motion.button>

      {/* ── Info area ── */}
      <div className="flex flex-1 flex-col p-4 pb-5">
        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/link">
          <h3 className="font-display text-[18px] font-semibold leading-snug text-forest transition-colors group-hover/link:text-forest-soft">
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        {/* Rating row */}
        <div className="mt-2.5 flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[11px] font-medium text-forest">{product.rating}</span>
          <span className="text-[11px] text-muted/70">({product.reviewCount})</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-semibold text-forest">₹{product.price}</span>
            <span className="text-[11px] text-muted">/ {product.weight}</span>
          </div>
        </div>

        {/* Full-width Add to Cart (All screens) */}
        <div className="mt-3">
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.div
                key="added"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-soft py-2.5 text-sm font-medium text-cream"
              >
                <ZapIcon size={14} strokeWidth={2} className="fill-gold text-gold" />
                Added to cart!
              </motion.div>
            ) : (
              <motion.button
                key="add"
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest/15 bg-cream-soft py-2.5 text-[13px] font-medium text-forest transition-all duration-200 hover:border-forest hover:bg-forest hover:text-cream group-hover:border-forest group-hover:bg-forest group-hover:text-cream"
              >
                <ShoppingBagIcon size={14} strokeWidth={1.8} />
                Add to Cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>

    {/* ── Auth gate modal ── */}
    <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
  </>
  );
}