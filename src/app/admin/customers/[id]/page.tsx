'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { users as usersApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await usersApi.adminGet(params.id as string);
        const data = res.data.user;
        
        // Map backend user structure
        const mapped = {
          id: data.userId,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username,
          email: data.email,
          phone: data.phoneNo || 'N/A',
          joinedAt: new Date(data.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          totalOrders: data.orderCount || data.orders?.length || 0,
          totalSpend: `₹${data.totalSpent || 0}`,
          addresses: data.addresses?.map((addr: any) => ({
            id: addr.addressId,
            fullName: addr.fullName,
            line1: addr.line1,
            line2: addr.line2,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            isDefault: addr.isDefault
          })) || [],
          orders: data.orders?.map((o: any) => ({
            id: o.orderId,
            number: o.orderNumber,
            date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            total: `₹${o.totalAmount}`,
            status: o.status
          })) || [],
        };
        setCustomer(mapped);
      } catch (err) {
        console.error('Fetch customer error:', err);
        toast.error('Failed to load customer details');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchCustomer();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-20 text-forest/60">Customer not found</div>;
  }

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
              {customer.orders.map((o: any) => (
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
              {customer.orders.length === 0 && (
                <p className="text-sm text-forest/60 py-4 text-center">No orders yet.</p>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-forest mb-4">Saved Addresses</h2>
            {customer.addresses.map((addr: any) => (
              <div key={addr.id} className="rounded-xl bg-[#FDFBF9] border border-forest/10 p-4 mb-4 last:mb-0">
                {addr.isDefault && <span className="inline-flex mb-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-forest text-white">Default</span>}
                <p className="font-semibold text-forest text-sm">{addr.fullName}</p>
                <address className="not-italic text-sm text-forest/60 mt-1 leading-relaxed">
                  {addr.line1}{addr.line2 && `, ${addr.line2}`}<br />
                  {addr.city}, {addr.state} {addr.postalCode}
                </address>
              </div>
            ))}
            {customer.addresses.length === 0 && (
              <p className="text-sm text-forest/60 py-4 text-center">No saved addresses.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-forest">Profile</h2>
            {[
              { icon: Mail, val: customer.email },
              { icon: Phone, val: customer.phone },
            ].map(({ icon: Icon, val }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-forest/70 break-all">
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
