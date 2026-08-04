'use client';

import React, { useState } from 'react';
import { Loader2, Eye, ZapIcon } from 'lucide-react';

interface DiscountBannerForm {
  isActive: boolean;
  badge: string;
  headlineLine1: string;
  headlineHighlight: string;
  description: string;
  backgroundColor: string;
  discountScope: 'global' | 'specific';
  discountPercent: string;
  specificTargetIds: string;
  endTime: string;
}

const colorOptions = [
  { label: 'Forest Green', value: 'bg-forest' },
  { label: 'Deep Forest', value: 'bg-forest-deep' },
  { label: 'Terracotta', value: 'bg-terracotta' },
  { label: 'Charcoal', value: 'bg-zinc-800' },
  { label: 'Midnight Blue', value: 'bg-slate-900' },
];

export default function AdminContentPage() {
  const [form, setForm] = useState<DiscountBannerForm>({
    isActive: true,
    badge: 'Today Only',
    headlineLine1: 'Big Naturals',
    headlineHighlight: 'Sale Event',
    description: 'Up to 30% off handmade soaps and our clay face wash. All natural, all on sale — for today only.',
    backgroundColor: 'bg-forest',
    discountScope: 'global',
    discountPercent: '20',
    specificTargetIds: '',
    endTime: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: POST /api/admin/content (To be implemented by backend dev later)
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
  };

  const inp = 'w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Discount Banner Settings</h1>
          <p className="text-sm text-forest/60 mt-1">Customize the promotional banner shown on the homepage.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest text-white text-sm font-bold shadow-sm hover:bg-[#16301F] transition-colors disabled:opacity-70">
          {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* Editor Form */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-display text-lg font-bold text-forest border-b border-forest/5 pb-3">Banner Content</h2>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-forest/5 border border-forest/10">
              <input 
                type="checkbox" 
                checked={form.isActive} 
                onChange={(e) => setForm(p => ({ ...p, isActive: e.target.checked }))} 
                className="w-5 h-5 rounded border-forest/30 text-forest focus:ring-forest" 
              />
              <div>
                <span className="block text-sm font-bold text-forest">Show Banner on Homepage</span>
                <span className="block text-xs text-forest/60">Toggle to temporarily hide the promotional banner</span>
              </div>
            </label>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-forest/80">Small Badge Text</label>
              <input
                value={form.badge}
                onChange={(e) => setForm(p => ({ ...p, badge: e.target.value }))}
                className={inp}
                placeholder="e.g. Today Only"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-forest/80">Headline (Line 1)</label>
              <input
                value={form.headlineLine1}
                onChange={(e) => setForm(p => ({ ...p, headlineLine1: e.target.value }))}
                className={inp}
                placeholder="e.g. Big Naturals"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-forest/80">Headline (Highlighted text)</label>
              <input
                value={form.headlineHighlight}
                onChange={(e) => setForm(p => ({ ...p, headlineHighlight: e.target.value }))}
                className={inp}
                placeholder="e.g. Sale Event"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-forest/80">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                className={inp}
                rows={3}
                placeholder="Details about your sale..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-forest/80">Background Color</label>
                <select
                  value={form.backgroundColor}
                  onChange={(e) => setForm(p => ({ ...p, backgroundColor: e.target.value }))}
                  className={inp}
                >
                  {colorOptions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-forest/80">Event End Time</label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm(p => ({ ...p, endTime: e.target.value }))}
                  className={inp}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-forest/80">Discount Scope</label>
                <select
                  value={form.discountScope}
                  onChange={(e) => setForm(p => ({ ...p, discountScope: e.target.value as 'global' | 'specific' }))}
                  className={inp}
                >
                  <option value="global">Global (All Products)</option>
                  <option value="specific">Specific Categories/Products</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-forest/80">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercent}
                  onChange={(e) => setForm(p => ({ ...p, discountPercent: e.target.value }))}
                  className={inp}
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {form.discountScope === 'specific' && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-forest/80">Target Category/Product IDs</label>
                <input
                  type="text"
                  value={form.specificTargetIds}
                  onChange={(e) => setForm(p => ({ ...p, specificTargetIds: e.target.value }))}
                  className={inp}
                  placeholder="e.g. category_soaps, prod_123"
                />
                <p className="text-[11px] text-forest/60">Comma separated IDs of products or categories to apply this discount to.</p>
              </div>
            )}
            
            <p className="text-[11px] text-forest/60 mt-1">This percentage will be automatically applied based on the scope chosen above while the event is active.</p>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-forest/60">
            <Eye size={14} /> Live Preview
          </div>
          
          <div className="rounded-3xl border-2 border-dashed border-forest/10 p-2 overflow-hidden bg-cream-soft flex items-center justify-center min-h-[400px]">
            {form.isActive ? (
              <div className={`relative w-full overflow-hidden rounded-3xl ${form.backgroundColor} transition-colors duration-300 shadow-xl max-w-2xl`}>
                {/* Decorative blobs (matching the real component) */}
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
                
                <div className="relative p-8 sm:p-12 flex flex-col justify-center">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">
                    <ZapIcon size={10} strokeWidth={2.5} className="fill-gold" />
                    {form.badge || 'Badge Text'}
                  </span>
                  
                  <h2 className="mt-4 font-display text-[38px] font-bold leading-[1.05] text-cream sm:text-[48px]">
                    {form.headlineLine1 || 'Headline'}
                    <br />
                    <span className="text-gold">{form.headlineHighlight || 'Highlight'}</span>
                  </h2>
                  
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
                    {form.description || 'Description text goes here...'}
                  </p>
                  
                  {/* Mock countdown for preview */}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-[22px] font-bold text-cream backdrop-blur-sm">12</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Hours</span>
                    </div>
                    <span className="text-2xl font-bold text-cream/30 pb-4">:</span>
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 font-display text-[22px] font-bold text-cream backdrop-blur-sm">45</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Mins</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-forest/40 flex flex-col items-center">
                <Eye size={32} className="mb-2 opacity-50" />
                <p className="text-sm font-medium">Banner is currently disabled</p>
              </div>
            )}
          </div>
          <p className="text-xs text-forest/40 text-center">Preview reflects your edits in real time. Backend saving to be connected later.</p>
        </div>
      </div>
    </div>
  );
}
