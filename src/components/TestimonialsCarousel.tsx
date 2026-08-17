'use client';

import React from 'react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { motion } from 'framer-motion';
import { QuoteIcon, CheckCircle2Icon } from 'lucide-react';
import { StarRating } from './StarRating';

const reviews = [
  {
    id: 'r1',
    category: 'Sensitive Skin',
    rating: 5,
    quote:
      'I have really reactive skin and break out with almost every soap I try. Been using the neem one for about a month now, no irritation at all. Actually calmed down some redness I had on my arms too.',
    name: 'Priya S.',
    location: 'Ahmedabad',
    initials: 'PS',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    accentColor: '#10b981',
  },
  {
    id: 'r2',
    category: 'De-Tanning',
    rating: 5,
    quote:
      'Was skeptical about the de-tan claim tbh, but after 3 weeks of daily use my arms are visibly lighter than before summer. Not overnight magic, but it works if you stick with it.',
    name: 'Rohit M.',
    location: 'Rajkot',
    initials: 'RM',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
    accentColor: '#d97706',
  },
  {
    id: 'r3',
    category: 'Daily Use / Gentle',
    rating: 4,
    quote:
      'Switched my whole family to this for everyday use. My kids don\'t complain about it stinging their eyes like their old soap did. Lathers well too, doesn\'t dry out skin.',
    name: 'Anjali D.',
    location: 'Surat',
    initials: 'AD',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    accentColor: '#2563eb',
  },
  {
    id: 'r4',
    category: 'No Palm Oil',
    rating: 5,
    quote:
      'Been trying to move away from products with palm oil for a while now and this was one of the few soap brands I could actually find that\'s upfront about it. Coffee soap smells amazing btw.',
    name: 'Karan V.',
    location: 'Vadodara',
    initials: 'KV',
    badgeColor: 'bg-stone-100 text-stone-700 border-stone-200/60',
    accentColor: '#78716c',
  },
  {
    id: 'r5',
    category: 'Face Wash',
    rating: 4,
    quote:
      'Good for oily skin, doesn\'t leave that tight feeling after washing. Only reason I\'m not giving 5 stars is the tube could be bigger for the price, but the product itself is solid.',
    name: 'Meera J.',
    location: 'Rajkot',
    initials: 'MJ',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
    accentColor: '#e11d48',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TestimonialsCarousel() {
  return (
    <section aria-labelledby="reviews-heading" className="w-full">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
          <CheckCircle2Icon size={13} className="text-terracotta" />
          Real Customer Feedback
        </span>
        <SectionHeading className="mt-3" id="reviews-heading">
          What People Say About Team Naturals
        </SectionHeading>
        <p className="mt-2 text-xs text-muted sm:text-sm">
          Honest reviews from customers across Gujarat using our handmade soaps and face wash daily.
        </p>
      </div>

      {/* Grid of 5 Elegant Review Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-forest-mist/70 bg-white p-7 shadow-[0_8px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-forest/25 hover:shadow-[0_18px_35px_rgba(0,0,0,0.08)]"
          >
            {/* Background Decorative Quote */}
            <QuoteIcon
              size={54}
              strokeWidth={0.6}
              className="pointer-events-none absolute right-4 top-4 text-forest/5 transition-transform group-hover:scale-110 group-hover:text-forest/10"
              aria-hidden="true"
            />

            <div>
              {/* Category Pill + Star Rating */}
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${rev.badgeColor}`}
                >
                  {rev.category}
                </span>
                <StarRating rating={rev.rating} size={14} />
              </div>

              {/* Review Text */}
              <p className="mt-5 text-sm leading-relaxed font-medium text-forest/90">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            {/* Customer Details */}
            <div className="mt-7 flex items-center gap-3.5 pt-4 border-t border-forest/6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: rev.accentColor }}
              >
                {rev.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-forest">{rev.name}</p>
                <p className="text-xs font-medium text-muted">{rev.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
