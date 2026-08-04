'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminAuthGuard } from '@/src/components/admin/AdminAuthGuard';

interface StoreSettings {
  storeName: string; email: string; phone: string;
  line1: string; city: string; state: string; postalCode: string;
  shippingFreeThreshold: string; shippingFlatRate: string;
  taxRate: string; taxLabel: string;
}

const INITIAL: StoreSettings = {
  storeName: 'Team Naturals', email: 'hello@teamnaturals.in', phone: '+91 98765 00000',
  line1: '123, Green Valley, Pune', city: 'Pune', state: 'Maharashtra', postalCode: '411001',
  shippingFreeThreshold: '499', shippingFlatRate: '49',
  taxRate: '18', taxLabel: 'GST',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof StoreSettings, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = 'w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest';
  const section = 'rounded-2xl border border-forest/10 bg-white p-6 shadow-sm space-y-5';

  return (
    <AdminAuthGuard requiredPermission="canManageSettings">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-forest">Settings</h1>
            <p className="text-sm text-forest/60 mt-1">Store configuration and preferences.</p>
          </div>
          <button type="submit" disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white text-sm font-bold shadow-sm hover:bg-[#16301F] transition-colors disabled:opacity-70">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Store Info */}
        <div className={section}>
          <h2 className="font-display text-lg font-bold text-forest">Store Information</h2>
          <Field label="Store Name"><input value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email"><input type="email" value={settings.email} onChange={(e) => update('email', e.target.value)} className={inp} /></Field>
            <Field label="Phone"><input value={settings.phone} onChange={(e) => update('phone', e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Address"><input value={settings.line1} onChange={(e) => update('line1', e.target.value)} className={inp} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="City"><input value={settings.city} onChange={(e) => update('city', e.target.value)} className={inp} /></Field>
            <Field label="State"><input value={settings.state} onChange={(e) => update('state', e.target.value)} className={inp} /></Field>
            <Field label="Postal Code"><input value={settings.postalCode} onChange={(e) => update('postalCode', e.target.value)} className={inp} /></Field>
          </div>
        </div>

        {/* Shipping */}
        <div className={section}>
          <h2 className="font-display text-lg font-bold text-forest">Shipping Rules</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Free Shipping Threshold (₹)">
              <input type="number" value={settings.shippingFreeThreshold} onChange={(e) => update('shippingFreeThreshold', e.target.value)} className={inp} />
            </Field>
            <Field label="Flat Rate Shipping (₹)">
              <input type="number" value={settings.shippingFlatRate} onChange={(e) => update('shippingFlatRate', e.target.value)} className={inp} />
            </Field>
          </div>
        </div>

        {/* Tax */}
        <div className={section}>
          <h2 className="font-display text-lg font-bold text-forest">Tax Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tax Label"><input value={settings.taxLabel} onChange={(e) => update('taxLabel', e.target.value)} className={inp} placeholder="GST" /></Field>
            <Field label="Tax Rate (%)"><input type="number" min={0} max={100} value={settings.taxRate} onChange={(e) => update('taxRate', e.target.value)} className={inp} /></Field>
          </div>
        </div>
      </form>
    </AdminAuthGuard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-forest/80">{label}</label>
      {children}
    </div>
  );
}
