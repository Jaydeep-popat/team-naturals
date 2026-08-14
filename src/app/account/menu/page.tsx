'use client';

import React from 'react';
import Link from 'next/link';
import { UserIcon, ShoppingBagIcon, MapPinIcon, SettingsIcon, ChevronRightIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfileIdentityBlock } from '@/src/components/account/ProfileIdentityBlock';
import { motion } from 'framer-motion';

export default function MobileAccountMenuPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { label: 'Personal Info', desc: 'Manage your name, phone, and DOB', href: '/account', icon: UserIcon },
    { label: 'Order History', desc: 'Track and manage your orders', href: '/account/orders', icon: ShoppingBagIcon },
    { label: 'Saved Addresses', desc: 'Manage shipping and billing', href: '/account/addresses', icon: MapPinIcon },
    { label: 'Notification Settings', desc: 'Control your alerts and security', href: '/account/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4 pb-20 sm:hidden"
    >

      <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-xs">
        <div className="bg-[#FDFBF9] border-b border-forest/10 p-3">
          <ProfileIdentityBlock />
        </div>

        <div className="flex flex-col divide-y divide-forest/5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-3.5 px-4 hover:bg-forest/5 transition-colors active:bg-forest/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest/5 text-forest">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-forest font-semibold">{item.label}</span>
                    <span className="text-[11px] text-muted">{item.desc}</span>
                  </div>
                </div>
                <ChevronRightIcon size={16} strokeWidth={2} className="text-forest/30" />
              </Link>
            );
          })}
        </div>
      </div>
        
      <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-xs">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between py-3.5 px-4 hover:bg-terracotta/5 transition-colors active:bg-terracotta/10 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
              <LogOutIcon size={18} strokeWidth={1.8} />
            </div>
            <span className="text-[14px] text-terracotta font-semibold">Sign Out</span>
          </div>
          <ChevronRightIcon size={16} strokeWidth={2} className="text-forest/30" />
        </button>
      </div>
    </motion.div>
  );
}
