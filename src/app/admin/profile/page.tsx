'use client';

import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-forest">Admin Profile</h1>
      
      <div className="bg-white rounded-2xl border border-forest/10 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-forest/10 flex items-center justify-center text-4xl font-bold text-forest shrink-0">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-forest">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-2 mt-2 text-forest/60">
              <Shield size={16} className="text-terracotta" />
              <span className="font-medium capitalize">{user?.role || 'Administrator'}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-forest/10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest/40 uppercase tracking-wider">Email Address</label>
            <div className="flex items-center gap-2 text-forest font-medium">
              <Mail size={18} className="text-forest/50" />
              {user?.email}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest/40 uppercase tracking-wider">Full Name</label>
            <div className="flex items-center gap-2 text-forest font-medium">
              <User size={18} className="text-forest/50" />
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
