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
    switch(true) {
      case pathname === '/account/orders':
        return { title: 'Orders', desc: 'View your recent orders and track their status.' };
      case pathname.startsWith('/account/orders/'):
        return { title: '', desc: '' };
      case pathname === '/account/addresses':
        return { title: 'Saved Addresses', desc: 'Manage your shipping and billing addresses.' };
      case pathname === '/account/settings':
        return { title: 'Account Settings', desc: 'Manage notifications and account security.' };
      case pathname === '/account/menu':
        return { title: '', desc: '' };
      case pathname === '/account':
      default:
        return { title: 'Personal Information', desc: 'Update your details to keep your account secure.' };
    }
  };

  const { title, desc } = getPageInfo();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cream/30 px-4 pt-24 pb-20 lg:px-8">
        <div className="mx-auto w-full max-w-[1440px]">
          {/* Dynamic Header */}
          {title && (
            <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end text-center sm:text-left px-6 sm:px-10">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-2 text-[14px] text-muted">
                {desc}
              </p>
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Sidebar Navigation (Desktop Only) */}
            <aside className="hidden lg:col-span-3 lg:block">
              <nav className="sticky top-28 flex flex-col gap-2">
                {tabs.map((tab) => {
                  const isActive = tab.exact 
                    ? pathname === tab.href 
                    : pathname.startsWith(tab.href);
                  const Icon = tab.icon;
                  
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={`group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 ${
                        isActive 
                          ? 'bg-forest text-white shadow-soft' 
                          : 'text-forest/70 hover:bg-forest/5 hover:text-forest'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                      <span className="font-medium">{tab.label}</span>
                    </Link>
                  );
                })}
                
                {/* Logout Button */}
                <button
                  className="group mt-8 flex items-center gap-4 rounded-2xl p-4 text-terracotta transition-all duration-300 hover:bg-terracotta/10"
                  onClick={() => console.log('Logout clicked')} // Add actual logout logic later
                >
                  <LogOutIcon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-9 w-full rounded-3xl bg-white p-6 shadow-soft border border-forest/5 sm:p-10 min-h-[500px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
