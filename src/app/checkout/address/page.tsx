'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from "@/src/contexts/CartContext";
import { CheckoutStepper } from "@/src/components/CheckoutStepper";
import { CheckoutSummary } from "@/src/components/CheckoutSummary";
import { ArrowLeftIcon } from 'lucide-react';

export default function AddressPage() {
  const { lines, subtotal } = useCart();
  const router = useRouter();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      router.push('/checkout/payment');
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
              <span className="text-[13px] text-muted hidden sm:block">
                Have an account?{' '}
                <Link href="/login" className="text-terracotta underline font-medium hover:text-terracotta/80">
                  Sign in
                </Link>
              </span>
            </div>

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
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full bg-forest px-8 py-4 text-[15px] font-medium text-cream shadow-soft transition-all hover:bg-forest-deep hover:shadow-lift"
                >
                  Continue to Payment
                </motion.button>
              </div>
            </form>
          </div>

          <CheckoutSummary lines={lines} subtotal={subtotal} />
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
