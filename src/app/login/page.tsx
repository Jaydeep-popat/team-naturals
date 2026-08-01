'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightIcon, LeafIcon } from 'lucide-react';
import { storyImage } from "@/src/data/products";
import { LogoMark } from "@/src/components/Logo";

export default function AuthPage() {
  const mode: 'login' | 'register' = 'login';
  const router = useRouter();
  const isLogin = true;

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={storyImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/45" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-cream">
          <LogoMark className="h-10 w-10" />
          <h2 className="mt-6 max-w-sm font-display text-4xl font-semibold leading-[1.1]">
            Rooted in Nature.<br />
            Made with Care.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream/90">
            An account just keeps your favourites in one place.<br />
            Shopping never requires one.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <>
              <LogoMark className="h-10 w-10 text-forest" />
              <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-forest">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-3 text-[15px] text-muted">
                {isLogin
                  ? 'Sign in to see your saved products.'
                  : 'Save favourites and track future orders.'}
              </p>

              <form
                className="mt-8 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push('/');
                }}
              >
                {!isLogin && <AuthField id="name" label="Full name" placeholder="Your name" />}
                <AuthField id="email" label="Email" type="email" placeholder="you@example.com" />
                <AuthField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="w-full rounded-full bg-forest px-6 py-3.5 text-sm text-cream transition-colors hover:bg-forest-deep"
                >
                  {isLogin ? 'Sign in' : 'Create account'}
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
              <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                Browsing and checkout work fully without an account.
              </p>

              <p className="mt-8 text-center text-sm text-muted">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Link
                  href={isLogin ? '/register' : '/login'}
                  className="text-forest underline"
                >
                  {isLogin ? 'Register' : 'Sign in'}
                </Link>
              </p>
            </>
        </motion.div>
      </div>
    </div>
  );
}

function AuthField({
  id,
  label,
  placeholder,
  type = 'text',
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
      />
    </div>
  );
}