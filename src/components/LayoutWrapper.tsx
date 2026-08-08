'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header').then((mod) => mod.Header), { ssr: true });
const Footer = dynamic(() => import('./Footer').then((mod) => mod.Footer), { ssr: true });
const MobileTabBar = dynamic(() => import('./MobileTabBar').then((mod) => mod.MobileTabBar), { ssr: false });
const CartFloatingPill = dynamic(() => import('./CartFloatingPill').then((mod) => mod.CartFloatingPill), { ssr: false });

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide header/footer on auth pages and admin pages
  const hideChrome = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname.startsWith('/admin');

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
