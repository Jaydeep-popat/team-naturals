'use client';

import React, { useState } from 'react';
import {
  ShoppingCart, Users, Package, AlertTriangle, TrendingUp,
  ArrowRight, Eye
} from 'lucide-react';
import { StatCard } from '@/src/components/admin/StatCard';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import Link from 'next/link';

// ── Mock data (replace with real API calls) ──────────────────────────────────
type Order = {
  id: string; number: string; customer: string; date: string;
  total: string; status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
};

const MOCK_ORDERS: Order[] = [
  { id: '1', number: 'ORD-20260803-0011', customer: 'Priya Sharma', date: '2 min ago', total: '₹1,249', status: 'pending' },
  { id: '2', number: 'ORD-20260803-0010', customer: 'Raj Patel', date: '18 min ago', total: '₹2,890', status: 'confirmed' },
  { id: '3', number: 'ORD-20260803-0009', customer: 'Sneha K.', date: '1 hr ago', total: '₹649', status: 'shipped' },
  { id: '4', number: 'ORD-20260803-0008', customer: 'Ameesha Joshi', date: '3 hr ago', total: '₹3,100', status: 'delivered' },
  { id: '5', number: 'ORD-20260802-0041', customer: 'Karan Mehta', date: 'Yesterday', total: '₹890', status: 'cancelled' },
];

type LowStockItem = { id: string; name: string; sku: string; stock: number; threshold: number };

const MOCK_LOW_STOCK: LowStockItem[] = [
  { id: '1', name: 'Neem & Tulsi Face Wash 100ml', sku: 'FW-NT-100', stock: 3, threshold: 10 },
  { id: '2', name: 'Charcoal Detox Soap 75g', sku: 'SP-CH-75', stock: 5, threshold: 15 },
  { id: '3', name: 'Rose & Honey Soap 100g', sku: 'SP-RH-100', stock: 7, threshold: 10 },
];

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:   'bg-gold/10 text-[#7A5E1A]',
  confirmed: 'bg-forest/10 text-forest',
  shipped:   'bg-blue-50 text-blue-700',
  delivered: 'bg-[#3F7D4C]/10 text-[#3F7D4C]',
  cancelled: 'bg-terracotta/10 text-terracotta',
};

const ORDER_COLUMNS: Column<Order>[] = [
  { key: 'number', header: 'Order', sortable: true,
    render: (o) => <span className="font-mono text-[13px] font-medium text-forest">{o.number}</span> },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'date', header: 'Placed', sortable: false,
    render: (o) => <span className="text-forest/60">{o.date}</span> },
  { key: 'total', header: 'Total', sortable: true,
    render: (o) => <span className="font-semibold text-forest">{o.total}</span> },
  { key: 'status', header: 'Status',
    render: (o) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize ${STATUS_STYLES[o.status]}`}>
        {o.status}
      </span>
    )},
];

const LOW_STOCK_COLUMNS: Column<LowStockItem>[] = [
  { key: 'name', header: 'Product',
    render: (i) => <span className="font-medium text-forest">{i.name}</span> },
  { key: 'sku', header: 'SKU',
    render: (i) => <span className="font-mono text-[12px] text-forest/60">{i.sku}</span> },
  { key: 'stock', header: 'Stock',
    render: (i) => (
      <span className={`font-bold ${i.stock <= i.threshold / 2 ? 'text-terracotta' : 'text-[#D99A3D]'}`}>
        {i.stock} left
      </span>
    )},
];

type Period = '7d' | '30d' | '90d';

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('7d');

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-forest">Dashboard</h1>
        <p className="text-sm text-forest/60">Welcome back — here&apos;s what&apos;s happening in your store today.</p>
      </div>

      {/* Period toggle */}
      <div className="flex items-center gap-1 rounded-xl bg-white border border-forest/10 p-1 w-fit shadow-sm">
        {(['7d', '30d', '90d'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              period === p ? 'bg-forest text-white shadow-sm' : 'text-forest/60 hover:text-forest'
            }`}
          >
            {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₹1,24,890"
          trend={{ value: 14.2, isPositive: true, label: 'vs prev period' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Orders"
          value="148"
          trend={{ value: 8.5, isPositive: true, label: 'vs prev period' }}
          icon={ShoppingCart}
        />
        <StatCard
          title="Low Stock Alerts"
          value="3"
          trend={{ value: 2, isPositive: false, label: 'products critical' }}
          icon={AlertTriangle}
        />
        <StatCard
          title="New Customers"
          value="34"
          trend={{ value: 5.3, isPositive: true, label: 'vs prev period' }}
          icon={Users}
        />
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders — spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-forest">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 text-sm font-medium text-forest/60 hover:text-forest transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <DataTable
            data={MOCK_ORDERS}
            columns={ORDER_COLUMNS}
            keyExtractor={(o) => o.id}
            onRowClick={(o) => window.location.href = `/admin/orders/${o.id}`}
          />
        </div>

        {/* Low Stock Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-forest">Low Stock</h2>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1.5 text-sm font-medium text-forest/60 hover:text-forest transition-colors"
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-white shadow-sm divide-y divide-forest/5 overflow-hidden">
            {MOCK_LOW_STOCK.map((item) => (
              <div key={item.id} className="flex items-start justify-between px-5 py-4 hover:bg-forest/5 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-forest leading-snug">{item.name}</span>
                  <span className="text-[11px] font-mono text-forest/40">{item.sku}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0 ml-4">
                  <span className={`text-sm font-bold ${item.stock <= item.threshold / 2 ? 'text-terracotta' : 'text-[#D99A3D]'}`}>
                    {item.stock} left
                  </span>
                  <span className="text-[11px] text-forest/40">Threshold: {item.threshold}</span>
                </div>
              </div>
            ))}
            <Link
              href="/admin/inventory"
              className="flex items-center justify-center gap-2 px-5 py-4 text-sm font-medium text-forest/50 hover:text-forest hover:bg-forest/5 transition-colors"
            >
              <Package size={14} /> Manage all inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
