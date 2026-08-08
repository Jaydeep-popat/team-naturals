'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { EventEditorForm } from '@/src/components/admin/EventEditorForm';
import { events } from '@/src/lib/api';

export default function EditEventPage() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    events.get(id)
      .then((res) => setEvent(res.data?.event || null))
      .catch((error) => {
        console.error('Failed to load event:', error);
        toast.error('Failed to load campaign');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-forest" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl border border-forest/10 bg-white p-8 text-center">
        <h1 className="font-display text-2xl text-forest">Campaign not found</h1>
        <p className="mt-2 text-sm text-forest/60">This campaign may have been deleted.</p>
        <Link href="/admin/events" className="mt-5 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white">
          Back to campaigns
        </Link>
      </div>
    );
  }

  return <EventEditorForm initialEvent={event} />;
}
