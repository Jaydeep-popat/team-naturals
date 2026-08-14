'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PencilIcon,
  CheckIcon,
  XIcon,
  Loader2Icon,
  CalendarIcon,
  PhoneIcon,
  AtSignIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { ApiError } from '@/src/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomDatePicker } from '@/src/components/CustomDatePicker';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDOB(iso: string | null): string {
  if (!iso) return '';
  // Return YYYY-MM-DD for <input type="date">
  return new Date(iso).toISOString().split('T')[0];
}

function displayDOB(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PersonalInfoPage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  // Form state — synced from user on each edit session open
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNo: '',
    dateOfBirth: '',
    profilePic: '',
  });
  const [formError, setFormError] = useState('');

  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Keep form in sync when user data loads or changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        username: user.username ?? '',
        phoneNo: user.phoneNo ?? '',
        dateOfBirth: formatDOB(user.dateOfBirth),
        profilePic: user.profilePic ?? '',
      });
    }
  }, [user]);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleEditOpen = () => {
    setFormError('');
    setIsEditing(true);
    setTimeout(() => firstFieldRef.current?.focus(), 80);
  };

  const handleCancel = () => {
    // Reset form to current user values
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      username: user.username ?? '',
      phoneNo: user.phoneNo ?? '',
      dateOfBirth: formatDOB(user.dateOfBirth),
      profilePic: user.profilePic ?? '',
    });
    setProfilePicFile(null);
    setFormError('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    setFormError('');

    if (!form.firstName.trim()) { setFormError('First name is required.'); return; }
    if (!form.lastName.trim()) { setFormError('Last name is required.'); return; }
    if (!form.username.trim()) { setFormError('Username is required.'); return; }

    setIsSaving(true);
    try {
      let finalProfilePicUrl = form.profilePic || null;

      // If a new file was selected, upload it first
      if (profilePicFile) {
        const { auth } = await import('@/src/lib/api');
        const formData = new FormData();
        formData.append('profilePic', profilePicFile);
        const res = await auth.uploadProfilePic(formData);
        finalProfilePicUrl = res.data.user.profilePic || null;
      }

      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        phoneNo: form.phoneNo.trim() || null,
        dateOfBirth: form.dateOfBirth || null,
        profilePic: finalProfilePicUrl,
      });
      setProfilePicFile(null);
      setIsEditing(false);
      showToast('Profile updated successfully');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to save. Please try again.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const field = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -16, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg
              ${toast.type === 'success' ? 'bg-forest text-white' : 'bg-terracotta text-white'}`}
          >
            {toast.type === 'success'
              ? <CheckIcon size={16} />
              : <AlertCircleIcon size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar + Name header ── */}
      <div className="flex items-center gap-5 pb-6 border-b border-forest/8">
        <div className="relative h-16 w-16 shrink-0 group">
          <div className="h-full w-full rounded-2xl bg-gradient-to-br from-forest/10 to-forest/20 flex items-center justify-center text-forest text-xl font-display font-bold border border-forest/10 shadow-sm overflow-hidden relative">
            {(isEditing ? form.profilePic : user.profilePic)
              ? <img src={(isEditing ? form.profilePic : user.profilePic)!} alt="Profile" className="h-full w-full object-cover" />
              : <span>{initials}</span>
            }
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <PencilIcon size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        setFormError('Image must be less than 2MB');
                        return;
                      }
                      setProfilePicFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        field('profilePic', reader.result as string);
                        setFormError('');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
          {isEditing && form.profilePic && (
            <button
              onClick={() => { field('profilePic', ''); setProfilePicFile(null); }}
              className="absolute -top-1.5 -right-1.5 bg-terracotta text-white rounded-full p-0.5 shadow-sm hover:bg-terracotta/90 z-10"
              title="Remove photo"
            >
              <XIcon size={12} strokeWidth={3} />
            </button>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-forest text-xl leading-tight truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-[13px] text-muted mt-0.5">@{user.username}</p>
          <div className="mt-2">
            {user.emailVerifiedAt ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3EB] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E]">
                <ShieldCheckIcon size={10} /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terracotta">
                Email not verified
              </span>
            )}
          </div>
        </div>

        {/* Edit / Save / Cancel buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <button
              onClick={handleEditOpen}
              id="edit-profile-btn"
              className="flex items-center gap-1.5 rounded-full border border-forest/20 bg-white px-4 py-2 text-[13px] font-semibold text-forest hover:bg-forest hover:text-white hover:border-forest transition-all duration-200 shadow-sm"
            >
              <PencilIcon size={13} strokeWidth={2.2} />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                id="save-profile-btn"
                className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[13px] font-semibold text-white hover:bg-forest/90 disabled:opacity-60 transition-all duration-200 shadow-sm"
              >
                {isSaving
                  ? <Loader2Icon size={13} className="animate-spin" />
                  : <CheckIcon size={13} strokeWidth={2.5} />}
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                id="cancel-edit-btn"
                className="flex items-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 py-2 text-[13px] font-semibold text-forest/70 hover:bg-forest/5 disabled:opacity-60 transition-all duration-200"
              >
                <XIcon size={13} strokeWidth={2.2} />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Inline error (edit mode) ── */}
      <AnimatePresence>
        {formError && isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta overflow-hidden"
          >
            <AlertCircleIcon size={15} className="mt-0.5 shrink-0" />
            {formError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile fields grid ── */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* First Name */}
        <ProfileField
          id="firstName"
          label="First Name"
          icon={<UserIcon size={14} />}
          value={isEditing ? form.firstName : user.firstName}
          editing={isEditing}
          inputRef={firstFieldRef}
          onChange={(v) => field('firstName', v)}
          placeholder="Enter first name"
        />

        {/* Last Name */}
        <ProfileField
          id="lastName"
          label="Last Name"
          icon={<UserIcon size={14} />}
          value={isEditing ? form.lastName : user.lastName}
          editing={isEditing}
          onChange={(v) => field('lastName', v)}
          placeholder="Enter last name"
        />

        {/* Username */}
        <ProfileField
          id="username"
          label="Username"
          icon={<AtSignIcon size={14} />}
          value={isEditing ? form.username : user.username}
          editing={isEditing}
          onChange={(v) => field('username', v)}
          placeholder="your_username"
          prefix="@"
        />

        {/* Email — always read-only */}
        <ProfileField
          id="email"
          label="Email Address"
          icon={<AtSignIcon size={14} />}
          value={user.email}
          editing={false}
          onChange={() => {}}
          readonlyNote="Contact support to change email"
        />

        {/* Phone */}
        <ProfileField
          id="phoneNo"
          label="Phone Number"
          icon={<PhoneIcon size={14} />}
          value={isEditing ? form.phoneNo : (user.phoneNo ?? '')}
          editing={isEditing}
          onChange={(v) => field('phoneNo', v)}
          placeholder="Add phone number"
          inputMode="tel"
        />

        {/* Date of Birth */}
        <ProfileField
          id="dateOfBirth"
          label="Date of Birth"
          icon={<CalendarIcon size={14} />}
          value={isEditing ? form.dateOfBirth : ''}
          displayValue={isEditing ? undefined : displayDOB(user.dateOfBirth)}
          editing={isEditing}
          onChange={(v) => field('dateOfBirth', v)}
          type="date-custom"
          placeholder="Select date"
        />
      </div>

      {/* ── Account meta strip ── */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-forest/8 bg-[#FDFBF9] px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-xl bg-forest/8 flex items-center justify-center text-forest">
            <ClockIcon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Member Since</p>
            <p className="text-[13px] font-semibold text-forest mt-0.5 truncate">
              {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-forest/8 bg-[#FDFBF9] px-4 py-3 flex items-center gap-3">
          <div className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center ${user.userStatus === 'active' ? 'bg-[#E8F3EB] text-[#1B4D2E]' : 'bg-terracotta/10 text-terracotta'}`}>
            <ShieldCheckIcon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Account Status</p>
            <p className="text-[13px] font-semibold text-forest mt-0.5 truncate capitalize">
              {user.userStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProfileField ─────────────────────────────────────────────────────────────

interface ProfileFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  displayValue?: string;     // Override display when not editing
  editing: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  readonlyNote?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

function ProfileField({
  id, label, icon, value, displayValue, editing, onChange,
  placeholder, prefix, type = 'text', inputMode, readonlyNote, inputRef,
}: ProfileFieldProps) {
  const shown = displayValue !== undefined ? displayValue : (value || placeholder || '—');
  const isEmpty = !displayValue && !value;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={editing ? id : undefined}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5"
      >
        <span className="text-forest/40">{icon}</span>
        {label}
      </label>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`flex items-center rounded-xl border-2 border-forest bg-white shadow-sm transition-shadow focus-within:shadow-md ${readonlyNote ? 'opacity-60 pointer-events-none border-forest/20' : ''}`}
          >
            {prefix && (
              <span className="pl-3.5 text-forest/50 font-medium text-sm select-none">{prefix}</span>
            )}
            {type === 'date-custom' ? (
              <CustomDatePicker
                value={value}
                onChange={(v) => onChange(v)}
                placeholder={placeholder}
                disabled={!!readonlyNote}
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                id={id}
                type={type}
                inputMode={inputMode}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                readOnly={!!readonlyNote}
                className={`w-full bg-transparent px-3.5 py-2.5 text-[14px] font-semibold text-forest outline-none placeholder:text-muted/50 placeholder:font-normal ${type === 'date' ? 'cursor-pointer uppercase tracking-wide' : ''}`}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center rounded-xl border border-forest/8 bg-[#FDFBF9] px-3.5 py-2.5 min-h-[42px] overflow-hidden"
          >
            <span className={`text-[14px] font-semibold leading-tight truncate ${isEmpty ? 'text-muted/50 font-normal' : 'text-forest'}`}>
              {prefix && !isEmpty ? prefix : ''}{shown}
            </span>
            {readonlyNote && (
              <span className="ml-auto text-[10px] text-muted/50 font-normal shrink-0 pl-2 truncate">{readonlyNote}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
