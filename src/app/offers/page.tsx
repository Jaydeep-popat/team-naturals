'use client';

import React, { useEffect, useState } from 'react';
import { EventBanner, EventBannerModel } from '@/src/components/EventBanner';
import { events as eventsApi } from '@/src/lib/api';
import { Loader2 } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';
import { motion } from 'framer-motion';

export default function OffersPage() {
  const [activeEvents, setActiveEvents] = useState<EventBannerModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getActive()
      .then(res => {
        if (res.data?.events) {
          setActiveEvents(res.data.events);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-white min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <Reveal className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Special Promotions</p>
          <SectionHeading className="mt-2">
            Current Offers & Campaigns
          </SectionHeading>
        </Reveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-forest" />
          </div>
        ) : activeEvents.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <h3 className="font-display text-xl text-forest font-medium">No active offers right now</h3>
            <p className="text-muted mt-2 text-sm">Check back later or subscribe to our newsletter for updates.</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {activeEvents.map((event) => (
              <motion.div key={event.eventId} variants={staggerItem}>
                <EventBanner event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
