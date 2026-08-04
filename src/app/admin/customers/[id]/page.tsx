'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const MOCK_CUSTOMER = {
  id: '1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210',
  joinedAt: '15 Jan 2026', totalOrders: 5, totalSpend: '₹4,890',
  addresses: [
    { id: '1', fullName: 'Priya Sharma', line1: '12, Rose Garden Apts', line2: 'Near City Mall', city: 'Pune', state: 'Maharashtra', postalCode: '411001', isDefault: true },
  ],
  orders: [
    { id: '1', number: 'ORD-20260803-0011', date: '03 Aug 2026', total: '₹1,249', status: 'pending' },
    { id: '4', number: 'ORD-20260803-0008', date: '02 Aug 2026', total: '₹3,100', status: 'delivered' },
  ],
};

export default function AdminCustomerDetailPage() {
  const router = useRouter();
  const customer = MOCK_CUSTOMER;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-forest/5 text-forest/60 hover:text-forest transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold text-forest">{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order history */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4">Order History</h2>
            <div className="divide-y divide-forest/5">
              {customer.orders.map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between py-3 hover:bg-forest/5 -mx-2 px-2 rounded-xl transition-colors">
                  <div>
                    <p className="font-mono text-[13px] font-semibold text-forest">{o.number}</p>
                    <p className="text-[12px] text-forest/50">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest">{o.total}</p>
                    <span className="text-[12px] text-forest/50 capitalize">{o.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4">Saved Addresses</h2>
            {customer.addresses.map((addr) => (
              <div key={addr.id} className="rounded-xl bg-[#FDFBF9] border border-forest/10 p-4">
                {addr.isDefault && <span className="inline-flex mb-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-forest text-white">Default</span>}
                <p className="font-semibold text-forest text-sm">{addr.fullName}</p>
                <address className="not-italic text-sm text-forest/60 mt-1 leading-relaxed">
                  {addr.line1}{addr.line2 && `, ${addr.line2}`}<br />
                  {addr.city}, {addr.state} {addr.postalCode}
                </address>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-forest">Profile</h2>
            {[
              { icon: Mail, val: customer.email },
              { icon: Phone, val: customer.phone },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-3 text-sm text-forest/70">
                <Icon size={15} className="text-forest/40 shrink-0" />
                {val}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-forest">{customer.totalOrders}</p>
              <p className="text-[12px] text-forest/50 mt-1">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-forest">{customer.totalSpend}</p>
              <p className="text-[12px] text-forest/50 mt-1">Total spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
