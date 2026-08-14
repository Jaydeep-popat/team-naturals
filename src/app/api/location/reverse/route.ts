import { NextResponse } from 'next/server';
import { GeoapifyResponse } from '@/src/lib/location/types';
import { parseGeoapifyAddress } from '@/src/lib/location/parseGeoapifyAddress';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  // Server-side only — NEVER expose this key to the browser
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    console.error('[Reverse] GEOAPIFY_API_KEY is not configured.');
    return NextResponse.json(
      { error: 'Internal server configuration error' },
      { status: 500 },
    );
  }

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/reverse');
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('lang', 'en');
    url.searchParams.set('format', 'geojson');
    // type=amenity gives POI names; fallback chain covers roads/suburbs/cities
    url.searchParams.set('type', 'amenity');

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      // No cache — coordinates change on every request
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[Reverse] Geoapify returned ${res.status}`);
      return NextResponse.json(
        { error: 'Failed to retrieve location data from provider' },
        { status: 502 },
      );
    }

    const data: GeoapifyResponse = await res.json();

    if (!data.features || data.features.length === 0) {
      // No result from Geoapify — try without type restriction
      const fallbackUrl = new URL('https://api.geoapify.com/v1/geocode/reverse');
      fallbackUrl.searchParams.set('lat', lat);
      fallbackUrl.searchParams.set('lon', lon);
      fallbackUrl.searchParams.set('apiKey', apiKey);
      fallbackUrl.searchParams.set('lang', 'en');
      fallbackUrl.searchParams.set('format', 'geojson');

      const fallbackRes = await fetch(fallbackUrl.toString(), {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });

      if (!fallbackRes.ok) {
        return NextResponse.json(
          { error: 'We couldn\'t find the address right now. Please try again.' },
          { status: 502 },
        );
      }

      const fallbackData: GeoapifyResponse = await fallbackRes.json();

      if (!fallbackData.features || fallbackData.features.length === 0) {
        return NextResponse.json(
          { error: 'No address found for these coordinates.' },
          { status: 404 },
        );
      }

      const props = fallbackData.features[0].properties;
      const locationData = parseGeoapifyAddress(props, latitude, longitude);
      return NextResponse.json(locationData);
    }

    // Parse the best result into normalized LocationData — key is never exposed
    const props = data.features[0].properties;
    const locationData = parseGeoapifyAddress(props, latitude, longitude);

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('[Reverse] Request failed:', error);
    return NextResponse.json(
      { error: 'Failed to complete reverse geocoding request' },
      { status: 500 },
    );
  }
}
