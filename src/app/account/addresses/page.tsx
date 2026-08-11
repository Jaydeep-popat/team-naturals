'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, AlertCircleIcon, XIcon, MapPinIcon } from 'lucide-react';
import { addresses as addressApi, ApiError } from '@/src/lib/api';
import type { Address } from '@/src/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressCard } from '@/src/components/account/AddressCard';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsModalOpen(true);
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
    setIsModalOpen(true);
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
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async (addressId: number) => {
    setIsDeleting(true);
    try {
      await addressApi.delete(addressId);
      await fetchAddresses();
      setDeleteConfirmId(null);
    } catch {
      // Error handling
    } finally {
      setIsDeleting(false);
    }
  };

  const field = (id: keyof AddressFormData) => ({
    value: formData[id] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [id]: e.target.value }));
      setFormError('');
    },
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200 relative">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-forest/8">
        <div>
          <h2 className="font-display text-lg font-bold text-forest">Your Addresses</h2>
          <p className="text-[12px] text-muted">Manage your delivery and billing locations</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-forest/90 transition-all"
        >
          <PlusIcon size={14} strokeWidth={2.5} />
          Add Address
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-forest/30 backdrop-blur-xs" onClick={() => !isDeleting && setDeleteConfirmId(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative bg-white rounded-2xl shadow-lg w-full max-w-sm p-5 border border-forest/10">
              <h3 className="font-display text-lg font-bold text-forest mb-1">Remove Address?</h3>
              <p className="text-muted text-[13px] mb-5">Are you sure you want to remove this address?</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirmId(null)} disabled={isDeleting} className="flex-1 rounded-full border border-forest/15 py-2 text-[13px] font-semibold text-forest hover:bg-forest/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={() => confirmDelete(deleteConfirmId)} disabled={isDeleting} className="flex-1 rounded-full bg-terracotta py-2 text-[13px] font-semibold text-white hover:bg-terracotta/90 transition-colors flex items-center justify-center">
                  {isDeleting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : 'Remove'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-forest/30 backdrop-blur-xs" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            <motion.div 
              initial={{ y: '100%', opacity: 1 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-forest/10"
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-5 py-3.5 border-b border-forest/8 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-forest">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-forest/5 text-forest">
                  <XIcon size={18} />
                </button>
              </div>

              <div className="p-5">
                {formError && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl bg-terracotta/10 px-3.5 py-2.5 text-[13px] text-terracotta">
                    <AlertCircleIcon size={15} className="mt-0.5 shrink-0" />{formError}
                  </div>
                )}
                <form className="grid gap-3.5 sm:grid-cols-2" onSubmit={handleSubmit}>
                  <Field id="fullName" label="Full Name" placeholder="Rahul Sharma" {...field('fullName')} required />
                  <Field id="phoneNo" label="Phone Number" placeholder="+91 98765 43210" {...field('phoneNo')} required />
                  <div className="sm:col-span-2">
                    <Field id="line1" label="Address Line 1" placeholder="House No, Building, Street" {...field('line1')} required />
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="line2" label="Address Line 2 (optional)" placeholder="Apartment, landmark" {...field('line2')} />
                  </div>
                  <Field id="city" label="City" placeholder="Mumbai" {...field('city')} required />
                  <Field id="state" label="State" placeholder="Maharashtra" {...field('state')} required />
                  <Field id="postalCode" label="Postal Code" placeholder="400001" {...field('postalCode')} required />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5">Country</label>
                    <input type="text" value="India" disabled
                      className="w-full rounded-xl border border-forest/10 bg-[#FDFBF9] px-3.5 py-2 text-[14px] font-medium text-muted cursor-not-allowed" />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2.5 bg-[#FDFBF9] p-3 rounded-xl border border-forest/8">
                    <input
                      type="checkbox" id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="h-4 w-4 rounded border-forest/30 accent-forest cursor-pointer"
                    />
                    <label htmlFor="isDefault" className="text-[13px] font-medium text-forest cursor-pointer">
                      Make this my default shipping address
                    </label>
                  </div>

                  <div className="pt-2 sm:col-span-2">
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full rounded-full bg-forest px-6 py-3 text-[14px] font-semibold text-white shadow-xs hover:bg-forest/90 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : editingId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-forest/10 p-5 animate-pulse bg-forest/5 h-36" />
          ))}
        </div>
      ) : addressList.length === 0 ? (
        <div className="rounded-xl border border-forest/8 bg-[#FDFBF9] p-10 text-center max-w-md mx-auto my-4">
          <div className="h-16 w-16 mx-auto mb-3 bg-forest/5 rounded-full flex items-center justify-center">
            <MapPinIcon size={24} className="text-forest/30" />
          </div>
          <h3 className="font-display text-lg text-forest font-bold mb-1">No saved addresses</h3>
          <p className="text-[13px] text-muted">Add your shipping address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {addressList.map((address, index) => (
              <AddressCard 
                key={address.addressId}
                address={address}
                label={index === 0 ? 'Home' : 'Other'}
                onEdit={openEdit}
                onDelete={() => setDeleteConfirmId(address.addressId)}
                isDeleting={isDeleting && deleteConfirmId === address.addressId}
              />
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
    <div className="space-y-1">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-forest/60 pl-0.5">{label}</label>
      <input
        id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2 text-[14px] font-medium text-forest outline-none transition-all focus:border-forest placeholder:text-muted/50"
      />
    </div>
  );
}
