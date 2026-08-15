'use client';

import React from 'react';
import { InstagramIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { motion } from 'framer-motion';
import { Reveal, staggerContainer, staggerItem } from './Reveal';
import { heroImage, storyImage, products } from '../data/products';
import { SOCIAL_LINKS } from '@/src/lib/site-contact';

export function InstagramFeed() {
  // Grab a few product images to mix with hero/story for the mock grid
  const feedImages = [
    heroImage,
    products[0]?.images[0] || heroImage,
    storyImage,
    products[1]?.images[0] || heroImage,
    products[2]?.images[0] || storyImage,
    products[3]?.images[0] || heroImage,
  ];

  return (
    <section aria-labelledby="social-heading" className="w-full">
      <Reveal className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-mist text-forest">
          <InstagramIcon size={20} strokeWidth={1.8} />
        </span>
        <SectionHeading id="social-heading" className="mt-4">
          Join The Community
        </SectionHeading>
        <p className="mt-2 text-sm text-muted">
          Follow{' '}
          <a
            href={SOCIAL_LINKS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-forest hover:underline"
          >
            {SOCIAL_LINKS.instagram.handle}
          </a>{' '}
          for skincare tips and behind-the-scenes.
        </p>
      </Reveal>

      {/* Grid of images */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6"
      >
        {feedImages.map((src, i) => (
          <motion.a
            key={i}
            variants={staggerItem}
            href={SOCIAL_LINKS.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-2xl bg-cream shadow-soft"
          >
            <img
              src={src}
              alt={`Instagram post ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Hover overlay with icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-forest/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <InstagramIcon size={24} className="text-white" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
