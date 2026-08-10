'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Package, Tag, Users, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { products, categories, users, orders } from '@/src/lib/api';
import Link from 'next/link';

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    products: any[];
    categories: any[];
    customers: any[];
    orders: any[];
  }>({
    products: [],
    categories: [],
    customers: [],
    orders: [],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [], customers: [], orders: [] });
      setIsLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes, userRes, orderRes] = await Promise.allSettled([
          products.adminList({ search: query, limit: '5' }),
          categories.list(), // Filter below since no backend search for categories
          users.adminList({ search: query, limit: '5' }),
          orders.adminList({ search: query, limit: '5' }),
        ]);

        const productsData = prodRes.status === 'fulfilled' ? prodRes.value.data.products : [];
        const allCategories = catRes.status === 'fulfilled' ? catRes.value.data.categories : [];
        const customersData = userRes.status === 'fulfilled' ? userRes.value.data.users : [];
        const ordersData = orderRes.status === 'fulfilled' ? orderRes.value.data.orders : [];

        const filteredCategories = allCategories
          .filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5);

        setResults({
          products: productsData,
          categories: filteredCategories,
          customers: customersData,
          orders: ordersData,
        });
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasResults =
    results.products.length > 0 ||
    results.categories.length > 0 ||
    results.customers.length > 0 ||
    results.orders.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-forest/40 group-focus-within:text-forest transition-colors" />
      <input
        type="text"
        placeholder="Search orders, customers, or products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full pl-11 pr-4 py-2.5 bg-[#FDFBF9] border border-forest/10 rounded-2xl text-[15px] text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all shadow-sm"
      />
      {isLoading && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-forest/40 animate-spin" />
      )}

      {isFocused && query.trim() !== '' && (
        <div className="absolute top-full mt-2 w-full max-h-[70vh] overflow-y-auto bg-white border border-forest/10 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
          {!isLoading && !hasResults && (
            <div className="p-6 text-center text-forest/50 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.products.length > 0 && (
            <div className="p-2 border-b border-forest/5">
              <div className="px-3 py-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider">
                Products
              </div>
              {results.products.map((p) => (
                <Link
                  key={p.productId}
                  href={`/admin/products/${p.productId}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-forest/5 rounded-xl transition-colors group"
                >
                  <div className="bg-forest/5 p-1.5 rounded-lg group-hover:bg-forest/10">
                    <Package className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-forest">{p.name}</div>
                    <div className="text-[11px] text-forest/50">SKU: {p.sku || 'N/A'} • ₹{p.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="p-2 border-b border-forest/5">
              <div className="px-3 py-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider">
                Categories
              </div>
              {results.categories.map((c) => (
                <Link
                  key={c.categoryId}
                  href={`/admin/categories`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-forest/5 rounded-xl transition-colors group"
                >
                  <div className="bg-forest/5 p-1.5 rounded-lg group-hover:bg-forest/10">
                    <Tag className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-forest">{c.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.customers.length > 0 && (
            <div className="p-2 border-b border-forest/5">
              <div className="px-3 py-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider">
                Customers
              </div>
              {results.customers.map((u) => (
                <Link
                  key={u.userId}
                  href={`/admin/customers`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-forest/5 rounded-xl transition-colors group"
                >
                  <div className="bg-forest/5 p-1.5 rounded-lg group-hover:bg-forest/10">
                    <Users className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-forest">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-[11px] text-forest/50">{u.email}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.orders.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider">
                Orders
              </div>
              {results.orders.map((o) => (
                <Link
                  key={o.orderId}
                  href={`/admin/orders/${o.orderId}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-forest/5 rounded-xl transition-colors group"
                >
                  <div className="bg-forest/5 p-1.5 rounded-lg group-hover:bg-forest/10">
                    <ShoppingBag className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-forest">Order #{o.orderNumber}</div>
                    <div className="text-[11px] text-forest/50">{o.status} • ₹{o.totalAmount}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
