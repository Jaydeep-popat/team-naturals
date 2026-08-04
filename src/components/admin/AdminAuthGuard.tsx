import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { hasPermission, ROLE_PERMISSIONS } from '@/src/lib/admin-roles';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: keyof typeof ROLE_PERMISSIONS['super_admin'];
}

export function AdminAuthGuard({ children, requiredPermission }: AdminAuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/');
      return;
    }

    if (requiredPermission && !hasPermission(user.adminRole, requiredPermission)) {
      router.replace('/admin');
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, user, isLoading, router, pathname, requiredPermission]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF9]">
        <Loader2 className="h-8 w-8 animate-spin text-forest" />
      </div>
    );
  }

  return <>{children}</>;
}
