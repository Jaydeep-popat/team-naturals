'use client';

import React, { useState } from 'react';
import { BarChart2, TrendingUp, Download } from 'lucide-react';

type Period = '7d' | '30d' | '90d';

const MOCK_SALES = [
  { label: 'Mon', revenue: 4200 }, { label: 'Tue', revenue: 6100 }, { label: 'Wed', revenue: 3400 },
  { label: 'Thu', revenue: 8900 }, { label: 'Fri', revenue: 12000 }, { label: 'Sat', revenue: 15400 }, { label: 'Sun', revenue: 9800 },
];

const MOCK_PRODUCTS = [
  { name: 'Neem & Tulsi Face Wash', revenue: '₹34,200', units: 98, pct: 100 },
  { name: 'Charcoal Detox Soap', revenue: '₹21,450', units: 108, pct: 63 },
  { name: 'Rose & Honey Soap', revenue: '₹18,900', units: 83, pct: 55 },
  { name: 'Sandalwood Luxury Soap', revenue: '₹14,220', units: 51, pct: 42 },
];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>('7d');
  const maxRevenue = Math.max(...MOCK_SALES.map((s) => s.revenue));

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
          {MOCK_SALES.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full flex items-end justify-center" style={{ height: 128 }}>
                <div
                  className="w-full rounded-t-lg bg-forest/20 hover:bg-forest transition-colors cursor-default relative group"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-forest text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{d.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-forest/50 font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-forest mb-6">Top Products</h2>
        <div className="space-y-5">
          {MOCK_PRODUCTS.map((p) => (
            <div key={p.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-forest">{p.name}</span>
                <div className="flex items-center gap-4 text-forest/60">
                  <span>{p.units} units</span>
                  <span className="font-bold text-forest">{p.revenue}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-forest/10 overflow-hidden">
                <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
