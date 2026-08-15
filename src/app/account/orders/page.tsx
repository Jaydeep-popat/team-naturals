'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon, FilterIcon, XIcon, Loader2, PackageIcon, RefreshCwIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OrderCard, type OrderItem } from '@/src/components/account/OrderCard';
import { ReviewModal } from '@/src/components/account/ReviewModal';
import { orders as ordersApi } from '@/src/lib/api';

type BackendOrder = {
  orderId: number;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: string | number;
  createdAt: string;
  items: Array<{ productId: number; productName: string; productSku: string; productImage: string | null; quantity: number; hasReviewed?: boolean }>;
};

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingProduct, setReviewingProduct] = useState<{ id: number; name: string } | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const query: any = { page: String(page), limit: String(limit) };
        if (activeStatus !== 'all') query.status = activeStatus;
        if (debouncedSearch) query.search = debouncedSearch;
        
        const res = await ordersApi.list(query);
        setOrders((res.data?.orders || []) as BackendOrder[]);
        setTotalPages(res.data?.pagination?.totalPages || 1);
        setTotalRecords(res.data?.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [page, limit, activeStatus, debouncedSearch]);

  const orderItems: OrderItem[] = useMemo(() => {
    return orders.map((order) => {
      const firstItem = order.items[0];
      const createdAt = new Date(order.createdAt);

      return {
        id: String(order.orderId),
        orderId: `#${order.orderNumber}`,
        name: firstItem?.productName || `Order ${order.orderNumber}`,
        variant: order.items.length > 1 ? `${order.items.length} items` : (firstItem?.productSku || 'Item'),
        price: Number(order.totalAmount),
        image: firstItem?.productImage || null,
        status: order.status,
        date: createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        dateObj: createdAt,
        productId: (firstItem as any)?.productId || undefined,
        hasReviewed: !!(firstItem as any)?.hasReviewed,
      };
    });
  }, [orders]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Search & Quick Filter Pills */}
      <div className="flex flex-col gap-3">
        
        {/* Search input */}
        <div className="relative flex items-center bg-[#FDFBF9] border border-forest/10 rounded-xl overflow-hidden focus-within:border-forest/30 focus-within:bg-white transition-all shadow-2xs">
          <SearchIcon size={16} className="absolute left-3.5 text-forest/40" />
          <input 
            type="text" 
            placeholder="Search by order ID or item name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2.5 pl-10 pr-9 outline-none text-forest text-[14px] font-medium placeholder:text-muted/60"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 text-forest/40 hover:text-forest">
              <XIcon size={14} />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveStatus(tab.id); setPage(1); }}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'bg-forest text-white shadow-2xs' 
                    : 'bg-forest/5 text-forest/70 hover:bg-forest/10 hover:text-forest'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-forest/10 bg-white p-12 text-center shadow-2xs flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-forest" />
          </div>
        ) : orderItems.length === 0 ? (
          <div className="rounded-xl border border-forest/8 bg-[#FDFBF9] p-10 text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-forest/5 rounded-full flex items-center justify-center">
              <PackageIcon size={24} className="text-forest/30" />
            </div>
            <h3 className="font-display text-lg text-forest font-bold mb-1">No orders found</h3>
            <p className="text-[13px] text-muted max-w-sm mx-auto">
              {searchQuery || activeStatus !== 'all' 
                ? 'Try clearing your search or status filter.' 
                : 'You have not placed any orders yet.'}
            </p>
            {(searchQuery || activeStatus !== 'all') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveStatus('all'); setPage(1); }} 
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest/5 px-4 py-2 text-[12px] font-bold text-forest hover:bg-forest hover:text-white transition-colors"
              >
                <RefreshCwIcon size={12} /> Clear filters
              </button>
            )}
          </div>
        ) : (
          orderItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <OrderCard 
                item={item} 
                onClick={() => router.push(`/account/orders/${item.id}`)} 
                onReview={(e, productId, productName) => {
                  e.stopPropagation();
                  setReviewingProduct({ id: productId, name: productName });
                }}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-forest/10 px-4 py-4 mt-6 bg-[#FDFBF9] rounded-b-3xl">
        <div className="text-sm text-forest/60">
          {totalRecords > 0 ? (
            <span>
              Showing <span className="font-medium text-forest">{Math.min((page - 1) * limit + 1, totalRecords)}</span> to <span className="font-medium text-forest">{Math.min(page * limit, totalRecords)}</span> of <span className="font-medium text-forest">{totalRecords}</span> results
            </span>
          ) : (
            <span>No results</span>
          )}
        </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-forest/10 px-3 py-1.5 text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest/5 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-forest/10 px-3 py-1.5 text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      
      {reviewingProduct && (
        <ReviewModal
          isOpen={!!reviewingProduct}
          onClose={() => setReviewingProduct(null)}
          productId={reviewingProduct.id}
          productName={reviewingProduct.name}
        />
      )}
    </div>
  );
}
