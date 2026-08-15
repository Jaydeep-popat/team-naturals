'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon,
  LeafIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { storyImage } from '@/src/data/products';
import { GuestOnlyRoute } from '@/src/components/AuthGuard';
import { useAuth } from '@/src/contexts/AuthContext';
import { auth as authApi, ApiError, addresses } from '@/src/lib/api';
import { isValidEmail, isValidUsername, isValidPhone, isValidPassword, isNotEmpty } from '@/src/utils/validation';

/** Derives a username suggestion from a display name. */
function generateUsername(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14) || 'user';
  const suffix = Math.floor(100 + Math.random() * 900); // 3-digit suffix
  return `${base}${suffix}`;
}

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
};

function RegisterForm() {
  const { register, verifyEmail, login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();
  const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step') as string, 10) : 1;
  const initialEmail = searchParams.get('email') || '';
  const initialMessage = searchParams.get('message') || '';

  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Info message shown as a green/neutral banner (e.g. redirect from login)
  const [infoMessage, setInfoMessage] = useState(initialStep === 2 ? initialMessage : '');

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 3 fields
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateForm, setStateForm] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Step 2 fields
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && step === 1) {
      router.replace('/account');
    }
  }, [isLoading, isAuthenticated, router, step]);

  // Auto-generate username from firstName unless the user has already edited it
  useEffect(() => {
    if (!isUsernameManuallyEdited && firstName.trim()) {
      setUsername(generateUsername(firstName.trim()));
    }
    if (!firstName.trim() && !isUsernameManuallyEdited) {
      setUsername('');
    }
  }, [firstName, isUsernameManuallyEdited]);

  const next = () => { setDirection(1); setStep((s) => s + 1); };
  const prev = () => { setDirection(-1); setStep((s) => s - 1); setError(''); };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isNotEmpty(firstName) || !isNotEmpty(lastName) || !isNotEmpty(email) || !isNotEmpty(password)) {
      setError('Please fill in all required fields.');
      return;
    }

    // Ensure a username exists — generate one if the user left it blank
    const finalUsername = isNotEmpty(username) ? username : generateUsername(firstName.trim());

    if (!isValidUsername(finalUsername)) {
      setError('Username must be 3-20 characters (letters, numbers, underscores).');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, username: finalUsername, email, password });
      next();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await verifyEmail(email, otp);
      if (password) {
        await login(email, password);
        next(); // Go to address screen
      } else {
        router.push('/login?message=' + encodeURIComponent('Email verified successfully. Please log in.'));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed. Check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isNotEmpty(fullName) || !isNotEmpty(phoneNo) || !isNotEmpty(line1) || !isNotEmpty(city) || !isNotEmpty(stateForm) || !isNotEmpty(postalCode)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidPhone(phoneNo)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addresses.create({
        fullName,
        phoneNo,
        line1,
        line2,
        city,
        state: stateForm,
        postalCode,
      });
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      await authApi.resendVerification({ email });
      setResendTimer(60);
      setOtp('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-white lg:grid-cols-2">
      {/* Left side image */}
      <div className="relative hidden lg:block">
        <img src={storyImage} alt="Brand Story" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/50" />
        <div className="absolute top-10 left-10 z-30">
          <img src="/full_logo.webp" alt="Team Naturals" className="w-48 h-auto object-contain drop-shadow-md" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-cream">
          <h2 className="max-w-sm font-display text-4xl font-semibold leading-[1.1]">
            Rooted in Nature.<br />Made with Care.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-cream/90">
            Join the community of conscious skincare lovers.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="relative flex flex-col items-center justify-center px-5 py-16 overflow-hidden">
        {step > 1 && step < 3 && (
          <button
            onClick={prev}
            className="absolute left-6 top-8 flex items-center gap-1 text-sm text-muted hover:text-forest transition-colors"
          >
            <ChevronLeftIcon size={16} /> Back
          </button>
        )}

        <div className="absolute top-8 right-8 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${i <= step ? 'bg-forest' : 'bg-forest/15'}`}
            />
          ))}
        </div>

        <div className="w-full max-w-sm relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >

              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <div className="mb-8">
                  <img src="/full_logo.webp" alt="Team Naturals" className="w-40 h-auto object-contain mb-4 lg:hidden" />
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">
                    Create your account
                  </h1>
                  <p className="mt-3 text-[15px] text-muted">
                    Save favourites, track orders, and join the community.
                  </p>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-6 space-y-3" onSubmit={handleRegister}>
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="firstName" label="First Name" placeholder="Rahul" value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(''); }} />
                      <Field id="lastName" label="Last Name" placeholder="Sharma" value={lastName} onChange={(e) => { setLastName(e.target.value); setError(''); }} />
                    </div>

                    <div>
                      <Field
                        id="username"
                        label="Username (optional)"
                        placeholder="auto-generated from your name"
                        required={false}
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setIsUsernameManuallyEdited(true);
                          setError('');
                        }}
                      />
                      {!isUsernameManuallyEdited && username && (
                        <p className="mt-1 text-[11px] text-muted/70">
                          Suggested from your name — feel free to change it
                        </p>
                      )}
                    </div>

                    <Field id="email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} />

                    <div>
                      <label className="mb-1 block text-xs text-muted">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required minLength={8}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(''); }}
                          placeholder="Min 8 chars"
                          className="w-full rounded-xl border border-forest/12 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-forest transition-colors">
                          {showPassword ? <EyeOffIcon size={16} strokeWidth={1.5} /> : <EyeIcon size={16} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-muted">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-forest/12 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
                      />
                    </div>

                    <motion.button
                      type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }}
                      className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" /> : 'Continue'}
                    </motion.button>
                  </form>



                  <p className="mt-6 text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-forest font-medium underline">Sign in</Link>
                  </p>
                </div>
              )}

              {/* ── STEP 2: OTP Verification ── */}
              {step === 2 && (
                <div>
                  <div className="relative h-16 w-16 mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl bg-forest/20 blur-md"
                    />
                    <div className="relative h-full w-full rounded-2xl bg-cream flex items-center justify-center text-forest shadow-sm border border-forest/10">
                      <LeafIcon size={28} />
                    </div>
                  </div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">Verify your email</h1>
                  <p className="mt-3 text-[15px] text-muted">
                    We&apos;ve sent a 6-digit code to <strong>{email}</strong>. Enter it below.
                  </p>

                  {/* Info banner — shown when redirected from login (not an error) */}
                  {infoMessage && !error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#E8F3EB] px-4 py-3 text-sm text-[#1B4D2E]"
                    >
                      <InfoIcon size={16} className="mt-0.5 shrink-0" />{infoMessage}
                    </motion.div>
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-8 space-y-4" onSubmit={handleVerify}>
                    {/* 6-box OTP input */}
                    <div className="relative">
                      <label className="mb-3 block text-xs text-muted">6-Digit Code</label>
                      <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }).map((_, index) => {
                          const char = otp[index] || '';
                          const isActive = otp.length === index || (otp.length === 6 && index === 5);
                          return (
                            <div key={index}
                              className={`flex h-14 w-full items-center justify-center rounded-xl border-2 text-xl font-display font-bold transition-all duration-300
                                ${char ? 'border-forest bg-forest/5 text-forest' : isActive ? 'border-forest/40 bg-white ring-4 ring-forest/10' : 'border-forest/10 bg-white text-muted'}`}
                            >
                              {char && (
                                <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >{char}</motion.span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <input
                        type="text" inputMode="numeric" pattern="\d*" maxLength={6}
                        required value={otp}
                        onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                        className="absolute inset-0 top-6 z-10 w-full h-14 opacity-0 cursor-text"
                        autoFocus
                      />
                    </div>

                    <motion.button
                      type="submit" disabled={isSubmitting || otp.length !== 6} whileTap={{ scale: 0.97 }}
                      className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" /> : 'Verify & Continue'}
                    </motion.button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted">
                    Didn&apos;t receive the code?{' '}
                    {resendTimer > 0 ? (
                      <span className="text-muted/70">Resend in 00:{resendTimer.toString().padStart(2, '0')}</span>
                    ) : (
                      <button type="button" onClick={handleResend} disabled={isResending}
                        className="text-forest font-medium hover:underline disabled:opacity-50">
                        {isResending ? 'Sending…' : 'Resend now'}
                      </button>
                    )}
                  </p>
                </div>
              )}

              {/* ── STEP 3: Address ── */}
              {step === 3 && (
                <div>
                  <div className="relative h-16 w-16 mb-6">
                    <div className="relative h-full w-full rounded-2xl bg-cream flex items-center justify-center text-forest shadow-sm border border-forest/10">
                      <CheckCircle2Icon size={28} />
                    </div>
                  </div>
                  <h1 className="font-display text-4xl font-bold tracking-tight text-forest">
                    Almost there!
                  </h1>
                  <p className="mt-3 text-[15px] text-muted">
                    Welcome, <strong>{firstName}</strong>! Add a delivery address to complete your profile.
                  </p>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
                    >
                      <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{error}
                    </motion.div>
                  )}

                  <form className="mt-6 space-y-3" onSubmit={handleAddress}>
                    <div className="grid grid-cols-2 gap-3">
                      <Field id="fullName" label="Full Name" placeholder="Rahul Sharma" value={fullName} onChange={(e) => { setFullName(e.target.value); setError(''); }} />
                      <Field id="phoneNo" label="Phone Number" placeholder="9876543210" value={phoneNo} onChange={(e) => { setPhoneNo(e.target.value); setError(''); }} />
                    </div>
                    <Field id="line1" label="Address Line 1" placeholder="Flat No, Building Name" value={line1} onChange={(e) => { setLine1(e.target.value); setError(''); }} />
                    <Field id="line2" label="Address Line 2 (Optional)" placeholder="Street, Area" required={false} value={line2} onChange={(e) => { setLine2(e.target.value); setError(''); }} />
                    <div className="grid grid-cols-3 gap-3">
                      <Field id="city" label="City" placeholder="Mumbai" value={city} onChange={(e) => { setCity(e.target.value); setError(''); }} />
                      <Field id="state" label="State" placeholder="Maharashtra" value={stateForm} onChange={(e) => { setStateForm(e.target.value); setError(''); }} />
                      <Field id="postalCode" label="Postal Code" placeholder="400001" value={postalCode} onChange={(e) => { setPostalCode(e.target.value); setError(''); }} />
                    </div>

                    <motion.button
                      type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }}
                      className="w-full rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" /> : 'Save Address & Continue'}
                    </motion.button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <button type="button" onClick={() => router.push('/')} className="text-sm font-medium text-muted hover:text-forest transition-colors">
                      Skip for now
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Small reusable field
function Field({ id, label, placeholder, type = 'text', value, onChange, required = true }: {
  id: string; label: string; placeholder: string; type?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-muted">{label}</label>
      <input
        id={id} type={type} required={required} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl border border-forest/12 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-forest placeholder:text-muted/60"
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}