'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Package, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { products, categories, ApiError } from '@/src/lib/api';
import toast from 'react-hot-toast';

type ProductFormProps = {
  initialData?: any;
  isEdit?: boolean;
};

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    categoryId: initialData?.categoryId?.toString() || '',
    price: initialData?.price || '',
    compareAtPrice: initialData?.compareAtPrice || '',
    stockQty: initialData?.stockQty?.toString() || '0',
    status: initialData?.status || 'draft',
    size: initialData?.size || '',
    scent: initialData?.scent || '',
    description: initialData?.description || '',
  });

  useEffect(() => {
    categories.list().then((res) => {
      setCategoryList(res.data.categories);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load categories');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stockQty: !isEdit ? parseInt(formData.stockQty, 10) : undefined,
      };

      let productId = initialData?.productId?.toString();

      if (isEdit && productId) {
        await products.update(productId, data);
      } else {
        const res = await products.create(data);
        productId = res.data.product.productId.toString();
      }

      // Handle image uploads
      if (selectedFiles.length > 0 && productId) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });
        await products.uploadImages(productId, formData);
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product created successfully');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('Failed to save product', err);
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Optional: limit to 5 files total
      const newFiles = [...selectedFiles, ...files].slice(0, 5);
      setSelectedFiles(newFiles);
      setPreviews(newFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-2xl border border-forest/10">
            <Loader2 size={48} className="animate-spin text-forest mb-4" />
            <p className="font-display font-semibold text-forest text-xl">Saving Product...</p>
            <p className="text-sm text-forest/60 mt-2">Uploading images and updating the database.</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-forest">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2.5 rounded-xl border border-forest/10 text-forest text-sm font-semibold hover:bg-forest/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold shadow-sm hover:bg-[#16301F] transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg flex items-center gap-2">
              <Package size={20} className="text-forest/60" /> Basic Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Product Name<span className="text-terracotta">*</span></label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="e.g., Neem & Tulsi Face Wash"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">SKU<span className="text-terracotta">*</span></label>
                <input
                  required
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  placeholder="e.g., FW-NT-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Category<span className="text-terracotta">*</span></label>
                <select
                  required
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                >
                  <option value="">Select a category</option>
                  {categoryList.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Price (₹)<span className="text-terracotta">*</span></label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Compare-at Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="compareAtPrice"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                  placeholder="0.00"
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-forest mb-1.5">Initial Stock Quantity<span className="text-terracotta">*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stockQty"
                  value={formData.stockQty}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
                <p className="text-xs text-forest/60 mt-1">Stock can only be adjusted via inventory management after creation.</p>
              </div>
            )}
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg flex items-center gap-2">
              <ImageIcon size={20} className="text-forest/60" /> Product Images (2 to 5 recommended)
            </h2>
            
            <div className="border-2 border-dashed border-forest/20 rounded-xl p-8 text-center bg-[#FDFBF9]">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-forest/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-forest/10 file:text-forest hover:file:bg-forest/20 transition-all cursor-pointer mx-auto max-w-[280px]"
              />
              <p className="text-xs text-forest/50 mt-3">Upload high quality images of your product.</p>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-forest/10 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1.5 bg-terracotta text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-terracotta/90"
                    >
                      <Trash2 size={14} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-forest text-white text-[10px] font-bold rounded-lg shadow-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {isEdit && initialData?.images && initialData.images.length > 0 && previews.length === 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {initialData.images.map((img: any, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-forest/10">
                    <img src={img.url} alt="Current" className="w-full h-full object-cover" />
                    {img.isPrimary && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-forest text-white text-[10px] font-bold rounded-lg shadow-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg">Status</h2>
            <div>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg">Variants (Optional)</h2>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Size / Weight</label>
              <input
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="e.g., 100ml, 75g"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Scent / Flavor</label>
              <input
                name="scent"
                value={formData.scent}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="e.g., Rose, Charcoal"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}
