'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header').then((mod) => mod.Header), { ssr: true });
const Footer = dynamic(() => import('./Footer').then((mod) => mod.Footer), { ssr: true });
const MobileTabBar = dynamic(() => import('./MobileTabBar').then((mod) => mod.MobileTabBar), { ssr: false });
const CartFloatingPill = dynamic(() => import('./CartFloatingPill').then((mod) => mod.CartFloatingPill), { ssr: false });
const WhatsAppFloat = dynamic(() => import('./WhatsAppFloat').then((mod) => mod.WhatsAppFloat), { ssr: false });
const FlyToCartManager = dynamic(() => import('./FlyToCart').then((mod) => mod.FlyToCartManager), { ssr: false });

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header/footer on auth pages and admin pages
  const hideChrome = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/admin');
  
  // Hide bottom tab bar and cart pill during checkout steps and account pages to reduce distractions
  const isCheckoutStep = pathname === '/cart' || pathname.startsWith('/checkout') || pathname.startsWith('/order-confirmation');
  const isAccountPage = pathname.startsWith('/account');
  const hideTabBar = hideChrome || isCheckoutStep || isAccountPage;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {!hideChrome && <Header />}
      <main className={`flex-1 ${!hideChrome ? 'pt-[88px]' : ''} ${!hideTabBar ? 'pb-16 lg:pb-0' : ''}`}>{children}</main>
      {!hideChrome && <Footer />}
      {!hideTabBar && <MobileTabBar />}
      {!hideTabBar && <CartFloatingPill />}
      {!hideTabBar && <WhatsAppFloat />}
      {!hideChrome && <FlyToCartManager />}
    </div>
  );
}
