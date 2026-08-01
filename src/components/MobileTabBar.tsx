'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { HomeIcon, LeafIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const tabs = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Shop', href: '/shop', icon: LeafIcon },
  { label: 'Cart', href: '/cart', icon: ShoppingBagIcon },
  { label: 'Account', href: '/login', icon: UserIcon },
];

/** Quick-commerce style bottom nav for mobile. */
export function MobileTabBar() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/8 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Mobile quick navigation"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center gap-1 py-2.5 text-[10px]"
                aria-label={label}
              >
                <span className="relative">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.5}
                    className={active ? 'text-forest' : 'text-muted'}
                  />
                  {label === 'Cart' && itemCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-medium text-white">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span className={active ? 'text-forest' : 'text-muted'}>{label}</span>
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute -top-px h-0.5 w-8 rounded-full bg-forest"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}