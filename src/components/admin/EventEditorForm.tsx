'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Loader2, PaintBucket, Percent, Save, Send, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { EventBanner, EventBannerModel } from '@/src/components/EventBanner';
import { events, products as productsApi, categories as categoriesApi } from '@/src/lib/api';

type DiscountRule = {
  type: 'percent' | 'flat';
  value: number;
  scope: 'all_products' | 'category' | 'specific_products';
  targetIds: (number | string)[];
};

type EventFormState = {
  name: string;
  status: string;
  shortDescription: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: number;
  bannerType: 'image' | 'custom' | 'gradient';
  bannerImage: string;
  bannerMobileImage: string;
  bannerOverlay: boolean;
  bannerOverlayColor: string;
  bannerOverlayOpacity: number;
  backgroundColor: string;
  gradientColors: string;
  gradientType: string;
  gradientDirection: string;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor: string;
  title: string;
  subtitle: string;
  textColor: string;
  subtitleColor: string;
  alignment: string;
  verticalAlignment: string;
  ctaEnabled: boolean;
  ctaText: string;
  ctaDestination: string;
  ctaBgColor: string;
  ctaTextColor: string;
  desktopHeight: string;
  mobileHeight: string;
  showOnHomepage: boolean;
  showOnOffersPage: boolean;
  showProductBadges: boolean;
  rules: DiscountRule[];
};

const toDateTimeLocal = (value?: string | Date | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const defaultForm: EventFormState = {
  name: '',
  status: 'draft',
  shortDescription: '',
  description: '',
  startDate: toDateTimeLocal(new Date()),
  endDate: toDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  priority: 0,
  bannerType: 'custom',
  bannerImage: '',
  bannerMobileImage: '',
  bannerOverlay: false,
  bannerOverlayColor: '#000000',
  bannerOverlayOpacity: 30,
  backgroundColor: '#f5efe6',
  gradientColors: '#f5efe6,#dbe8d2,#1f3d2b',
  gradientType: 'linear',
  gradientDirection: 'to right',
  badgeText: 'LIMITED TIME',
  badgeBgColor: '#c25e4a',
  badgeTextColor: '#ffffff',
  title: '',
  subtitle: 'Special offers',
  textColor: '#1f3d2b',
  subtitleColor: '#2a523a',
  alignment: 'center',
  verticalAlignment: 'center',
  ctaEnabled: true,
  ctaText: 'Shop Now',
  ctaDestination: '/shop',
  ctaBgColor: '#1f3d2b',
  ctaTextColor: '#ffffff',
  desktopHeight: '360px',
  mobileHeight: '260px',
  showOnHomepage: false,
  showOnOffersPage: true,
  showProductBadges: true,
  rules: [],
};

const buildInitialForm = (event?: any): EventFormState => {
  if (!event) return defaultForm;

  return {
    ...defaultForm,
    ...event,
    status: event.status || 'draft',
    startDate: toDateTimeLocal(event.startDate),
    endDate: toDateTimeLocal(event.endDate),
    gradientColors: Array.isArray(event.gradientColors)
      ? event.gradientColors.join(',')
      : event.gradientColors || defaultForm.gradientColors,
    rules: event.rules || [],
  };
};

export function EventEditorForm({ initialEvent }: { initialEvent?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormState>(() => buildInitialForm(initialEvent));
  const [activeTab, setActiveTab] = useState<'info' | 'design' | 'content' | 'rules'>('info');
  const [savingAction, setSavingAction] = useState<string | null>(null);
  const isEditing = Boolean(initialEvent?.eventId);

  const inputClass = 'w-full rounded-xl border border-forest/20 bg-white px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest';
  const labelClass = 'mb-1.5 block text-xs font-semibold text-forest/80';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);

  React.useEffect(() => {
    productsApi.list({ limit: '100' }).then(res => setAvailableProducts(res.data.products)).catch(console.error);
    categoriesApi.list().then(res => setAvailableCategories(res.data.categories)).catch(console.error);
  }, []);

  const previewEvent: EventBannerModel = useMemo(() => ({
    ...form,
    eventId: initialEvent?.eventId || 0,
    slug: initialEvent?.slug || 'preview',
    name: form.name || 'Campaign Preview',
    gradientColors: form.gradientColors.split(',').map((color) => color.trim()).filter(Boolean),
  }), [form, initialEvent?.eventId, initialEvent?.slug]);

  const saveEvent = async (statusOverride?: string) => {
    if (!form.name.trim()) {
      toast.error('Campaign name is required');
      setActiveTab('info');
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast.error('Start and end dates are required');
      setActiveTab('info');
      return;
    }

    setSavingAction(statusOverride || 'save');
    try {
      const payload = {
        ...form,
        status: statusOverride || form.status,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        gradientColors: form.gradientColors.split(',').map((color) => color.trim()).filter(Boolean),
      };

      if (isEditing) {
        await events.update(String(initialEvent.eventId), payload);
        toast.success('Campaign updated');
      } else {
        await events.create(payload);
        toast.success('Campaign created');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to save event:', error);
      toast.error(error.message || 'Failed to save campaign');
    } finally {
      setSavingAction(null);
    }
  };

  const updateRule = (index: number, nextRule: Partial<DiscountRule>) => {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? { ...rule, ...nextRule } : rule)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm font-medium text-forest/70 hover:text-forest">
            <ArrowLeft size={16} /> Back to campaigns
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold text-forest">
            {isEditing ? 'Edit Campaign' : 'Create Campaign'}
          </h1>
          <p className="mt-1 text-sm text-forest/60">Design the event banner, set display rules, and preview it before publishing.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => saveEvent('draft')}
            disabled={!!savingAction}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest/15 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-cream-soft disabled:opacity-60"
          >
            {savingAction === 'draft' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => saveEvent('active')}
            disabled={!!savingAction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16301F] disabled:opacity-60"
          >
            {savingAction === 'active' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <main className="min-w-0 rounded-2xl border border-forest/10 bg-white">
          <div className="flex gap-1 overflow-x-auto border-b border-forest/10 px-3 pt-3">
            {[
              { id: 'info', icon: Type, label: 'General' },
              { id: 'design', icon: PaintBucket, label: 'Design' },
              { id: 'content', icon: ImageIcon, label: 'Content' },
              { id: 'rules', icon: Percent, label: 'Discounts' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'border-forest text-forest' : 'border-transparent text-gray-500 hover:text-forest'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'info' && (
              <section className="space-y-5">
                <div>
                  <label className={labelClass}>Campaign Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Independence Day Sale" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Priority</label>
                    <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number.parseInt(e.target.value, 10) || 0 })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Publish Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                      <option value="draft">Draft</option>
                      <option value="active">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Short Description</label>
                  <textarea rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Full Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
                </div>
                <div className="grid gap-3 border-t border-forest/8 pt-4 sm:grid-cols-3">
                  <CheckRow label="Show on Homepage" checked={form.showOnHomepage} onChange={(checked) => setForm({ ...form, showOnHomepage: checked })} />
                  <CheckRow label="Show on Offers Page" checked={form.showOnOffersPage} onChange={(checked) => setForm({ ...form, showOnOffersPage: checked })} />
                  <CheckRow label="Product Badges" checked={form.showProductBadges} onChange={(checked) => setForm({ ...form, showProductBadges: checked })} />
                </div>
              </section>
            )}

            {activeTab === 'design' && (
              <section className="space-y-5">
                <div>
                  <label className={labelClass}>Banner Type</label>
                  <select value={form.bannerType} onChange={(e) => setForm({ ...form, bannerType: e.target.value as EventFormState['bannerType'] })} className={inputClass}>
                    <option value="image">Image</option>
                    <option value="custom">Custom Color</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>

                {form.bannerType === 'image' && (
                  <div className="grid gap-4 rounded-2xl border border-forest/8 bg-cream-soft/50 p-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Desktop Image URL</label>
                      <input value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} className={inputClass} placeholder="https://..." />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Image URL</label>
                      <input value={form.bannerMobileImage} onChange={(e) => setForm({ ...form, bannerMobileImage: e.target.value })} className={inputClass} placeholder="Optional" />
                    </div>
                  </div>
                )}

                {form.bannerType === 'custom' && (
                  <ColorField label="Background Color" value={form.backgroundColor} onChange={(value) => setForm({ ...form, backgroundColor: value })} inputClass={inputClass} labelClass={labelClass} />
                )}

                {form.bannerType === 'gradient' && (
                  <div className="space-y-4 rounded-2xl border border-forest/8 bg-cream-soft/50 p-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={`${labelClass} mb-0`}>Gradient Colors</label>
                        <div 
                          className="w-32 h-6 rounded-md border border-forest/15 shadow-sm"
                          style={{
                            background: `${form.gradientType}-gradient(${
                              form.gradientType === 'linear' ? form.gradientDirection + ',' : ''
                            } ${form.gradientColors})`
                          }}
                        />
                      </div>
                      <input value={form.gradientColors} onChange={(e) => setForm({ ...form, gradientColors: e.target.value })} className={inputClass} placeholder="#f5efe6,#dbe8d2,#1f3d2b" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Gradient Type</label>
                        <select value={form.gradientType} onChange={(e) => setForm({ ...form, gradientType: e.target.value })} className={inputClass}>
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Direction</label>
                        <input value={form.gradientDirection} onChange={(e) => setForm({ ...form, gradientDirection: e.target.value })} className={inputClass} placeholder="to right" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t border-forest/8 pt-4">
                  <CheckRow label="Enable Overlay" checked={form.bannerOverlay} onChange={(checked) => setForm({ ...form, bannerOverlay: checked })} />
                  {form.bannerOverlay && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorField label="Overlay Color" value={form.bannerOverlayColor} onChange={(value) => setForm({ ...form, bannerOverlayColor: value })} inputClass={inputClass} labelClass={labelClass} />
                      <div>
                        <label className={labelClass}>Overlay Opacity</label>
                        <input type="number" min="0" max="100" value={form.bannerOverlayOpacity} onChange={(e) => setForm({ ...form, bannerOverlayOpacity: Number.parseInt(e.target.value, 10) || 0 })} className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 border-t border-forest/8 pt-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Desktop Height</label>
                    <input value={form.desktopHeight} onChange={(e) => setForm({ ...form, desktopHeight: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Height</label>
                    <input value={form.mobileHeight} onChange={(e) => setForm({ ...form, mobileHeight: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Horizontal Alignment</label>
                    <select value={form.alignment} onChange={(e) => setForm({ ...form, alignment: e.target.value })} className={inputClass}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Vertical Alignment</label>
                    <select value={form.verticalAlignment} onChange={(e) => setForm({ ...form, verticalAlignment: e.target.value })} className={inputClass}>
                      <option value="top">Top</option>
                      <option value="center">Center</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'content' && (
              <section className="space-y-5">
                <div className="grid gap-4 rounded-2xl border border-forest/8 bg-cream-soft/50 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Badge Text</label>
                    <input value={form.badgeText} onChange={(e) => setForm({ ...form, badgeText: e.target.value })} className={inputClass} placeholder="LIMITED TIME" />
                  </div>
                  <ColorField label="Badge Background" value={form.badgeBgColor} onChange={(value) => setForm({ ...form, badgeBgColor: value })} inputClass={inputClass} labelClass={labelClass} />
                  <ColorField label="Badge Text" value={form.badgeTextColor} onChange={(value) => setForm({ ...form, badgeTextColor: value })} inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div>
                  <label className={labelClass}>Banner Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Leave empty to use event name" />
                </div>
                <div>
                  <label className={labelClass}>Subtitle</label>
                  <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} placeholder="Up to 40% OFF" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorField label="Main Text Color" value={form.textColor} onChange={(value) => setForm({ ...form, textColor: value })} inputClass={inputClass} labelClass={labelClass} />
                  <ColorField label="Subtitle Color" value={form.subtitleColor} onChange={(value) => setForm({ ...form, subtitleColor: value })} inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div className="space-y-4 rounded-2xl border border-forest/8 bg-cream-soft/50 p-4">
                  <CheckRow label="Enable CTA Button" checked={form.ctaEnabled} onChange={(checked) => setForm({ ...form, ctaEnabled: checked })} />
                  {form.ctaEnabled && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Button Text</label>
                        <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Destination URL</label>
                        <input value={form.ctaDestination} onChange={(e) => setForm({ ...form, ctaDestination: e.target.value })} className={inputClass} placeholder="/shop" />
                      </div>
                      <ColorField label="Button Background" value={form.ctaBgColor} onChange={(value) => setForm({ ...form, ctaBgColor: value })} inputClass={inputClass} labelClass={labelClass} />
                      <ColorField label="Button Text" value={form.ctaTextColor} onChange={(value) => setForm({ ...form, ctaTextColor: value })} inputClass={inputClass} labelClass={labelClass} />
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'rules' && (
              <section className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-forest">Discount Rules</h2>
                    <p className="text-sm text-forest/60">Specific products override categories, and categories override all-products discounts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, rules: [...prev.rules, { type: 'percent', value: 10, scope: 'all_products', targetIds: [] }] }))}
                    className="rounded-xl bg-forest/10 px-3 py-2 text-sm font-semibold text-forest hover:bg-forest/15"
                  >
                    Add Rule
                  </button>
                </div>

                {form.rules.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-forest/20 bg-cream-soft/40 p-8 text-center text-sm text-forest/60">
                    No discount rules yet. This campaign will only show the banner.
                  </div>
                )}

                {form.rules.map((rule, index) => (
                  <div key={index} className="space-y-4 rounded-2xl border border-forest/10 bg-forest/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-forest">Rule {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }))}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-terracotta hover:bg-white"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Discount Type</label>
                        <select value={rule.type} onChange={(e) => updateRule(index, { type: e.target.value as DiscountRule['type'] })} className={inputClass}>
                          <option value="percent">Percent (%)</option>
                          <option value="flat">Flat Amount</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Value</label>
                        <input type="number" min={1} value={rule.value} onChange={(e) => updateRule(index, { value: Number.parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Scope</label>
                      <select value={rule.scope} onChange={(e) => updateRule(index, { scope: e.target.value as DiscountRule['scope'], targetIds: [] })} className={inputClass}>
                        <option value="all_products">All Products</option>
                        <option value="category">Specific Categories</option>
                        <option value="specific_products">Specific Products</option>
                      </select>
                    </div>
                    {rule.scope !== 'all_products' && (
                      <div className="space-y-2">
                        <label className={labelClass}>{rule.scope === 'category' ? 'Select Categories' : 'Select Products'}</label>
                        <div className="max-h-56 overflow-y-auto rounded-xl border border-forest/15 bg-white p-2 space-y-1">
                          {(rule.scope === 'category' ? availableCategories : availableProducts).map((item: any) => {
                            const idToToggle = item.slug || item.id || item.categoryId || item.productId;
                            const isSelected = rule.targetIds.includes(idToToggle);
                            return (
                              <label key={idToToggle} className="flex items-center gap-3 p-2 hover:bg-forest/5 rounded-lg cursor-pointer transition-colors">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    let newTargets = [...rule.targetIds];
                                    if (checked) {
                                      newTargets.push(idToToggle);
                                    } else {
                                      newTargets = newTargets.filter(id => id !== idToToggle);
                                    }
                                    updateRule(index, { targetIds: newTargets });
                                  }}
                                  className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest"
                                />
                                <div className="flex items-center gap-3">
                                  {(item.images?.[0] || item.imageUrl) ? (
                                    <img src={item.imageUrl || (typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url)} className="w-8 h-8 rounded-md object-cover border border-forest/10" alt="" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-md bg-forest/5 border border-forest/10" />
                                  )}
                                  <span className="text-sm text-forest font-medium">{item.name}</span>
                                </div>
                              </label>
                            );
                          })}
                          {(rule.scope === 'category' ? availableCategories : availableProducts).length === 0 && (
                            <div className="text-sm text-forest/50 p-4 text-center">Loading options...</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        </main>

        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-2xl border border-forest/10 bg-[#FDFBF9] p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-forest/50">Live Preview</h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-forest/60">Customer banner</span>
            </div>
            <EventBanner event={previewEvent} className="shadow-soft" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-forest/8 bg-white px-3 py-2.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-forest" />
      <span className="text-sm font-medium text-forest">{label}</span>
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
  inputClass,
  labelClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: string;
  labelClass: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-forest/15 bg-white p-1" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      </div>
    </div>
  );
}
