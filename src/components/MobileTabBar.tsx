'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

// SVG filled/stroked icon pairs — premium custom icons
function HomeFilledIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <path
          d="M3 10.182L12 3l9 7.182V21a1 1 0 0 1-1 1H15v-6h-2v6H4a1 1 0 0 1-1-1V10.182Z"
          fill="currentColor"
        />
      ) : (
        <>
          <path d="M3 10.182L12 3l9 7.182V21a1 1 0 0 1-1 1H15v-6h-2v6H4a1 1 0 0 1-1-1V10.182Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

function ShopFilledIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <>
          <path d="M12 2C8.5 2 6 5 6 8H4l-1 14h18l-1-14h-2c0-3-2.5-6-6-6Z" fill="currentColor" opacity="0.2" />
          <path d="M12 2C8.5 2 6 5 6 8H4l-1 14h18l-1-14h-2c0-3-2.5-6-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="currentColor" />
          <circle cx="9" cy="8" r="1" fill="white" />
          <circle cx="15" cy="8" r="1" fill="white" />
        </>
      ) : (
        <path d="M12 2C8.5 2 6 5 6 8H4l-1 14h18l-1-14h-2c0-3-2.5-6-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CartFilledIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" fill="currentColor" />
          <path d="M3 6h18" stroke="white" strokeWidth="1.5" />
          <path d="M16 10a4 4 0 0 1-8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function AccountFilledIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" opacity="0.85" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const tabs = [
  { label: 'Home', href: '/', Icon: HomeFilledIcon },
  { label: 'Shop', href: '/shop', Icon: ShopFilledIcon },
  { label: 'Cart', href: '/cart', Icon: CartFilledIcon },
  { label: 'Account', href: '/account/menu', Icon: AccountFilledIcon },
];

const SCROLL_THRESHOLD = 6; // px delta to consider a direction change

export function MobileTabBar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const lastDir = useRef<'up' | 'down'>('up');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_THRESHOLD) return;

      const dir = delta > 0 ? 'down' : 'up';

      // Only act on direction change to avoid constant toggling
      if (dir !== lastDir.current) {
        setVisible(dir === 'up');
        lastDir.current = dir;
      }

      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Always visible at very top of page
  useEffect(() => {
    if (window.scrollY < 40) setVisible(true);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="mobile-tab-bar"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 36, mass: 0.8 }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
          aria-label="Mobile quick navigation"
        >
          {/* Solid white bar */}
          <div className="border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
            <ul className="mx-auto flex max-w-md items-stretch">
              {tabs.map(({ label, href, Icon }) => {
                const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <li key={href} className="flex-1">
                    <Link
                      href={href}
                      className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium select-none"
                      aria-label={label}
                      aria-current={active ? 'page' : undefined}
                    >
                      {/* Icon — only the icon itself colors green when active */}
                      <span className="relative">
                        <span
                          className={`flex transition-colors duration-200 ${
                            active ? 'text-[#1F3D2B]' : 'text-gray-400'
                          }`}
                        >
                          <Icon filled={active} />
                        </span>

                        {/* Cart badge */}
                        {label === 'Cart' && itemCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-white shadow-sm z-20"
                          >
                            {itemCount > 9 ? '9+' : itemCount}
                          </motion.span>
                        )}
                      </span>

                      {/* Label */}
                      <span
                        className={`transition-colors duration-200 ${
                          active ? 'font-bold text-[#1F3D2B]' : 'font-medium text-gray-400'
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}