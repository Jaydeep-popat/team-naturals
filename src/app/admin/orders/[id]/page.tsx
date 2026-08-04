'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, CheckCircle2, Clock, Package, Truck, Home, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

const STATUS_META: Record<OrderStatus, { label: string; icon: React.ElementType; color: string }> = {
  pending:          { label: 'Pending',          icon: Clock,        color: 'text-[#7A5E1A]' },
  confirmed:        { label: 'Confirmed',         icon: CheckCircle2, color: 'text-forest' },
  shipped:          { label: 'Shipped',           icon: Package,      color: 'text-blue-600' },
  out_for_delivery: { label: 'Out for Delivery',  icon: Truck,        color: 'text-purple-600' },
  delivered:        { label: 'Delivered',         icon: Home,         color: 'text-[#3F7D4C]' },
  cancelled:        { label: 'Cancelled',         icon: XCircle,      color: 'text-terracotta' },
  returned:         { label: 'Returned',          icon: RotateCcw,    color: 'text-[#6B7268]' },
};

// Mock order — in production fetch from /api/admin/orders/:id
const MOCK_ORDER = {
  id: '1', number: 'ORD-20260803-0011',
  status: 'confirmed' as OrderStatus,
  createdAt: '03 Aug 2026, 10:21 AM',
  customer: { name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210' },
  shippingAddress: { line1: '12, Rose Garden Apts', line2: 'Near City Mall', city: 'Pune', state: 'Maharashtra', postalCode: '411001', country: 'India' },
  items: [
    { id: '1', name: 'Neem & Tulsi Face Wash 100ml', sku: 'FW-NT-100', qty: 1, unitPrice: '₹349', lineTotal: '₹349', image: null },
    { id: '2', name: 'Charcoal Detox Soap 75g', sku: 'SP-CH-75', qty: 2, unitPrice: '₹199', lineTotal: '₹398', image: null },
  ],
  subtotal: '₹747', shippingFee: '₹49', discount: '₹0', total: '₹796',
  paymentStatus: 'paid', paymentMethod: 'Razorpay',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${meta.color}`}>
      <meta.icon size={16} strokeWidth={2} />
      {meta.label}
    </span>
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(MOCK_ORDER);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [note, setNote] = useState('');

  const currentIdx = STATUS_FLOW.indexOf(order.status);

  const handleStatusClick = (status: OrderStatus) => {
    setPendingStatus(status);
    setShowConfirm(true);
  };

  const handleConfirmTransition = () => {
    if (pendingStatus) setOrder((prev) => ({ ...prev, status: pendingStatus }));
    setShowConfirm(false);
    setPendingStatus(null);
    setNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-forest/5 text-forest/60 hover:text-forest transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-forest">{order.number}</h1>
          <p className="text-sm text-forest/60 mt-0.5">Placed on {order.createdAt}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-forest/10 text-sm font-medium text-forest shadow-sm hover:bg-forest/5 transition-colors">
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — main details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status state machine */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-forest">Order Status</h2>
              <StatusBadge status={order.status} />
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-2 mt-4 mb-6">
              {STATUS_FLOW.map((step, i) => {
                const done = STATUS_FLOW.indexOf(order.status) >= i;
                const meta = STATUS_META[step];
                const Icon = meta.icon;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-forest text-white' : 'bg-forest/10 text-forest/40'}`}>
                        <Icon size={14} />
                      </div>
                      <span className={`text-[10px] font-medium ${done ? 'text-forest' : 'text-forest/40'}`}>{meta.label}</span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-4 rounded-full ${STATUS_FLOW.indexOf(order.status) > i ? 'bg-forest' : 'bg-forest/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Next-step actions */}
            {!['cancelled', 'returned', 'delivered'].includes(order.status) && (
              <div className="flex flex-wrap gap-2 border-t border-forest/5 pt-4">
                {currentIdx < STATUS_FLOW.length - 1 && (
                  <button
                    onClick={() => handleStatusClick(STATUS_FLOW[currentIdx + 1])}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-[#16301F] transition-colors shadow-sm"
                  >
                    Advance to {STATUS_META[STATUS_FLOW[currentIdx + 1]].label} <ChevronRight size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleStatusClick('cancelled')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta/10 text-terracotta text-sm font-semibold hover:bg-terracotta/20 transition-colors"
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4">Items</h2>
            <div className="divide-y divide-forest/5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="h-12 w-12 rounded-xl bg-forest/5 flex items-center justify-center shrink-0">
                    <Package size={20} className="text-forest/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-forest text-sm leading-snug">{item.name}</p>
                    <p className="text-[12px] font-mono text-forest/40 mt-0.5">{item.sku} × {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-forest text-sm">{item.lineTotal}</p>
                    <p className="text-[12px] text-forest/40">{item.unitPrice} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-forest/10 mt-4 pt-4 space-y-2">
              {[
                { label: 'Subtotal', val: order.subtotal },
                { label: 'Shipping', val: order.shippingFee },
                { label: 'Discount', val: order.discount },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-sm text-forest/70">
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold text-forest border-t border-forest/10 pt-2 mt-2">
                <span>Total</span><span>{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-forest mb-3">Customer</h2>
            <p className="font-bold text-forest">{order.customer.name}</p>
            <p className="text-sm text-forest/60">{order.customer.email}</p>
            <p className="text-sm text-forest/60">{order.customer.phone}</p>
          </div>

          {/* Shipping address */}
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-forest mb-3">Shipping Address</h2>
            <address className="not-italic text-sm text-forest/70 leading-relaxed">
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-forest mb-3">Payment</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-forest/60">Method</span>
              <span className="font-medium text-forest">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-forest/60">Status</span>
              <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-[#3F7D4C]' : 'text-terracotta'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm status-change dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmTransition}
        title={`Move to ${pendingStatus ? STATUS_META[pendingStatus].label : ''}?`}
        message={`This will update the order status to "${pendingStatus ? STATUS_META[pendingStatus].label : ''}" and the customer will be notified. This drives the tracking timeline the customer sees.`}
        confirmText="Yes, Update Status"
        isDestructive={pendingStatus === 'cancelled' || pendingStatus === 'returned'}
      />
    </div>
  );
}
