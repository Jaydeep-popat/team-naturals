'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileTabBar } from './MobileTabBar';
import { CartFloatingPill } from './CartFloatingPill';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header/footer on auth pages
  const hideChrome = pathname === '/login' || pathname === '/register';

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {!hideChrome && <Header />}
      <main className={`flex-1 pb-16 lg:pb-0 ${!hideChrome ? 'pt-[88px]' : ''}`}>{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <MobileTabBar />}
      {!hideChrome && <CartFloatingPill />}
    </div>
  );
}
