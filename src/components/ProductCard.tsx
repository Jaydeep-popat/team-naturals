'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingBagIcon, ZapIcon, StarIcon } from 'lucide-react';
import type { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from './StarRating';
import { AuthModal } from './AuthModal';
<<<<<<< HEAD
import { isCloudinaryUrl } from '@/src/lib/cloudinary';
=======
import { OptimizedImage } from './OptimizedImage';
import { extractProductImageAlt } from '@/src/lib/seo';
import { useAvailableDiscounts } from '../hooks/useAvailableDiscounts';
>>>>>>> origin/yugal

// True hover guard: returns true only on pointer-fine (mouse) devices
const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;


export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
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

  const { getCouponsForProduct } = useAvailableDiscounts();
  const categoryId = typeof product.category === 'object' && product.category !== null ? (product.category as any).categoryId || (product.category as any).id : undefined;
  const applicableCoupons = getCouponsForProduct(productId, categoryId);
  const hasCoupons = applicableCoupons.length > 0;

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

  const rawImages = product.images || [];
  const images = rawImages.map((img) =>
    typeof img === 'string' ? img : ((img as any)?.url || '/placeholder.png')
  );
  const primaryImage = images[0] || '/placeholder.png';
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeImageIndex] || primaryImage;
  const imageAlt = extractProductImageAlt(rawImages, activeImageIndex, product.name);

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
        whileHover={canHover ? { y: -4 } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
<<<<<<< HEAD
        className={`group relative flex flex-col overflow-hidden border border-forest/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift h-full ${
          compact ? 'rounded-[18px]' : 'rounded-[28px]'
        }`}
=======
        className="group relative flex flex-col h-full"
>>>>>>> origin/yugal
    >
      {/* ── Image area ── */}
      <Link
        href={`/product/${product.slug}`}
<<<<<<< HEAD
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: compact ? '1/1' : '4/5' }}
=======
        className="relative block overflow-hidden bg-gray-50 rounded-[12px] sm:rounded-[16px]"
        style={{ aspectRatio: '1/1' }}
>>>>>>> origin/yugal
        tabIndex={0}
      >
        {compact ? (
          <Image
            src={activeImage}
            alt={`${product.name} — handmade natural ${categoryLabel.toLowerCase()} by Team Naturals`}
            width={400}
            height={400}
            unoptimized={!isCloudinaryUrl(activeImage)}
            className="absolute inset-0 h-full w-full object-cover object-[58%_42%]"
          />
        ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage}
            initial={hasMultipleImages ? { opacity: 0, x: 36, scale: 1.02 } : { opacity: 0, scale: 1.04, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={hasMultipleImages ? { opacity: 0, x: -28 } : { opacity: 0, scale: 1.01, x: 0 }}
            transition={{ duration: hasMultipleImages ? 0.38 : 0.55, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <OptimizedImage
              src={activeImage}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
              className={`object-cover object-top transition-transform duration-700 ease-out ${
                canHover ? (hasMultipleImages ? 'group-hover:scale-110' : 'group-hover:scale-[1.08]') : ''
              }`}
            />
          </motion.div>
        </AnimatePresence>
        )}

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

        {/* Badges */}
<<<<<<< HEAD
        <div className={`absolute left-2 top-2 flex flex-col gap-1 ${compact ? '' : 'left-3 top-3 gap-1.5'}`}>
          {product.bestSeller && !compact && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream shadow-sm">
              <ZapIcon size={9} strokeWidth={2.5} className="fill-gold text-gold" />
              Best Seller
            </span>
          )}
          {(product as any).activeDiscount && !compact && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFC5C5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-forest shadow-sm">
              {(product as any).activeDiscount.event}
            </span>
          )}
          {!compact && (
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-forest/70 backdrop-blur-sm w-fit">
              {categoryLabel}
            </span>
          )}
=======
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5 z-10 w-[calc(100%-32px)] pointer-events-none">
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 rounded bg-forest px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-cream shadow-sm max-w-full">
              <ZapIcon size={9} strokeWidth={2.5} className="fill-gold text-gold shrink-0" />
              <span className="truncate">Best Seller</span>
            </span>
          )}
          {(product as any).activeDiscount && (
            <span className="inline-flex items-center rounded bg-[#FFC5C5] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#4A1D1D] shadow-sm max-w-full">
              <span className="truncate">{(product as any).activeDiscount.event}</span>
            </span>
          )}
>>>>>>> origin/yugal
        </div>

        {/* Quick-view concern tags — slide up on hover */}
        {product.concerns && product.concerns.length > 0 && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <div className="flex flex-col gap-1 items-end">
              {product.concerns.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-forest/90 backdrop-blur-sm shadow-sm max-w-[80px] truncate"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Floating Rating Badge */}
        {(() => {
          // Provide a fallback rating of 4.8 if not specified in the backend, for better aesthetics
          const rating = (product as any).avgRating ?? product.rating ?? 4.8;
          return (
            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-sm">
              <span className="text-[11px] font-bold text-forest">{rating.toFixed(1)}</span>
              <StarIcon size={10} strokeWidth={2.5} className="fill-gold text-gold" />
            </div>
          );
        })()}
      </Link>

      {/* ── Wishlist button ── */}
      <motion.button
        type="button"
        onClick={() => toggleWishlist(String(productId))}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        aria-pressed={wished}
        whileTap={{ scale: 0.85 }}
<<<<<<< HEAD
        className={`absolute rounded-full bg-white/90 shadow-soft backdrop-blur transition-all hover:bg-white hover:shadow-lift ${
          compact ? 'right-2 top-2 p-1.5' : 'right-3 top-3 p-2.5'
        }`}
      >
        <HeartIcon
          size={compact ? 13 : 15}
=======
        className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 shadow-soft backdrop-blur transition-all hover:bg-white hover:shadow-lift"
      >
        <HeartIcon
          size={14}
>>>>>>> origin/yugal
          strokeWidth={1.8}
          className={`transition-colors duration-200 ${
            wished ? 'fill-terracotta text-terracotta' : 'text-forest/60'
          }`}
        />
      </motion.button>

      {/* ── Info area ── */}
<<<<<<< HEAD
      <div className={`flex flex-1 flex-col ${compact ? 'p-2.5 pb-3' : 'p-4 pb-5'}`}>
        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/link">
          <h3
            className={`font-display font-semibold leading-snug text-forest transition-colors group-hover/link:text-forest-soft ${
              compact ? 'text-[13px] line-clamp-2' : 'text-[18px]'
            }`}
          >
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        {!compact && (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">
            {product.shortDescription || (product as any).description || ''}
          </p>
        )}

        {/* Rating row */}
        {!compact &&
          (() => {
            const rating = (product as any).avgRating ?? product.rating ?? null;
            const count = (product as any).reviewCount ?? product.reviewCount ?? 0;
            if (!rating && count === 0)
              return <p className="mt-2.5 text-[11px] text-muted/60 italic">No reviews yet</p>;
            return (
              <div className="mt-2.5 flex items-center gap-2">
                <StarRating rating={rating ?? 5} size={12} />
                <span className="text-[11px] font-semibold text-forest">
                  {(rating ?? 5).toFixed(1)}
                </span>
                <span className="text-[11px] text-muted/60">({count})</span>
              </div>
            );
          })()}

        {/* Price & Stock */}
        <div className={`flex flex-col gap-1 ${compact ? 'mt-2' : 'mt-4'}`}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
=======
      <div className="flex flex-col pt-2.5 sm:pt-3">
        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/link block">
          <h3 className="font-display text-[15px] sm:text-[16px] font-bold leading-tight text-forest transition-colors group-hover/link:text-forest-soft line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {/* Price & Cart row */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex flex-col flex-1 min-w-0">
>>>>>>> origin/yugal
            {(() => {
              const mrp = product.compareAtPrice ? Number(product.compareAtPrice) : Number(product.price || 0);
              const productSellingPrice = Number(product.price || 0);
              const productDiscountPercent = mrp > productSellingPrice ? Math.round(((mrp - productSellingPrice) / mrp) * 100) : 0;
              
              const activeDiscount = (product as any).activeDiscount;
              let finalPrice = productSellingPrice;
              
              if (activeDiscount) {
                if (activeDiscount.type === 'percent') {
                  finalPrice = productSellingPrice - (productSellingPrice * Number(activeDiscount.value) / 100);
                } else if (activeDiscount.type === 'flat') {
                  finalPrice = Math.max(0, productSellingPrice - Number(activeDiscount.value));
                }
              }

              let bestCouponPrice = finalPrice;
              let bogoCoupon = null;
              
              if (applicableCoupons && applicableCoupons.length > 0) {
                let maxDiscValue = 0;
                applicableCoupons.forEach((coupon: any) => {
                  if (coupon.type === 'buy_x') {
                    bogoCoupon = coupon;
                  } else {
                    let discountAmt = 0;
                    if (coupon.type === 'percent') {
                      discountAmt = finalPrice * (Number(coupon.value) / 100);
                      const maxDisc = coupon.maxDiscount ? Number(coupon.maxDiscount) : Infinity;
                      if (discountAmt > maxDisc) discountAmt = maxDisc;
                    } else if (coupon.type === 'flat') {
                      discountAmt = Number(coupon.value);
                    }
                    
                    if (discountAmt > maxDiscValue) {
                      maxDiscValue = discountAmt;
                    }
                  }
                });
                bestCouponPrice = Math.max(0, finalPrice - maxDiscValue);
              }

              return (
<<<<<<< HEAD
                <>
                  <span
                    className={`font-semibold text-forest ${
                      compact ? 'text-[14px]' : 'text-[18px]'
                    }`}
                  >
                    ₹{finalPrice.toFixed(2)}
                  </span>
                  {(activeDiscount || (compareAtPrice && compareAtPrice > originalPrice)) && (
                    <>
                      <span className="text-[13px] text-muted line-through">₹{compareAtPrice || originalPrice}</span>
                      <span className="whitespace-nowrap text-[12px] font-semibold text-[#388E3C]">
                        {activeDiscount ? discountLabel : `${Math.round((((compareAtPrice || originalPrice) - originalPrice) / (compareAtPrice || originalPrice)) * 100)}% off`}
=======
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[14px] sm:text-[16px] font-bold text-forest">
                      ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </span>
                    {productDiscountPercent > 0 && (
                      <>
                        <span className="text-[11px] sm:text-[12px] text-muted line-through">
                          ₹{Math.round(mrp).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#388E3C]">
                          {productDiscountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  
                  {activeDiscount && (
                    <div className="flex items-center text-[10px] sm:text-[11px] text-forest/80 overflow-hidden text-ellipsis whitespace-nowrap bg-blue-50/50 rounded px-1 w-fit max-w-full border border-blue-100/50">
                      <span className="mr-1">🎁</span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-blue-800">
                        {activeDiscount.event}
>>>>>>> origin/yugal
                      </span>
                      <span className="mx-1">·</span>
                      <span className="font-bold whitespace-nowrap text-blue-700">Extra {activeDiscount.type === 'percent' ? `${activeDiscount.value}%` : `₹${activeDiscount.value}`} OFF</span>
                    </div>
                  )}

                  {bogoCoupon ? (
                    <div className="flex items-center text-[10px] sm:text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100/50 px-1.5 py-0.5 rounded w-fit mt-0.5 uppercase tracking-wide">
                      <span className="mr-1">🎁</span> BUY {(bogoCoupon as any).minQuantity || 1} GET {(bogoCoupon as any).getQuantity || 1} {Number((bogoCoupon as any).value) === 100 ? 'FREE' : `AT ${Number((bogoCoupon as any).value)}% OFF`}
                    </div>
                  ) : bestCouponPrice < finalPrice ? (
                    <div className="flex items-center text-[14px] sm:text-[15px] text-blue-700 w-fit mt-0.5">
                      <span className="font-extrabold">Buy at ₹{Math.round(bestCouponPrice).toLocaleString('en-IN')}</span>
                    </div>
                  ) : bestCouponPrice === finalPrice && hasCoupons ? (
                    <div className="flex items-center text-[10px] sm:text-[11px] text-forest/70 w-fit mt-0.5">
                      <span className="mr-1">🏷</span>
                      <span className="font-medium">Offers available</span>
                    </div>
                  ) : null}
                </div>
              );
            })()}
<<<<<<< HEAD
            
            {!compact && (
              <span className="text-[11px] text-muted ml-auto">
                / {product.weight || (product as any).size || '100g'}
              </span>
            )}
          </div>
          {!compact && product.stockQty !== undefined && product.stockQty > 0 && product.stockQty <= 10 && (
            <div className="mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                Only {product.stockQty} left
              </span>
            </div>
          )}
          {!compact && product.stockQty === 0 && (
            <div className="mt-1">
              <span className="inline-flex items-center text-[11px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart & Quantity */}
        {!compact && (
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
=======
          </div>
          
          {/* Quick Add Button */}
          <div className="shrink-0 flex items-end h-full self-end pb-1">
            {product.stockQty !== 0 && user?.role !== 'admin' && !added ? (
>>>>>>> origin/yugal
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-cream transition-colors hover:bg-forest-deep sm:h-8 sm:w-8"
              >
                <ShoppingBagIcon size={14} strokeWidth={1.8} />
              </motion.button>
            ) : added ? (
               <motion.div
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-soft text-cream sm:h-8 sm:w-8"
               >
                 <ZapIcon size={14} strokeWidth={2} className="fill-gold text-gold" />
               </motion.div>
            ) : null}
          </div>
        </div>
        )}
      </div>
    </motion.article>

    {/* ── Auth gate modal ── */}
    <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
  </>
  );
}