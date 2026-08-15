'use client';

import React, { useState } from 'react';
import { ShoppingCart, AlertTriangle, Star, CreditCard, CheckCircle2 } from 'lucide-react';

type NotifType = 'order' | 'low_stock' | 'review' | 'payment';

type Notification = {
  id: string; type: NotifType; title: string; body: string;
  time: string; isRead: boolean;
};

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  order:     { icon: ShoppingCart, color: 'text-forest', bg: 'bg-forest/10' },
  low_stock: { icon: AlertTriangle, color: 'text-[#D99A3D]', bg: 'bg-gold/10' },
  review:    { icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  payment:   { icon: CreditCard, color: 'text-terracotta', bg: 'bg-terracotta/10' },
};

const MOCK_NOTIFS: Notification[] = [
  { id: '1', type: 'order', title: 'New Order Placed', body: 'ORD-20260803-0011 — Priya Sharma placed a new order worth ₹1,249.', time: '2 min ago', isRead: false },
  { id: '2', type: 'low_stock', title: 'Low Stock Alert', body: 'Charcoal Detox Soap 75g has only 5 units remaining (threshold: 15).', time: '1 hr ago', isRead: false },
  { id: '3', type: 'review', title: 'New Review Pending', body: 'A new review by Raj P. on Charcoal Detox Soap is awaiting moderation.', time: '3 hr ago', isRead: true },
  { id: '4', type: 'payment', title: 'Payment Received', body: 'Razorpay confirmed payment of ₹2,890 for ORD-20260803-0010.', time: 'Yesterday', isRead: true },
];

export default function AdminNotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [filter, setFilter] = useState<NotifType | 'all'>('all');

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

  const filtered = notifs.filter((n) => filter === 'all' || n.type === filter);
  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Notifications</h1>
          <p className="text-sm text-forest/60 mt-1">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-forest/10 text-sm font-medium text-forest shadow-sm hover:bg-forest/5 transition-colors">
            <CheckCircle2 size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 bg-white border border-forest/10 rounded-xl p-1 w-fit shadow-sm">
        {(['all', 'order', 'low_stock', 'review', 'payment'] as const).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${filter === tab ? 'bg-forest text-white shadow-sm' : 'text-forest/60 hover:text-forest'}`}>
            {tab === 'low_stock' ? 'Low Stock' : tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-forest/10 bg-white p-12 text-center text-forest/50">
            No notifications.
          </div>
        )}
        {filtered.map((notif) => {
          const meta = TYPE_META[notif.type];
          const Icon = meta.icon;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`flex items-start gap-4 rounded-2xl border p-5 cursor-pointer transition-all ${notif.isRead ? 'border-forest/5 bg-white' : 'border-forest/10 bg-[#FDFBF9] shadow-sm'}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${notif.isRead ? 'text-forest/70' : 'text-forest'}`}>{notif.title}</p>
                  {!notif.isRead && <span className="h-2 w-2 rounded-full bg-terracotta shrink-0"></span>}
                </div>
                <p className="text-sm text-forest/60 mt-0.5 leading-relaxed">{notif.body}</p>
              </div>
              <span className="text-xs text-forest/40 shrink-0 mt-0.5">{notif.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
