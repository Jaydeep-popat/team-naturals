'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Users, Package, AlertTriangle, TrendingUp,
  ArrowRight, Eye
} from 'lucide-react';
import { StatCard } from '@/src/components/admin/StatCard';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import Link from 'next/link';
import { orders as ordersApi, products as productsApi, ApiError } from '@/src/lib/api';
import toast from 'react-hot-toast';

type Order = {
  id: string; number: string; customer: string; date: string;
  total: string; status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice?: number; // for stat calculation
  createdAt?: string; // for sorting
  user?: { firstName?: string; lastName?: string; username?: string };
};

type LowStockItem = { id: string; name: string; sku: string; stock: number; threshold: number };

const STATUS_STYLES: Record<Order['status'], string> = {
  pending:   'bg-gold/10 text-[#7A5E1A]',
  confirmed: 'bg-forest/10 text-forest',
  shipped:   'bg-blue-50 text-blue-700',
  delivered: 'bg-[#3F7D4C]/10 text-[#3F7D4C]',
  cancelled: 'bg-terracotta/10 text-terracotta',
};

const ORDER_COLUMNS: Column<Order>[] = [
  { key: 'customer', header: 'Customer', sortable: true,
    render: (o) => (
      <div className="flex flex-col">
        <span className="font-semibold text-[13px] text-forest">{o.customer}</span>
        <span className="text-[11px] text-forest/50 font-medium mt-0.5">{o.date}</span>
      </div>
    )
  },
  { key: 'total', header: 'Amount', sortable: true,
    render: (o) => <span className="font-bold text-forest">{o.total}</span> },
  { key: 'status', header: 'Status',
    render: (o) => (
      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status]}`}>
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
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockItem[]>([]);
  const [stats, setStats] = useState({ revenue: 0, count: 0, items: 0, inStock: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          ordersApi.adminList({ limit: '10' }), // Fetch recent orders for dashboard
          productsApi.adminList({ limit: '100' }) // Fetch products to check stock
        ]);
        
        // Map backend orders to dashboard format
        const mappedOrders = ordersRes.data.orders.map((o: any) => ({
          id: o.orderId,
          number: o.orderNumber,
          customer: o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.username : 'Guest',
          date: new Date(o.createdAt).toLocaleDateString(),
          total: `₹${o.totalAmount}`,
          status: o.status,
          totalPrice: o.totalAmount,
          createdAt: o.createdAt
        }));
        
        setOrders(mappedOrders);
        
        // Calculate basic stats from orders (this would typically come from an aggregation endpoint)
        const revenue = mappedOrders.reduce((sum: number, o: any) => sum + Number(o.totalPrice || 0), 0);
        const inStock = productsRes.data.products.filter((p: any) => p.stockQty > 0).length;
        setStats({
          revenue,
          count: mappedOrders.length,
          items: productsRes.data.products.length,
          inStock
        });

        // Filter low stock products
        const lowStock = productsRes.data.products
          .filter((p: any) => p.stockQty <= 10)
          .map((p: any) => ({
            id: String(p.productId),
            name: p.name,
            sku: p.sku || `SKU-${p.productId}`,
            stock: p.stockQty,
            threshold: 10
          }));
        
        setLowStockProducts(lowStock);
        
      } catch (error) {
        console.error("Dashboard fetch error", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [period]);

  return (
    <div className="relative space-y-8 pb-10">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-forest/5 blur-[100px]" />
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[120px]" />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-4xl font-bold text-forest tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-forest/60">Welcome back — here&apos;s a quick overview of your store.</p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 p-1.5 shadow-sm">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                period === p 
                  ? 'bg-forest text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] scale-105' 
                  : 'text-forest/50 hover:text-forest hover:bg-white/50'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`}
          trend={{ value: 12, isPositive: true, label: 'vs last period' }}
          icon={TrendingUp}
        />
        <StatCard
          title="Orders"
          value={stats.count.toString()}
          trend={{ value: 8, isPositive: true, label: 'vs last period' }}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={stats.items.toString()}
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length.toString()}
          icon={AlertTriangle}
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
            data={orders}
            columns={ORDER_COLUMNS}
            keyExtractor={(o) => o.id}
            onRowClick={(o) => window.location.href = `/admin/orders/${o.id}`}
            emptyMessage="No recent orders."
            isLoading={isLoading}
          />
        </div>

        {/* Low Stock Panel */}
        <div className="flex flex-col rounded-[24px] border border-white/60 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <AlertTriangle size={16} strokeWidth={2} />
              </div>
              <h2 className="font-display text-lg font-bold text-forest">Low Stock Alerts</h2>
            </div>
            <Link href="/admin/products" className="text-sm font-semibold text-forest/50 hover:text-forest transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-white">
              Manage &rarr;
            </Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-forest/5 rounded-2xl w-full"></div>)}
              </div>
            ) : lowStockProducts.length > 0 ? (
              lowStockProducts.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl border border-terracotta/10 bg-white hover:bg-terracotta/5 hover:border-terracotta/20 transition-all duration-300 shadow-sm hover:shadow">
                  <div className="flex flex-col">
                    <span className="font-semibold text-forest text-sm">{item.name}</span>
                    <span className="text-[11px] text-forest/40 font-mono mt-0.5">SKU: {item.sku}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold ${item.stock <= item.threshold / 2 ? 'text-terracotta' : 'text-[#D99A3D]'}`}>
                      {item.stock} left
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-forest/40 font-bold mt-0.5">Min: {item.threshold}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 bg-white/40 rounded-2xl border border-dashed border-forest/10">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                  <Package size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-forest text-center">All products are well stocked.</p>
                <p className="text-xs text-forest/50 text-center mt-1">No alerts at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
