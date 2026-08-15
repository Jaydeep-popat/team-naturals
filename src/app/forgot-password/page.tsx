'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  LeafIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { storyImage } from '@/src/data/products';
import { GuestOnlyRoute } from '@/src/components/AuthGuard';
import { auth as authApi, ApiError } from '@/src/lib/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { isValidEmail } from '@/src/utils/validation';

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
};

function ForgotPasswordForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const next = () => { setDirection(1); setStep((s) => s + 1); };
  const prev = () => { setDirection(-1); setStep((s) => s - 1); setError(''); };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      setResendTimer(60);
      next();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await authApi.verifyResetOtp({ email, otp });
      next();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed. Check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ email, otp, password: newPassword });
      await login(email, newPassword); // Auto-login
      next();
      
      // Auto redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Reset failed. Please try again.';
      setError(msg);
      // If the backend rejects the OTP, send the user back to the OTP step so they can see the error and fix it
      const isOtpError = msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code') || msg.toLowerCase().includes('invalid');
      if (isOtpError) {
        setDirection(-1);
        setStep(2);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await authApi.forgotPassword({ email });
      setResendTimer(60);
      setOtp('');
    } catch {
      setError('Could not resend code.');
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      {/* Left image */}
      <div className="relative hidden lg:block">
        <img src={storyImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/50" />
        <div className="absolute top-10 left-10 z-30">
          <img src="/full_logo.webp" alt="Team Naturals" className="w-48 h-auto object-contain drop-shadow-md" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-cream">
          <h2 className="max-w-sm font-display text-4xl font-semibold leading-[1.1]">
            Rooted in Nature.<br />Made with Care.
          </h2>
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
        {step > 1 && step < 4 && (
          <button onClick={prev} className="absolute left-6 top-8 flex items-center gap-1 text-sm text-muted hover:text-forest transition-colors">
            <ChevronLeftIcon size={16} /> Back
          </button>
        )}

        {step < 4 && (
          <div className="absolute top-8 right-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= step ? 'bg-forest' : 'bg-forest/15'}`} />
            ))}
          </div>
        )}

        <div className="w-full max-w-sm relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >

              {/* ── STEP 1: Email ── */}
              {step === 1 && (
                <div>
                  <div className="relative h-16 w-16 mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-forest/10 blur-md" />
                    <div className="relative h-full w-full rounded-2xl bg-cream flex items-center justify-center text-forest shadow-sm border border-forest/10">
                      <LeafIcon size={28} />
                    </div>
                  </div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">Forgot password?</h1>
                  <p className="mt-3 text-[15px] text-muted">
                    Enter your email and we&apos;ll send a 6-digit reset code.
                  </p>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-8 space-y-4" onSubmit={handleForgot}>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs text-muted">Email address</label>
                      <input
                        id="email" type="email" required
                        value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                      />
                    </div>
                    <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }}
                      className="mt-2 w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" /> : 'Send Reset Code'}
                    </motion.button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted">
                    Remembered it?{' '}
                    <Link href="/login" className="text-forest font-medium underline">Sign in</Link>
                  </p>
                </div>
              )}

              {/* ── STEP 2: OTP ── */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">Check your email</h1>
                  <p className="mt-3 text-[15px] text-muted">
                    Enter the 6-digit code sent to <strong>{email}</strong>.
                  </p>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-8 space-y-4" onSubmit={handleOtpSubmit}>
                    {/* 6-box OTP */}
                    <div className="relative">
                      <label className="mb-3 block text-xs text-muted">6-Digit Reset Code</label>
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }).map((_, index) => {
                          const char = otp[index] || '';
                          const isActive = otp.length === index || (otp.length === 6 && index === 5);
                          return (
                            <div key={index}
                              className={`flex h-12 w-full items-center justify-center rounded-xl border-2 text-lg font-display font-bold transition-all duration-300
                                ${char ? 'border-forest bg-forest/5 text-forest' : isActive ? 'border-forest/40 ring-4 ring-forest/10' : 'border-forest/10 bg-white'}`}
                            >
                              {char && <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{char}</motion.span>}
                            </div>
                          );
                        })}
                      </div>
                      <input
                        type="text" inputMode="numeric" pattern="\d*" maxLength={6}
                        value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                        className="absolute inset-0 top-6 z-10 w-full h-12 opacity-0 cursor-text" autoFocus
                      />
                    </div>

                    <motion.button type="submit" disabled={otp.length !== 6} whileTap={{ scale: 0.97 }}
                      className="mt-6 w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      Verify Code
                    </motion.button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted">
                    Didn&apos;t receive the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-muted/70">Resend in 00:{resendTimer.toString().padStart(2, '0')}</span>
                    ) : (
                      <button type="button" onClick={handleResend} className="text-forest font-medium hover:underline">Resend now</button>
                    )}
                  </p>
                </div>
              )}

              {/* ── STEP 3: New Password ── */}
              {step === 3 && (
                <div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">Reset password</h1>
                  <p className="mt-3 text-[15px] text-muted">
                    Choose a new password for your account.
                  </p>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-8 space-y-4" onSubmit={handleReset}>
                    <div>
                      <label className="mb-1.5 block text-xs text-muted">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'} required minLength={8}
                          value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                          placeholder="Min 8 characters"
                          className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-forest">
                          {showPassword ? <EyeOffIcon size={16} strokeWidth={1.5} /> : <EyeIcon size={16} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-muted">Confirm New Password</label>
                      <input
                        type="password" required
                        value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                      />
                    </div>

                    <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }}
                      className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" /> : 'Reset Password'}
                    </motion.button>
                  </form>
                </div>
              )}

              {/* ── STEP 4: Success ── */}
              {step === 4 && (
                <div className="text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                    className="h-20 w-20 rounded-full bg-cream flex items-center justify-center text-forest mb-6"
                  >
                    <CheckCircle2Icon size={40} strokeWidth={1.5} />
                  </motion.div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">Password reset!</h1>
                  <p className="mt-4 text-[15px] text-muted max-w-xs">
                    Your password has been updated and you have been logged in. Redirecting to home...
                  </p>
                  <motion.div whileTap={{ scale: 0.97 }} className="w-full mt-10">
                    <button
                      onClick={() => router.push('/')}
                      className="inline-block w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream text-center transition-colors hover:bg-forest/90"
                    >
                      Go to Home
                    </button>
                  </motion.div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <GuestOnlyRoute>
      <ForgotPasswordForm />
    </GuestOnlyRoute>
  );
}
