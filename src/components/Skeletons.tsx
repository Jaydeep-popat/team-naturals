'use client';

import React from 'react';

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-2xl ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-forest/8 bg-white p-3">
      <SkeletonBlock className="aspect-square w-full" />
      <div className="space-y-2 px-1 pb-1 pt-4">
        <SkeletonBlock className="h-3 w-16 rounded-full" />
        <SkeletonBlock className="h-4 w-4/5 rounded-full" />
        <SkeletonBlock className="h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8">
      <div className="space-y-4">
        <SkeletonBlock className="aspect-square w-full rounded-3xl" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-20 w-20 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4 pt-2">
        <SkeletonBlock className="h-3 w-24 rounded-full" />
        <SkeletonBlock className="h-8 w-3/4 rounded-full" />
        <SkeletonBlock className="h-4 w-40 rounded-full" />
        <SkeletonBlock className="h-6 w-24 rounded-full" />
        <SkeletonBlock className="h-20 w-full rounded-2xl" />
        <SkeletonBlock className="h-12 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-12 lg:px-8">
      <SkeletonBlock className="h-4 w-32 rounded-full" />
      <SkeletonBlock className="h-10 w-2/3 rounded-full" />
      <SkeletonBlock className="h-64 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}