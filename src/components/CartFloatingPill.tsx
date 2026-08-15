'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function CartFloatingPill() {
  const { lines, itemCount } = useCart();
  const pathname = usePathname();

  // Hide on cart, checkout, and auth routes
  const hideOnRoutes = ['/cart', '/checkout/address', '/checkout/payment', '/order-confirmation', '/login', '/register'];
  const shouldHide = hideOnRoutes.includes(pathname);

  // If empty or on a hidden route, don't show
  const isVisible = itemCount > 0 && !shouldHide;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "-50%", y: 100, opacity: 0, scale: 0.8 }}
          animate={{ x: "-50%", y: 0, opacity: 1, scale: 1 }}
          exit={{ x: "-50%", y: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
          className="fixed bottom-[5.5rem] lg:bottom-8 left-1/2 z-[100] flex w-[calc(100vw-2rem)] sm:w-max items-center justify-center rounded-full bg-[#348C31] p-1.5 pr-4 sm:pr-5 shadow-2xl shadow-[#348C31]/40"
        >
          <Link href="/cart" className="flex w-full items-center justify-between gap-4 sm:justify-start">
            <div className="flex items-center gap-3">
              {/* Overlapping Thumbnails (Mobile: Max 2) */}
              <div className="flex sm:hidden -space-x-3">
                {lines.slice(0, 2).map((line, idx) => (
                  <div
                    key={`mobile-${line.product.id}`}
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2.5px] border-[#348C31] bg-white shadow-sm"
                    style={{ zIndex: 2 - idx }}
                  >
                    <img
                      src={typeof line.product.images?.[0] === 'string' ? line.product.images[0] : ((line.product.images?.[0] as any)?.url || '/placeholder.png')}
                      alt={line.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {lines.length > 2 && (
                  <div className="relative z-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#348C31] bg-white/20 backdrop-blur-sm text-[12px] font-bold text-white shadow-sm">
                    +{lines.length - 2}
                  </div>
                )}
              </div>

              {/* Overlapping Thumbnails (Desktop: Max 3) */}
              <div className="hidden sm:flex -space-x-3">
                {lines.slice(0, 3).map((line, idx) => (
                  <div
                    key={`desktop-${line.product.id}`}
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-[2.5px] border-[#348C31] bg-white shadow-sm"
                    style={{ zIndex: 3 - idx }}
                  >
                    <img
                      src={typeof line.product.images?.[0] === 'string' ? line.product.images[0] : ((line.product.images?.[0] as any)?.url || '/placeholder.png')}
                      alt={line.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {lines.length > 3 && (
                  <div className="relative z-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[2.5px] border-[#348C31] bg-white/20 backdrop-blur-sm text-[12px] font-bold text-white shadow-sm">
                    +{lines.length - 3}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left mr-2">
                <span className="font-display text-[15px] font-bold text-white leading-tight">
                  View cart
                </span>
                <span className="text-[12px] font-medium text-white/90 leading-tight mt-0.5">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            {/* Right Chevron */}
            <div className="flex items-center justify-center text-white">
              <ChevronRightIcon size={22} strokeWidth={2.5} />
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
