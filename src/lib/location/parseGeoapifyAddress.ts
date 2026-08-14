import { GeoapifyProperties, LocationData } from './types';

/**
 * Converts a Geoapify reverse-geocoding `properties` object into the
 * application's normalized `LocationData`.
 *
 * This is the ONLY place where Geoapify's response is parsed. All components
 * (LocationPickerModal, UseCurrentLocationButton, checkout) consume the same
 * output via the /api/location/reverse route, which calls this function
 * server-side before returning clean LocationData to the browser.
 *
 * Parsing priorities
 * ──────────────────
 * Line 1:
 *   1. Named POI / building / place  (non-generic)
 *   2. House number + street
 *   3. Street alone
 *   4. Formatted address first token (last resort)
 *
 * Line 2:
 *   neighbourhood → suburb → city_district → district
 *   (deduplicated; nothing that already appears in Line 1 or City)
 *
 * City:   city → county → district
 * State:  state
 * PIN:    postcode
 * Country: country (defaults to "India" when missing)
 *
 * Nothing is invented. Fields are only set when real data is available.
 */
export function parseGeoapifyAddress(
  props: GeoapifyProperties,
  latitude: number,
  longitude: number,
): LocationData {
  // ── Deduplication helper ────────────────────────────────────────────────────
  const seen = new Set<string>();

  const addUnique = (arr: string[], part?: string | null): void => {
    const s = part?.trim();
    if (s && !seen.has(s.toLowerCase())) {
      arr.push(s);
      seen.add(s.toLowerCase());
    }
  };

  // ── Generic road/highway detector ───────────────────────────────────────────
  // Roads like "NH27", "SH9", "Unnamed Road" are not useful as primary address
  // components when a meaningful named place is available.
  const isGenericRoad = (s?: string | null): boolean => {
    if (!s) return true;
    return /^\s*$|^Unnamed Road$|^NH\s*\d+$|^SH\s*\d+$|^MDR\s*\d+$|^Highway$|^Road$|^Street$|^Marg$/i.test(
      s.trim(),
    );
  };

  // ── 1. Best named place (POI / building / amenity) ──────────────────────────
  // Geoapify puts POI/landmark names in `name` when result_type is
  // "amenity", "building", "tourism" etc. We use it only when it is
  // non-generic and not the same as the street.
  const candidateNames = [props.name, props.building];
  const placeName =
    candidateNames.find(
      (n) => n && !isGenericRoad(n) && n !== props.street,
    ) ?? null;

  // ── 2. Build Line 1 ─────────────────────────────────────────────────────────
  const line1Parts: string[] = [];

  if (placeName) {
    addUnique(line1Parts, placeName);
  }

  if (props.housenumber) {
    addUnique(line1Parts, props.housenumber);
  }

  // Add street: always include unless it is a generic highway AND a named
  // place already fills Line 1 (in that case demote to Line 2 support).
  if (props.street) {
    if (!isGenericRoad(props.street)) {
      // Specific named road — always include
      addUnique(line1Parts, props.street);
    } else if (!placeName) {
      // Generic road (e.g. NH27) but no better name — still use it
      addUnique(line1Parts, props.street);
    }
    // Generic road + named place already in line1 → skip (avoid "Mahendra Nagar Chowk, NH27")
  }

  let line1 = line1Parts.join(', ');

  // Absolute fallback — take the first meaningful token of `formatted`
  if (!line1 && props.formatted) {
    line1 = props.formatted.split(',')[0].trim();
    seen.add(line1.toLowerCase());
  }

  // ── 3. Build Line 2 (locality / neighbourhood) ──────────────────────────────
  // For Indian addresses the neighbourhood / suburb is the most useful
  // locality descriptor. Avoid duplicating what is already in Line 1 or City.
  const line2Parts: string[] = [];

  // When a generic road was used as Line 1 (no named place), add the road as
  // context in Line 2 if we have a neighbourhood to anchor it.
  if (
    props.street &&
    isGenericRoad(props.street) &&
    placeName &&
    line1Parts.length > 0
  ) {
    // Named place is line 1 — add road reference as "Near <road>"
    const roadRef = `Near ${props.street.trim()}`;
    addUnique(line2Parts, roadRef);
  }

  addUnique(line2Parts, props.neighbourhood);
  addUnique(line2Parts, props.suburb);
  addUnique(line2Parts, props.city_district);

  const line2 = line2Parts.join(', ');

  // ── 4. City ─────────────────────────────────────────────────────────────────
  // Prefer the actual city. Fall back to county or district only as last resort.
  const city: string =
    props.city || props.county || props.district || '';

  // ── 5. State ────────────────────────────────────────────────────────────────
  const state: string = props.state || '';

  // ── 6. Postal code ──────────────────────────────────────────────────────────
  const postalCode: string = props.postcode || '';

  // ── 7. Country ──────────────────────────────────────────────────────────────
  const country: string = props.country || 'India';

  return {
    line1,
    line2: line2 || undefined,
    city,
    state,
    postalCode,
    country,
    latitude,
    longitude,
  };
}
