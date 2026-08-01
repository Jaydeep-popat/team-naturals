'use client';

import React from 'react';
import { StarIcon } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, size = 14, className = '' }: StarRatingProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <StarIcon
            key={i}
            width={size}
            height={size}
            className={filled ? 'fill-gold text-gold' : 'text-forest/20'}
            strokeWidth={1.5}
          />
        );
      })}
    </span>
  );
}