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
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
          className="fixed bottom-24 left-1/2 z-[100] flex w-max -translate-x-1/2 items-center justify-center rounded-full bg-[#348C31] p-1.5 pr-5 shadow-2xl shadow-[#348C31]/40 lg:bottom-12"
        >
          <Link href="/cart" className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Overlapping Thumbnails */}
              <div className="flex -space-x-3">
                {lines.slice(0, 3).map((line, idx) => (
                  <div
                    key={line.product.id}
                    className="relative z-10 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-[2.5px] border-[#348C31] bg-white shadow-sm"
                    style={{ zIndex: 3 - idx }}
                  >
                    <img
                      src={line.product.images[0]}
                      alt={line.product.name}
                      className="h-[80%] w-[80%] object-contain"
                    />
                  </div>
                ))}
                {lines.length > 3 && (
                  <div className="relative z-0 flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-[#348C31] bg-white/20 backdrop-blur-sm text-[12px] font-bold text-white shadow-sm -ml-3">
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
