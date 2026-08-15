export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  emailVerifiedAt: string | null;
  phoneNo: string | null;
  profilePic: string | null;
  dateOfBirth: string | null;
  role: 'user' | 'admin';
  adminRole?: 'super_admin' | 'order_manager' | 'product_manager' | 'support';
  userStatus: 'active' | 'suspended' | 'deactivated';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  addressId: number;
  userId: number;
  fullName: string;
  phoneNo: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  success: false;
  errors: string[];
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
