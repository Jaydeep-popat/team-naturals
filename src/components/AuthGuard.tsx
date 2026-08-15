'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute — wraps pages that require an authenticated user.
 * While loading: renders nothing (avoids flash).
 * If unauthenticated: redirects to /login?redirect=<current path>.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * GuestOnlyRoute — wraps auth pages (login, register, forgot-password).
 * If already authenticated: redirects to /account.
 */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/account');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
