'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/src/components/admin/AdminSidebar';
import { AdminTopbar } from '@/src/components/admin/AdminTopbar';
import { AdminAuthGuard } from '@/src/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#FDFBF9] overflow-hidden selection:bg-forest/20 selection:text-forest">
        <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="mx-auto max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
