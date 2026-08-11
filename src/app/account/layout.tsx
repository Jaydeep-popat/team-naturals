'use client';

import React from 'react';
import { 
  UserIcon, ShoppingBagIcon, MapPinIcon, SettingsIcon, LogOutIcon, ShieldCheckIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/src/components/AuthGuard';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const tabs = [
    { href: '/account', label: 'Personal Info', icon: UserIcon, exact: true },
    { href: '/account/orders', label: 'Order History', icon: ShoppingBagIcon, exact: false },
    { href: '/account/addresses', label: 'Saved Addresses', icon: MapPinIcon, exact: false },
    { href: '/account/settings', label: 'Settings', icon: SettingsIcon, exact: false },
  ];

  const getPageInfo = () => {
    switch(true) {
      case pathname === '/account/orders':
        return { title: 'Order History', desc: 'View your recent orders and track delivery status.' };
      case pathname.startsWith('/account/orders/'):
        return { title: 'Order Details', desc: 'Detailed view of your order items and timeline.' };
      case pathname === '/account/addresses':
        return { title: 'Saved Addresses', desc: 'Manage shipping addresses for faster checkout.' };
      case pathname === '/account/settings':
        return { title: 'Account Settings', desc: 'Manage notifications and security options.' };
      case pathname === '/account/menu':
        return { title: 'Account Menu', desc: 'Quick overview of your account section.' };
      case pathname === '/account':
      default:
        return { title: 'Personal Information', desc: 'View and update your personal details.' };
    }
  };

  const { title, desc } = getPageInfo();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFBF9] px-4 pt-16 pb-12 sm:pt-20 lg:px-8">
        <div className="mx-auto w-full max-w-[1360px]">
          
          {/* Header Banner - Compact & Clean */}
          {title && (
            <div className="mb-6 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-forest/10 pb-4">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-forest sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-0.5 text-[13px] text-muted font-medium">
                  {desc}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="hidden lg:col-span-3 lg:block">
              <nav className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-forest/10 bg-white p-4 shadow-sm">
                
                {/* User Mini Profile Badge */}
                {user && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FDFBF9] border border-forest/8">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-forest/10 text-forest font-display font-bold flex items-center justify-center text-sm border border-forest/10 overflow-hidden">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-forest truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[11px] text-muted truncate">@{user.username}</p>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {tabs.map((tab) => {
                    const isActive = tab.exact 
                      ? pathname === tab.href 
                      : pathname.startsWith(tab.href);
                    const Icon = tab.icon;
                    
                    return (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'bg-forest text-white shadow-xs' 
                            : 'text-forest/80 hover:bg-forest/5 hover:text-forest'
                        }`}
                      >
                        <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-105'}`} />
                        <span>{tab.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="h-px bg-forest/8 my-1" />

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold text-terracotta transition-all duration-200 hover:bg-terracotta/10"
                >
                  <LogOutIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-9 w-full rounded-2xl bg-white p-5 sm:p-7 shadow-xs border border-forest/10 min-h-[450px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
