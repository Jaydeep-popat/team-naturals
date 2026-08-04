/**
 * Centralized API client for Team Naturals.
 * JWT is handled via httpOnly cookies — all requests send `credentials: 'include'`.
 * No manual token storage is needed.
 */

const isServer = typeof window === 'undefined';
const BASE_URL = isServer ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000') : '';

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  /**
   * If true, a 401 response will NOT trigger an automatic redirect to /login.
   * Use for the initial silent session-check on app load.
   */
  silent401?: boolean;
}

async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { silent401 = false, ...init } = options;

  const isFormData = init.body instanceof FormData;
  
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    // On 401, clear client auth state and bounce to login unless suppressed
    if (res.status === 401 && !silent401 && typeof window !== 'undefined') {
      const redirect = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${redirect}`;
      // Return a never-resolving promise to stop further execution
      return new Promise(() => {});
    }

    let errorBody: { message?: string } = {};
    try {
      errorBody = await res.json();
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, errorBody?.message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const auth = {
  me(): Promise<{ data: { user: import('../types/auth').User } }> {
    return apiFetch('/api/auth/me', { silent401: true });
  },

  login(body: { emailOrUsername: string; password: string }) {
    return apiFetch<{ data: { user: import('../types/auth').User } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      silent401: true,
    });
  },

  register(body: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phoneNo?: string;
  }) {
    return apiFetch<{ data: { user: import('../types/auth').User } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  verifyEmail(body: { email: string; otp: string }) {
    return apiFetch<{ data: { user: import('../types/auth').User } }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  resendVerification(body: { email: string }) {
    return apiFetch('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  logout() {
    return apiFetch('/api/auth/logout', { method: 'POST' });
  },

  forgotPassword(body: { email: string }) {
    return apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  resetPassword(body: { email: string; otp: string; password: string }) {
    return apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  refreshToken() {
    return apiFetch('/api/auth/refresh-token', { method: 'POST', silent401: true } as FetchOptions);
  },
};

// ─── Address endpoints ────────────────────────────────────────────────────────

export const addresses = {
  list() {
    return apiFetch<{ data: { addresses: import('../types/auth').Address[] } }>('/api/addresses');
  },

  create(body: {
    fullName: string;
    phoneNo: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    isDefault?: boolean;
  }) {
    return apiFetch<{ data: { address: import('../types/auth').Address } }>('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update(
    addressId: number,
    body: Partial<{
      fullName: string;
      phoneNo: string;
      line1: string;
      line2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    }>
  ) {
    return apiFetch<{ data: { address: import('../types/auth').Address } }>(
      `/api/addresses/${addressId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      }
    );
  },

  delete(addressId: number) {
    return apiFetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
  },
};

// ─── Products endpoints (Admin) ────────────────────────────────────────────────────────

export const products = {
  // Public storefront methods
  list(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { products: any[], pagination: any } }>(`/api/products?${q}`);
  },

  getBySlug(slug: string) {
    return apiFetch<{ data: { product: any } }>(`/api/products/${slug}`);
  },

  // Admin methods
  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { products: any[], pagination: any } }>(`/api/products/admin?${q}`);
  },

  adminGet(productId: string) {
    return apiFetch<{ data: { product: any } }>(`/api/products/admin/${productId}`);
  },

  create(body: any) {
    return apiFetch<{ data: { product: any } }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update(productId: string, body: any) {
    return apiFetch<{ data: { product: any } }>(`/api/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(productId: string) {
    return apiFetch<{ data: any }>(`/api/products/${productId}`, { method: 'DELETE' });
  },

  // Image upload method (FormData)
  uploadImages(productId: string, formData: FormData) {
    return fetch(`${BASE_URL}/api/products/${productId}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) {
        let err;
        try { err = await res.json(); } catch {}
        throw new ApiError(res.status, err?.message || 'Failed to upload images');
      }
      return res.json();
    });
  },
};

// ─── Categories endpoints ───────────────────────────────────────────────────────

export const categories = {
  list() {
    return apiFetch<{ data: { categories: any[] } }>('/api/categories');
  },
  
  create(body: FormData | { name: string; slug?: string; description?: string }) {
    return apiFetch<{ data: { category: any } }>('/api/categories', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  update(categoryId: string, body: FormData | { name?: string; slug?: string; description?: string }) {
    return apiFetch<{ data: { category: any } }>(`/api/categories/${categoryId}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete(categoryId: string) {
    return apiFetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
  },
};

// ─── Users endpoints ──────────────────────────────────────────────────────────

export const users = {
  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { users: any[], pagination: any } }>(`/api/auth/admin/users?${q}`);
  },

  promoteAdmin(email: string) {
    return apiFetch(`/api/auth/promote-admin`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ─── Cart endpoints ────────────────────────────────────────────────────────────

export const cart = {
  getCart() {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>('/api/cart');
  },
  
  addItem(productId: string, quantity: number) {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateItem(cartItemId: string, quantity: number) {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>(`/api/cart/items/${cartItemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem(cartItemId: string) {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>(`/api/cart/items/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  clearCart() {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>('/api/cart', {
      method: 'DELETE',
    });
  },
};

// ─── Orders endpoints ──────────────────────────────────────────────────────────

export const orders = {
  checkout(addressId: number, notes?: string) {
    return apiFetch<{ data: { order: any; razorpay: any } }>('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({ addressId, notes }),
    });
  },

  verifyPayment(body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    return apiFetch<{ data: { order: any; alreadyProcessed: boolean } }>('/api/orders/verify-payment', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  list(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { orders: any[]; pagination: any } }>(`/api/orders?${q}`);
  },

  get(orderId: string) {
    return apiFetch<{ data: { order: any } }>(`/api/orders/${orderId}`);
  },

  cancel(orderId: string, reason?: string) {
    return apiFetch<{ data: { order: any; refund: any } }>(`/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};
