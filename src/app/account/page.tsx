'use client';
import React from 'react';
import { CameraIcon } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';

export default function PersonalInfoPage() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Avatar row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-forest/5">
        <div className="relative h-24 w-24 overflow-hidden rounded-[24px] border border-forest/10 bg-[#FDFBF9] flex items-center justify-center text-forest text-3xl font-display font-bold group cursor-pointer shadow-sm">
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <CameraIcon className="text-white" size={24} />
          </div>
        </div>
        <div>
          <p className="font-display font-bold text-forest text-lg">{user.firstName} {user.lastName}</p>
          <p className="text-[13px] text-muted mt-1">@{user.username}</p>
          {user.emailVerifiedAt ? (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#E8F3EB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E]">
              ✓ Email Verified
            </span>
          ) : (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-terracotta">
              Email Not Verified
            </span>
          )}
        </div>
      </div>

      {/* Info fields — read-only until backend adds PATCH /api/users/me */}
      <div className="grid gap-6 sm:grid-cols-2">
        <InfoField label="First Name" value={user.firstName} />
        <InfoField label="Last Name" value={user.lastName} />
        <InfoField label="Username" value={`@${user.username}`} />
        <InfoField label="Email Address" value={user.email} />
        {user.phoneNo && <InfoField label="Phone Number" value={user.phoneNo} />}
        {user.dateOfBirth && <InfoField label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString('en-IN', { dateStyle: 'long' })} />}
        <InfoField label="Account Status" value={user.userStatus.charAt(0).toUpperCase() + user.userStatus.slice(1)} />
        <InfoField label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })} />
      </div>

      {/* Notice about profile editing */}
      <div className="rounded-xl border border-forest/10 bg-[#FDFBF9] px-5 py-4 text-[13px] text-muted">
        <p className="font-semibold text-forest mb-1">Profile editing coming soon</p>
        <p>To update your name, email or password, please contact our support team at <a href="mailto:noreply@teamnaturals.in" className="text-forest underline">noreply@teamnaturals.in</a>.</p>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-forest/70 pl-1">{label}</label>
      <div className="w-full rounded-xl border-2 border-forest/5 bg-[#FDFBF9] px-5 py-3.5 text-[15px] font-bold text-forest">
        {value || '—'}
      </div>
    </div>
  );
}
