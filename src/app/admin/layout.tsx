'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/src/components/admin/AdminSidebar';
import { AdminTopbar } from '@/src/components/admin/AdminTopbar';
import { AdminAuthGuard } from '@/src/components/admin/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#FDFBF9] overflow-hidden selection:bg-forest/20 selection:text-forest">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
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
