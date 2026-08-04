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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteConfirmId(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 overflow-hidden">
              <h3 className="font-display text-xl font-bold text-forest mb-2">Remove Address?</h3>
              <p className="text-muted text-[14px] mb-6">Are you sure you want to remove this address? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} disabled={isDeleting} className="flex-1 rounded-full border-2 border-forest/10 py-2.5 font-bold text-forest hover:bg-forest/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={() => confirmDelete(deleteConfirmId)} disabled={isDeleting} className="flex-1 rounded-full bg-terracotta py-2.5 font-bold text-white shadow-soft hover:bg-terracotta/90 transition-colors flex items-center justify-center">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-forest/30 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
            <motion.div 
              initial={{ y: '100%', opacity: 1 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-6 py-4 border-b border-forest/5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-forest">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                <button onClick={() => !isSubmitting && setIsModalOpen(false)} className="p-2 rounded-full hover:bg-forest/5 text-forest">
                  <XIcon size={20} />
                </button>
              </div>

              <div className="p-6">
                {formError && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
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

                  <div className="sm:col-span-2 flex items-center gap-3 bg-[#FDFBF9] p-4 rounded-xl border border-forest/5 mt-2">
                    <input
                      type="checkbox" id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="h-4 w-4 rounded border-forest/30 accent-forest"
                    />
                    <label htmlFor="isDefault" className="text-[14px] font-medium text-forest cursor-pointer">
                      Make this my default shipping address
                    </label>
                  </div>

                  <div className="pt-4 sm:col-span-2">
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full rounded-full bg-forest px-8 py-4 text-[15px] font-bold text-white shadow-soft transition-all hover:bg-forest/90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : editingId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pb-2">
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[14px] font-bold text-white shadow-soft transition-all hover:bg-forest/90 shrink-0"
        >
          <PlusIcon size={18} strokeWidth={2.5} />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-[20px] border border-forest/10 p-7 animate-pulse bg-forest/5 h-48" />
          ))}
        </div>
      ) : addressList.length === 0 ? (
        <div className="bg-white border border-forest/10 rounded-[20px] p-12 text-center shadow-sm max-w-xl mx-auto mt-8">
          <div className="h-24 w-24 mx-auto mb-6 bg-forest/5 rounded-full flex items-center justify-center">
            <MapPinIcon size={32} className="text-forest/30" />
          </div>
          <h3 className="font-display text-xl text-forest font-bold mb-2">No saved addresses</h3>
          <p className="text-sm text-muted">Add your first shipping address to make checkout faster and easier.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <AnimatePresence>
            {addressList.map((address, index) => (
              <AddressCard 
                key={address.addressId}
                address={address}
                label={index === 0 ? 'Home' : 'Other'} // Stubbing labels for demo
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
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-forest/70 pl-1">{label}</label>
      <input
        id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="w-full rounded-xl border-2 border-forest/5 bg-[#FDFBF9] px-5 py-3.5 text-[15px] font-bold text-forest outline-none transition-all focus:border-forest/20 focus:bg-white focus:shadow-sm placeholder:text-muted/50"
      />
    </div>
  );
}
