'use client';

import React, { useEffect, useState } from 'react';
import { ProductForm } from '@/src/components/admin/ProductForm';
import { products, ApiError } from '@/src/lib/api';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    products.adminGet(id as string)
      .then(res => setInitialData(res.data.product))
      .catch(err => setError(err.message || 'Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-forest/60">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-terracotta mb-4">{error || 'Product not found'}</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="px-4 py-2 bg-forest text-white rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProductForm isEdit={true} initialData={initialData} />
    </div>
  );
}
