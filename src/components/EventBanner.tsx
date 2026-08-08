'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export type EventBannerModel = {
  eventId: number;
  name: string;
  slug: string;
  bannerType: 'image' | 'custom' | 'gradient';
  bannerImage?: string | null;
  bannerMobileImage?: string | null;
  bannerOverlay?: boolean;
  bannerOverlayColor?: string | null;
  bannerOverlayOpacity?: number | null;
  
  backgroundColor?: string | null;
  gradientColors?: string[] | null;
  gradientType?: string | null;
  gradientDirection?: string | null;
  
  badgeText?: string | null;
  badgeBgColor?: string | null;
  badgeTextColor?: string | null;
  
  title?: string | null;
  subtitle?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  
  textColor?: string | null;
  subtitleColor?: string | null;
  alignment?: 'left' | 'center' | 'right' | string;
  verticalAlignment?: 'top' | 'center' | 'bottom' | string;
  
  ctaEnabled?: boolean;
  ctaText?: string | null;
  ctaDestination?: string | null;
  ctaBgColor?: string | null;
  ctaTextColor?: string | null;
  
  desktopHeight?: string | null;
  mobileHeight?: string | null;
};

export function EventBanner({ event, className = '' }: { event: EventBannerModel | null, className?: string }) {
  if (!event) return null;

  const type = event.bannerType || 'image';

  // Base styles for custom & gradient
  let bgStyle: React.CSSProperties = {};
  if (type === 'custom') {
    bgStyle.backgroundColor = event.backgroundColor || '#f5efe6'; // Cream default
  } else if (type === 'image' && !event.bannerImage) {
    bgStyle.backgroundColor = event.backgroundColor || '#f5efe6';
  } else if (type === 'gradient') {
    const colors = Array.isArray(event.gradientColors) && event.gradientColors.length > 0 
      ? event.gradientColors 
      : ['#1f3d2b', '#2a523a']; // Forest greens default
    
    const direction = event.gradientDirection || 'to right';
    const gType = event.gradientType || 'linear';
    
    if (gType === 'radial') {
      bgStyle.backgroundImage = `radial-gradient(circle, ${colors.join(', ')})`;
    } else {
      bgStyle.backgroundImage = `linear-gradient(${direction}, ${colors.join(', ')})`;
    }
  }

  const hAlign = event.alignment === 'left' ? 'items-start text-left' :
                 event.alignment === 'right' ? 'items-end text-right' : 'items-center text-center';
  
  const vAlign = event.verticalAlignment === 'top' ? 'justify-start' :
                 event.verticalAlignment === 'bottom' ? 'justify-end' : 'justify-center';

  const desktopH = event.desktopHeight || '400px';
  const mobileH = event.mobileHeight || '300px';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative w-full overflow-hidden rounded-3xl ${className}`}
      style={{
        '--mobile-h': mobileH,
        '--desktop-h': desktopH,
        ...bgStyle
      } as React.CSSProperties}
    >
      <div className="flex w-full min-h-[var(--mobile-h)] md:min-h-[var(--desktop-h)] relative">
        
        {/* IMAGE BACKGROUND */}
        {type === 'image' && event.bannerImage && (
          <>
            <picture className="absolute inset-0 z-0">
              {event.bannerMobileImage && (
                <source media="(max-width: 768px)" srcSet={event.bannerMobileImage} />
              )}
              <img 
                src={event.bannerImage} 
                alt={event.name} 
                className="w-full h-full object-cover"
              />
            </picture>
          </>
        )}

        {/* OVERLAY */}
        {(type === 'image' || event.bannerOverlay) && event.bannerOverlay && (
          <div 
            className="absolute inset-0 z-0" 
            style={{ 
              backgroundColor: event.bannerOverlayColor || '#000000',
              opacity: (event.bannerOverlayOpacity !== undefined && event.bannerOverlayOpacity !== null ? event.bannerOverlayOpacity : 30) / 100
            }} 
          />
        )}

        {/* CONTENT */}
        <div className={`relative z-10 w-full min-w-0 flex flex-col p-5 sm:p-8 md:p-12 lg:p-16 ${hAlign} ${vAlign}`}>
          
          {/* Badge */}
          {event.badgeText && (
            <span 
              className="inline-block px-3 py-1 mb-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full"
              style={{
                backgroundColor: event.badgeBgColor || '#c25e4a', // Terracotta
                color: event.badgeTextColor || '#ffffff'
              }}
            >
              {event.badgeText}
            </span>
          )}
          
          {/* Title */}
          {(event.title || event.name) && (
            <h2 
              className="mb-3 max-w-full break-words font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ color: event.textColor || (type === 'custom' ? '#1f3d2b' : '#ffffff') }}
            >
              {event.title || event.name}
            </h2>
          )}

          {/* Subtitle */}
          {event.subtitle && (
            <h3 
              className="mb-3 max-w-full break-words font-display text-lg font-medium leading-snug sm:text-2xl"
              style={{ color: event.subtitleColor || event.textColor || (type === 'custom' ? '#2a523a' : '#f5efe6') }}
            >
              {event.subtitle}
            </h3>
          )}

          {/* Description */}
          {(event.description || event.shortDescription) && (
            <p 
              className="mb-6 max-w-2xl break-words text-sm leading-relaxed opacity-90 sm:text-base md:text-lg"
              style={{ color: event.textColor || (type === 'custom' ? '#1f3d2b' : '#ffffff') }}
            >
              {event.shortDescription || event.description}
            </p>
          )}

          {/* CTA Button */}
          {event.ctaEnabled && (
            <Link 
              href={event.ctaDestination || `/offers/${event.slug}`}
              className="mt-2 inline-flex max-w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-105 sm:px-8 sm:py-3.5 sm:text-base"
              style={{
                backgroundColor: event.ctaBgColor || '#1f3d2b', // Forest
                color: event.ctaTextColor || '#ffffff'
              }}
            >
              {event.ctaText || 'Shop Now'}
            </Link>
          )}

        </div>
      </div>
    </motion.div>
  );
}
