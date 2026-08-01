'use client';

import { useEffect, useState } from 'react';

/**
 * Simulates a short per-page data fetch so every route can show its own
 * skeleton state. Seed-data only — there is no real network request.
 */
export function usePageLoad(delay = 650): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return loading;
}