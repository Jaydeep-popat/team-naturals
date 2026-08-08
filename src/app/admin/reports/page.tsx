'use client';

import React, { useState } from 'react';
import { BarChart2, TrendingUp, Download } from 'lucide-react';

import { orders as ordersApi, products as productsApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

type Period = '7d' | '30d' | '90d';

type SalesData = { label: string; revenue: number };
type ProductData = { name: string; revenue: string; units: number; pct: number };

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>('7d');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const maxRevenue = salesData.length > 0 ? Math.max(...salesData.map((s) => s.revenue)) : 100;

  React.useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          ordersApi.adminList({ limit: '1000' }), 
          productsApi.adminList({ limit: '100' }) 
        ]);
        
        const orders = ordersRes.data.orders;
        const products = productsRes.data.products;
        
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const now = new Date();
        const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        
        const recentOrders = orders.filter((o: any) => new Date(o.createdAt) >= past && o.status !== 'cancelled');

        // Bucket sales
        const bucketsCount = period === '7d' ? 7 : period === '30d' ? 6 : 9;
        const msPerBucket = (days * 24 * 60 * 60 * 1000) / bucketsCount;
        
        const buckets = Array.from({ length: bucketsCount }, (_, i) => ({
          label: period === '7d' ? `Day ${i + 1}` : period === '30d' ? `Wk ${i + 1}` : `Pt ${i + 1}`,
          revenue: 0,
          startTime: past.getTime() + (i * msPerBucket),
          endTime: past.getTime() + ((i + 1) * msPerBucket)
        }));

        recentOrders.forEach((o: any) => {
          const t = new Date(o.createdAt).getTime();
          const bucket = buckets.find(b => t >= b.startTime && t <= b.endTime);
          if (bucket) {
            bucket.revenue += Number(o.totalAmount || 0);
          }
        });

        setSalesData(buckets.map(b => ({ label: b.label, revenue: b.revenue })));

        // Aggregate top products
        const productSales: Record<string, { revenue: number, units: number }> = {};
        
        recentOrders.forEach((o: any) => {
          if (o.items && Array.isArray(o.items)) {
             o.items.forEach((item: any) => {
               const pId = String(item.productId || (item.product && item.product.productId));
               if (pId && pId !== 'undefined') {
                 if (!productSales[pId]) productSales[pId] = { revenue: 0, units: 0 };
                 productSales[pId].revenue += Number(item.price || 0) * Number(item.quantity || 1);
                 productSales[pId].units += Number(item.quantity || 1);
               }
             });
          }
        });

        const maxUnits = Math.max(...Object.values(productSales).map(p => p.units), 1);

        const topProducts = products
          .map((p: any) => {
            const sale = productSales[String(p.productId)] || { revenue: 0, units: 0 };
            return {
              name: p.name,
              revenue: `₹${sale.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
              units: sale.units,
              pct: Math.round((sale.units / maxUnits) * 100) || 0
            };
          })
          .sort((a: any, b: any) => b.units - a.units)
          .slice(0, 4);

        setProductData(topProducts);
        
      } catch (err) {
        console.error('Reports error:', err);
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, [period]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Reports & Analytics</h1>
          <p className="text-sm text-forest/60 mt-1">Store performance at a glance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-forest/10 text-sm font-medium text-forest shadow-sm hover:bg-forest/5 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Period Toggle */}
      <div className="flex gap-1 bg-white border border-forest/10 rounded-xl p-1 w-fit shadow-sm">
        {(['7d', '30d', '90d'] as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${period === p ? 'bg-forest text-white' : 'text-forest/60 hover:text-forest'}`}>
            {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-forest mb-6">Revenue Trend</h2>
        <div className="flex items-end gap-3 h-40">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
               <span className="text-forest/40">Loading chart...</span>
            </div>
          ) : (
            salesData.map((d) => (
              <div key={d.label} className="relative flex-1 group flex flex-col items-center justify-end gap-2 h-full">
                <div className="absolute bottom-full mb-2 bg-forest text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  ₹{d.revenue.toLocaleString()}
                </div>
                <div className="w-full bg-forest/20 rounded-t-sm overflow-hidden" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                  <div className="w-full h-full bg-forest opacity-80 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-xs font-medium text-forest/60">{d.label}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-forest mb-6">Top Products</h2>
        <div className="flex flex-col gap-4">
          {isLoading ? (
             <div className="animate-pulse space-y-4">
               {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>)}
             </div>
          ) : productData.map((p) => (
            <div key={p.name} className="flex items-center gap-4 group">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-forest group-hover:text-gold transition-colors">{p.name}</span>
                  <span className="text-sm font-bold text-forest">{p.revenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-forest/5 rounded-full overflow-hidden">
                    <div className="h-full bg-forest rounded-full transition-all duration-500" style={{ width: `${p.pct}%` }}></div>
                  </div>
                  <span className="text-[11px] font-medium text-forest/50 min-w-[50px] text-right">{p.units} units</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
