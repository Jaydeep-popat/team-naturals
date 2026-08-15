'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LeafIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  MailIcon,
} from 'lucide-react';
import { storyImage } from '@/src/data/products';
import { GuestOnlyRoute } from '@/src/components/AuthGuard';
import { auth as authApi, ApiError } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { isValidEmail } from '@/src/utils/validation';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, login } = useAuth();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [codeSentMessage, setCodeSentMessage] = useState(
    searchParams.get('email') ? 'Verification code sent to your email.' : ''
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsResending(true);
    setError('');
    setCodeSentMessage('');

    try {
      await authApi.resendVerification({ email: email.trim() });
      setResendTimer(60);
      setOtp('');
      setCodeSentMessage('A new 6-digit code has been sent to your email.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send verification code.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await verifyEmail(email.trim(), otp);

      if (password) {
        try {
          await login(email.trim(), password);
          router.push('/');
          return;
        } catch {
          // If login with password fails, fallback to login page redirect
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(
          `/login?message=${encodeURIComponent(
            'Email verified successfully! Please sign in to continue.'
          )}`
        );
      }, 1500);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Verification failed. Please check the code and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      {/* Left side image branding */}
      <div className="relative hidden lg:block">
        <img src={storyImage} alt="Brand Story" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/50" />
        <div className="absolute top-10 left-10 z-30">
          <img src="/full_logo.png" alt="Team Naturals" className="w-48 h-auto object-contain drop-shadow-md" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-cream">
          <h2 className="max-w-sm font-display text-4xl font-semibold leading-[1.1]">
            Rooted in Nature.<br />Made with Care.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream/90">
            Verify your email address to unlock your Team Naturals account.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="relative flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
        <Link
          href="/login"
          className="absolute left-6 top-8 flex items-center gap-1 text-sm text-muted hover:text-forest transition-colors"
        >
          <ChevronLeftIcon size={16} /> Back to Sign in
        </Link>

        <div className="w-full max-w-sm">
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center flex flex-col items-center py-8"
            >
              <div className="h-20 w-20 rounded-full bg-cream flex items-center justify-center text-forest mb-6 shadow-sm border border-forest/10">
                <CheckCircle2Icon size={40} strokeWidth={1.5} />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-forest">
                Email Verified!
              </h1>
              <p className="mt-3 text-[15px] text-muted">
                Your email has been verified successfully. Redirecting you to sign in...
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-16 w-16 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl bg-forest/20 blur-md"
                />
                <div className="relative h-full w-full rounded-2xl bg-cream flex items-center justify-center text-forest shadow-sm border border-forest/10">
                  <MailIcon size={28} />
                </div>
              </div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-forest">
                Verify your email
              </h1>
              <p className="mt-3 text-[15px] text-muted">
                Enter your registered email address and the 6-digit verification code.
              </p>

              {codeSentMessage && !error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-[#E8F3EB] px-4 py-3 text-xs font-medium text-[#1B4D2E]"
                >
                  {codeSentMessage}
                </motion.div>
              )}

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

              <form className="mt-6 space-y-4" onSubmit={handleVerify}>
                <div>
                  <label htmlFor="verify-email" className="mb-1.5 block text-xs text-muted">
                    Email Address
                  </label>
                  <input
                    id="verify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                  />
                </div>

                {/* 6-box OTP input */}
                <div className="relative pt-2">
                  <label className="mb-3 block text-xs text-muted">6-Digit Verification Code</label>
                  <div className="flex justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, index) => {
                      const char = otp[index] || '';
                      const isActive = otp.length === index || (otp.length === 6 && index === 5);
                      return (
                        <div
                          key={index}
                          className={`flex h-14 w-full items-center justify-center rounded-xl border-2 text-xl font-display font-bold transition-all duration-300 ${
                            char
                              ? 'border-forest bg-forest/5 text-forest'
                              : isActive
                              ? 'border-forest/40 bg-white ring-4 ring-forest/10'
                              : 'border-forest/10 bg-white text-muted'
                          }`}
                        >
                          {char && (
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              {char}
                            </motion.span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    className="absolute inset-0 top-8 z-10 w-full h-14 opacity-0 cursor-text"
                    autoFocus
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6 || !email}
                  whileTap={{ scale: 0.97 }}
                  className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
                  ) : (
                    'Verify Email & Continue'
                  )}
                </motion.button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-muted">
                <div>
                  Didn&apos;t receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-muted/70">
                      Resend in 00:{resendTimer.toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending || !email}
                      className="text-forest font-medium hover:underline disabled:opacity-50"
                    >
                      {isResending ? 'Sending...' : 'Resend code now'}
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-forest/10 w-full">
                  <Link href="/login" className="text-xs text-forest font-medium hover:underline">
                    Already verified? Sign in here
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <GuestOnlyRoute>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <VerifyEmailForm />
      </Suspense>
    </GuestOnlyRoute>
  );
}
