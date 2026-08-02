'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightIcon, LeafIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
import { storyImage } from '@/src/data/products';
import { auth, ApiError } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { isNotEmpty } from '@/src/utils/validation';
import { useEffect } from 'react';

function LoginForm() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show success message if coming from password reset
  const successMessage = searchParams.get('message');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams.get('redirect');
      router.replace(redirect && redirect.startsWith('/') ? redirect : '/');
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNotEmpty(emailOrUsername) || !isNotEmpty(password)) {
      setError('Please enter both your email/username and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await login(emailOrUsername.trim(), password);
      // Let the useEffect handle the redirect to avoid race conditions with AuthGuard
    } catch (err: any) {
      const isApiError = err instanceof ApiError || err?.name === 'ApiError';
      if (isApiError) {
        if (err.statusCode === 401 || err.message === 'Invalid credentials') {
          setError('Password incorrect or Email incorrect/not found. Please register if you don\'t have an account.');
        } else {
          setError(err.message);
        }
      } else {
        setError(err?.message || 'Something went wrong. Please try again.');
      }
      setIsSubmitting(false); // Only stop loading if there's an error, otherwise let the redirect happen
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      {/* Left side image */}
      <div className="relative hidden lg:block">
        <img src={storyImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/50" />
        <div className="absolute top-10 left-10 z-30">
          <img src="/full_logo.png" alt="Team Naturals" className="w-48 h-auto object-contain drop-shadow-md" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-cream">
          <h2 className="max-w-sm font-display text-4xl font-semibold leading-[1.1]">
            Rooted in Nature.<br />Made with Care.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream/90">
            An account just keeps your favourites in one place.<br />Shopping never requires one.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <img src="/full_logo.png" alt="Team Naturals" className="w-40 h-auto object-contain mb-2 lg:hidden" />
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-forest">
            Welcome back
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            Sign in to see your saved products.
          </p>

          {/* Success message from password reset */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-[#E8F3EB] px-4 py-3 text-sm font-medium text-[#1B4D2E]"
            >
              {decodeURIComponent(successMessage)}
            </motion.div>
          )}

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
            >
              <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="emailOrUsername" className="mb-1.5 block text-xs text-muted">
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                type="text"
                autoComplete="email"
                required
                value={emailOrUsername}
                onChange={(e) => { setEmailOrUsername(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-xs text-muted">Password</label>
                <Link href="/forgot-password" className="text-xs text-forest hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-forest transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={16} strokeWidth={1.5} /> : <EyeIcon size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className="mt-2 w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
              ) : 'Sign in'}
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="h-px flex-1 bg-forest/10" />
            or
            <span className="h-px flex-1 bg-forest/10" />
          </div>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-full border border-forest/15 px-6 py-3.5 text-sm text-forest transition-colors hover:bg-cream"
          >
            <LeafIcon size={15} strokeWidth={1.6} />
            Continue as Guest
            <ArrowRightIcon size={15} strokeWidth={1.7} />
          </Link>

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-forest underline font-medium">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}