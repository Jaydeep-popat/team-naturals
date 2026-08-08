'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import type { CartLine, Product } from '../types/product';
import { cart as cartApi } from '../lib/api';
import toast from 'react-hot-toast';

// Extend CartLine to include optional cartItemId for backend syncing
export interface BackendCartLine extends CartLine {
  cartItemId?: string | number;
  finalUnitPrice?: number;
  appliedEventName?: string | null;
}

interface CartContextValue {
  lines: BackendCartLine[];
  itemCount: number;
  subtotal: number;
  originalSubtotal: number;
  promoCode: string | null;
  discountAmount: number;
  eventDiscountAmount: number;
  promoDiscountAmount: number;
  isDrawerOpen: boolean;
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromo: (code: string) => Promise<void>;
  removePromo: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BackendCartLine[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [eventDiscountAmount, setEventDiscountAmount] = useState<number>(0);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(0);
  const [originalSubtotal, setOriginalSubtotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { isAuthenticated, user } = useAuth();
  const prevIsAuthenticated = useRef(isAuthenticated);

  const fetchCart = useCallback(async () => {
    try {
      const res = await cartApi.getCart();
      if (res?.data?.cart?.items) {
        const backendCart = res.data.cart;
        const totals = backendCart.totals || {};
        const mappedLines = res.data.cart.items.map((item: any) => ({
          cartItemId: item.cartItemId,
          quantity: item.quantity,
          finalUnitPrice: Number(item.finalUnitPrice || item.product.currentPrice || 0),
          appliedEventName: item.appliedEventName,
          product: {
            id: String(item.productId),
            productId: item.productId,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.unitPrice || item.product.currentPrice || 0),
            compareAtPrice: Number(item.product.compareAtPrice),
            images: item.product.image ? [item.product.image.url] : [],
            weight: item.product.size,
            stockQty: item.product.stockQty,
          } as unknown as Product
        }));
        setLines(mappedLines);
        setPromoCode(backendCart.promo?.code || backendCart.discountCode || null);
        setDiscountAmount(Number(totals.totalDiscount ?? backendCart.discountAmount ?? 0));
        setEventDiscountAmount(Number(totals.eventDiscount ?? backendCart.eventDiscountAmount ?? 0));
        setPromoDiscountAmount(Number(totals.promoDiscount ?? backendCart.promoDiscountAmount ?? 0));
        setOriginalSubtotal(Number(totals.subtotal ?? backendCart.originalSubtotal ?? backendCart.subtotalAmount ?? 0));
        setSubtotal(
          Math.max(
            0,
            Number(totals.subtotal ?? backendCart.originalSubtotal ?? 0) -
              Number(totals.eventDiscount ?? backendCart.eventDiscountAmount ?? 0)
          )
        );
        
        if (res.data.warnings && res.data.warnings.length > 0) {
          // Could toast warnings here
          console.warn('Cart warnings:', res.data.warnings);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setLines([]);
      setPromoCode(null);
      setDiscountAmount(0);
      setEventDiscountAmount(0);
      setPromoDiscountAmount(0);
      setOriginalSubtotal(0);
      setSubtotal(0);
    }
  }, [isAuthenticated, fetchCart]);

  const getProductId = (p: any) => String(p.productId || p.id);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    try {
      if (user?.role === 'admin') {
        toast.error('Admins cannot make purchases.', { icon: '🛡️' });
        return;
      }
      
      const pId = getProductId(product);
      if (isAuthenticated) {
        await cartApi.addItem(pId, quantity);
        await fetchCart();
      } else {
        // Optimistic / Local update for guests or fast feedback
        setLines((prev) => {
          const existing = prev.find((l) => getProductId(l.product) === pId);
          if (existing) {
            return prev.map((l) =>
              getProductId(l.product) === pId ? { ...l, quantity: l.quantity + quantity } : l
            );
          }
          return [...prev, { product, quantity }];
        });
      }
      setDrawerOpen(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [isAuthenticated, user, fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const line = lines.find((l) => getProductId(l.product) === String(productId));
      if (isAuthenticated && line?.cartItemId) {
        await cartApi.removeItem(String(line.cartItemId));
        await fetchCart();
      } else {
        setLines((prev) => prev.filter((l) => getProductId(l.product) !== String(productId)));
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  }, [isAuthenticated, lines, fetchCart]);

  const setQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      const line = lines.find((l) => getProductId(l.product) === String(productId));
      if (isAuthenticated && line?.cartItemId) {
        await cartApi.updateItem(String(line.cartItemId), quantity);
        await fetchCart();
      } else {
        setLines((prev) =>
          prev.map((l) => (getProductId(l.product) === String(productId) ? { ...l, quantity } : l))
        );
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }, [isAuthenticated, lines, fetchCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await cartApi.clearCart();
      }
      setLines([]);
      setPromoCode(null);
      setDiscountAmount(0);
      setEventDiscountAmount(0);
      setPromoDiscountAmount(0);
      setOriginalSubtotal(0);
      setSubtotal(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [isAuthenticated]);

  const applyPromo = useCallback(async (code: string) => {
    try {
      if (isAuthenticated) {
        const res = await cartApi.applyPromo(code);
        if (res.data?.warnings?.length) {
          toast.error(res.data.warnings[0].message);
        } else {
          toast.success('Promo code applied!');
        }
        await fetchCart();
      } else {
        toast.error('Please login to apply promo codes');
      }
    } catch (error: any) {
      console.error('Failed to apply promo:', error);
      toast.error(error.message || 'Invalid promo code');
    }
  }, [isAuthenticated, fetchCart]);

  const removePromo = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await cartApi.removePromo();
        toast.success('Promo removed');
        await fetchCart();
      }
    } catch (error: any) {
      console.error('Failed to remove promo:', error);
      toast.error('Failed to remove promo');
    }
  }, [isAuthenticated, fetchCart]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: isAuthenticated ? subtotal : lines.reduce((sum, l) => sum + l.quantity * (l.product.price || 0), 0),
      originalSubtotal: isAuthenticated ? originalSubtotal : lines.reduce((sum, l) => sum + l.quantity * (l.product.price || 0), 0),
      promoCode,
      discountAmount,
      eventDiscountAmount,
      promoDiscountAmount,
      isDrawerOpen,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      applyPromo,
      removePromo,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleWishlist,
    }),
    [lines, promoCode, discountAmount, eventDiscountAmount, promoDiscountAmount, originalSubtotal, subtotal, isDrawerOpen, wishlist, addToCart, removeFromCart, setQuantity, clearCart, applyPromo, removePromo, toggleWishlist, isAuthenticated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
