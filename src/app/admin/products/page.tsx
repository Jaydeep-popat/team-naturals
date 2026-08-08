'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { useRouter } from 'next/navigation';
import { Plus, Package, Eye, Pencil, Trash2 } from 'lucide-react';
import { products as productsApi, ApiError } from '@/src/lib/api';
import toast from 'react-hot-toast';

type ProductStatus = 'active' | 'draft' | 'archived';

type Product = {
  productId: number;
  name: string;
  sku: string;
  category: { name: string } | null;
  price: string;
  stockQty: number;
  status: ProductStatus;
  images?: any[];
};

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-800 border border-green-200',
  draft: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
  archived: 'bg-red-50 text-red-700 border border-red-200',
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productsApi.adminList(activeFilters);
      setProducts(res.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === undefined) delete next[key]; else next[key] = value;
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await productsApi.delete(deleteTarget.productId.toString());
      setDeleteTarget(null);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Product>[] = [
    { key: 'name', header: 'Product', sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-forest/5 flex items-center justify-center shrink-0 overflow-hidden">
            {p.images?.[0] ? (
              <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <Package size={16} className="text-forest/40" />
            )}
          </div>
          <div>
            <div className="font-semibold text-forest text-sm">{p.name}</div>
            <div className="text-[11px] font-mono text-forest/40">{p.sku}</div>
          </div>
        </div>
      )},
    { key: 'category', header: 'Category',
      render: (p) => (
        <span className="text-forest/70 text-[13px] font-medium">{p.category?.name || 'Uncategorized'}</span>
      )},
    { key: 'price', header: 'Price', sortable: true,
      render: (p) => <span className="font-semibold text-forest">₹{p.price}</span> },
    { key: 'stockQty', header: 'Stock', sortable: true,
      render: (p) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ${
          p.stockQty === 0 ? 'bg-terracotta/10 text-terracotta' : 
          p.stockQty < 10 ? 'bg-[#D99A3D]/10 text-[#D99A3D]' : 
          'bg-forest/10 text-forest'
        }`}>
          {p.stockQty === 0 ? 'Out of stock' : `${p.stockQty} units`}
        </span>
      )},
    { key: 'status', header: 'Status',
      render: (p) => (
        <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold capitalize shadow-sm ${STATUS_STYLES[p.status]}`}>
          {p.status}
        </span>
      )},
    { key: 'actions', header: '',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/products/${p.productId}`); }}
            className="p-1.5 rounded-lg text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
            className="p-1.5 rounded-lg text-forest/40 hover:text-terracotta hover:bg-terracotta/5 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Products</h1>
          <p className="text-sm text-forest/60 mt-1">
            {products.filter((p) => p.stockQty > 0).length}/{products.length} in stock
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/products/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold shadow-sm hover:bg-[#16301F] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <FilterBar
        searchPlaceholder="Search by product name or SKU..."
        onSearch={setSearchQuery}
        filters={[
          { key: 'status', label: 'Status', options: [{ value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }, { value: 'archived', label: 'Archived' }] },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => setActiveFilters({})}
      />

      <DataTable
        data={products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        columns={columns}
        keyExtractor={(p) => p.productId.toString()}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowClick={(p) => router.push(`/admin/products/${p.productId}`)}
        emptyMessage={isLoading ? "Loading products..." : "No products found."}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        isDestructive
      />
    </div>
  );
}
