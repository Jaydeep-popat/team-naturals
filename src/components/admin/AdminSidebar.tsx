'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  Users, 
  Ticket, 
  MessageSquare, 
  LayoutTemplate, 
  BarChart3, 
  Settings, 
  ShieldAlert,
  Boxes,
  Bell,
  LogOut,
  Menu,
  ChevronLeft,
  Store,
  X
} from 'lucide-react';

export function AdminSidebar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen?: boolean; setIsMobileOpen?: (val: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    if (isMobileOpen) {
      setIsCollapsed(false);
    }
  }, [isMobileOpen]);

  const navGroups = [
    {
      heading: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      ]
    },
    {
      heading: 'Store',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Tags },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
      ]
    },
    {
      heading: 'Marketing',
      items: [
        { label: 'Events', href: '/admin/events', icon: LayoutTemplate },
        { label: 'Promo Codes', href: '/admin/promo-codes', icon: Ticket },
      ]
    },
    {
      heading: 'System',
      items: [
        { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
        { label: 'Notifications', href: '/admin/notifications', icon: Bell },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#1B3A2B]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}
      <aside 
        className={`group fixed lg:static flex flex-col h-screen bg-[#1B3A2B] text-white shrink-0 transition-transform duration-300 ease-in-out z-50 ${isCollapsed ? 'w-24' : 'w-72'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
      <div className={`flex flex-col gap-6 p-6 pt-8 relative`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          {!isCollapsed ? (
            <Link href="/admin" className="block transition-opacity hover:opacity-80 shrink-0 w-[190px] -my-4">
              <img src="/full_logo.webp" alt="Team Naturals" className="w-full h-auto brightness-0 invert drop-shadow-sm" />
            </Link>
          ) : (
            <Link href="/admin" className="block transition-opacity hover:opacity-80 mix-blend-screen">
              <img src="/favicon-trimmed.png" alt="TN" className="h-10 w-10 object-contain grayscale invert contrast-200 brightness-200 drop-shadow-sm" />
            </Link>
          )}
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:block text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all ${isCollapsed ? 'absolute -right-3 top-9 bg-[#1B3A2B] border border-white/10 shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110' : ''}`}
          >
            {isCollapsed ? <ChevronLeft size={16} className="rotate-180" /> : <ChevronLeft size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileOpen?.(false)}
            className="lg:hidden text-white/60 hover:text-white p-2"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-none pb-8">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                {group.heading}
              </h3>
            )}
            {group.items.map((item) => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen?.(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors z-10 ${
                    isActive 
                      ? 'text-[#1B3A2B]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white rounded-xl'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="sidebar-active-bg -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <div className={`flex items-center justify-center shrink-0 z-10 ${isActive ? 'w-8 h-8 rounded-full bg-[#FFC5C5] text-black shadow-sm' : ''}`}>
                    <Icon size={isActive ? 16 : 18} className={isActive ? 'text-black' : 'text-white/60'} />
                  </div>
                  {!isCollapsed && <span className="whitespace-nowrap font-bold z-10">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-6 flex flex-col border-t border-white/10">
        <Link
          href="/"
          onClick={() => setIsMobileOpen?.(false)}
          className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors text-white/60 hover:bg-white/5 hover:text-white rounded-xl ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Storefront' : undefined}
        >
          <div className="flex items-center justify-center shrink-0 w-8 h-8">
            <Store size={18} />
          </div>
          {!isCollapsed && <span className="whitespace-nowrap font-bold">Storefront</span>}
        </Link>
      </div>
    </aside>
    </>
  );
}
