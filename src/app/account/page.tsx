'use client';
import React, { useState } from 'react';
import { CameraIcon, CheckIcon, XIcon, Edit2Icon, Loader2Icon } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function PersonalInfoPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState('');

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const simulateUpload = () => {
    showToast('Profile photo updated');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 rounded-full bg-forest px-6 py-3 text-sm font-bold text-white shadow-lg flex items-center gap-2"
          >
            <CheckIcon size={16} className="text-white" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="font-display text-xl font-bold text-forest mb-6">Identity</h2>
        {/* Avatar row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-forest/5">
          <button 
            onClick={simulateUpload}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-forest/10 bg-gradient-to-br from-forest/5 to-forest/10 flex items-center justify-center text-forest text-3xl font-display font-bold group shadow-sm transition-all hover:shadow-md hover:border-forest/30"
          >
            {user.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-forest/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
              <CameraIcon className="text-white" size={24} />
            </div>
          </button>
          <div className="flex-1">
            <p className="font-display font-bold text-forest text-2xl">{user.firstName} {user.lastName}</p>
            <p className="text-[14px] text-muted mt-1 font-medium">@{user.username}</p>
            {user.emailVerifiedAt ? (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#E8F3EB] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1B4D2E]">
                ✓ Email Verified
              </span>
            ) : (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-terracotta">
                Email Not Verified
              </span>
            )}
          </div>
        </div>

        {/* Editable Info fields */}
        <div className="grid gap-6 sm:grid-cols-2 mt-8">
          <EditableField label="First Name" initialValue={user.firstName} onSave={() => showToast('Profile updated')} />
          <EditableField label="Last Name" initialValue={user.lastName} onSave={() => showToast('Profile updated')} />
          <EditableField label="Username" initialValue={user.username} onSave={() => showToast('Profile updated')} prefix="@" />
          <EditableField label="Email Address" initialValue={user.email} onSave={() => showToast('Profile updated')} />
          <EditableField label="Phone Number" initialValue={user.phoneNo || ''} onSave={() => showToast('Profile updated')} placeholder="Add phone number" />
          <EditableField label="Date of Birth" initialValue={user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''} onSave={() => showToast('Profile updated')} type="date" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-forest mb-6">Account Status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Current Status" value={user.userStatus.charAt(0).toUpperCase() + user.userStatus.slice(1)} highlight={user.userStatus === 'active'} />
          <StatCard label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-forest mb-6">Security</h2>
        <div className="rounded-2xl border border-forest/10 bg-white p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-bold text-forest text-[15px]">Password</p>
            <p className="text-[13px] text-muted mt-0.5">Change your password to keep your account secure.</p>
          </div>
          <button className="rounded-full bg-forest/5 px-5 py-2 text-[13px] font-bold text-forest hover:bg-forest hover:text-white transition-colors">
            Update
          </button>
        </div>
      </section>
    </div>
  );
}

function EditableField({ label, initialValue, onSave, prefix, type = 'text', placeholder }: { label: string; initialValue: string; onSave: (val: string) => void; prefix?: string; type?: string; placeholder?: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      onSave(value);
    }, 600);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="space-y-1.5 group">
      <label className="text-[11px] font-bold uppercase tracking-wider text-forest/70 pl-1">{label}</label>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white border-2 border-forest rounded-xl overflow-hidden shadow-sm">
            {prefix && <span className="pl-4 text-forest/50 font-medium">{prefix}</span>}
            <input
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full bg-transparent px-4 py-3 text-[15px] font-bold text-forest outline-none"
            />
          </div>
          <button onClick={handleSave} disabled={isSaving} className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-forest text-white hover:bg-forest-deep transition-colors disabled:opacity-50">
            {isSaving ? <Loader2Icon size={18} className="animate-spin" /> : <CheckIcon size={20} />}
          </button>
          <button onClick={handleCancel} disabled={isSaving} className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-forest/5 text-forest hover:bg-forest/10 transition-colors disabled:opacity-50">
            <XIcon size={20} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="group/field relative w-full rounded-xl border-2 border-forest/5 bg-[#FDFBF9] px-5 py-3.5 text-[15px] font-bold text-forest transition-colors hover:border-forest/20 hover:bg-white cursor-text flex items-center"
        >
          <span className={!value ? 'text-muted font-normal' : ''}>
            {prefix && value ? prefix : ''}{value || placeholder || '—'}
          </span>
          <div className="absolute right-4 text-forest/0 group-hover/field:text-forest/40 transition-colors">
            <Edit2Icon size={16} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-forest/70">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        {highlight && <span className="h-2 w-2 rounded-full bg-[#348C31]" />}
        <p className={`font-display text-xl font-bold ${highlight ? 'text-forest' : 'text-forest'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
