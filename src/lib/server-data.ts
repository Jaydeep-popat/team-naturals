import { ApiError } from './api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';
const REVALIDATE_SECONDS = 3600;

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
  const products: Array<Record<string, unknown>> = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await serverFetch<{
      data: { products: Array<Record<string, unknown>>; pagination: { totalPages: number } };
    }>(`/api/products?limit=100&page=${page}`);

    products.push(...res.data.products);
    totalPages = res.data.pagination?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return products;
}

export async function fetchAllCategories() {
  const res = await serverFetch<{ data: { categories: Array<Record<string, unknown>> } }>(
    '/api/categories'
  );
  return res.data.categories;
}

export async function fetchCategoryBySlug(slug: string) {
  try {
    const res = await serverFetch<{ data: { category: Record<string, unknown> } }>(
      `/api/categories/${encodeURIComponent(slug)}`
    );
    return res.data.category;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}
