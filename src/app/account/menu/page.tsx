'use client';
import React from 'react';
import Link from 'next/link';
import { UserIcon, ShoppingBagIcon, MapPinIcon, SettingsIcon, ChevronRightIcon, LogOutIcon } from 'lucide-react';

export default function MobileAccountMenuPage() {
  const menuItems = [
    { label: 'Edit Profile', href: '/account', icon: UserIcon },
    { label: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
    { label: 'Saved Addresses', href: '/account/addresses', icon: MapPinIcon },
    { label: 'Notification Settings', href: '/account/settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10 sm:hidden">
      <div>
        <h2 className="font-display text-[22px] font-bold text-forest px-1">Account Settings</h2>
      </div>

      <div className="flex flex-col">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between py-4 px-1 hover:bg-forest/5 transition-colors active:bg-forest/10"
            >
              <div className="flex items-center gap-4">
                <Icon size={22} strokeWidth={1.5} className="text-[#2874F0]" />
                <span className="text-[15px] text-forest/90 font-medium">{item.label}</span>
              </div>
              <ChevronRightIcon size={18} strokeWidth={1.5} className="text-forest/40" />
            </Link>
          );
        })}
        
        <button className="flex items-center justify-between py-4 px-1 hover:bg-forest/5 transition-colors active:bg-forest/10 mt-2 border-t border-forest/5">
          <div className="flex items-center gap-4">
            <LogOutIcon size={22} strokeWidth={1.5} className="text-terracotta" />
            <span className="text-[15px] text-terracotta font-medium">Log Out</span>
          </div>
          <ChevronRightIcon size={18} strokeWidth={1.5} className="text-forest/40" />
        </button>
      </div>
    </div>
  );
}
