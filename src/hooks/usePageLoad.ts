'use client';

import { useEffect, useState } from 'react';

// Keep track of the initial app load globally so we don't repeat long loading delays on client-side navigation.
let isAppInitialLoad = true;

/**
 * Simulates a short per-page data fetch so every route can show its own
 * skeleton state. Seed-data only — there is no real network request.
 */
export function usePageLoad(delay = 650): boolean {
  // If the app has already loaded, we don't want to enforce the long delay again.
  // For standard navigation, we can use a very short delay (or no delay).
  const [loading, setLoading] = useState(isAppInitialLoad);

  useEffect(() => {
    if (!isAppInitialLoad) {
      // Only do a tiny visual delay on subsequent navigations if needed, or 0.
      setLoading(true);
      const t = window.setTimeout(() => setLoading(false), Math.min(delay, 150));
      return () => window.clearTimeout(t);
    }

    setLoading(true);
    const t = window.setTimeout(() => {
      isAppInitialLoad = false;
      setLoading(false);
    }, delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  return loading;
}