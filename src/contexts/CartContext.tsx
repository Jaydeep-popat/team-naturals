'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import type { CartLine, Product } from '../types/product';

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleWishlist: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();
  const prevIsAuthenticated = React.useRef(isAuthenticated);

  React.useEffect(() => {
    if (prevIsAuthenticated.current && !isAuthenticated) {
      // User just logged out, clear cart data for privacy
      setLines([]);
    }
    prevIsAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.product.id !== productId)
        : prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l))
    );
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.quantity * l.product.price, 0),
      isDrawerOpen,
      wishlist,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart: () => setLines([]),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleWishlist,
    }),
    [lines, isDrawerOpen, wishlist, addToCart, removeFromCart, setQuantity, toggleWishlist]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}