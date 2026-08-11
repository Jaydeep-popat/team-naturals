'use client';

import React from 'react';
import { ChevronLeftIcon, DownloadIcon, ExternalLinkIcon, PackageIcon, MapPinIcon, ReceiptIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { StatusPill } from '@/src/components/account/StatusPill';
import { OrderTrackingTimeline, type TrackingStep } from '@/src/components/account/OrderTrackingTimeline';
import { Loader2, MessageSquareIcon } from 'lucide-react';
import { orders as ordersApi } from '@/src/lib/api';
import { ReviewModal } from '@/src/components/account/ReviewModal';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

type OrderData = {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string | number;
  shippingFee: string | number;
  codFee: string | number;
  discount: string | number;
  totalAmount: string | number;
  payment?: { provider?: string; status?: string } | null;
  shipping: {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: Array<{
    orderItemId: number;
    productId: number;
    productName: string;
    productSku: string;
    productImage: string | null;
    quantity: number;
    lineTotal: string | number;
    unitPrice: string | number;
  }>;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string | null;
};

const formatMoney = (value: string | number) => `₹${Number(value).toFixed(2)}`;

const formatTimestamp = (value?: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const buildTrackingSteps = (order: OrderData): TrackingStep[] => {
  const steps: TrackingStep[] = [
    { id: 'placed', label: 'Order Placed', timestamp: formatTimestamp(order.createdAt), status: 'completed' },
  ];

  if (order.status === 'cancelled') {
    steps.push({ id: 'cancelled', label: 'Cancelled', timestamp: formatTimestamp(order.cancelledAt || order.updatedAt), status: 'cancelled' });
    return steps;
  }

  if (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered') {
    steps.push({
      id: 'confirmed',
      label: 'Confirmed',
      timestamp: formatTimestamp(order.updatedAt),
      status: order.status === 'confirmed' ? 'current' : 'completed',
    });
  }

  if (order.status === 'shipped' || order.status === 'delivered') {
    steps.push({
      id: 'shipped',
      label: 'Shipped',
      timestamp: formatTimestamp(order.updatedAt),
      status: order.status === 'shipped' ? 'current' : 'completed',
    });
  }

  if (order.status === 'delivered') {
    steps.push({ id: 'delivered', label: 'Delivered', timestamp: formatTimestamp(order.updatedAt), status: 'current' });
  }

  return steps;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params.id);
  const [order, setOrder] = React.useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [reviewingProduct, setReviewingProduct] = React.useState<{ id: number; name: string } | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      try {
        const res = await ordersApi.get(orderId);
        if (!mounted) return;
        setOrder(res.data.order as OrderData);
      } catch (error) {
        console.error('Failed to load order details:', error);
        if (mounted) setOrder(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-forest" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-16 text-forest/60 font-medium">Order not found</div>;
  }

  const trackingSteps = buildTrackingSteps(order);

  return (
    <div className="animate-in fade-in duration-200 space-y-6">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-forest/8">
        <div>
          <Link href="/account/orders" className="inline-flex items-center gap-1 text-[12px] font-bold text-forest/70 hover:text-forest transition-colors mb-2">
            <ChevronLeftIcon size={14} strokeWidth={2.5} /> Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-forest">#{order.orderNumber}</h2>
            <StatusPill status={order.status} />
          </div>
          <p className="text-[12px] text-muted font-medium mt-0.5">Placed on {formatTimestamp(order.createdAt)}</p>
        </div>
        
        <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-forest/20 px-4 py-2 text-[12px] font-semibold text-forest transition-all hover:bg-forest hover:text-white shrink-0">
          <DownloadIcon size={14} strokeWidth={2} /> Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Items & Timeline) */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Tracking Timeline */}
          <div className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-5 shadow-2xs">
            <h3 className="font-display text-base font-bold text-forest mb-4 flex items-center gap-2">
              <PackageIcon size={18} className="text-forest/60" /> Tracking Details
            </h3>
            <OrderTrackingTimeline steps={trackingSteps} />
          </div>

          {/* Items List */}
          <div className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-5 shadow-2xs">
            <h3 className="font-display text-base font-bold text-forest mb-4">Items in this order ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={item.orderItemId} className={`flex gap-4 ${i !== 0 ? 'pt-4 border-t border-forest/5' : ''}`}>
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-forest/5 flex items-center justify-center border border-forest/10 overflow-hidden">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <PackageIcon className="text-forest/20" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-forest text-[14px] truncate">{item.productName}</h4>
                    <p className="text-[12px] text-muted font-medium mt-0.5">SKU: {item.productSku} · Qty: {item.quantity}</p>
                    <p className="font-display font-semibold text-forest text-[14px] mt-1">{formatMoney(item.lineTotal)}</p>
                  </div>
                  {order.status === 'delivered' && (
                    <div className="flex items-center pl-2 shrink-0">
                      <button 
                        onClick={() => setReviewingProduct({ id: item.productId || (item as any).product?.productId || item.orderItemId, name: item.productName })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-forest/20 text-[11px] font-bold text-forest hover:bg-forest/5 transition-colors"
                      >
                        <MessageSquareIcon size={12} /> Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Address, Payment, Actions) */}
        <div className="space-y-5">
          
          {/* Shipping Address */}
          <div className="rounded-2xl border border-forest/10 bg-[#FDFBF9] p-4 sm:p-5 shadow-2xs">
            <h3 className="font-display text-base font-bold text-forest mb-3 flex items-center gap-2">
              <MapPinIcon size={16} className="text-forest/60" /> Shipping Address
            </h3>
            <div className="space-y-0.5 text-[13px] text-forest/80 font-medium">
              <p className="font-bold text-forest text-[14px] mb-1">{order.shipping.name}</p>
              <p>{order.shipping.line1}</p>
              {order.shipping.line2 && <p>{order.shipping.line2}</p>}
              <p>{order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-forest/10 bg-[#FDFBF9] p-4 sm:p-5 shadow-2xs">
            <h3 className="font-display text-base font-bold text-forest mb-3 flex items-center gap-2">
              <ReceiptIcon size={16} className="text-forest/60" /> Payment Summary
            </h3>
            <div className="space-y-2 text-[13px] font-medium text-forest/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{Number(order.shippingFee) === 0 ? 'Free' : formatMoney(order.shippingFee)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-terracotta">
                  <span>Discount</span>
                  <span>-{formatMoney(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-forest/10 pt-2.5 font-display text-[16px] font-bold text-forest">
                <span>Total</span>
                <span>{formatMoney(order.totalAmount)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-forest/10">
              <p className="text-[11px] text-muted">Paid via {order.payment?.provider === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>
          </div>

          {/* Actions Row Contextual */}
          <div className="rounded-2xl border border-forest/10 bg-white p-4 shadow-2xs space-y-2">
            {order.status === 'shipped' && (
              <button className="w-full flex items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-[13px] font-bold text-white shadow-2xs transition-colors hover:bg-forest/90">
                Track Package <ExternalLinkIcon size={14} />
              </button>
            )}
            
            {(order.status === 'delivered' || order.status === 'shipped') && (
              <button className="w-full rounded-full border border-forest/15 bg-white px-4 py-2 text-[13px] font-semibold text-forest transition-colors hover:bg-forest/5">
                {order.status === 'delivered' ? 'Return / Replace' : 'Cancel Order'}
              </button>
            )}
            
            {/* Mobile invoice download */}
            <button className="w-full flex sm:hidden items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-white px-4 py-2 text-[13px] font-semibold text-forest transition-colors hover:bg-forest/5">
              <DownloadIcon size={14} /> Download Invoice
            </button>
          </div>

        </div>
      </div>
      
      <ReviewModal 
        isOpen={!!reviewingProduct} 
        onClose={() => setReviewingProduct(null)} 
        productId={reviewingProduct?.id || ''} 
        productName={reviewingProduct?.name || ''} 
      />
    </div>
  );
}
