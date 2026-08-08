'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon, MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { addresses } from '@/src/lib/api';
import { Address } from '@/src/types/auth';
import toast from 'react-hot-toast';

export default function AddressPage() {
  const { lines, subtotal } = useCart();
  const router = useRouter();

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    addresses.list().then(res => {
      if (isMounted) {
        if (res.data?.addresses && res.data.addresses.length > 0) {
          setSavedAddresses(res.data.addresses);
          setSelectedAddressId(res.data.addresses[0].addressId);
        } else {
          setShowNewAddressForm(true);
        }
      }
    }).catch(err => {
      console.error("Failed to fetch addresses:", err);
      if (isMounted) setShowNewAddressForm(true);
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
      router.push(`/checkout/payment?addressId=${selectedAddressId}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
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
        });
        const addressId = res.data.address.addressId;
        router.push(`/checkout/payment?addressId=${addressId}`);
      } catch (error) {
        console.error('Failed to create address', error);
        toast.error('Failed to save address. Please make sure you are logged in.');
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
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
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
                    </div>
                    
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="flex items-center gap-2 text-forest font-medium hover:text-terracotta transition-colors"
                    >
                      <Plus size={18} /> Add a new address
                    </button>

                    <div className="flex items-center justify-between pt-6 border-t border-forest/10 mt-6">
                      <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                        <ArrowLeftIcon size={16} /> Return to cart
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProceedWithSelected}
                        className="rounded-full bg-forest px-8 py-4 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift"
                      >
                        Deliver to this address
                      </motion.button>
                    </div>
                  </div>
                )}

                {showNewAddressForm && (
                  <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-[24px] border border-forest/8 p-6 lg:p-8 bg-white shadow-sm space-y-6">
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
                  <Field label="Phone number" id="phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
                  <Field label="Email" id="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} className="sm:col-span-2" />
                  
                  <div className="sm:col-span-2 border-t border-forest/5 pt-4 mt-2">
                    <Field label="PIN code" id="pin" value={form.pin} onChange={(v) => setForm({ ...form, pin: v })} error={errors.pin} />
                    {form.pin.length === 6 && !errors.pin && (
                      <p className="mt-2 text-[12px] text-forest/70 font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-forest"></span> Estimated delivery: 3–5 days
                      </p>
                    )}
                  </div>

                  <Field label="Address line 1" id="address1" value={form.address1} onChange={(v) => setForm({ ...form, address1: v })} error={errors.address1} className="sm:col-span-2" />
                  <Field label="Address line 2 (Optional)" id="address2" value={form.address2} onChange={(v) => setForm({ ...form, address2: v })} />
                  <Field label="City" id="city" value={form.city} onChange={(v) => setForm({ ...form, city: v })} error={errors.city} />
                  <Field label="State" id="state" value={form.state} onChange={(v) => setForm({ ...form, state: v })} error={errors.state} />
                  <Field label="Landmark (Optional)" id="landmark" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} className="sm:col-span-2" />
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" className="h-4 w-4 border-forest/20 text-forest rounded focus:ring-forest bg-cream" defaultChecked />
                  <span className="text-[14px] text-forest">Save this address for next time</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-terracotta transition-colors">
                  <ArrowLeftIcon size={16} /> Return to cart
                </Link>
                <div className="flex gap-4">
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="rounded-full border border-forest/20 px-6 py-4 text-[15px] font-medium text-forest transition-all hover:bg-forest/5"
                    >
                      Cancel
                    </button>
                  )}
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full bg-forest px-8 py-4 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift"
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </div>
            </form>
            )}
            </>
            )}
          </div>

          <CheckoutSummary />
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-forest/80">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-[15px] text-forest shadow-sm outline-none transition-all focus:ring-2 placeholder:text-muted/50 ${
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-forest/15 focus:border-forest focus:ring-forest/10'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-red-500 font-medium" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
