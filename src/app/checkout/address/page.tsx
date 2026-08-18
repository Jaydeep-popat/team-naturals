'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, MapPin, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { addresses } from '@/src/lib/api';
import { Address } from '@/src/types/auth';
import { AddressCard } from '@/src/components/account/AddressCard';
import { LocationPickerModal } from '@/src/components/LocationPickerModal';
import type { LocationData } from '@/src/lib/location/types';
import toast from 'react-hot-toast';

export default function AddressPage() {
  const { lines, subtotal } = useCart();
  const router = useRouter();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    addresses.list().then(res => {
      if (isMounted) {
        if (res.data?.addresses && res.data.addresses.length > 0) {
          setSavedAddresses(res.data.addresses);
          setSelectedAddressId(res.data.addresses[0].addressId);
        } else {
          setShowMapModal(true);
        }
      }
    }).catch(err => {
      console.error("Failed to fetch addresses:", err);
      if (isMounted) setShowMapModal(true);
    }).finally(() => {
      if (isMounted) setIsLoadingAddresses(false);
    });
    return () => { isMounted = false; };
  }, []);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    landmark: '',
    latitude: null as number | null,
    longitude: null as number | null,
    type: 'Home' as 'Home' | 'Work',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin)) newErrors.pin = 'Valid 6-digit PIN code is required';
    if (!form.address1.trim()) newErrors.address1 = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedWithSelected = () => {
    if (selectedAddressId) {
      setIsProceeding(true);
      router.push(`/checkout/payment?addressId=${selectedAddressId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const res = await addresses.create({
          fullName: form.name,
          phoneNo: form.phone,
          line1: form.address1,
          line2: form.address2,
          city: form.city,
          state: form.state,
          postalCode: form.pin,
          country: 'India',
          latitude: form.latitude,
          longitude: form.longitude,
        });
        const addressId = res.data.address.addressId;
        router.push(`/checkout/payment?addressId=${addressId}`);
      } catch (error) {
        console.error('Failed to create address', error);
        toast.error('Failed to save address');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full bg-white pb-16 min-h-[80vh]">
      <div className="bg-gradient-to-b from-cream-soft to-white">
        <div className="mx-auto max-w-4xl px-5 py-6 lg:px-8 text-center">
          <CheckoutStepper currentStep={2} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl px-5 py-6 lg:px-8"
      >
        <div className="flex flex-col lg:grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-display text-3xl text-forest">Delivery details</h1>
            </div>

            {isLoadingAddresses ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-forest/5 rounded-2xl w-full"></div>
                <div className="h-32 bg-forest/5 rounded-2xl w-full"></div>
              </div>
            ) : (
              <>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.addressId}
                          onClick={() => setSelectedAddressId(addr.addressId)}
                          className={`relative cursor-pointer rounded-[20px] border p-5 transition-all ${
                            selectedAddressId === addr.addressId
                              ? 'border-forest bg-forest/5 shadow-sm'
                              : 'border-forest/10 bg-white hover:border-forest/30 hover:bg-forest/5'
                          }`}
                        >
                          {selectedAddressId === addr.addressId && (
                            <div className="absolute top-4 right-4 text-forest">
                              <CheckCircle2 size={20} className="fill-forest/10" />
                            </div>
                          )}
                          <div className="flex items-start gap-3 mb-2">
                            <MapPin size={18} className="text-forest mt-0.5" />
                            <div>
                              <h3 className="font-semibold text-forest">{addr.fullName}</h3>
                              <p className="text-sm text-forest/70">{addr.phoneNo}</p>
                            </div>
                          </div>
                          <p className="text-sm text-forest/80 ml-7 line-clamp-2">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state}, {addr.postalCode}
                          </p>
                        </div>
                      ))}
                      
                      {/* Add New Address Card Option */}
                      <div
                        onClick={() => setShowMapModal(true)}
                        className="relative cursor-pointer rounded-[20px] border-2 border-dashed border-forest/20 p-5 flex flex-col items-center justify-center text-forest/70 hover:bg-forest/5 hover:border-forest/40 hover:text-forest transition-all min-h-[130px]"
                      >
                        <Plus size={28} className="mb-2" />
                        <span className="font-medium">Add a new address</span>
                      </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-between pt-6 border-t border-forest/10 mt-6">
                      <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                        <ArrowLeftIcon size={16} /> Return to cart
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProceedWithSelected}
                        disabled={isProceeding}
                        className="rounded-full bg-forest px-8 py-4 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isProceeding && <Loader2 size={16} className="animate-spin" />}
                        {isProceeding ? 'Processing...' : 'Deliver to this address'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {showMapModal && (
                  <LocationPickerModal 
                    onClose={() => {
                      setShowMapModal(false);
                      setIsManualEntry(true);
                      setShowNewAddressForm(true); 
                    }}
                    onManualEntry={() => {
                      setShowMapModal(false);
                      setIsManualEntry(true);
                      setShowNewAddressForm(true);
                    }}
                    onConfirm={(data: LocationData) => {
                      setShowMapModal(false);
                      setIsManualEntry(false);
                      setShowNewAddressForm(true);
                      setForm(prev => ({
                        ...prev,
                        address1: data.line1,
                        address2: data.line2 || '',
                        city: data.city,
                        state: data.state,
                        pin: data.postalCode,
                        latitude: data.latitude,
                        longitude: data.longitude,
                      }));
                    }}
                  />
                )}

                {showNewAddressForm && (
                  <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Deliver To</h2>

                    {/* Warning Banner */}
                    <div className="mb-6 flex items-start gap-2 rounded-lg bg-orange-50 px-4 py-3 border border-orange-100">
                      <div className="text-orange-500 mt-0.5 shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      </div>
                      <p className="text-[13px] text-orange-800 font-medium leading-relaxed">
                        Ensure your address details are accurate for a smooth delivery experience
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <FloatingField id="address1" label="Flat/House/building name" value={form.address1} onChange={(v) => setForm({ ...form, address1: v })} error={errors.address1} required />
                      
                      <div className="sm:col-span-2">
                        {isManualEntry ? (
                          <div className="space-y-5">
                            <FloatingField id="address2" label="Area / Sector / Locality" value={form.address2} onChange={(v) => setForm({ ...form, address2: v })} error={errors.address2} required />
                            <div className="grid grid-cols-2 gap-5">
                              <FloatingField id="city" label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} error={errors.city} required />
                              <FloatingField id="state" label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} error={errors.state} required />
                            </div>
                            <FloatingField id="pin" label="Pincode" value={form.pin} onChange={(v) => setForm({ ...form, pin: v })} error={errors.pin} required />
                            
                            <div className="flex justify-end pt-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  setShowNewAddressForm(false);
                                  setShowMapModal(true);
                                }}
                                className="text-[#1D4ED8] font-semibold text-[14px] flex items-center gap-1.5 hover:underline"
                              >
                                <MapPin size={16} /> Use map instead
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <label className="block text-[12px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Area / Sector / Locality</label>
                            <div className="flex items-start justify-between gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <div className="flex-1">
                                <p className="text-[15px] text-gray-800 leading-snug">
                                  {form.address2 ? `${form.address2}, ` : ''}{form.city ? `${form.city}, ` : ''}
                                </p>
                                <p className="text-[15px] font-bold text-gray-900 mt-0.5">
                                  {form.city}, {form.state}, {form.pin}
                                </p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  setShowNewAddressForm(false);
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

                      <FloatingField id="name" label="Enter your full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} required />
                      <FloatingField id="phone" label="10-digit mobile number" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} required />
                      <FloatingField id="email" label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
                      <FloatingField id="landmark" label="Alternate phone number (Optional)" type="tel" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
                    </div>

                    <div className="pt-2">
                      <label className="block text-[13px] text-gray-500 mb-2">Type of address</label>
                      <div className="flex gap-3">
                        <button 
                          type="button" 
                          onClick={() => setForm({ ...form, type: 'Home' })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-[14px] transition-colors ${
                            form.type === 'Home' 
                              ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          Home
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setForm({ ...form, type: 'Work' })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-[14px] transition-colors ${
                            form.type === 'Work' 
                              ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' 
                              : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                          Work
                        </button>
                      </div>
                    </div>

                    <div className="hidden lg:flex pt-4 items-center justify-between gap-4 border-t border-gray-100 mt-6">
                      <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors w-full sm:w-auto justify-center">
                        <ArrowLeftIcon size={16} /> Return to cart
                      </Link>
                      <div className="flex gap-3 w-full sm:w-auto">
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="flex-1 sm:flex-none rounded-xl border border-gray-200 px-6 py-4 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50 bg-white"
                          >
                            Cancel
                          </button>
                        )}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileTap={{ scale: 0.98 }}
                          className="flex-[2] sm:flex-none rounded-xl bg-[#1D4ED8] hover:bg-blue-700 px-8 py-4 text-[16px] font-bold text-white shadow-sm transition-colors text-center disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                          {isSubmitting ? 'Saving...' : 'Save address'}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <CheckoutSummary />
          </div>
        </div>
      </motion.div>

      {/* Fixed Bottom Bar for Mobile (Select Address) */}
      {savedAddresses.length > 0 && !showNewAddressForm && !isLoadingAddresses && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-gray-900">₹{subtotal}</span>
            <span className="text-[12px] text-[#2874f0] font-medium" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>View price details</span>
          </div>
          <button
            onClick={handleProceedWithSelected}
            disabled={isProceeding}
            className="rounded-sm bg-[#fb641b] px-8 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-[#f3580a] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isProceeding && <Loader2 size={16} className="animate-spin" />}
            {isProceeding ? 'Loading...' : 'Deliver Here'}
          </button>
        </div>
      )}

      {/* Fixed Bottom Bar for Mobile (Manual Address Form) */}
      {showNewAddressForm && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden gap-3">
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNewAddressForm(false)}
              className="flex-1 rounded-sm border border-gray-200 bg-white px-4 py-3 text-[15px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] rounded-sm bg-[#1D4ED8] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      )}
    </div>
  );
}

function FloatingField({ id, label, value, onChange, error, required = false, type = 'text', className = '' }: {
  id: string; label: string; value: string; onChange: (val: string) => void;
  error?: string; required?: boolean; type?: string; className?: string;
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className={`relative pt-2 ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-transparent px-4 py-3.5 text-[15px] text-gray-900 outline-none transition-colors ${
          error ? 'border-red-400 ring-1 ring-red-400 focus:border-red-500' : isFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1 z-10 ${
          error ? 'text-red-500' : isActive ? 'text-blue-600' : 'text-gray-500'
        } ${
          isActive ? 'top-0 text-[12px] font-medium' : 'top-[22px] text-[15px]'
        }`}
      >
        {label} {required && '*'}
      </label>
      {error && (
        <p className="mt-1 text-[12px] text-red-500 font-medium" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
