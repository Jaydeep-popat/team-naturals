'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeIcon, LeafIcon, ArrowRightIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream/20 px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md"
      >
        {/* Decorative leaf */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-forest/10 text-forest"
        >
          <LeafIcon size={48} strokeWidth={1.2} />
        </motion.div>

        <p className="font-display text-[100px] font-bold leading-none text-forest/10 select-none">
          404
        </p>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 text-[15px] text-muted leading-relaxed">
          Looks like this page has gone back to nature. The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-forest/90"
          >
            <HomeIcon size={16} strokeWidth={2} />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-full border border-forest/15 px-7 py-3.5 text-sm font-semibold text-forest transition-colors hover:bg-cream"
          >
            Browse Products
            <ArrowRightIcon size={16} strokeWidth={1.8} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
