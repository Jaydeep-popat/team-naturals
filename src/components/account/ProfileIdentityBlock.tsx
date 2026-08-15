'use client';

import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

export function ProfileIdentityBlock() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="flex items-center gap-4 py-4 px-2">
      {/* Avatar */}
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-forest/10 bg-forest/5 text-[22px] font-bold text-forest shadow-sm">
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.firstName} className="h-full w-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display text-[17px] font-bold text-forest truncate">
            {user.firstName} {user.lastName}
          </p>
          {user.emailVerifiedAt && (
            <span className="shrink-0 rounded-full bg-[#E8F3EB] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#1B4D2E]">
              Verified
            </span>
          )}
        </div>
        <p className="text-[13px] text-muted truncate">@{user.username}</p>
      </div>
    </div>
  );
}
