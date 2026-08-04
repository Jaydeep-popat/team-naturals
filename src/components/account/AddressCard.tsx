import React from 'react';
import { motion } from 'framer-motion';
import { Edit2Icon, Trash2Icon, HomeIcon, BriefcaseIcon, MapPinIcon } from 'lucide-react';
import type { Address } from '@/src/types/auth';

interface AddressCardProps {
  address: Address;
  label?: 'Home' | 'Work' | 'Other'; // Stub for backend feature
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  isDeleting: boolean;
}

export function AddressCard({ address, label = 'Home', onEdit, onDelete, isDeleting }: AddressCardProps) {
  
  const LabelIcon = label === 'Home' ? HomeIcon : label === 'Work' ? BriefcaseIcon : MapPinIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-[20px] border border-forest/10 bg-white p-6 sm:p-7 shadow-sm transition-all hover:shadow-md hover:border-forest/30 group flex flex-col"
    >
      {/* Top right badges */}
      <div className="absolute right-5 top-5 flex items-center gap-2">
        {address.isDefault && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F3EB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D2E]" /> Default
          </div>
        )}
      </div>

      {/* Identity block */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-bold text-forest text-xl">{address.fullName}</h3>
          {/* Label Pill */}
          <span className="inline-flex items-center gap-1 rounded-full bg-forest/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest/70 border border-forest/10">
            <LabelIcon size={10} strokeWidth={2.5} /> {label}
          </span>
        </div>
        <p className="text-[13px] text-muted">{address.phoneNo}</p>
      </div>

      {/* Address details */}
      <div className="space-y-1 text-[14px] text-forest/80 font-medium flex-1">
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p className="text-muted">{address.country}</p>
      </div>

      {/* Action row */}
      <div className="mt-6 flex gap-4 text-[13px] font-bold text-forest border-t border-forest/5 pt-5 shrink-0">
        <button 
          onClick={() => onEdit(address)} 
          className="flex items-center gap-1.5 hover:text-forest-soft transition-colors"
        >
          <Edit2Icon size={14} strokeWidth={2.5} /> Edit
        </button>
        <button
          onClick={() => onDelete(address.addressId)}
          disabled={isDeleting}
          className="flex items-center gap-1.5 hover:text-terracotta transition-colors text-forest/60 disabled:opacity-50"
        >
          {isDeleting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
          ) : (
            <Trash2Icon size={14} strokeWidth={2.5} />
          )}
          Remove
        </button>
      </div>
    </motion.div>
  );
}
