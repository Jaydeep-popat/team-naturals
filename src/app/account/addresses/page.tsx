'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, Edit2Icon, Trash2Icon, AlertCircleIcon } from 'lucide-react';
import { addresses as addressApi, ApiError } from '@/src/lib/api';
import type { Address } from '@/src/types/auth';
import { motion, AnimatePresence } from 'framer-motion';

type AddressFormData = {
  fullName: string;
  phoneNo: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const emptyForm: AddressFormData = {
  fullName: '', phoneNo: '', line1: '', line2: '',
  city: '', state: '', postalCode: '', country: 'India', isDefault: false,
};

export default function AddressesPage() {
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await addressApi.list();
      setAddressList(res.data.addresses);
    } catch {
      // silently fail — the account layout already guards auth
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const openAdd = () => {
    setFormData(emptyForm);
    setFormError('');
    setEditingId(null);
    setIsAdding(true);
  };

  const openEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phoneNo: address.phoneNo,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setFormError('');
    setEditingId(address.addressId);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingId) {
        await addressApi.update(editingId, formData);
      } else {
        await addressApi.create(formData);
      }
      await fetchAddresses();
      setIsAdding(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    setDeletingId(addressId);
    try {
      await addressApi.delete(addressId);
      await fetchAddresses();
    } catch {
      // could show a toast here
    } finally {
      setDeletingId(null);
    }
  };

  const field = (id: keyof AddressFormData) => ({
    value: formData[id] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [id]: e.target.value }));
      setFormError('');
    },
  });

  if (isAdding) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {formError && (
          <div className="flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{formError}
          </div>
        )}

        <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Field id="fullName" label="Full Name" placeholder="Rahul Sharma" {...field('fullName')} required />
          <Field id="phoneNo" label="Phone Number" placeholder="+91 98765 43210" {...field('phoneNo')} required />
          <div className="sm:col-span-2">
            <Field id="line1" label="Address Line 1" placeholder="House No, Building, Street" {...field('line1')} required />
          </div>
          <div className="sm:col-span-2">
            <Field id="line2" label="Address Line 2 (optional)" placeholder="Apartment, suite, landmark" {...field('line2')} />
          </div>
          <Field id="city" label="City" placeholder="Mumbai" {...field('city')} required />
          <Field id="state" label="State" placeholder="Maharashtra" {...field('state')} required />
          <Field id="postalCode" label="Postal Code" placeholder="400001" {...field('postalCode')} required />
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-forest/70 pl-1">Country</label>
            <input type="text" value="India" disabled
              className="w-full rounded-xl border-2 border-forest/5 bg-[#FDFBF9] px-5 py-3.5 text-[15px] font-bold text-muted cursor-not-allowed" />
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox" id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
              className="h-4 w-4 rounded border-forest/30 accent-forest"
            />
            <label htmlFor="isDefault" className="text-[14px] font-medium text-forest cursor-pointer">
              Set as default address
            </label>
          </div>

          <div className="pt-2 sm:col-span-2 flex flex-col sm:flex-row items-center gap-4">
            <motion.button
              type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto rounded-full bg-forest px-8 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest/90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : editingId ? 'Update Address' : 'Save Address'}
            </motion.button>
            <button
              type="button" onClick={() => setIsAdding(false)}
              className="w-full sm:w-auto rounded-full border-2 border-forest/10 px-8 py-3 text-sm font-bold text-forest transition-all hover:bg-forest hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-end pb-2">
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest/90 shrink-0"
        >
          <PlusIcon size={16} />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-[20px] border border-forest/10 p-7 animate-pulse bg-forest/5 h-48" />
          ))}
        </div>
      ) : addressList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[15px] font-bold text-forest mb-2">No saved addresses yet</p>
          <p className="text-[13px] text-muted">Add your first shipping address to make checkout faster.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {addressList.map((address) => (
              <motion.div
                key={address.addressId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-[20px] border border-forest/10 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-forest/20 group"
              >
                {address.isDefault && (
                  <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#E8F3EB] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1B4D2E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4D2E]" /> Default
                  </div>
                )}
                <div className="mb-4">
                  <p className="font-display font-bold text-forest text-xl">{address.fullName}</p>
                  <p className="text-[13px] text-muted mt-0.5">{address.phoneNo}</p>
                </div>
                <div className="space-y-1 text-[14px] text-forest/70 font-medium">
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                </div>
                <div className="mt-6 flex gap-4 text-[13px] font-bold text-forest border-t border-forest/5 pt-5">
                  <button onClick={() => openEdit(address)} className="flex items-center gap-2 hover:text-forest/70 transition-colors">
                    <Edit2Icon size={15} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.addressId)}
                    disabled={deletingId === address.addressId}
                    className="flex items-center gap-2 hover:text-terracotta transition-colors text-forest/60 disabled:opacity-50"
                  >
                    {deletingId === address.addressId
                      ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta" />
                      : <Trash2Icon size={15} />
                    }
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function Field({ id, label, placeholder, value, onChange, required = false }: {
  id: string; label: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-forest/70 pl-1">{label}</label>
      <input
        id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="w-full rounded-xl border-2 border-forest/5 bg-[#FDFBF9] px-5 py-3.5 text-[15px] font-bold text-forest outline-none transition-all focus:border-forest/20 focus:bg-white focus:shadow-sm"
      />
    </div>
  );
}
