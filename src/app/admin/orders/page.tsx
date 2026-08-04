'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { Drawer } from '@/src/components/admin/Drawer';
import { useRouter } from 'next/navigation';
import { Download, ChevronRight, Package } from 'lucide-react';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

type Order = {
  id: string; number: string; customer: string; email: string;
  date: string; total: string; items: number; status: OrderStatus;
};

const MOCK_ORDERS: Order[] = [
  { id: '1', number: 'ORD-20260803-0011', customer: 'Priya Sharma', email: 'priya@email.com', date: '03 Aug 2026', total: '₹1,249', items: 2, status: 'pending' },
  { id: '2', number: 'ORD-20260803-0010', customer: 'Raj Patel', email: 'raj@email.com', date: '03 Aug 2026', total: '₹2,890', items: 4, status: 'confirmed' },
  { id: '3', number: 'ORD-20260803-0009', customer: 'Sneha K.', email: 'sneha@email.com', date: '03 Aug 2026', total: '₹649', items: 1, status: 'shipped' },
  { id: '4', number: 'ORD-20260803-0008', customer: 'Ameesha Joshi', email: 'am@email.com', date: '02 Aug 2026', total: '₹3,100', items: 5, status: 'delivered' },
  { id: '5', number: 'ORD-20260802-0041', customer: 'Karan Mehta', email: 'karan@email.com', date: '02 Aug 2026', total: '₹890', items: 2, status: 'cancelled' },
  { id: '6', number: 'ORD-20260802-0040', customer: 'Deepa R.', email: 'deepa@email.com', date: '02 Aug 2026', total: '₹1,790', items: 3, status: 'out_for_delivery' },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:          'bg-gold/10 text-[#7A5E1A]',
  confirmed:        'bg-forest/10 text-forest',
  shipped:          'bg-blue-50 text-blue-700',
  out_for_delivery: 'bg-purple-50 text-purple-700',
  delivered:        'bg-[#3F7D4C]/10 text-[#3F7D4C]',
  cancelled:        'bg-terracotta/10 text-terracotta',
  returned:         'bg-[#6B7268]/10 text-[#6B7268]',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  cancelled: 'Cancelled', returned: 'Returned',
};

function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === undefined) { delete next[key]; } else { next[key] = value; }
      return next;
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilters.status && o.status !== activeFilters.status) return false;
    return true;
  });

  const columns: Column<Order>[] = [
    { key: 'number', header: 'Order', sortable: true,
      render: (o) => <span className="font-mono text-[13px] font-medium text-forest">{o.number}</span> },
    { key: 'customer', header: 'Customer', sortable: true,
      render: (o) => (
        <div>
          <div className="font-medium text-forest">{o.customer}</div>
          <div className="text-[12px] text-forest/50">{o.email}</div>
        </div>
      )},
    { key: 'date', header: 'Date', sortable: true,
      render: (o) => <span className="text-forest/60 text-sm">{o.date}</span> },
    { key: 'items', header: 'Items',
      render: (o) => <span className="text-forest/70">{o.items} item{o.items !== 1 ? 's' : ''}</span> },
    { key: 'total', header: 'Total', sortable: true,
      render: (o) => <span className="font-semibold text-forest">{o.total}</span> },
    { key: 'status', header: 'Status', render: (o) => <StatusPill status={o.status} /> },
    { key: 'actions', header: '',
      render: (o) => (
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${o.id}`); }}
          className="p-1.5 rounded-lg text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Orders</h1>
          <p className="text-sm text-forest/60 mt-1">{filteredOrders.length} orders found</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-forest/10 text-sm font-medium text-forest shadow-sm hover:bg-forest/5 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <FilterBar
        searchPlaceholder="Search by order # or customer name..."
        filters={[
          {
            key: 'status', label: 'Status',
            options: Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => setActiveFilters({})}
      />

      {selectedKeys.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-forest text-white px-4 py-3 text-sm shadow-sm">
          <span className="font-semibold">{selectedKeys.size} order{selectedKeys.size > 1 ? 's' : ''} selected</span>
          <div className="w-px h-4 bg-white/20 mx-2"></div>
          <select
            className="bg-transparent text-white font-medium text-sm outline-none"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk action...</option>
            <option value="confirm">Mark as Confirmed</option>
            <option value="cancel">Cancel Orders</option>
          </select>
          {bulkAction && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="ml-auto px-3 py-1.5 rounded-lg bg-white text-forest font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Apply
            </button>
          )}
        </div>
      )}

      <DataTable
        data={filteredOrders}
        columns={columns}
        keyExtractor={(o) => o.id}
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
        emptyMessage="No orders match your filters."
      />

      <ConfirmDialog
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={() => { setShowBulkConfirm(false); setBulkAction(''); setSelectedKeys(new Set()); }}
        title={bulkAction === 'cancel' ? 'Cancel Orders' : 'Update Orders'}
        message={`Are you sure you want to ${bulkAction === 'cancel' ? 'cancel' : 'update'} ${selectedKeys.size} order(s)? This action cannot be undone.`}
        confirmText={bulkAction === 'cancel' ? 'Yes, Cancel' : 'Apply'}
        isDestructive={bulkAction === 'cancel'}
      />
    </div>
  );
}
