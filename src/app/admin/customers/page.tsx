'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { FilterBar } from '@/src/components/admin/FilterBar';
import { ChevronRight } from 'lucide-react';

type Customer = {
  id: string; name: string; email: string; phone: string;
  orders: number; totalSpend: string; joinedAt: string;
  status: string; verified: boolean; profilePic?: string;
};

import { users as usersApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

const COLUMNS: Column<Customer>[] = [
  { key: 'name', header: 'Customer', sortable: true,
    render: (c) => (
      <div className="flex items-center gap-3">
        {c.profilePic ? (
          <img src={c.profilePic} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-forest/10 shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-xs shrink-0">
            {c.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="font-semibold text-forest flex items-center gap-2">
            {c.name}
            {c.verified && <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] uppercase font-bold tracking-wider">Verified</span>}
          </div>
          <div className="text-[12px] text-forest/50">{c.email}</div>
        </div>
      </div>
    )},
  { key: 'phone', header: 'Phone', render: (c) => <span className="text-sm text-forest/60">{c.phone}</span> },
  { key: 'orders', header: 'Orders', sortable: true,
    render: (c) => <span className="font-semibold text-forest">{c.orders}</span> },
  { key: 'totalSpend', header: 'Total Spent', sortable: true,
    render: (c) => <span className="font-semibold text-forest">{c.totalSpend}</span> },
  { key: 'status', header: 'Status', sortable: true,
    render: (c) => <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span> },
  { key: 'joinedAt', header: 'Joined', sortable: true,
    render: (c) => <span className="text-sm text-forest/60">{c.joinedAt}</span> },
  { key: 'actions', header: '',
    render: (c) => <ChevronRight size={16} className="text-forest/30" /> },
];

export default function AdminCustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [limit, setLimit] = useState(10);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const query: any = { page: Number(page), limit: Number(limit) };
        if (searchQuery) query.search = searchQuery; // adminUsers.list expects 'search'
        
        const res = await usersApi.adminList(query);
        
        const mapped = res.data.users.map((u: any) => ({
          id: u.userId,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
          email: u.email,
          phone: u.phoneNo || 'N/A',
          profilePic: u.profilePic,
          orders: u._count?.orders || 0,
          totalSpend: `₹${Number(u.totalSpend || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
          status: u.userStatus || 'N/A',
          verified: !!u.emailVerifiedAt,
          joinedAt: new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }));
        
        setCustomers(mapped);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalRecords(res.data.pagination?.total || 0);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        toast.error('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [page, limit, searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest">Customers</h1>
      </div>

      <FilterBar 
        searchPlaceholder="Search by name or email..." 
        onSearch={(q) => { setSearchQuery(q); setPage(1); }} 
      />

      <DataTable
        data={customers}
        columns={COLUMNS}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        onRowClick={(c) => router.push(`/admin/customers/${c.id}`)}
        emptyMessage="No customers found."
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
}
