import { NextResponse } from 'next/server';
import { GeoapifyResponse, GeoapifySearchResult } from '@/src/lib/location/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  // Server-side only — NEVER expose this key to the browser
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    console.error('[Search] GEOAPIFY_API_KEY is not configured.');
    return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 });
  }

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete');
    url.searchParams.set('text', q.trim());
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('limit', '7');
    url.searchParams.set('format', 'geojson');
    const searchLat = searchParams.get('lat');
    const searchLon = searchParams.get('lon');
    const bbox = searchParams.get('bbox'); // west,south,east,north

    // Filter results to India
    url.searchParams.set('filter', 'countrycode:in');
    
    let biasStr = 'countrycode:in';
    
    if (searchLat && searchLon) {
      biasStr = `proximity:${searchLon},${searchLat}|${biasStr}`;
    } else if (bbox) {
      biasStr = `rect:${bbox}|${biasStr}`;
    }
    
    url.searchParams.set('bias', biasStr);

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[Search] Geoapify returned ${res.status}`);
      return NextResponse.json([]);
    }

    const data: GeoapifyResponse = await res.json();

    if (!data.features || data.features.length === 0) {
      return NextResponse.json([]);
    }

    // Normalize to our stable GeoapifySearchResult shape
    const results: GeoapifySearchResult[] = data.features
      .filter((f) => f.properties?.lat !== undefined && f.properties?.lon !== undefined)
      .map((f) => {
        const p = f.properties;

        // Primary display name: POI name > street > formatted first token
        const primaryName =
          (p.name && p.name !== p.street ? p.name : null) ||
          p.street ||
          (p.formatted ? p.formatted.split(',')[0].trim() : '');

        // Secondary line: city, state, postcode
        const secondaryParts = [p.city || p.county, p.state, p.postcode]
          .filter(Boolean)
          .join(', ');

        return {
          place_id: p.place_id || `${p.lat}_${p.lon}`,
          lat: String(p.lat),
          lon: String(p.lon),
          display_name: primaryName || p.formatted || 'Unknown location',
          display_secondary: secondaryParts || undefined,
        };
      });

    return NextResponse.json(results);
  } catch (error) {
    console.error('[Search] Request failed:', error);
    return NextResponse.json([]);
  }
}
