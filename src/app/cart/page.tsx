'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LockIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TagIcon,
  Trash2Icon,
  TruckIcon,
  SparklesIcon,
  ChevronRight,
  XIcon,
  HeartIcon,
  ClockIcon,
  Loader2
} from 'lucide-react';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { QtyStepper } from "@/src/components/QtyStepper";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { SkeletonBlock } from "@/src/components/Skeletons";
import { discounts } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { lines, setQuantity, removeFromCart, originalSubtotal, subtotal, promoCode, eventDiscountAmount, promoDiscountAmount, applyPromo, removePromo, toggleWishlist, wishlist } = useCart();
  const loading = usePageLoad(500);
  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<any[]>([]);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);

  const shipping = originalSubtotal === 0 || originalSubtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping - promoDiscountAmount;

  const totalMRP = lines.reduce((acc, line) => acc + (line.product.price * line.quantity), 0);
  const itemDiscount = totalMRP - originalSubtotal;
  const totalSaved = itemDiscount + promoDiscountAmount;

  useEffect(() => {
    if (!loading && lines.length === 0) {
      router.replace('/');
    }
  }, [loading, lines.length, router]);

  useEffect(() => {
    let mounted = true;

    discounts.available()
      .then((res) => {
        if (!mounted) return;
        setAvailableDiscounts(res.data?.discounts || []);
      })
      .catch((error) => {
        console.error('Failed to fetch available discounts:', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="w-full bg-[#f1f3f6] min-h-screen pb-24 lg:pb-16 font-sans">
      <Suspense fallback={null}>
        <AutoApplyPromo />
      </Suspense>
      
      <div className="bg-white shadow-sm mb-4">
        <div className="mx-auto max-w-4xl px-5 py-6 lg:px-8 text-center">
          <h1 className="font-display text-2xl font-medium tracking-tight text-forest">Secure Checkout</h1>
          <div className="mt-4">
            <CheckoutStepper currentStep={1} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-10 lg:px-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28 w-full rounded-xl bg-white" />
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-5 py-32 text-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-cream-soft text-forest shadow-sm"
          >
            <ShoppingBagIcon size={32} strokeWidth={1.5} />
          </motion.span>
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-medium text-forest">Your cart is empty!</h2>
            <p className="text-[15px] text-muted">Add items to it now.</p>
          </div>
          <Link
            href="/shop"
            className="mt-4 rounded-sm bg-[#fb641b] px-12 py-3.5 text-[15px] font-medium text-white shadow-sm transition-all active:scale-95"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1100px] gap-4 px-2 sm:px-5 lg:grid-cols-[1fr_340px] lg:px-8 items-start">
          
          {/* Left Column: Cart Items */}
          <div className="space-y-4">
            <div className="bg-white sm:rounded-md shadow-sm border border-gray-200/60 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                <AnimatePresence initial={false}>
                  {lines.map((line) => {
                    const productId = (line.product as any).productId || line.product.id;
                    const isWished = wishlist.includes(String(productId));
                    
                    const originalItemPrice = line.product.price * line.quantity;
                    const finalItemPrice = (line.finalUnitPrice || line.product.price) * line.quantity;
                    const hasDiscount = finalItemPrice < originalItemPrice;
                    const discountPercent = hasDiscount ? Math.round(((originalItemPrice - finalItemPrice) / originalItemPrice) * 100) : 0;
                    
                    return (
                    <motion.li
                      key={productId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-5 flex flex-col gap-4"
                    >
                      <div className="flex gap-4">
                        <Link href={`/product/${line.product.slug}`} className="flex-shrink-0">
                          <div className="overflow-hidden bg-gray-50 border border-gray-100 rounded-sm">
                            <img
                              src={typeof line.product.images?.[0] === 'string' ? line.product.images[0] : ((line.product.images?.[0] as any)?.url || '/placeholder.png')}
                              alt={line.product.name}
                              className="h-20 w-20 sm:h-28 sm:w-28 object-contain mix-blend-multiply p-1"
                            />
                          </div>
                        </Link>
                        
                        <div className="flex-1 flex flex-col justify-start">
                          <Link href={`/product/${line.product.slug}`} className="hover:text-[#2874f0] transition-colors">
                            <h2 className="truncate font-medium text-[15px] sm:text-base leading-tight text-gray-800">
                              {line.product.name}
                            </h2>
                          </Link>
                          <p className="mt-1 text-[13px] text-gray-500">
                            {line.product.weight || '100g'}
                          </p>
                          
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-medium text-[17px] text-gray-900">
                              ₹{finalItemPrice}
                            </span>
                            {hasDiscount && (
                              <>
                                <span className="text-[13px] text-gray-500 line-through">
                                  ₹{originalItemPrice}
                                </span>
                                <span className="text-[13px] font-bold text-[#388e3c]">
                                  {discountPercent}% Off
                                </span>
                              </>
                            )}
                          </div>
                          
                          {line.appliedEventName && (
                            <span className="inline-block mt-1 text-[11px] font-bold text-[#388e3c] bg-[#e8f3eb] px-1.5 py-0.5 rounded-sm">
                              {line.appliedEventName}
                            </span>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-gray-500 font-medium">
                             <ClockIcon size={14} className="text-gray-400" /> Delivery by tomorrow, 10 PM
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 pt-2">
                        <QtyStepper
                          value={line.quantity}
                          onChange={(q) => setQuantity(String(productId), q)}
                          label={line.product.name}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            toggleWishlist(String(productId));
                            removeFromCart(String(productId));
                            toast.success("Saved for later");
                          }}
                          className="text-[14px] font-medium text-gray-700 hover:text-[#2874f0] transition-colors uppercase"
                        >
                          Save for later
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(String(productId))}
                          className="text-[14px] font-medium text-gray-700 hover:text-[#2874f0] transition-colors uppercase"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  )})}
                </AnimatePresence>
              </ul>
              
              <div className="bg-white p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    setIsProceeding(true);
                    router.push('/checkout/address');
                  }}
                  disabled={isProceeding}
                  className="hidden lg:flex items-center justify-center rounded-sm bg-[#fb641b] px-10 py-3.5 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-[#f3580a] gap-2 disabled:opacity-70"
                >
                  {isProceeding && <Loader2 size={16} className="animate-spin" />}
                  {isProceeding ? 'Loading...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Price Details & Offers */}
          <div className="space-y-4">
            
            {/* Coupon Apply Button */}
            <div className="bg-white sm:rounded-md shadow-sm border border-gray-200/60 p-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <TagIcon size={18} className="text-[#2874f0]" fill="#2874f0" fillOpacity={0.1} />
                   <span className="font-medium text-gray-800">Coupons & Offers</span>
                 </div>
                 {!promoCode && (
                   <button 
                     onClick={() => setShowOffersModal(true)}
                     className="text-sm font-medium text-[#2874f0] hover:underline"
                   >
                     Apply
                   </button>
                 )}
               </div>
               
               {promoCode ? (
                 <div className="mt-3 flex items-center justify-between rounded-md border border-[#388e3c]/20 bg-[#e8f3eb]/50 px-3 py-2.5">
                   <div>
                     <p className="text-sm font-bold text-[#388e3c]">{promoCode}</p>
                     <p className="text-[11px] text-[#388e3c]">Coupon applied successfully</p>
                   </div>
                   <button
                     onClick={() => removePromo()}
                     className="text-xs font-semibold text-gray-500 hover:text-red-500"
                   >
                     REMOVE
                   </button>
                 </div>
               ) : (
                 <p className="mt-1 text-xs text-gray-500">Log in to see best offers</p>
               )}
            </div>

            {/* Price Details */}
            <aside className="bg-white sm:rounded-md shadow-sm border border-gray-200/60 p-5">
              <h2 className="font-medium text-gray-500 border-b border-gray-100 pb-3 uppercase text-[15px] tracking-wide">Price Details</h2>

              <dl className="space-y-4 py-4 text-[15px]">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-800">Price ({lines.length} items)</dt>
                  <dd className="text-gray-800">₹{totalMRP}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-800">Discount</dt>
                  <dd className="text-[#388e3c] font-medium">− ₹{itemDiscount}</dd>
                </div>
                {promoDiscountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-800">Coupons for you</dt>
                    <dd className="text-[#388e3c] font-medium">− ₹{promoDiscountAmount}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-gray-800">Delivery Charges</dt>
                  <dd className="text-[#388e3c] font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
                </div>
                
                <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-4 mt-2">
                  <dt className="font-medium text-lg text-gray-900">Total Amount</dt>
                  <dd className="font-medium text-lg text-gray-900">₹{total}</dd>
                </div>
              </dl>
              
              {totalSaved > 0 && (
                <div className="border-t border-gray-100 pt-4 text-[#388e3c] font-medium text-[15px]">
                  You will save ₹{totalSaved} on this order
                </div>
              )}
            </aside>
            
            <div className="flex items-center gap-2 pt-1 text-xs text-gray-500 font-medium px-2 justify-center">
              <ShieldCheckIcon size={16} className="text-gray-400" /> 
              Safe and Secure Payments. Easy returns.
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar for Mobile */}
      {lines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-gray-900">₹{total}</span>
            <span className="text-[12px] text-[#2874f0] font-medium" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>View price details</span>
          </div>
          <button
            onClick={() => {
              setIsProceeding(true);
              router.push('/checkout/address');
            }}
            disabled={isProceeding}
            className="rounded-sm bg-[#fb641b] px-8 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-[#f3580a] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isProceeding && <Loader2 size={16} className="animate-spin" />}
            {isProceeding ? 'Loading...' : 'Place Order'}
          </button>
        </div>
      )}

      {/* Offers Modal / Bottom Sheet */}
      <AnimatePresence>
        {showOffersModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOffersModal(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[110] bg-[#f1f3f6] rounded-t-2xl sm:rounded-2xl sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[450px] sm:max-w-[90vw] sm:max-h-[85vh] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm z-10">
                <h3 className="text-lg font-medium text-gray-800">Apply Coupon</h3>
                <button onClick={() => setShowOffersModal(false)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <XIcon size={20} className="text-gray-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <form
                  className="flex gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!promoInput.trim()) return;
                    setIsApplyingPromo(true);
                    await applyPromo(promoInput.trim());
                    setIsApplyingPromo(false);
                    setPromoInput('');
                    setShowOffersModal(false);
                  }}
                >
                  <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5">
                    <input
                      id="promo"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 font-medium"
                      disabled={isApplyingPromo}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !promoInput.trim()}
                    className="rounded-md bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-50"
                  >
                    {isApplyingPromo ? '...' : 'APPLY'}
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Offers</p>
                  
                  {(() => {
                    const getProductId = (p: any) => p?.productId || p?.id;
                    const applicableDiscounts = availableDiscounts.filter(offer => {
                      if (offer.applyTo === 'specific_products' && offer.targetItemIds) {
                        const targetIds = Array.isArray(offer.targetItemIds) ? offer.targetItemIds : JSON.parse(offer.targetItemIds || '[]');
                        return lines.some(line => {
                          const pId = getProductId(line.product);
                          return targetIds.includes(String(pId)) || targetIds.includes(Number(pId));
                        });
                      }
                      if (offer.applyTo === 'specific_categories' && offer.targetItemIds) {
                        const targetIds = Array.isArray(offer.targetItemIds) ? offer.targetItemIds : JSON.parse(offer.targetItemIds || '[]');
                        return lines.some(line => {
                          const cId = line.product.category;
                          return cId && (targetIds.includes(String(cId)) || targetIds.includes(Number(cId)));
                        });
                      }
                      return true;
                    });

                    if (applicableDiscounts.length === 0) {
                      return (
                        <div className="rounded-md border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                          No active offers right now.
                        </div>
                      );
                    }

                    return applicableDiscounts.slice(0, 10).map((offer) => {
                      const minOrder = Number(offer.minOrderAmount || 0);
                      const currentTotal = originalSubtotal || subtotal;
                      const isEligible = currentTotal >= minOrder;
                      const shortfall = minOrder - currentTotal;
                      
                      return (
                        <div key={offer.discountId || offer.code} className="bg-white rounded-md border border-gray-200 overflow-hidden">
                          <div className="p-4 flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-[#e8f3eb] text-[#388e3c] rounded border border-[#388e3c]/20">
                              <TagIcon size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800 text-[15px]">{offer.code}</span>
                                <button
                                  onClick={async () => {
                                    if (!isEligible) return;
                                    setIsApplyingPromo(true);
                                    await applyPromo(offer.code);
                                    setIsApplyingPromo(false);
                                    setShowOffersModal(false);
                                  }}
                                  disabled={isApplyingPromo || !isEligible}
                                  className={`text-sm font-bold ${isEligible ? 'text-[#2874f0]' : 'text-gray-400'}`}
                                >
                                  APPLY
                                </button>
                              </div>
                              <span className="block text-[13px] text-gray-600 mt-1">
                                {offer.type === 'percent' 
                                  ? `Get ${offer.value}% off on this order` 
                                  : offer.type === 'buy_x'
                                  ? `Buy ${offer.minQuantity || 1} Get ${offer.getQuantity || 1} at ${offer.value}% off`
                                  : `Get ₹${offer.value} off on this order`}
                              </span>
                              {!isEligible && (
                                <span className="block text-xs text-red-500 mt-2 font-medium">
                                  Shop for ₹{shortfall.toFixed(2)} more to unlock this offer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AutoApplyPromo() {
  const searchParams = useSearchParams();
  const { applyPromo, promoCode } = useCart();
  const promo = searchParams.get('promo');
  
  useEffect(() => {
    if (promo && promoCode !== promo) {
      applyPromo(promo);
    }
  }, [promo, promoCode, applyPromo]);

  return null;
}
