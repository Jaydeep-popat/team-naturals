export type AdminRole = 'super_admin' | 'order_manager' | 'product_manager' | 'support';

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin' as AdminRole,
  ORDER_MANAGER: 'order_manager' as AdminRole,
  PRODUCT_MANAGER: 'product_manager' as AdminRole,
  SUPPORT: 'support' as AdminRole,
};

export const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    canManageOrders: true,
    canManageProducts: true,
    canManageCustomers: true,
    canManageContent: true,
    canManageSettings: true,
    canManageUsers: true,
  },
  [ADMIN_ROLES.ORDER_MANAGER]: {
    canManageOrders: true,
    canManageProducts: false,
    canManageCustomers: true, // Read-only mostly
    canManageContent: false,
    canManageSettings: false,
    canManageUsers: false,
  },
  [ADMIN_ROLES.PRODUCT_MANAGER]: {
    canManageOrders: false,
    canManageProducts: true,
    canManageCustomers: false,
    canManageContent: true,
    canManageSettings: false,
    canManageUsers: false,
  },
  [ADMIN_ROLES.SUPPORT]: {
    canManageOrders: false,
    canManageProducts: false,
    canManageCustomers: true, // Read-only
    canManageContent: false,
    canManageSettings: false,
    canManageUsers: false,
  },
};

export function hasPermission(role: AdminRole | undefined, permission: keyof typeof ROLE_PERMISSIONS['super_admin']): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.[permission] || false;
}
