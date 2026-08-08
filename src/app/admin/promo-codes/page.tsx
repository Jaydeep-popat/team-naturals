'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { Drawer } from '@/src/components/admin/Drawer';
import { Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { discounts } from '@/src/lib/api';
import toast from 'react-hot-toast';

type DiscountType = 'percent' | 'flat';

type Coupon = {
  discountId: string; code: string; type: DiscountType; value: number;
  minOrderAmount: number; usageLimit: number | null; usageCount: number;
  maxDiscount: number | null; perUserLimit: number; canStack: boolean;
  validFrom: string; validTo: string; isActive: boolean;
};

export default function AdminDiscountsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ 
    code: '', type: 'percent' as DiscountType, value: '', minOrder: '', 
    usageLimit: '', maxDiscount: '', perUserLimit: '1', canStack: false, 
    validFrom: new Date().toISOString().slice(0, 10), validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const res = await discounts.list();
      setCoupons(res.data?.discounts || []);
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
      toast.error('Failed to load discounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleActive = async (id: string) => {
    const coupon = coupons.find(c => c.discountId === id);
    if (!coupon) return;
    try {
      await discounts.update(id, { isActive: !coupon.isActive });
      setCoupons((prev) => prev.map((c) => c.discountId === id ? { ...c, isActive: !c.isActive } : c));
      toast.success(coupon.isActive ? 'Coupon disabled' : 'Coupon activated');
    } catch (error) {
      console.error('Failed to toggle discount:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await discounts.delete(deleteTarget.discountId);
      setCoupons((prev) => prev.filter((c) => c.discountId !== deleteTarget.discountId));
      toast.success('Coupon deleted');
    } catch (error) {
      console.error('Failed to delete discount:', error);
      toast.error('Failed to delete coupon');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await discounts.create({
        code: form.code,
        type: form.type,
        value: parseFloat(form.value),
        minOrderAmount: form.minOrder ? parseFloat(form.minOrder) : 0,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
        perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : null,
        canStack: form.canStack,
        validFrom: form.validFrom,
        validTo: form.validTo,
        isActive: true,
      });
      await fetchDiscounts();
      setShowDrawer(false);
      setForm({
        code: '',
        type: 'percent',
        value: '',
        minOrder: '',
        usageLimit: '',
        maxDiscount: '',
        perUserLimit: '1',
        canStack: false,
        validFrom: new Date().toISOString().slice(0, 10),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
      toast.success('Promo Code created successfully');
    } catch (error: any) {
      console.error('Failed to create discount:', error);
      toast.error(error.message || 'Failed to create discount');
    } finally {
      setIsSaving(false);
    }
  };

  const COLUMNS: Column<Coupon>[] = [
    { key: 'code', header: 'Code', render: (c) => <span className="font-mono font-bold text-forest">{c.code}</span> },
    { key: 'type', header: 'Discount',
      render: (c) => <span className="font-semibold text-forest">{c.type === 'percent' ? `${c.value}%` : `₹${c.value} off`}</span> },
    { key: 'minOrderAmount', header: 'Min. Order', render: (c) => <span className="text-forest/60">₹{c.minOrderAmount}</span> },
    { key: 'usage', header: 'Usage',
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-forest/10 w-16">
            <div className="h-full rounded-full bg-forest" style={{ width: `${c.usageLimit ? Math.min(100, (c.usageCount / c.usageLimit) * 100) : 0}%` }} />
          </div>
          <span className="text-xs text-forest/60">{c.usageCount}/{c.usageLimit ?? '∞'}</span>
        </div>
      )},
    { key: 'validTo', header: 'Expires', render: (c) => <span className="text-sm text-forest/60">{c.validTo ? new Date(c.validTo).toLocaleDateString() : 'Never'}</span> },
    { key: 'isActive', header: 'Status',
      render: (c) => (
        <button onClick={(e) => { e.stopPropagation(); toggleActive(c.discountId); }} className="text-forest/40 hover:text-forest transition-colors">
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

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 size={24} className="animate-spin text-forest" />
        </div>
      ) : (
        <DataTable data={coupons} columns={COLUMNS} keyExtractor={(c) => c.discountId} emptyMessage="No coupons created yet." />
      )}

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
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Max Discount (₹)</label>
              <input type="number" min={0} value={form.maxDiscount} onChange={(e) => setForm(p => ({ ...p, maxDiscount: e.target.value }))} className={inp} placeholder="None" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Usage Limit (Total)</label>
              <input type="number" min={1} value={form.usageLimit} onChange={(e) => setForm(p => ({ ...p, usageLimit: e.target.value }))} className={inp} placeholder="Unlimited" /></div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Usage Per User</label>
              <input type="number" min={1} value={form.perUserLimit} onChange={(e) => setForm(p => ({ ...p, perUserLimit: e.target.value }))} className={inp} placeholder="1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Valid From</label>
              <input type="date" value={form.validFrom} onChange={(e) => setForm(p => ({ ...p, validFrom: e.target.value }))} className={inp} /></div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-forest/80">Valid To</label>
              <input type="date" value={form.validTo} onChange={(e) => setForm(p => ({ ...p, validTo: e.target.value }))} className={inp} /></div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <label className="text-sm font-semibold text-forest/80 flex-1">Stack with Events?</label>
            <button type="button" onClick={() => setForm(p => ({...p, canStack: !p.canStack}))}>
              {form.canStack ? <ToggleRight size={28} className="text-forest" /> : <ToggleLeft size={28} className="text-forest/40" />}
            </button>
          </div>
          <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-bold text-sm hover:bg-[#16301F] transition-colors disabled:opacity-60">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Create Coupon'}
          </button>
        </form>
      </Drawer>
    </div>
  );
}
