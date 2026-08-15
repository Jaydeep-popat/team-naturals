'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  ShieldCheckIcon,
  MailIcon,
  MessageSquareIcon,
  KeyIcon,
  XIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
  Loader2Icon,
  LockIcon,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { auth as authApi, ApiError } from '@/src/lib/api';
import { isValidPassword } from '@/src/utils/validation';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Change Password Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Send OTP request, 2: OTP & New Password form, 3: Success
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const openModal = () => {
    setStep(1);
    setError('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting || isSendingOtp) return;
    setIsModalOpen(false);
  };

  // Step 1: Send OTP to user's registered email
  const handleSendOtp = async () => {
    if (!user?.email) return;
    setError('');
    setIsSendingOtp(true);
    try {
      await authApi.forgotPassword({ email: user.email });
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send OTP code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and update password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.email) return;

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        email: user.email,
        otp: otp.trim(),
        password: newPassword,
      });

      setStep(3);
      
      // Since backend invalidates active sessions on password reset, clear local state & redirect to login
      setTimeout(async () => {
        await logout();
        router.push(
          `/login?message=${encodeURIComponent('Password reset successfully. Please sign in with your new password.')}`
        );
      }, 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to reset password. Please check your OTP and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Section 1: Notifications */}
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-3 flex items-center gap-1.5">
          <BellIcon size={13} /> Notification Preferences
        </h2>
        <div className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-forest/5 text-forest shrink-0 mt-0.5">
                <MailIcon size={16} />
              </div>
              <div>
                <p className="font-bold text-forest text-[14px]">Email Updates</p>
                <p className="text-[12px] text-muted font-medium mt-0.5">Receive order confirmations, tracking alerts, and special offers.</p>
              </div>
            </div>
            <div 
              className={`flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${emailNotif ? 'bg-forest' : 'bg-forest/15'}`}
              onClick={() => setEmailNotif(!emailNotif)}
            >
              <motion.div 
                className="h-[22px] w-[22px] rounded-full bg-white shadow-xs" 
                animate={{ x: emailNotif ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <div className="h-px bg-forest/8" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-forest/5 text-forest shrink-0 mt-0.5">
                <MessageSquareIcon size={16} />
              </div>
              <div>
                <p className="font-bold text-forest text-[14px]">SMS & WhatsApp Alerts</p>
                <p className="text-[12px] text-muted font-medium mt-0.5">Get real-time delivery notifications straight to your phone.</p>
              </div>
            </div>
            <div 
              className={`flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${smsNotif ? 'bg-forest' : 'bg-forest/15'}`}
              onClick={() => setSmsNotif(!smsNotif)}
            >
              <motion.div 
                className="h-[22px] w-[22px] rounded-full bg-white shadow-xs" 
                animate={{ x: smsNotif ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Security & Privacy */}
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-forest/60 mb-3 flex items-center gap-1.5">
          <ShieldCheckIcon size={13} /> Security
        </h2>
        <div className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-forest/5 text-forest shrink-0 mt-0.5">
              <KeyIcon size={16} />
            </div>
            <div>
              <p className="font-bold text-forest text-[14px]">Account Password</p>
              <p className="text-[12px] text-muted font-medium mt-0.5">Update your account password securely using email OTP verification.</p>
            </div>
          </div>
          <button 
            onClick={openModal}
            className="rounded-full border border-forest/20 px-4 py-1.5 text-[12px] font-semibold text-forest hover:bg-forest hover:text-white transition-all shrink-0 shadow-2xs"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-forest/30 backdrop-blur-xs" 
              onClick={closeModal} 
            />

            {/* Dialog */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }} 
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden border border-forest/10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-forest/8 mb-4">
                <div className="flex items-center gap-2 text-forest">
                  <LockIcon size={18} />
                  <h3 className="font-display text-lg font-bold">Change Password</h3>
                </div>
                <button 
                  onClick={closeModal} 
                  disabled={isSubmitting || isSendingOtp} 
                  className="p-1 rounded-full hover:bg-forest/5 text-forest/70 hover:text-forest transition-colors disabled:opacity-50"
                >
                  <XIcon size={18} />
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-3.5 py-2.5 text-[13px] text-terracotta">
                  <AlertCircleIcon size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Confirmation to send OTP */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-[13px] text-muted leading-relaxed">
                    To keep your account secure, we will send a 6-digit verification code (OTP) to your registered email:
                  </p>
                  <div className="p-3 rounded-xl bg-[#FDFBF9] border border-forest/10 font-mono text-[14px] font-semibold text-forest text-center">
                    {user?.email}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 rounded-full border border-forest/15 py-2.5 text-[13px] font-semibold text-forest hover:bg-forest/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="flex-1 rounded-full bg-forest py-2.5 text-[13px] font-semibold text-white hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
                    >
                      {isSendingOtp ? (
                        <Loader2Icon size={16} className="animate-spin" />
                      ) : (
                        'Send OTP Code'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: OTP + New Password Form */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  <p className="text-[12px] text-muted">
                    We sent a 6-digit code to <strong>{user?.email}</strong>.
                  </p>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5 block mb-1">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      placeholder="123456"
                      className="w-full text-center font-mono tracking-[0.3em] rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-base font-bold text-forest outline-none focus:border-forest transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5 block mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2 text-[14px] font-medium text-forest outline-none focus:border-forest transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-forest"
                      >
                        {showPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Repeat new password"
                      className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2 text-[14px] font-medium text-forest outline-none focus:border-forest transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[12px] text-muted">
                    <span>Didn&apos;t get the code?</span>
                    {resendTimer > 0 ? (
                      <span className="text-muted/70 font-mono">Resend in 00:{resendTimer.toString().padStart(2, '0')}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp}
                        className="text-forest font-bold hover:underline disabled:opacity-50"
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || otp.length !== 6}
                      className="w-full rounded-full bg-forest py-3 text-[14px] font-semibold text-white hover:bg-forest/90 transition-colors flex items-center justify-center gap-2 shadow-2xs disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <Loader2Icon size={16} className="animate-spin" />
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="py-6 text-center space-y-3">
                  <div className="h-12 w-12 mx-auto rounded-full bg-[#E8F3EB] text-[#1B4D2E] flex items-center justify-center">
                    <CheckCircle2Icon size={24} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-forest">Password Reset Successfully!</h4>
                  <p className="text-[13px] text-muted max-w-xs mx-auto">
                    Your password has been updated. Redirecting you to the sign-in page...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
