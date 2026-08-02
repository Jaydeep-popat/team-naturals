/**
 * Centralized API client for Team Naturals.
 * JWT is handled via httpOnly cookies — all requests send `credentials: 'include'`.
 * No manual token storage is needed.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

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

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
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
