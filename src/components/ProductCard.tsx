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

// True hover guard: returns true only on pointer-fine (mouse) devices
const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;


export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const productId = (product as any).productId || product.id;
  const wished = wishlist.includes(String(productId));
  const [added, setAdded] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [hoverFill, setHoverFill] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const hoverTimerRef = React.useRef<number | null>(null);
  const hoverCycleRef = React.useRef<number | null>(null);

  function handleAddToCart() {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
    }, 1800);
  }

  const images = (product.images || []).map((img) => (typeof img === 'string' ? img : ((img as any)?.url || '/placeholder.png')));
  const primaryImage = images[0] || '/placeholder.png';
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeImageIndex] || primaryImage;

  const startHoverSwap = () => {
    // Only run on true pointer-capable (mouse) devices
    if (!canHover) return;
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    if (hoverCycleRef.current) {
      window.clearInterval(hoverCycleRef.current);
    }
    setActiveImageIndex(0);
    setHoverFill(true);
    if (!hasMultipleImages) return;
    hoverTimerRef.current = window.setTimeout(() => {
      hoverCycleRef.current = window.setInterval(() => {
        setActiveImageIndex((current) => (current + 1) % images.length);
      }, 2000);
    }, 2000);
  };

  const clearHoverSwap = () => {
    if (!canHover) return;
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (hoverCycleRef.current) {
      window.clearInterval(hoverCycleRef.current);
      hoverCycleRef.current = null;
    }
    setHoverFill(false);
    setActiveImageIndex(0);
  };

  React.useEffect(() => () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    if (hoverCycleRef.current) {
      window.clearInterval(hoverCycleRef.current);
    }
  }, []);

  const categoryLabel = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any).name 
    : (product.category === 'face-wash' ? 'Face Wash' : 'Soap');

  return (
    <>
      <motion.article
        onMouseEnter={startHoverSwap}
        onMouseLeave={clearHoverSwap}
        // Do NOT use onFocus/onBlur for hover swap — they fire on touch tap
        whileHover={canHover ? { y: -8 } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="group relative flex flex-col overflow-hidden rounded-[28px] border border-forest/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift h-full"
    >
      {/* ── Image area ── */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: '4/5' }}
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={`${product.name} — handmade natural ${categoryLabel.toLowerCase()} by Team Naturals`}
            loading="lazy"
            initial={hasMultipleImages ? { opacity: 0, x: 36, scale: 1.02 } : { opacity: 0, scale: 1.04, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={hasMultipleImages ? { opacity: 0, x: -28 } : { opacity: 0, scale: 1.01, x: 0 }}
            transition={{ duration: hasMultipleImages ? 0.38 : 0.55, ease: 'easeOut' }}
            className={`absolute inset-0 h-full w-full object-cover object-[58%_42%] transition-transform duration-700 ease-out ${
              // Only scale on hover for true pointer devices
              canHover ? (hasMultipleImages ? 'group-hover:scale-115' : 'group-hover:scale-[1.14]') : ''
            }`}
          />
        </AnimatePresence>

        {/* Carousel Indicators (Bottom of image) */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full bg-white/40 overflow-hidden transition-all duration-300 ${
                  i === activeImageIndex ? 'w-6' : 'w-1.5'
                }`}
              >
                {i === activeImageIndex && hoverFill && (
                  <motion.div
                    key={activeImageIndex}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'linear' }}
                    className="h-full bg-white"
                  />
                )}
                {i === activeImageIndex && !hoverFill && (
                  <div className="h-full w-full bg-white" />
                )}
              </div>
            ))}
          </div>
        )}

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
          {(product as any).activeDiscount && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFC5C5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-forest shadow-sm">
              {(product as any).activeDiscount.event}
            </span>
          )}
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-forest/70 backdrop-blur-sm w-fit">
            {categoryLabel}
          </span>
        </div>

        {/* Quick-view concern tags — slide up on hover */}
        {product.concerns && product.concerns.length > 0 && (
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
        onClick={() => toggleWishlist(String(productId))}
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
          {product.shortDescription || (product as any).description || ''}
        </p>

        {/* Rating row */}
        {(() => {
          const rating = (product as any).avgRating ?? product.rating ?? null;
          const count = (product as any).reviewCount ?? product.reviewCount ?? 0;
          if (!rating && count === 0) return (
            <p className="mt-2.5 text-[11px] text-muted/60 italic">No reviews yet</p>
          );
          return (
            <div className="mt-2.5 flex items-center gap-2">
              <StarRating rating={rating ?? 5} size={12} />
              <span className="text-[11px] font-semibold text-forest">{(rating ?? 5).toFixed(1)}</span>
              <span className="text-[11px] text-muted/60">({count})</span>
            </div>
          );
        })()}

        {/* Price & Stock */}
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {(() => {
              const activeDiscount = (product as any).activeDiscount;
              const originalPrice = Number(product.price || 0);
              const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
              
              let finalPrice = originalPrice;
              let discountLabel = '';
              
              if (activeDiscount) {
                if (activeDiscount.type === 'percent') {
                  finalPrice = originalPrice - (originalPrice * Number(activeDiscount.value) / 100);
                  discountLabel = `${activeDiscount.value}% off`;
                } else if (activeDiscount.type === 'flat') {
                  finalPrice = Math.max(0, originalPrice - Number(activeDiscount.value));
                  discountLabel = `₹${activeDiscount.value} off`;
                }
              }

              return (
                <>
                  <span className="text-[18px] font-semibold text-forest">₹{finalPrice.toFixed(2)}</span>
                  {(activeDiscount || (compareAtPrice && compareAtPrice > originalPrice)) && (
                    <>
                      <span className="text-[13px] text-muted line-through">₹{compareAtPrice || originalPrice}</span>
                      <span className="whitespace-nowrap text-[12px] font-semibold text-[#388E3C]">
                        {activeDiscount ? discountLabel : `${Math.round((((compareAtPrice || originalPrice) - originalPrice) / (compareAtPrice || originalPrice)) * 100)}% off`}
                      </span>
                    </>
                  )}
                </>
              );
            })()}
            
            <span className="text-[11px] text-muted ml-auto">/ {product.weight || (product as any).size || '100g'}</span>
          </div>
          {product.stockQty !== undefined && product.stockQty > 0 && product.stockQty <= 10 && (
            <div className="mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                Only {product.stockQty} left
              </span>
            </div>
          )}
          {product.stockQty === 0 && (
            <div className="mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart & Quantity */}
        <div className="mt-3 flex flex-row items-center gap-2">
          {product.stockQty !== 0 && user?.role !== 'admin' && !added && (
            <div className="flex h-9 shrink-0 items-center justify-between rounded-full border border-forest/15 bg-white px-1 py-1 min-w-[72px] shadow-sm">
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-forest/70 hover:text-forest transition-colors focus:outline-none rounded-full"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-[12px] font-semibold text-forest select-none">{quantity}</span>
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.min(product.stockQty || 99, q + 1)); }}
                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-forest/70 hover:text-forest transition-colors focus:outline-none rounded-full"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              {user?.role === 'admin' ? (
              <motion.div
                key="admin-disabled"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest/15 bg-gray-50 py-2.5 text-[13px] font-medium text-forest/50 cursor-not-allowed"
                title="Admins cannot purchase items"
              >
                <ShoppingBagIcon size={14} strokeWidth={1.8} className="opacity-50" />
                Admin View
              </motion.div>
            ) : product.stockQty === 0 ? (
              <motion.div
                key="out-of-stock"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-forest/15 bg-gray-50 py-2.5 text-[13px] font-medium text-forest/50 cursor-not-allowed"
              >
                Out of Stock
              </motion.div>
            ) : added ? (
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
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-cream-soft px-2 py-2.5 text-[12px] font-medium text-forest transition-all duration-200 hover:border-forest hover:bg-forest hover:text-cream group-hover:border-forest group-hover:bg-forest group-hover:text-cream"
              >
                <ShoppingBagIcon size={14} strokeWidth={1.8} className="shrink-0" />
                <span className="whitespace-nowrap">Add<span className="hidden sm:inline"> to Cart</span></span>
              </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>

    {/* ── Auth gate modal ── */}
    <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
  </>
  );
}