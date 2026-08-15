'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EventBanner, EventBannerModel } from '@/src/components/EventBanner';
import { events as eventsApi } from '@/src/lib/api';
import { Loader2, PackageX } from 'lucide-react';
import { ProductCard } from '@/src/components/ProductCard';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';
import { motion } from 'framer-motion';

export default function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventBannerModel | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof slug !== 'string') return;
    
    eventsApi.getProductsBySlug(slug)
      .then(res => {
        if (res.data?.event) {
          setEvent(res.data.event);
        }
        setProducts(res.data?.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <Loader2 size={32} className="animate-spin text-forest" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white">
        <h2 className="font-display text-2xl font-bold text-forest">Event Not Found</h2>
        <p className="text-muted mt-2">This event may have expired or does not exist.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        
        {/* Banner */}
        <EventBanner event={event} className="mb-12" />

        <Reveal className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-3xl font-bold text-forest mb-4">Applicable Products</h1>
          <p className="text-muted text-sm leading-relaxed">
            These special discounts are applied automatically at checkout.
          </p>
        </Reveal>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-forest/15 bg-cream-soft/60 py-16 text-center">
            <PackageX size={42} className="text-forest/30" />
            <h3 className="mt-4 font-display text-xl text-forest font-medium">No products attached yet</h3>
            <p className="text-muted mt-2 text-sm">This offer is live, but no eligible products were found.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <motion.div key={product.productId || product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
