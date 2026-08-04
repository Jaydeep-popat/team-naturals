'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { ChevronRight } from 'lucide-react';

type Customer = {
  id: string; name: string; email: string; phone: string;
  orders: number; totalSpend: string; joinedAt: string;
};

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', orders: 5, totalSpend: '₹4,890', joinedAt: '15 Jan 2026' },
  { id: '2', name: 'Raj Patel', email: 'raj@email.com', phone: '+91 99887 65432', orders: 3, totalSpend: '₹2,890', joinedAt: '22 Mar 2026' },
  { id: '3', name: 'Sneha K.', email: 'sneha@email.com', phone: '+91 87654 32109', orders: 8, totalSpend: '₹9,320', joinedAt: '01 Dec 2025' },
  { id: '4', name: 'Karan Mehta', email: 'karan@email.com', phone: '+91 91234 56789', orders: 1, totalSpend: '₹890', joinedAt: '30 Jul 2026' },
];

const COLUMNS: Column<Customer>[] = [
  { key: 'name', header: 'Customer', sortable: true,
    render: (c) => (
      <div>
        <div className="font-semibold text-forest">{c.name}</div>
        <div className="text-[12px] text-forest/50">{c.email}</div>
      </div>
    )},
  { key: 'phone', header: 'Phone', render: (c) => <span className="text-sm text-forest/60">{c.phone}</span> },
  { key: 'orders', header: 'Orders', sortable: true,
    render: (c) => <span className="font-semibold text-forest">{c.orders}</span> },
  { key: 'totalSpend', header: 'Total Spent', sortable: true,
    render: (c) => <span className="font-semibold text-forest">{c.totalSpend}</span> },
  { key: 'joinedAt', header: 'Joined', sortable: true,
    render: (c) => <span className="text-sm text-forest/60">{c.joinedAt}</span> },
  { key: 'actions', header: '',
    render: (c) => <ChevronRight size={16} className="text-forest/30" /> },
];

export default function AdminCustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_CUSTOMERS.filter((c) =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest">Customers</h1>
        <p className="text-sm text-forest/60 mt-1">{filtered.length} customers registered</p>
      </div>

      <FilterBar searchPlaceholder="Search by name or email..." onSearch={setSearchQuery} />

      <DataTable
        data={filtered}
        columns={COLUMNS}
        keyExtractor={(c) => c.id}
        onRowClick={(c) => router.push(`/admin/customers/${c.id}`)}
        emptyMessage="No customers found."
      />
    </div>
  );
}
