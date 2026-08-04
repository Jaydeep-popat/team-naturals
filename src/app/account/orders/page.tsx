'use client';
import React, { useState, useMemo } from 'react';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OrderCard, type OrderItem } from '@/src/components/account/OrderCard';
import Image from 'next/image';

const mockOrderItems: OrderItem[] = [
  {
    id: 'item-1',
    orderId: '#TN-1249',
    name: 'Neem & Aloe Face Wash',
    variant: '100ml',
    price: 350,
    image: '/images/products/neem-aloe-facewash.png', // Assuming realistic paths, we fallback if missing in OrderCard
    status: 'Delivered',
    date: 'Feb 02, 2026',
    dateObj: new Date('2026-02-02'),
  },
  {
    id: 'item-2',
    orderId: '#TN-1249',
    name: 'Charcoal Soap Bar',
    variant: 'Set of 3',
    price: 550,
    image: null,
    status: 'Delivered',
    date: 'Jan 20, 2026',
    dateObj: new Date('2026-01-20'),
  },
  {
    id: 'item-3',
    orderId: '#TN-1022',
    name: 'Rose Water Toner',
    variant: '200ml',
    price: 890,
    image: null,
    status: 'On the way',
    date: 'Aug 15, 2026',
    dateObj: new Date('2026-08-15'),
  },
  {
    id: 'item-4',
    orderId: '#TN-0988',
    name: 'Multani Mitti Clay Mask',
    variant: '50g',
    price: 250,
    image: null,
    status: 'Cancelled',
    date: 'Jan 15, 2024',
    dateObj: new Date('2024-01-15'),
  },
  {
    id: 'item-5',
    orderId: '#TN-0750',
    name: 'Almond & Saffron Moisturizer',
    variant: '50ml',
    price: 1200,
    image: null,
    status: 'Returned',
    date: 'Dec 05, 2023',
    dateObj: new Date('2023-12-05'),
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredItems = useMemo(() => {
    return mockOrderItems.filter((item) => {
      if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.orderId.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilters.length > 0 && !statusFilters.includes(item.status)) {
        return false;
      }
      if (timeFilters.length > 0) {
        const now = new Date('2026-08-03');
        const itemDate = item.dateObj;
        const daysDiff = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        const itemYear = itemDate.getFullYear();

        let matchesTime = false;
        if (timeFilters.includes('Last 30 days') && daysDiff <= 30 && daysDiff >= 0) matchesTime = true;
        if (timeFilters.includes('2024') && itemYear === 2024) matchesTime = true;
        if (timeFilters.includes('2023') && itemYear === 2023) matchesTime = true;
        if (timeFilters.includes('Older') && itemYear < 2023) matchesTime = true;

        if (!matchesTime) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilters, timeFilters]);

  const handleStatusToggle = (status: string) => {
    setStatusFilters(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const handleTimeToggle = (time: string) => {
    setTimeFilters(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setTimeFilters([]);
  };

  const hasActiveFilters = statusFilters.length > 0 || timeFilters.length > 0;

  const SidebarContent = () => (
    <div className="space-y-8">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-forest">Active Filters</span>
          <button onClick={clearFilters} className="text-[12px] text-terracotta hover:underline font-semibold">Clear All</button>
        </div>
      )}

      <div>
        <h3 className="font-display font-bold text-forest mb-4 text-[13px] tracking-wide uppercase">Order Status</h3>
        <div className="space-y-3">
          {['On the way', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors border ${statusFilters.includes(status) ? 'bg-forest border-forest text-white' : 'border-forest/20 group-hover:border-forest/50 bg-white'}`}
              >
                {statusFilters.includes(status) && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-[14px] text-forest/80 font-medium select-none">
                {status}
              </span>
              <input type="checkbox" className="sr-only" checked={statusFilters.includes(status)} onChange={() => handleStatusToggle(status)} />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-forest/5" />

      <div>
        <h3 className="font-display font-bold text-forest mb-4 text-[13px] tracking-wide uppercase">Order Time</h3>
        <div className="space-y-3">
          {['Last 30 days', '2024', '2023', 'Older'].map((time) => (
            <label key={time} className="flex items-center gap-3 cursor-pointer group">
              <div 
                className={`w-[18px] h-[18px] rounded flex items-center justify-center transition-colors border ${timeFilters.includes(time) ? 'bg-forest border-forest text-white' : 'border-forest/20 group-hover:border-forest/50 bg-white'}`}
              >
                {timeFilters.includes(time) && <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-[14px] text-forest/80 font-medium select-none">
                {time}
              </span>
              <input type="checkbox" className="sr-only" checked={timeFilters.includes(time)} onChange={() => handleTimeToggle(time)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full animate-in fade-in duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 sticky top-24 bg-white rounded-2xl border border-forest/10 p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-forest mb-6 border-b border-forest/5 pb-4">Filters</h2>
        <SidebarContent />
      </aside>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <React.Fragment key="mobile-filters">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-forest/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 border-b border-forest/5 pb-4">
                <h2 className="font-display text-xl font-bold text-forest">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-cream rounded-full text-forest">
                  <XIcon size={18} />
                </button>
              </div>
              <SidebarContent />
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-8 bg-forest text-white font-bold py-3.5 rounded-full"
              >
                Apply Filters
              </button>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
        
        {/* Search Bar & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full">
          <div className="relative flex-1 flex items-center bg-white border border-forest/15 rounded-[16px] shadow-sm overflow-hidden focus-within:border-forest/40 transition-colors">
            <SearchIcon size={18} className="absolute left-4 text-forest/40" />
            <input 
              type="text" 
              placeholder="Search your orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-forest text-[15px] font-medium placeholder:text-muted/60"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden shrink-0 h-[54px] w-[54px] flex items-center justify-center bg-white border border-forest/15 rounded-[16px] text-forest shadow-sm"
          >
            <FilterIcon size={20} />
          </button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-forest/10 rounded-[20px] p-12 text-center shadow-sm">
              <div className="h-24 w-24 mx-auto mb-6 bg-forest/5 rounded-full flex items-center justify-center">
                <SearchIcon size={32} className="text-forest/30" />
              </div>
              <h3 className="font-display text-xl text-forest font-bold mb-2">No orders found</h3>
              <p className="text-sm text-muted">Try adjusting your filters or search for something else.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-6 rounded-full bg-forest/5 px-6 py-2.5 text-sm font-bold text-forest hover:bg-forest hover:text-white transition-colors">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <OrderCard 
                  item={item} 
                  onClick={() => router.push(`/account/orders/${item.orderId.replace('#TN-', '')}`)} 
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
