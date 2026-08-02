'use client';

import React from 'react';
import { 
  UserIcon, ShoppingBagIcon, MapPinIcon, SettingsIcon, LogOutIcon, 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/AuthGuard';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/account', label: 'Personal Info', icon: UserIcon, exact: true },
    { href: '/account/orders', label: 'Order History', icon: ShoppingBagIcon, exact: false },
    { href: '/account/addresses', label: 'Saved Addresses', icon: MapPinIcon, exact: false },
    { href: '/account/settings', label: 'Settings', icon: SettingsIcon, exact: false },
  ];

  const getPageInfo = () => {
    switch(pathname) {
      case '/account/orders':
        return { title: 'Orders', desc: 'View your recent orders and track their status.' };
      case '/account/addresses':
        return { title: 'Saved Addresses', desc: 'Manage your shipping and billing addresses.' };
      case '/account/settings':
        return { title: 'Account Settings', desc: 'Manage notifications and account security.' };
      case '/account/menu':
        return { title: '', desc: '' };
      case '/account':
      default:
        return { title: 'Personal Information', desc: 'Update your details to keep your account secure.' };
    }
  };

  const { title, desc } = getPageInfo();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cream/30 px-4 pt-24 pb-20 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          {/* Dynamic Header */}
          <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end text-center sm:text-left">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-2 text-[14px] text-muted">
                {desc}
              </p>
            </div>
          </div>

          <div>
            {/* Main Content Area */}
            <main className="w-full rounded-3xl bg-white p-6 shadow-soft border border-forest/5 sm:p-10 min-h-[500px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
