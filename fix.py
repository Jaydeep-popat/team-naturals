import os
import re

# Fix addresses/page.tsx
addr_path = r'c:\Users\popat\Desktop\team-naturals\src\app\account\addresses\page.tsx'
with open(addr_path, 'r', encoding='utf-8') as f:
    addr_content = f.read()

addr_content = re.sub(
    r'<<<<<<< HEAD.*?=======(.*?)(?:>>>>>>> origin/yugal)',
    r'\1',
    addr_content,
    flags=re.DOTALL
)

with open(addr_path, 'w', encoding='utf-8') as f:
    f.write(addr_content)

# Fix ProductCard.tsx
card_path = r'c:\Users\popat\Desktop\team-naturals\src\components\ProductCard.tsx'
with open(card_path, 'r', encoding='utf-8') as f:
    card_content = f.read()

# 1. Imports
c1 = r'''<<<<<<< HEAD
import { isCloudinaryUrl } from '@/src/lib/cloudinary';
=======
import { OptimizedImage } from './OptimizedImage';
import { extractProductImageAlt } from '@/src/lib/seo';
import { useAvailableDiscounts } from '../hooks/useAvailableDiscounts';
>>>>>>> origin/yugal'''
r1 = '''import { isCloudinaryUrl } from '@/src/lib/cloudinary';
import { OptimizedImage } from './OptimizedImage';
import { extractProductImageAlt } from '@/src/lib/seo';
import { useAvailableDiscounts } from '../hooks/useAvailableDiscounts';'''
card_content = card_content.replace(c1, r1)

# 2. Wrapper classes
c2 = r'''<<<<<<< HEAD
        className={`group relative flex flex-col overflow-hidden border border-forest/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift h-full ${
          compact ? 'rounded-[18px]' : 'rounded-[28px]'
        }`}
=======
        className="group relative flex flex-col h-full"
>>>>>>> origin/yugal'''
r2 = '''        className={`group relative flex flex-col overflow-hidden border border-forest/8 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift h-full ${
          compact ? 'rounded-[18px]' : 'rounded-[28px]'
        }`}'''
card_content = card_content.replace(c2, r2)

# 3. Image aspect ratio
c3 = r'''<<<<<<< HEAD
        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: compact ? '1/1' : '4/5' }}
=======
        className="relative block overflow-hidden bg-gray-50 rounded-[12px] sm:rounded-[16px]"
        style={{ aspectRatio: '1/1' }}
>>>>>>> origin/yugal'''
r3 = '''        className="relative block overflow-hidden bg-cream"
        style={{ aspectRatio: compact ? '1/1' : '4/5' }}'''
card_content = card_content.replace(c3, r3)

# 4. Badges
c4 = r'''<<<<<<< HEAD
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
>>>>>>> origin/yugal'''
r4 = '''        <div className={`absolute left-2 top-2 flex flex-col gap-1 z-10 w-[calc(100%-32px)] pointer-events-none ${compact ? '' : 'left-3 top-3 gap-1.5'}`}>
          {product.bestSeller && !compact && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream shadow-sm max-w-full">
              <ZapIcon size={9} strokeWidth={2.5} className="fill-gold text-gold shrink-0" />
              <span className="truncate">Best Seller</span>
            </span>
          )}
          {(product as any).activeDiscount && !compact && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFC5C5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-forest shadow-sm max-w-full">
              <span className="truncate">{(product as any).activeDiscount.event}</span>
            </span>
          )}
          {!compact && (
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-forest/70 backdrop-blur-sm w-fit">
              {categoryLabel}
            </span>
          )}'''
card_content = card_content.replace(c4, r4)

# 5. Heart icon
c5 = r'''<<<<<<< HEAD
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
>>>>>>> origin/yugal'''
r5 = '''        className={`absolute rounded-full bg-white/90 shadow-soft backdrop-blur transition-all hover:bg-white hover:shadow-lift z-20 ${
          compact ? 'right-2 top-2 p-1.5' : 'right-3 top-3 p-2.5'
        }`}
      >
        <HeartIcon
          size={compact ? 13 : 15}'''
card_content = card_content.replace(c5, r5)

# 6. Price block
c6 = r'''<<<<<<< HEAD
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
>>>>>>> origin/yugal'''
r6 = '''      <div className={`flex flex-1 flex-col ${compact ? 'p-2.5 pb-3' : 'p-4 pb-5'}`}>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col flex-1 min-w-0">'''
card_content = card_content.replace(c6, r6)

# 7. Price content and cart button conflict
c7 = r'''<<<<<<< HEAD
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
>>>>>>> origin/yugal'''
r7 = '''                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-bold text-forest ${compact ? 'text-[14px]' : 'text-[16px]'}`}>
                      ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </span>
                    {productDiscountPercent > 0 && (
                      <>
                        <span className={`text-muted line-through ${compact ? 'text-[11px]' : 'text-[12px]'}`}>
                          ₹{Math.round(mrp).toLocaleString('en-IN')}
                        </span>
                        <span className={`font-bold text-[#388E3C] ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
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
            
            {!compact && (
              <span className="text-[11px] text-muted ml-auto">
                / {product.weight || (product as any).size || '100g'}
              </span>
            )}
          </div>
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
            ) : ('''
card_content = card_content.replace(c7, r7)

with open(card_path, 'w', encoding='utf-8') as f:
    f.write(card_content)

print("Done fixing merge conflicts.")
