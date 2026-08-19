'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, AlertCircleIcon, XIcon, MapPinIcon } from 'lucide-react';
import { addresses as addressApi, ApiError } from '@/src/lib/api';
import type { Address } from '@/src/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressCard } from '@/src/components/account/AddressCard';
import { LocationPickerModal } from '@/src/components/LocationPickerModal';
import type { LocationData } from '@/src/lib/location/types';

type AddressFormData = {
  addressId?: number;
  fullName: string;
  phoneNo: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  latitude?: number | null;
  longitude?: number | null;
};

const emptyForm: AddressFormData = {
  fullName: '',
  phoneNo: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  isDefault: false,
  latitude: null,
  longitude: null,
};

export default function AddressesPage() {
  const [addressList, setAddressList] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
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
    setShowMapModal(true);
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
      isDefault: address.isDefault,
    });
    setFormError('');
    setEditingId(address.addressId);
    setIsManualEntry(true);
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
    <div className="animate-in fade-in duration-200 relative">
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

      {/* Map Picker Modal */}
      {showMapModal && (
        <LocationPickerModal
          onClose={() => {
            setShowMapModal(false);
            setIsManualEntry(true);
            setIsModalOpen(true);
          }}
          onManualEntry={() => {
            setShowMapModal(false);
            setIsManualEntry(true);
            setIsModalOpen(true);
          }}
          onConfirm={(data: LocationData) => {
            setShowMapModal(false);
            setIsManualEntry(false);
            setFormData(prev => ({
              ...prev,
              line1: data.line1,
              line2: data.line2 || '',
              city: data.city,
              state: data.state,
              postalCode: data.postalCode,
              latitude: data.latitude,
              longitude: data.longitude,
            }));
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Main Content Area */}
      {isModalOpen && !showMapModal ? (
        <div className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 mt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 flex items-start gap-2 rounded-lg bg-orange-50 px-4 py-3 border border-orange-100">
            <AlertCircleIcon size={18} className="text-orange-500 mt-0.5 shrink-0" />
            <p className="text-[13px] text-orange-800 font-medium leading-relaxed">
              Ensure your address details are accurate for a smooth delivery experience
            </p>
          </div>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600 border border-red-100">
              <AlertCircleIcon size={16} className="mt-0.5 shrink-0" />{formError}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <FloatingField id="line1" label="Flat/House/building name" value={formData.line1} onChange={(e) => { setFormData(prev => ({...prev, line1: e.target.value})); setFormError(''); }} required />
              
              {/* Area / Sector / Locality Card */}
              <div className="sm:col-span-2">
                {isManualEntry ? (
                  <div className="space-y-5">
                    <FloatingField id="line2" label="Area / Sector / Locality" value={formData.line2} onChange={(e) => { setFormData(prev => ({...prev, line2: e.target.value})); setFormError(''); }} required />
                    <div className="grid grid-cols-2 gap-5">
                      <FloatingField id="city" label="City" value={formData.city} onChange={(e) => { setFormData(prev => ({...prev, city: e.target.value})); setFormError(''); }} required />
                      <FloatingField id="state" label="State" value={formData.state} onChange={(e) => { setFormData(prev => ({...prev, state: e.target.value})); setFormError(''); }} required />
                    </div>
                    <FloatingField id="postalCode" label="Pincode" value={formData.postalCode} onChange={(e) => { setFormData(prev => ({...prev, postalCode: e.target.value})); setFormError(''); }} required />
                  </div>
                ) : (
                  <>
                    <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Area / Sector / Locality</label>
                    <div className="flex items-start justify-between gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex-1">
                        <p className="text-[15px] text-gray-800 leading-snug">
                          {formData.line2 ? `${formData.line2}, ` : ''}{formData.city ? `${formData.city}, ` : ''}
                        </p>
                        <p className="text-[15px] font-bold text-gray-900 mt-0.5">
                          {formData.city}, {formData.state}, {formData.postalCode}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setShowMapModal(true);
                        }}
                        className="text-blue-600 font-medium text-[13px] border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors shrink-0 bg-white"
                      >
                        Change
                      </button>
                    </div>
                  </>
                )}
              </div>

              <FloatingField id="fullName" label="Enter your full name" value={formData.fullName} onChange={(e) => { setFormData(prev => ({...prev, fullName: e.target.value})); setFormError(''); }} required />
              
              <FloatingField id="phoneNo" label="10-digit mobile number" value={formData.phoneNo} onChange={(e) => { setFormData(prev => ({...prev, phoneNo: e.target.value})); setFormError(''); }} required type="tel" />
            </div>
            
            {/* Type of Address */}
            <div className="pt-2">
              <label className="block text-[13px] text-gray-500 mb-2">Type of address</label>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium text-[14px] hover:border-gray-300 bg-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Home
                </button>
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-medium text-[14px] hover:border-gray-300 bg-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                  Work
                </button>
              </div>
            </div>


            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox" id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
              />
              <label htmlFor="isDefault" className="text-[14px] text-gray-700 cursor-pointer">
                Make this my default shipping address
              </label>
            </div>


            <div className="pt-4 flex flex-col sm:flex-row gap-3 mt-6 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 sm:flex-none rounded-xl border border-gray-200 px-6 py-4 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50 bg-white"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={isSubmitting}
                className="flex-[2] sm:flex-none rounded-xl bg-[#1D4ED8] hover:bg-blue-700 px-8 py-4 text-[16px] font-bold text-white shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : editingId ? 'Update Address' : 'Save address'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-5">
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
      )}
    </div>
  );
}

function FloatingField({ id, label, value, onChange, required = false, type = 'text' }: {
  id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; type?: string;
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative pt-2">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`w-full rounded-lg border bg-transparent px-4 py-3.5 text-[15px] text-gray-900 outline-none transition-colors ${
          isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1 z-10 ${
          isActive
            ? 'top-0 text-[12px] font-medium text-blue-600'
            : 'top-[22px] text-[15px] text-gray-500'
        }`}
      >
        {label} {required && '*'}
      </label>
    </div>
  );
}

