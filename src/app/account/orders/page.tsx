'use client';
import React, { useState } from 'react';
import { PackageIcon, CheckCircle2Icon, ClockIcon, ArrowRightIcon } from 'lucide-react';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const mockOrders = [
    { 
      id: '#TN-1249', 
      date: 'Oct 12, 2026', 
      total: '₹1,450', 
      status: 'Delivered', 
      canCancel: false,
      items: [
        { name: 'Neem & Aloe Face Wash', variant: '100ml', qty: 1, price: '₹350', image: '/22f656cd-e070-47f1-ad50-e243752d0d8e.jpg' },
        { name: 'Charcoal Soap Bar', variant: 'Set of 3', qty: 2, price: '₹550', image: '/25dcd76f-37d7-4036-b396-20449c8e4796.jpg' }
      ],
      tracking: [
        { step: 'Order Placed', date: 'Oct 12, 10:00 AM', completed: true },
        { step: 'Processing', date: 'Oct 13, 09:30 AM', completed: true },
        { step: 'Shipped', date: 'Oct 14, 11:15 AM', completed: true },
        { step: 'Delivered', date: 'Oct 15, 02:45 PM', completed: true },
      ],
      shippingAddress: "123 Nature Valley Road, Suite A, Mumbai, MH 400001",
      paymentMethod: "Credit Card ending in 4242"
    },
    { 
      id: '#TN-1022', 
      date: 'Sep 05, 2026', 
      total: '₹890', 
      status: 'Processing',
      canCancel: true, 
      items: [
        { name: 'Rose Water Toner', variant: '200ml', qty: 1, price: '₹890', image: '/4d43f26a-b03f-405e-985f-c84f473e0793.jpg' }
      ],
      tracking: [
        { step: 'Order Placed', date: 'Sep 05, 04:20 PM', completed: true },
        { step: 'Processing', date: 'Sep 06, 10:10 AM', completed: true },
        { step: 'Shipped', date: 'Pending', completed: false },
        { step: 'Delivered', date: 'Pending', completed: false },
      ],
      shippingAddress: "123 Nature Valley Road, Suite A, Mumbai, MH 400001",
      paymentMethod: "UPI (Google Pay)"
    },
  ];

  if (selectedOrder) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-forest/10 pb-4">
          <button 
            onClick={() => { setSelectedOrder(null); setShowCancelModal(false); }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/5 text-forest hover:bg-forest/10 transition-colors"
          >
            ←
          </button>
          <div>
            <h2 className="font-display text-xl font-bold text-forest">Order Details</h2>
            <p className="text-[12px] text-muted font-medium mt-0.5">ID: {selectedOrder.id} &nbsp;|&nbsp; Placed on {selectedOrder.date}</p>
          </div>
        </div>

        {/* Top Info Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-forest/10 p-5 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-forest mb-3 uppercase tracking-wide">Delivery Address</h3>
              <p className="text-sm font-semibold text-forest mb-1">Yugal Doe</p>
              <p className="text-[13px] text-muted leading-relaxed max-w-[200px]">
                {selectedOrder.shippingAddress}
              </p>
              <p className="text-[13px] font-semibold text-forest mt-3">Phone: +91 98765 43210</p>
            </div>
          </div>
          
          <div className="rounded-xl border border-forest/10 p-5 bg-white shadow-sm flex flex-col justify-between">
             <div>
               <h3 className="text-sm font-bold text-forest mb-3 uppercase tracking-wide">Order Summary</h3>
               <div className="text-[13px] text-muted flex justify-between mb-1.5"><p>Item(s) Subtotal:</p><p className="font-semibold text-forest">{selectedOrder.total}</p></div>
               <div className="text-[13px] text-muted flex justify-between mb-3"><p>Shipping:</p><p className="font-semibold text-forest">Free</p></div>
               <div className="text-[14px] font-bold text-forest flex justify-between border-t border-forest/5 pt-3"><p>Grand Total:</p><p>{selectedOrder.total}</p></div>
             </div>
             
             <button className="mt-4 w-full rounded-lg border border-forest/20 py-2.5 text-xs font-bold text-forest hover:bg-forest/5 transition-colors">
               Download Invoice
             </button>
          </div>
        </div>

        {/* Items & Tracking */}
        <div className="space-y-6 pt-2">
          {selectedOrder.items.map((item: any, i: number) => (
            <div key={i} className="rounded-2xl border border-forest/10 bg-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* Product Info Section */}
              <div className="p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="h-28 w-28 shrink-0 rounded-lg border border-forest/5 bg-cream/20 relative overflow-hidden">
                   {item.image ? (
                     <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                   ) : (
                     <PackageIcon size={32} className="text-forest/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   )}
                </div>
                
                <div className="flex-1 flex flex-col h-full justify-center">
                  <h3 className="font-display font-bold text-forest text-lg">{item.name}</h3>
                  <p className="text-[13px] text-muted mt-1 font-medium">Variant: {item.variant} &nbsp;|&nbsp; Seller: Team Naturals</p>
                  <p className="font-display font-bold text-forest text-xl mt-3">{item.price}</p>
                </div>
                
                {/* Actions */}
                <div className="w-full sm:w-40 flex flex-col gap-2 shrink-0">
                  {selectedOrder.canCancel ? (
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="w-full rounded-lg bg-terracotta text-white py-2.5 text-[13px] font-bold hover:bg-terracotta/90 transition-colors shadow-sm"
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <button className="w-full rounded-lg border-2 border-forest/20 text-forest py-2 text-[13px] font-bold hover:bg-forest hover:text-white transition-colors">
                      Return Item
                    </button>
                  )}
                  <button className="w-full rounded-lg border-2 border-forest/20 text-forest py-2 text-[13px] font-bold hover:bg-forest hover:text-white transition-colors">
                    Need Help?
                  </button>
                </div>
              </div>

              {/* Cancel Confirmation Banner */}
              {showCancelModal && selectedOrder.canCancel && (
                <div className="border-t border-terracotta/20 bg-terracotta/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
                   <p className="text-sm font-bold text-terracotta">Are you sure you want to cancel this item?</p>
                   <div className="flex gap-2">
                     <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-xs font-bold text-forest bg-white rounded-lg border border-forest/10 hover:bg-forest/5">Don&apos;t Cancel</button>
                     <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta/90">Confirm Cancel</button>
                   </div>
                </div>
              )}

              {/* Integrated Tracking Timeline */}
              <div className="border-t border-forest/5 bg-forest/5 p-6 sm:px-10">
                <div className="relative flex justify-between max-w-2xl mx-auto">
                  <div className="absolute top-3 left-[12.5%] right-[12.5%] h-1 bg-forest/10 rounded-full" />
                  <div 
                    className="absolute top-3 left-[12.5%] h-1 bg-forest rounded-full transition-all duration-1000" 
                    style={{ width: selectedOrder.status === 'Delivered' ? '75%' : '25%' }} 
                  />
                  {selectedOrder.tracking.map((track: any, idx: number) => (
                    <div key={idx} className="relative flex flex-col items-center gap-3 z-10 w-1/4">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center border-4 border-[#F3F4F1] ${track.completed ? 'bg-forest text-white shadow-sm' : 'bg-cream text-forest/40'}`}>
                        {track.completed ? <CheckCircle2Icon size={12} /> : <div className="h-2 w-2 rounded-full bg-forest/20" />}
                      </div>
                      <div className="text-center">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${track.completed ? 'text-forest' : 'text-forest/40'}`}>{track.step}</p>
                        <p className="text-[10px] text-muted mt-0.5">{track.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">


      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => setSelectedOrder(order)}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-forest/10 bg-white p-5 transition-all hover:border-forest/20 hover:shadow-md cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#FDFBF9] border border-forest/5 overflow-hidden">
                {order.items[0].image ? (
                  <img src={order.items[0].image} alt="product" className="object-cover w-full h-full mix-blend-multiply opacity-90" />
                ) : (
                  <PackageIcon size={24} className="text-forest/30" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-forest text-[16px] mb-1.5 group-hover:text-forest transition-colors">
                  {order.items[0].name} {order.items.length > 1 && <span className="text-forest/60 text-sm font-medium ml-1">+{order.items.length - 1} more</span>}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-[#E8F3EB] text-[#1B4D2E]' : 'bg-[#FFF0E5] text-[#A64322]'
                  }`}>
                    {order.status === 'Delivered' ? <CheckCircle2Icon size={12} /> : <ClockIcon size={12} />}
                    {order.status}
                  </span>
                  <span className="text-[13px] font-medium text-muted">• Placed on {order.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-4 sm:mt-0 self-end sm:self-auto">
              <p className="font-display font-bold text-forest text-xl">{order.total}</p>
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-forest/5 text-forest group-hover:bg-forest group-hover:text-white transition-colors">
                <ArrowRightIcon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
