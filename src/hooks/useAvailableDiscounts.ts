import { useState, useEffect } from 'react';
import { discounts as discountsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

let cachedCoupons: any[] | null = null;
let lastUserId: string | number | null | undefined = undefined;
let lastFetchTime: number = 0;

export function useAvailableDiscounts() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Invalidate cache if user changes (guest -> logged in, or vice versa)
    const currentUserId = user?.userId || null;
    if (lastUserId !== undefined && lastUserId !== currentUserId) {
      cachedCoupons = null;
    }
    lastUserId = currentUserId;

    const now = Date.now();
    if (cachedCoupons && now - lastFetchTime < 60000) { // 1 minute TTL
      setCoupons(cachedCoupons);
      setLoading(false);
      return;
    }

    setLoading(true);
    discountsApi.available()
      .then(res => {
        const data = res.data?.discounts || [];
        cachedCoupons = data;
        lastFetchTime = Date.now();
        setCoupons(data);
      })
      .catch(err => {
        console.error('Failed to fetch available discounts', err);
        setCoupons([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.userId]);

  const getCouponsForProduct = (productId: string | number, categoryId?: string | number, cartTotal?: number) => {
    return coupons.filter(coupon => {
      // Check minimum order amount (if cartTotal provided)
      if (cartTotal !== undefined && coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return false;
      }
      
      // If it applies to specific products
      if (coupon.applyTo === 'specific_products' && coupon.targetItemIds && coupon.targetItemIds.length > 0) {
        if (!coupon.targetItemIds.includes(productId.toString())) return false;
      }
      
      // If it applies to specific categories
      if (coupon.applyTo === 'specific_categories' && categoryId && coupon.targetItemIds && coupon.targetItemIds.length > 0) {
        if (!coupon.targetItemIds.includes(categoryId.toString())) return false;
      }
      
      return true;
    });
  };

  return { coupons, loading, getCouponsForProduct };
}
