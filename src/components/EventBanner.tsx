'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export type EventBannerModel = {
  eventId: number;
  name: string;
  slug: string;
  bannerType: 'image' | 'custom' | 'gradient' | 'pattern';
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

const PATTERNS: Record<string, string> = {
  independence: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3Cg fill='%23138808' fill-opacity='0.15'%3E%3Cpath d='M21 19v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 30v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM51 19v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 30v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  trees: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5l10 15h-5v10h-10v-10h-5l10-15z' fill='%232a523a' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  diwali: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 5c0 0-5 10-5 15s5 15 5 15 5-10 5-15-5-15-5-15z' fill='%23C9A268' fill-opacity='0.15'/%3E%3C/svg%3E")`,
  stars: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='%23000000' fill-opacity='0.05'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0 10 10 T20 10' fill='none' stroke='%23000000' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
  zigzag: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10l5-5 5 5 5-5 5 5v2l-5-5-5 5-5-5-5 5z' fill='%23000000' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  hexagons: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 33L0 25V8l14-8 14 8v17l-14 8zM14 17V33M0 25L14 17 28 25' fill='none' stroke='%23000000' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
  confetti: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' fill='%23e63946' fill-opacity='0.2'/%3E%3Ccircle cx='10' cy='10' r='4' fill='%23457b9d' fill-opacity='0.2'/%3E%3Cpath d='M50 40l5 8h-10z' fill='%232a9d8f' fill-opacity='0.2'/%3E%3C/g%3E%3C/svg%3E")`,
  stripes: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1 11L11 -1M-1 1L1 -1M9 11L11 9' stroke='%23000000' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`
};

  // Base styles for custom & gradient
  let bgStyle: React.CSSProperties = {};
  if (type === 'custom') {
    bgStyle.backgroundColor = event.backgroundColor || '#f5efe6'; // Cream default
  } else if (type === 'pattern') {
    bgStyle.backgroundColor = event.backgroundColor || '#f5efe6';
    const patternType = event.gradientType || 'dots';
    bgStyle.backgroundImage = PATTERNS[patternType] || PATTERNS.dots;
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
