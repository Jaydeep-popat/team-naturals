'use client';

import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.to ? (
              <Link href={item.to} className="transition-colors hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span className="text-forest" aria-current="page">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && (
              <ChevronRightIcon size={12} strokeWidth={1.8} className="text-muted/60" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}