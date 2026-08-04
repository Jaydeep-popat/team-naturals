'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { Drawer } from '@/src/components/admin/Drawer';
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';

type DiscountType = 'percent' | 'flat';

type Coupon = {
  id: string; code: string; type: DiscountType; value: number;
  minOrder: number; usageLimit: number; usageCount: number;
  validFrom: string; validTo: string; isActive: boolean;
};

const MOCK_COUPONS: Coupon[] = [
  { id: '1', code: 'WELCOME20', type: 'percent', value: 20, minOrder: 300, usageLimit: 100, usageCount: 34, validFrom: '01 Aug 2026', validTo: '31 Aug 2026', isActive: true },
  { id: '2', code: 'FLAT50', type: 'flat', value: 50, minOrder: 500, usageLimit: 50, usageCount: 50, validFrom: '01 Jul 2026', validTo: '31 Jul 2026', isActive: false },
];

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent' as DiscountType, value: '', minOrder: '', usageLimit: '', validFrom: '', validTo: '' });

  const toggleActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const newCoupon: Coupon = {
      id: Math.random().toString(36).slice(2), ...form,
      value: parseFloat(form.value), minOrder: parseFloat(form.minOrder),
      usageLimit: parseInt(form.usageLimit), usageCount: 0, isActive: true,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setIsSaving(false);
    setShowDrawer(false);
  };

  const COLUMNS: Column<Coupon>[] = [
    { key: 'code', header: 'Code', render: (c) => <span className="font-mono font-bold text-forest">{c.code}</span> },
    { key: 'type', header: 'Discount',
      render: (c) => <span className="font-semibold text-forest">{c.type === 'percent' ? `${c.value}%` : `₹${c.value} off`}</span> },
    { key: 'minOrder', header: 'Min. Order', render: (c) => <span className="text-forest/60">₹{c.minOrder}</span> },
    { key: 'usage', header: 'Usage',
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-forest/10 w-16">
            <div className="h-full rounded-full bg-forest" style={{ width: `${Math.min(100, (c.usageCount / c.usageLimit) * 100)}%` }} />
          </div>
          <span className="text-xs text-forest/60">{c.usageCount}/{c.usageLimit}</span>
        </div>
      )},
    { key: 'validTo', header: 'Expires', render: (c) => <span className="text-sm text-forest/60">{c.validTo}</span> },
    { key: 'isActive', header: 'Status',
      render: (c) => (
        <button onClick={(e) => { e.stopPropagation(); toggleActive(c.id); }} className="text-forest/40 hover:text-forest transition-colors">
          {c.isActive ? <ToggleRight size={22} className="text-forest" /> : <ToggleLeft size={22} />}
        </button>
      )},
    { key: 'actions', header: '',
      render: (c) => (
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}
          className="p-1.5 rounded-lg text-forest/30 hover:text-terracotta hover:bg-terracotta/5 transition-colors">
          <Trash2 size={14} />
        </button>
      )},
  ];

  const inp = 'w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Discounts & Coupons</h1>
          <p className="text-sm text-forest/60 mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowDrawer(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold shadow-sm hover:bg-[#16301F] transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <DataTable data={coupons} columns={COLUMNS} keyExtractor={(c) => c.id} emptyMessage="No coupons created yet." />

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Coupon" message={`Are you sure you want to delete coupon "${deleteTarget?.code}"?`}
        confirmText="Yes, Delete" isDestructive
      />

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title="Create Coupon">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Code<span className="text-terracotta">*</span></label>
            <input required value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className={inp} placeholder="WELCOME20" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Type</label>
              <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value as DiscountType }))} className={inp + ' bg-white'}>
                <option value="percent">Percentage</option><option value="flat">Flat Amount</option>
              </select></div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Value<span className="text-terracotta">*</span></label>
              <input required type="number" min={1} value={form.value} onChange={(e) => setForm(p => ({ ...p, value: e.target.value }))} className={inp} placeholder={form.type === 'percent' ? '20' : '50'} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Min. Order (₹)</label>
              <input type="number" min={0} value={form.minOrder} onChange={(e) => setForm(p => ({ ...p, minOrder: e.target.value }))} className={inp} placeholder="300" /></div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Usage Limit</label>
              <input type="number" min={1} value={form.usageLimit} onChange={(e) => setForm(p => ({ ...p, usageLimit: e.target.value }))} className={inp} placeholder="100" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Valid From</label>
              <input type="date" value={form.validFrom} onChange={(e) => setForm(p => ({ ...p, validFrom: e.target.value }))} className={inp} /></div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Valid To</label>
              <input type="date" value={form.validTo} onChange={(e) => setForm(p => ({ ...p, validTo: e.target.value }))} className={inp} /></div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-bold text-sm hover:bg-[#16301F] transition-colors disabled:opacity-60">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Create Coupon'}
          </button>
        </form>
      </Drawer>
    </div>
  );
}
