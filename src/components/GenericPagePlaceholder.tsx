'use client';

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/src/components/Breadcrumb';

export default function GenericPage({ title }: { title: string }) {
  return (
    <div className="w-full bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <h1 className="font-display text-4xl font-extrabold text-forest sm:text-5xl">{title}</h1>
        <div className="mt-4 flex justify-center">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: title }]} />
        </div>
        <div className="mt-10 rounded-3xl border border-forest/10 bg-cream/30 p-8 text-forest/80 font-medium sm:p-12">
          <p className="text-base sm:text-lg">
            This page is currently being updated with our latest policies and information. Please check back soon or reach out directly via our contact page.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="inline-flex rounded-full bg-forest px-8 py-3 text-sm font-bold text-cream transition-colors hover:bg-forest-deep">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
