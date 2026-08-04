'use client';

import React from 'react';
import { ChevronLeftIcon, DownloadIcon, ExternalLinkIcon, PackageIcon, MapPinIcon, ReceiptIcon } from 'lucide-react';
import Link from 'next/link';
import { StatusPill } from '@/src/components/account/StatusPill';
import { OrderTrackingTimeline, type TrackingStep } from '@/src/components/account/OrderTrackingTimeline';
import { OrderItem } from '@/src/components/account/OrderCard';

// Mock data based on the route ID
type OrderStatus = 'Delivered' | 'On the way' | 'Cancelled' | 'Returned';

const mockOrder = {
  orderId: '1249',
  date: 'Feb 02, 2026',
  status: 'Delivered' as OrderStatus,
  total: 900,
  subtotal: 900,
  shipping: 0,
  discount: 0,
  paymentMethod: 'Credit Card (ending in 4242)',
  shippingAddress: {
    fullName: 'Yash Joshi',
    line1: 'A-201, Green Valley Apts',
    line2: 'Near Central Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400053',
  },
  items: [
    {
      id: 'item-1',
      orderId: '#TN-1249',
      name: 'Neem & Aloe Face Wash',
      variant: '100ml',
      price: 350,
      image: '/images/products/neem-aloe-facewash.png',
      status: 'Delivered' as OrderStatus,
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
      status: 'Delivered' as OrderStatus,
      date: 'Jan 20, 2026',
      dateObj: new Date('2026-01-20'),
    },
  ]
};

const mockSteps: TrackingStep[] = [
  { id: '1', label: 'Order Placed', timestamp: 'Feb 01, 2026 - 10:30 AM', status: 'completed' },
  { id: '2', label: 'Confirmed', timestamp: 'Feb 01, 2026 - 11:15 AM', status: 'completed' },
  { id: '3', label: 'Shipped', timestamp: 'Feb 01, 2026 - 04:00 PM', status: 'completed' },
  { id: '4', label: 'Out for Delivery', timestamp: 'Feb 02, 2026 - 08:30 AM', status: 'completed' },
  { id: '5', label: 'Delivered', timestamp: 'Feb 02, 2026 - 02:45 PM', status: 'current' },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  // In reality we would fetch the order using resolvedParams.id
  const order = mockOrder;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-forest/70 hover:text-forest transition-colors mb-3">
            <ChevronLeftIcon size={16} strokeWidth={2.5} /> Back to Orders
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest">Order #TN-{resolvedParams.id}</h1>
            <StatusPill status={order.status} />
          </div>
          <p className="text-[14px] text-muted font-medium mt-1">Placed on {order.date}</p>
        </div>
        
        <button className="hidden sm:flex items-center gap-2 rounded-full border-2 border-forest/10 px-5 py-2.5 text-[13px] font-bold text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white shrink-0">
          <DownloadIcon size={16} strokeWidth={2} /> Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Items & Timeline) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tracking Timeline */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm overflow-hidden">
            <h2 className="font-display text-xl font-bold text-forest mb-6 flex items-center gap-2">
              <PackageIcon size={20} className="text-forest/60" /> Tracking Details
            </h2>
            <OrderTrackingTimeline steps={mockSteps} />
          </div>

          {/* Items List */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-forest mb-6">Items in this order ({order.items.length})</h2>
            <div className="space-y-5">
              {order.items.map((item, i) => (
                <div key={item.id} className={`flex gap-5 ${i !== 0 ? 'pt-5 border-t border-forest/5' : ''}`}>
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-forest/5 flex items-center justify-center border border-forest/10 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <PackageIcon className="text-forest/20" size={32} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-forest text-[15px] truncate">{item.name}</h3>
                    <p className="text-[13px] text-muted font-medium mt-0.5">Variant: {item.variant}</p>
                    <p className="font-display font-semibold text-forest text-[15px] mt-2">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Address, Payment, Actions) */}
        <div className="space-y-6">
          
          {/* Shipping Address */}
          <div className="rounded-2xl border border-forest/10 bg-[#FDFBF9] p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
              <MapPinIcon size={18} className="text-forest/60" /> Shipping Address
            </h2>
            <div className="space-y-1 text-[14px] text-forest/80 font-medium">
              <p className="font-bold text-forest text-[15px] mb-2">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-forest/10 bg-[#FDFBF9] p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4 flex items-center gap-2">
              <ReceiptIcon size={18} className="text-forest/60" /> Payment Summary
            </h2>
            <div className="space-y-3 text-[14px] font-medium text-forest/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-terracotta">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-forest/10 pt-3 font-display text-[18px] font-bold text-forest">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-forest/10">
              <p className="text-[12px] text-muted">Paid via {order.paymentMethod}</p>
            </div>
          </div>

          {/* Actions Row Contextual */}
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm space-y-3">
            {order.status === 'On the way' && (
              <button className="w-full flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3.5 text-[14px] font-bold text-white shadow-soft transition-colors hover:bg-forest/90">
                Track Package <ExternalLinkIcon size={16} />
              </button>
            )}
            
            {(order.status === 'Delivered' || order.status === 'On the way') && (
              <button className="w-full rounded-full border-2 border-forest/10 bg-white px-5 py-3 text-[14px] font-bold text-forest transition-colors hover:bg-forest/5">
                {order.status === 'Delivered' ? 'Return / Replace' : 'Cancel Order'}
              </button>
            )}

            {order.status === 'Delivered' && (
              <button className="w-full rounded-full border-2 border-forest/10 bg-white px-5 py-3 text-[14px] font-bold text-forest transition-colors hover:bg-forest/5">
                Rate & Review Items
              </button>
            )}
            
            {/* Mobile invoice download */}
            <button className="w-full flex sm:hidden items-center justify-center gap-2 rounded-full border-2 border-forest/10 bg-white px-5 py-3 text-[14px] font-bold text-forest transition-colors hover:bg-forest/5 mt-2">
              <DownloadIcon size={16} /> Download Invoice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
