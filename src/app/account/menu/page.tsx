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
    { label: 'Edit Profile', desc: 'Manage your personal info', href: '/account', icon: UserIcon },
    { label: 'Orders', desc: 'Track and manage your orders', href: '/account/orders', icon: ShoppingBagIcon, badge: 'dot' },
    { label: 'Saved Addresses', desc: 'Manage shipping and billing', href: '/account/addresses', icon: MapPinIcon },
    { label: 'Notification Settings', desc: 'Control your alerts', href: '/account/settings', icon: SettingsIcon, badge: 'count' },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="space-y-6 pb-24 sm:hidden"
    >
      <div>
        <h2 className="font-display text-[22px] font-bold text-forest px-2">Account Settings</h2>
      </div>

      <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden">
        <div className="bg-[#FDFBF9] border-b border-forest/10">
          <ProfileIdentityBlock />
        </div>

        <div className="flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-4 px-4 hover:bg-forest/5 transition-colors active:bg-forest/10 border-b border-forest/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/5 text-forest">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] text-forest font-semibold">{item.label}</span>
                      {item.badge === 'dot' && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D99A3D]" aria-label="Alert" />
                      )}
                      {item.badge === 'count' && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-white">
                          2
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-muted">{item.desc}</span>
                  </div>
                </div>
                <ChevronRightIcon size={18} strokeWidth={2} className="text-forest/30" />
              </Link>
            );
          })}
        </div>
      </div>
        
      <div className="rounded-2xl border border-forest/10 bg-white overflow-hidden">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between py-4 px-4 hover:bg-terracotta/5 transition-colors active:bg-terracotta/10"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
              <LogOutIcon size={20} strokeWidth={1.8} />
            </div>
            <span className="text-[15px] text-terracotta font-semibold">Log Out</span>
          </div>
          <ChevronRightIcon size={18} strokeWidth={2} className="text-forest/30" />
        </button>
      </div>
    </motion.div>
  );
}
