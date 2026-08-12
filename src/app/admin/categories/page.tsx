'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { Drawer } from '@/src/components/admin/Drawer';
import { Plus, Trash2, Pencil, ToggleLeft, ToggleRight, GripVertical, Loader2, Image as ImageIcon } from 'lucide-react';
import { categories as categoriesApi, ApiError } from '@/src/lib/api';
import toast from 'react-hot-toast';

type Category = {
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  imageUrl?: string;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoriesApi.adminList();
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
    });
    setImageFile(null);
    setImagePreview(category.imageUrl || null);
    setEditId(category.categoryId);
    setShowDrawer(true);
  };

  const handleOpenNew = () => {
    setForm({ name: '', slug: '', description: '', metaTitle: '', metaDescription: '' });
    setImageFile(null);
    setImagePreview(null);
    setEditId(null);
    setShowDrawer(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await categoriesApi.delete(deleteTarget.categoryId.toString());
      setDeleteTarget(null);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      if (form.slug) payload.append('slug', form.slug);
      if (form.description) payload.append('description', form.description);
      if (form.metaTitle) payload.append('metaTitle', form.metaTitle);
      if (form.metaDescription) payload.append('metaDescription', form.metaDescription);
      if (imageFile) payload.append('image', imageFile);

      if (editId) {
        await categoriesApi.update(editId.toString(), payload);
        toast.success('Category updated successfully');
      } else {
        await categoriesApi.create(payload);
        toast.success('Category created successfully');
      }
      
      setShowDrawer(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<Category>[] = [
    { key: 'displayOrder', header: '#', render: (c) => <GripVertical size={16} className="text-forest/30 cursor-grab" /> },
    { key: 'image', header: 'Image', render: (c) => (
      <div className="h-10 w-10 overflow-hidden rounded-lg border border-forest/10 bg-cream">
        <img src={c.imageUrl || '/placeholder.png'} alt={c.name} className="h-full w-full object-cover" />
      </div>
    ) },
    { key: 'name', header: 'Name', sortable: true, render: (c) => <span className="font-semibold text-forest">{c.name}</span> },
    { key: 'slug', header: 'Slug', render: (c) => <span className="font-mono text-[12px] text-forest/50">/{c.slug}</span> },
    { key: 'productCount', header: 'Products', render: (c) => <span className="text-forest/70">{c._count?.products || 0}</span> },
    { key: 'actions', header: '',
      render: (c) => (
        <div className="flex items-center gap-1 justify-end">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
            className="p-1.5 rounded-lg text-forest/30 hover:text-forest hover:bg-forest/5 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(c); }}
            className="p-1.5 rounded-lg text-forest/30 hover:text-terracotta hover:bg-terracotta/5 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      )},
  ];

  const inp = 'w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest focus:outline-none focus:ring-1 focus:ring-forest';

  return (
    <div className="space-y-6 relative">
      {isSaving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl border border-forest/10">
            <Loader2 size={48} className="animate-spin text-forest mb-4" />
            <p className="font-display font-semibold text-forest text-xl">Saving Category...</p>
            <p className="text-sm text-forest/60 mt-2">Please wait while we update the database.</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Categories</h1>
          <p className="text-sm text-forest/60 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold shadow-sm hover:bg-[#16301F] transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <FilterBar
        searchPlaceholder="Search categories..."
        onSearch={setSearchQuery}
      />

      <DataTable 
        data={categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.slug.toLowerCase().includes(searchQuery.toLowerCase()))} 
        columns={columns} 
        keyExtractor={(c) => c.categoryId.toString()} 
        emptyMessage={isLoading ? "Loading..." : "No categories found."} 
      />

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Category"
        message={`Deleting "${deleteTarget?.name}" may affect ${deleteTarget?._count?.products || 0} linked products. This cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"} isDestructive
      />

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title={editId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Name<span className="text-terracotta">*</span></label>
            <input required value={form.name} onChange={(e) => { setForm(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })); }} className={inp} placeholder="e.g. Bundles" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Category Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-forest/20 flex items-center justify-center bg-[#FDFBF9] overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-forest/30" />
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="text-sm text-forest/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest/10 file:text-forest hover:file:bg-forest/20 transition-all cursor-pointer" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Slug</label>
            <input value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))} className={inp} placeholder="auto-generated" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className={inp} placeholder="Optional description..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Meta Title</label>
            <input value={form.metaTitle} onChange={(e) => setForm(p => ({ ...p, metaTitle: e.target.value }))} maxLength={160} className={inp} placeholder="SEO page title (max 160 chars)" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-forest/80">Meta Description</label>
            <textarea value={form.metaDescription} onChange={(e) => setForm(p => ({ ...p, metaDescription: e.target.value }))} rows={2} maxLength={300} className={inp} placeholder="SEO meta description (max 300 chars)" />
          </div>
          <button type="submit" disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest text-white font-bold text-sm hover:bg-[#16301F] transition-colors disabled:opacity-60">
            {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : (editId ? 'Save Changes' : 'Create Category')}
          </button>
        </form>
      </Drawer>
    </div>
  );
}
