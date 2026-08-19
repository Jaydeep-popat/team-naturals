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
  const [existingImages, setExistingImages] = useState<any[]>(initialData?.images || []);
  const [draggedPreviewIndex, setDraggedPreviewIndex] = useState<number | null>(null);
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    sku: initialData?.sku || '',
    categoryId: initialData?.categoryId?.toString() || '',
    price: initialData?.price || '',
    compareAtPrice: initialData?.compareAtPrice || '',
    stockQty: initialData?.stockQty?.toString() || '0',
    status: initialData?.status || 'draft',
    size: initialData?.size || '',
    scent: initialData?.scent || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });

  useEffect(() => {
    categories.list().then((res) => {
      setCategoryList(res.data.categories);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load categories');
    });
  }, []);

  const handleDragStartPreview = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedPreviewIndex(index);
  };

  const handleDragOverPreview = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropPreview = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPreviewIndex === null || draggedPreviewIndex === targetIndex) return;

    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    const [draggedFile] = newFiles.splice(draggedPreviewIndex, 1);
    const [draggedPreview] = newPreviews.splice(draggedPreviewIndex, 1);
    
    newFiles.splice(targetIndex, 0, draggedFile);
    newPreviews.splice(targetIndex, 0, draggedPreview);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    setDraggedPreviewIndex(null);
  };

  const handleDragStartExisting = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedExistingIndex(index);
  };

  const handleDragOverExisting = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropExisting = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedExistingIndex === null || draggedExistingIndex === targetIndex) return;

    const newExisting = [...existingImages];
    const [draggedItem] = newExisting.splice(draggedExistingIndex, 1);
    newExisting.splice(targetIndex, 0, draggedItem);
    
    setExistingImages(newExisting);
    setDraggedExistingIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stockQty: parseInt(formData.stockQty, 10),
        slug: formData.slug.trim() || undefined,
        shortDescription: formData.shortDescription.trim() || undefined,
        metaTitle: formData.metaTitle.trim() || undefined,
        metaDescription: formData.metaDescription.trim() || undefined,
      };

      let productId = initialData?.productId?.toString();

      if (isEdit && productId) {
        const { stockQty, ...updateData } = data;
        await products.update(productId, updateData);

        // Update stock via adjustStock if it changed
        const currentStock = initialData?.stockQty || 0;
        const newStock = parseInt(formData.stockQty, 10);
        if (newStock !== currentStock) {
          await products.adjustStock(productId, { newQty: newStock, reason: 'Manual adjustment via edit form' });
        }
        
        if (existingImages.length > 0) {
          const originalImages = initialData?.images || [];
          const orderChanged = existingImages.some((img, idx) => img.imageId !== originalImages[idx]?.imageId);
          
          if (orderChanged) {
            await products.reorderImages(productId, {
              images: existingImages.map((img, idx) => ({ imageId: img.imageId, sortOrder: idx }))
            });
            if (existingImages[0].imageId !== originalImages[0]?.imageId) {
              await products.setPrimaryImage(productId, existingImages[0].imageId);
            }
          }
        }
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
              <label className="block text-sm font-medium text-forest mb-1.5">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                maxLength={300}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                placeholder="Brief summary for listings (max 300 chars)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                placeholder="Full product description..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-forest/10 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-forest text-lg">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">URL Slug</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                maxLength={220}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="auto-generated from name if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Meta Title</label>
              <input
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={160}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="Page title for search engines (max 160 chars)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                maxLength={300}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                placeholder="Search snippet description (max 300 chars)"
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

            <div>
              <label className="block text-sm font-medium text-forest mb-1.5">Stock Quantity<span className="text-terracotta">*</span></label>
              <input
                required
                type="number"
                min="0"
                name="stockQty"
                value={formData.stockQty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-xl text-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                placeholder="0"
              />
            </div>
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
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-xl overflow-hidden border ${draggedPreviewIndex === index ? 'border-forest opacity-50' : 'border-forest/10'} group cursor-move`}
                    draggable
                    onDragStart={(e) => handleDragStartPreview(e, index)}
                    onDragOver={handleDragOverPreview}
                    onDrop={(e) => handleDropPreview(e, index)}
                    onDragEnd={() => setDraggedPreviewIndex(null)}
                  >
                    <img src={preview} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
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
            
            {/* Existing Images Management (Edit Mode) */}
            {isEdit && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-forest">
                    Current Product Images ({existingImages.length})
                  </p>
                  <p className="text-[11px] text-forest/60">Drag to reorder • Tap trash icon to delete</p>
                </div>

                {existingImages.length === 0 ? (
                  <p className="text-sm text-forest/50 italic py-2">No images uploaded for this product yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {existingImages.map((img: any, idx: number) => {
                      const imageId = img.imageId || img.id;
                      const imageUrl = typeof img === 'string' ? img : (img.url || '/placeholder.png');
                      const isPrimary = img.isPrimary || idx === 0;

                      return (
                        <div 
                          key={imageId || idx} 
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                            draggedExistingIndex === idx 
                              ? 'border-forest opacity-40 scale-95' 
                              : isPrimary 
                              ? 'border-forest ring-2 ring-forest/20 shadow-md' 
                              : 'border-forest/15 hover:border-forest/40 shadow-xs'
                          } bg-[#FDFBF9] flex flex-col justify-between p-2`}
                          draggable
                          onDragStart={(e) => handleDragStartExisting(e, idx)}
                          onDragOver={handleDragOverExisting}
                          onDrop={(e) => handleDropExisting(e, idx)}
                          onDragEnd={() => setDraggedExistingIndex(null)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={img.altText || "Product"} 
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                          />
                          
                          {/* Top bar: Primary Badge + Delete Button */}
                          <div className="relative z-10 flex items-center justify-between w-full">
                            {isPrimary ? (
                              <span className="px-2 py-0.5 bg-forest text-white text-[10px] font-bold rounded-md shadow-md">
                                ★ Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const productId = initialData?.productId?.toString() || initialData?.id?.toString();
                                    await products.setPrimaryImage(productId, imageId);
                                    const updated = existingImages.map((i, index) => ({
                                      ...i,
                                      isPrimary: (i.imageId || i.id) === imageId
                                    }));
                                    setExistingImages(updated);
                                    toast.success('Set as primary image');
                                  } catch (err: any) {
                                    toast.error(err.message || 'Failed to set primary image');
                                  }
                                }}
                                className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-forest text-[10px] font-bold rounded-md shadow-md hover:bg-forest hover:text-white transition-colors"
                              >
                                Make Primary
                              </button>
                            )}

                            <button
                              type="button"
                              title="Delete Image"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm('Delete this image permanently?')) return;
                                try {
                                  const productId = initialData?.productId?.toString() || initialData?.id?.toString();
                                  await products.deleteImage(productId, imageId);
                                  setExistingImages(existingImages.filter((i) => (i.imageId || i.id) !== imageId));
                                  toast.success('Image deleted successfully');
                                } catch (err: any) {
                                  toast.error(err.message || 'Failed to delete image');
                                }
                              }}
                              className="flex items-center justify-center h-7 w-7 rounded-lg bg-terracotta text-white shadow-md hover:bg-terracotta/90 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Bottom Drag handle hint */}
                          <div className="relative z-10 flex items-center justify-center w-full">
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">
                              Drag to move
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
