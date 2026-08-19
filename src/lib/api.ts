/**
 * Centralized API client for Team Naturals.
 * JWT is handled via httpOnly cookies — all requests send `credentials: 'include'`.
 * No manual token storage is needed.
 */

const isServer = typeof window === 'undefined';
const LIVE_API_BASE_URL = 'https://api.teamnaturals.in';
const LOCAL_API_BASE_URL = 'http://127.0.0.1:8000';

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!isServer && window.location.hostname.endsWith('teamnaturals.in')) {
    if (!configuredUrl || /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(configuredUrl)) {
      return LIVE_API_BASE_URL;
    }
  }

  if (configuredUrl) return configuredUrl;
  if (process.env.NODE_ENV === 'production') return LIVE_API_BASE_URL;
  return isServer ? LOCAL_API_BASE_URL : '';
}

const BASE_URL = getApiBaseUrl();

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  /**
   * If true, a 401 response will NOT trigger an automatic redirect to /login.
   * Use for the initial silent session-check on app load.
   */
  silent401?: boolean;
}
let isRefreshing = false;
let refreshSubscribers: ((error: Error | null) => void)[] = [];

function onRefreshed(error: Error | null) {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (error: Error | null) => void) {
  refreshSubscribers.push(callback);
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

  let res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 && !silent401 && typeof window !== 'undefined') {
      if (path === '/api/auth/refresh-token') {
        // Refresh token itself failed, redirect to login
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?redirect=${redirect}`;
        return new Promise(() => {});
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await auth.refreshToken();
          isRefreshing = false;
          onRefreshed(null);
          
          // Retry original request
          res = await fetch(`${BASE_URL}${path}`, {
            ...init,
            credentials: 'include',
            headers,
          });
        } catch (error: any) {
          isRefreshing = false;
          onRefreshed(error);
          const redirect = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?redirect=${redirect}`;
          return new Promise(() => {});
        }
      } else {
        // Wait for ongoing refresh
        return new Promise<T>((resolve, reject) => {
          addRefreshSubscriber(async (error) => {
            if (error) return reject(error);
            try {
              const retryRes = await fetch(`${BASE_URL}${path}`, {
                ...init,
                credentials: 'include',
                headers,
              });
              if (!retryRes.ok) {
                let errBody = {};
                try { errBody = await retryRes.json(); } catch {}
                return reject(new ApiError(retryRes.status, (errBody as any)?.message ?? retryRes.statusText));
              }
              resolve(await retryRes.json());
            } catch (err) {
              reject(err);
            }
          });
        });
      }
    }

    if (!res.ok) {
      let errorBody: { message?: string } = {};
      try {
        errorBody = await res.json();
      } catch {
        // ignore parse error
      }
      throw new ApiError(res.status, errorBody?.message ?? res.statusText);
    }
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

  uploadProfilePic(formData: FormData): Promise<{ data: { user: import('../types/auth').User } }> {
    return apiFetch('/api/auth/me/profile-pic', {
      method: 'PUT',
      body: formData,
    });
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

  verifyResetOtp(body: { email: string; otp: string }) {
    return apiFetch('/api/auth/verify-reset-otp', {
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

  updateProfile(body: {
    firstName?: string;
    lastName?: string;
    username?: string;
    phoneNo?: string | null;
    profilePic?: string | null;
    dateOfBirth?: string | null;
  }) {
    return apiFetch<{ data: { user: import('../types/auth').User } }>('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};

// ─── Admin Users endpoints ──────────────────────────────────────────────────

export const adminUsers = {
  list(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiFetch<{ data: { users: import('../types/auth').User[], pagination: any } }>(`/api/auth/admin/users${query}`);
  },

  promote(email: string) {
    return apiFetch<{ data: { user: import('../types/auth').User } }>('/api/auth/promote-admin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
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
    latitude?: number | null;
    longitude?: number | null;
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
      latitude: number | null;
      longitude: number | null;
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

  // Admin methods (preferred /api/admin/* routes per backend API docs)
  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { products: any[]; pagination: any } }>(`/api/admin/products?${q}`);
  },

  adminGet(productId: string) {
    return apiFetch<{ data: { product: any } }>(`/api/admin/products/${productId}`);
  },

  create(body: any) {
    return apiFetch<{ data: { product: any } }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update(productId: string, body: any) {
    return apiFetch<{ data: { product: any } }>(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(productId: string) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}`, { method: 'DELETE' });
  },

  adjustStock(productId: string, body: { newQty?: number; delta?: number; reason?: string }) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  // Image upload method (FormData) — equivalent admin path
  uploadImages(productId: string, formData: FormData) {
    return fetch(`${BASE_URL}/api/admin/products/${productId}/images`, {
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

  reorderImages(productId: string, body: { images: { imageId: string | number, sortOrder: number }[] }) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}/images/reorder`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  deleteImage(productId: string | number, imageId: string | number) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },

  updateImage(productId: string | number, imageId: string | number, body: { altText?: string | null; sortOrder?: number; isPrimary?: boolean }) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}/images/${imageId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  setPrimaryImage(productId: string | number, imageId: string | number) {
    return apiFetch<{ data: any }>(`/api/admin/products/${productId}/images/${imageId}/primary`, {
      method: 'PATCH',
    });
  },
};

// ─── Categories endpoints ───────────────────────────────────────────────────────

export const categories = {
  list() {
    return apiFetch<{ data: { categories: any[] } }>('/api/categories');
  },

  getBySlug(slug: string) {
    return apiFetch<{ data: { category: any } }>(`/api/categories/${encodeURIComponent(slug)}`);
  },

  adminList() {
    return apiFetch<{ data: { categories: any[] } }>('/api/admin/categories');
  },

  create(body: FormData | {
    name: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) {
    return apiFetch<{ data: { category: any } }>('/api/admin/categories', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  update(
    categoryId: string,
    body: FormData | {
      name?: string;
      slug?: string;
      description?: string;
      metaTitle?: string | null;
      metaDescription?: string | null;
    }
  ) {
    return apiFetch<{ data: { category: any } }>(`/api/admin/categories/${categoryId}`, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete(categoryId: string) {
    return apiFetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
  },
};

// ─── Users endpoints ──────────────────────────────────────────────────────────

export const users = {
  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { users: any[], pagination: any } }>(`/api/auth/admin/users?${q}`);
  },

  adminGet(userId: string) {
    return apiFetch<{ data: { user: any } }>(`/api/auth/admin/users/${userId}`);
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

  applyPromo(code: string) {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>('/api/cart/apply-promo', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  removePromo() {
    return apiFetch<{ data: { cart: any; warnings: any[] } }>('/api/cart/remove-promo', {
      method: 'POST',
    });
  },
};

// ─── Orders endpoints ──────────────────────────────────────────────────────────

export const orders = {
  checkout(addressId: number, paymentMethod: 'razorpay' | 'cod', notes?: string) {
    return apiFetch<{ data: { order: any; razorpay?: any; paymentMethod: 'razorpay' | 'cod' } }>('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({ addressId, paymentMethod, notes }),
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

  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { orders: any[]; pagination: any } }>(`/api/admin/orders?${q}`);
  },

  get(orderId: string) {
    return apiFetch<{ data: { order: any } }>(`/api/orders/${orderId}`);
  },

  adminGet(orderId: string) {
    return apiFetch<{ data: { order: any } }>(`/api/admin/orders/${orderId}`);
  },

  adminUpdateStatus(orderId: string, status: string) {
    return apiFetch<{ data: { order: any } }>(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  cancel(orderId: string, reason?: string) {
    return apiFetch<{ data: { order: any; refund: any } }>(`/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};

// ─── Events (Offers) endpoints ─────────────────────────────────────────────────────────

export const events = {
  // Public
  getActiveHomepageEvent() {
    return apiFetch<{ data: { event: any } }>('/api/events/active-homepage');
  },
  getActive() {
    return apiFetch<{ data: { events: any[] } }>('/api/events/active');
  },
  getBySlug(slug: string) {
    return apiFetch<{ data: { event: any } }>(`/api/events/slug/${slug}`);
  },
  getProductsBySlug(slug: string) {
    return apiFetch<{ data: { event: any; products: any[] } }>(`/api/events/slug/${slug}/products`);
  },

  // Admin
  list() {
    return apiFetch<{ data: { events: any[] } }>('/api/events');
  },
  get(id: string) {
    return apiFetch<{ data: { event: any } }>(`/api/events/${id}`);
  },
  create(body: any) {
    return apiFetch<{ data: { event: any } }>('/api/events', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  update(id: string, body: any) {
    return apiFetch<{ data: { event: any } }>(`/api/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
  delete(id: string) {
    return apiFetch(`/api/events/${id}`, { method: 'DELETE' });
  },
};

// ─── Discounts endpoints ───────────────────────────────────────────────────────

export const discounts = {
  available() {
    return apiFetch<{ data: { discounts: any[] } }>('/api/discounts/available');
  },

  list() {
    return apiFetch<{ data: { discounts: any[] } }>('/api/discounts');
  },
  
  create(body: any) {
    return apiFetch<{ data: { discount: any } }>('/api/discounts', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update(id: string, body: any) {
    return apiFetch<{ data: { discount: any } }>(`/api/discounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(id: string) {
    return apiFetch(`/api/discounts/${id}`, { method: 'DELETE' });
  },
};

// ─── Reviews endpoints ─────────────────────────────────────────────────────────

export const reviews = {
  // Public
  listProductReviews(productId: string) {
    return apiFetch<{ data: { reviews: any[] } }>(`/api/products/${productId}/reviews`);
  },

  add(productId: string, body: { rating: number; comment: string }) {
    return apiFetch<{ data: { review: any } }>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // Admin
  adminList(query: Record<string, string> = {}) {
    const q = new URLSearchParams(query).toString();
    return apiFetch<{ data: { reviews: any[]; pagination: any } }>(`/api/reviews?${q}`);
  },

  adminUpdateStatus(reviewId: string, status: 'approved' | 'rejected') {
    return apiFetch<{ data: { review: any } }>(`/api/reviews/${reviewId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  adminDelete(reviewId: string) {
    return apiFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
  },
};

// ─── Settings endpoints ────────────────────────────────────────────────────────

export const settings = {
  getEventBanner() {
    return apiFetch<{ data: { eventBanner: any } }>('/api/settings/event-banner');
  },
};
