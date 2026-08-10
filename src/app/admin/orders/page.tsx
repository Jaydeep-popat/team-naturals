'use client';

import React, { useState } from 'react';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { Drawer } from '@/src/components/admin/Drawer';
import { useRouter } from 'next/navigation';
import { Download, ChevronRight, Package } from 'lucide-react';
import { orders as ordersApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:          'bg-gold/10 text-[#7A5E1A]',
  confirmed:        'bg-forest/10 text-forest',
  shipped:          'bg-blue-50 text-blue-700',
  delivered:        'bg-[#3F7D4C]/10 text-[#3F7D4C]',
  cancelled:        'bg-terracotta/10 text-terracotta',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped',
  delivered: 'Delivered', cancelled: 'Cancelled',
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
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedKeys, setSelectedKeys] = useState(new Set<string>());
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ordersApi.adminList(activeFilters);
      
      const mappedOrders = res.data.orders.map((o: any) => ({
        id: o.orderId,
        number: o.orderNumber,
        customer: o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.username : 'Guest',
        email: o.user?.email || 'N/A',
        date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        total: `₹${o.totalAmount || 0}`,
        items: o.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0,
        status: o.status
      }));
      
      setOrders(mappedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const columns: Column<any>[] = [
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
        onSearch={(q) => handleFilterChange('search', q || undefined)}
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
        isLoading={isLoading}
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
