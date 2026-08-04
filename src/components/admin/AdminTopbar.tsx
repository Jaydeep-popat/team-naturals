'use client';

import React, { useState } from 'react';
import { Search, Bell, Menu, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="h-20 shrink-0 bg-white/70 backdrop-blur-2xl border-b border-forest/10 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 text-forest/70 hover:text-forest hover:bg-forest/5 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-forest/40 group-focus-within:text-forest transition-colors" />
          <input
            type="text"
            placeholder="Search orders, customers, or products..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-2xl text-[15px] text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-forest/70 hover:text-forest hover:bg-forest/5 rounded-xl transition-all hover:scale-105 active:scale-95">
          <Bell size={22} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-terracotta border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-forest/10 mx-2"></div>
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-forest/5 transition-all focus:outline-none focus:ring-2 focus:ring-forest/20"
          >
            <div className="h-9 w-9 shrink-0 rounded-full bg-forest/10 flex items-center justify-center font-bold text-[15px] text-forest">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left mr-1">
              <span className="text-[13px] font-bold text-forest leading-tight">{user?.firstName} {user?.lastName}</span>
              <span className="text-[11px] text-forest/60 capitalize font-medium">
                Admin
              </span>
            </div>
            <ChevronDown size={16} className={`text-forest/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-forest/10 py-2 z-50 overflow-hidden origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-forest/5 mb-1 bg-forest/5">
                    <p className="text-[13px] font-bold text-forest">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[12px] text-forest/60 truncate">{user?.email}</p>
                  </div>
                  
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-forest hover:bg-[#FDFBF9] transition-colors"
                  >
                    <User size={16} className="text-forest/70" />
                    My Profile
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-terracotta hover:bg-[#FFF5F5] transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
