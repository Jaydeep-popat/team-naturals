'use client';

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import type { CartLine, Product } from '../types/product';
import { cart as cartApi } from '../lib/api';

// Extend CartLine to include optional cartItemId for backend syncing
export interface BackendCartLine extends CartLine {
  cartItemId?: string | number;
}

interface CartContextValue {
  lines: BackendCartLine[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<BackendCartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const prevIsAuthenticated = useRef(isAuthenticated);

  const fetchCart = useCallback(async () => {
    try {
      const res = await cartApi.getCart();
      if (res?.data?.cart?.items) {
        const mappedLines = res.data.cart.items.map((item: any) => ({
          cartItemId: item.cartItemId,
          quantity: item.quantity,
          product: {
            id: String(item.productId),
            productId: item.productId,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.currentPrice), // Backend returns string from Decimal
            images: item.product.image ? [item.product.image.url] : [],
          } as unknown as Product
        }));
        setLines(mappedLines);
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
    }
  }, [isAuthenticated, fetchCart]);

  const getProductId = (p: any) => String(p.productId || p.id);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    try {
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
  }, [isAuthenticated, fetchCart]);

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
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.quantity * (l.product.price || 0), 0),
      isDrawerOpen,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleWishlist,
    }),
    [lines, isDrawerOpen, wishlist, addToCart, removeFromCart, setQuantity, clearCart, toggleWishlist]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}