'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, LogInIcon } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Shared auth gate modal — rendered at document.body via portal so it
 * is never clipped by any parent overflow:hidden container.
 *
 * Usage:
 *   const [showAuth, setShowAuth] = useState(false);
 *   <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
 *
 * Then in your handler:
 *   if (!isAuthenticated) { setShowAuth(true); return; }
 */
export function AuthModal({ open, onClose }: AuthModalProps) {
  const pathname = usePathname();

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[3px]"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-forest/40 hover:bg-forest/5 hover:text-forest transition-colors"
              aria-label="Close"
            >
              <XIcon size={18} strokeWidth={1.8} />
            </button>

            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/8 text-forest">
              <LogInIcon size={26} strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <h3
              id="auth-modal-title"
              className="font-display text-[22px] font-bold text-forest leading-tight"
            >
              Login required
            </h3>
            <p className="mt-2.5 text-[14px] text-muted leading-relaxed">
              Please sign in or create an account to add items to your cart and save your favourites.
            </p>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-forest px-6 py-3.5 text-[15px] font-semibold text-cream shadow-sm transition-all hover:bg-forest/90 hover:shadow-md active:scale-[0.98]"
              >
                <LogInIcon size={16} strokeWidth={2} />
                Sign In
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(pathname)}`}
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-forest/12 px-6 py-3.5 text-[15px] font-semibold text-forest transition-all hover:border-forest hover:bg-forest hover:text-white active:scale-[0.98]"
              >
                Create Account
              </Link>
            </div>

            {/* Hint */}
            <p className="mt-5 text-center text-[12px] text-muted">
              You can still browse all products without an account.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
