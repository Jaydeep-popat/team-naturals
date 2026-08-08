'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable, Column } from '@/src/components/admin/DataTable';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react';
import { events } from '@/src/lib/api';
import toast from 'react-hot-toast';

export default function AdminEventsPage() {
  const [eventList, setEventList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await events.list();
      setEventList(res.data?.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await events.delete(String(deleteTarget.eventId));
      setEventList((prev) => prev.filter((e) => e.eventId !== deleteTarget.eventId));
      toast.success('Event deleted');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Event Name',
      render: (event) => (
        <Link href={`/admin/events/${event.eventId}`} className="font-bold text-forest hover:underline">
          {event.name}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (event) => (
        <span className={`rounded-lg px-2 py-1 text-xs font-medium ${
          event.status === 'active' ? 'bg-[#388E3C]/10 text-[#388E3C]' : 'bg-gray-100 text-gray-500'
        }`}>
          {event.status?.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (event) => (
        <span className="text-sm text-forest/60">
          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'homepage',
      header: 'Homepage',
      render: (event) => <span className="text-sm text-forest/60">{event.showOnHomepage ? 'Yes' : 'No'}</span>,
    },
    {
      key: 'rules',
      header: 'Rules',
      render: (event) => (
        <span className="rounded-lg bg-forest/5 px-2 py-1 text-xs font-medium text-forest">
          {event.rules?.length || 0} Rule(s)
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (event) => (
        <div className="flex justify-end gap-1">
          <Link
            href={`/admin/events/${event.eventId}`}
            className="rounded-lg p-1.5 text-forest/50 transition-colors hover:bg-forest/5 hover:text-forest"
            aria-label={`Edit ${event.name}`}
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(event);
            }}
            className="rounded-lg p-1.5 text-forest/30 transition-colors hover:bg-terracotta/5 hover:text-terracotta"
            aria-label={`Delete ${event.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest">Events & Campaigns</h1>
          <p className="mt-1 text-sm text-forest/60">Manage marketing banners, event dates, and discounts.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#16301F]"
        >
          <Plus size={16} /> Create Campaign
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 size={24} className="animate-spin text-forest" />
        </div>
      ) : (
        <DataTable data={eventList} columns={columns} keyExtractor={(event) => String(event.eventId)} emptyMessage="No campaigns found." />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Yes, Delete"
        isDestructive
      />
    </div>
  );
}
