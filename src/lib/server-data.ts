import { ApiError } from './api';
import { REVALIDATE_SECONDS } from './seo';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

async function serverFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export async function fetchProductBySlug(slug: string) {
  const res = await serverFetch<{ data: { product: Record<string, unknown> } }>(
    `/api/products/${encodeURIComponent(slug)}`
  );
  return res.data.product;
}

export async function fetchAllProducts() {
  const res = await serverFetch<{ data: { products: Array<Record<string, unknown>> } }>(
    '/api/products?limit=500'
  );
  return res.data.products;
}

export async function fetchAllCategories() {
  const res = await serverFetch<{ data: { categories: Array<Record<string, unknown>> } }>(
    '/api/categories'
  );
  return res.data.categories;
}

export async function fetchCategoryBySlug(slug: string) {
  const categories = await fetchAllCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}
