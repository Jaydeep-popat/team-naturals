// ─────────────────────────────────────────────────────────────────────────────
// Application location data — provider-agnostic, consumed by checkout + UI
// ─────────────────────────────────────────────────────────────────────────────

export interface LocationData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  
  // Extended Geoapify Metadata
  name?: string;
  street?: string;
  houseNumber?: string;
  district?: string;
  suburb?: string;
  neighbourhood?: string;
  resultType?: string;
  confidence?: number;
  placeId?: string;
  formatted?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geoapify reverse-geocoding / forward-geocoding response types
// Reference: https://apidocs.geoapify.com/docs/geocoding/reverse-geocoding/
// ─────────────────────────────────────────────────────────────────────────────

/** Properties object inside a Geoapify GeoJSON feature */
export interface GeoapifyProperties {
  /** Named place / POI / building (e.g. "Mahendra Nagar Chowk") */
  name?: string;
  /** House or plot number */
  housenumber?: string;
  /** Street / road name */
  street?: string;
  /** Building name */
  building?: string;
  /** Sub-locality / neighbourhood */
  suburb?: string;
  /** Neighbourhood */
  neighbourhood?: string;
  /** City district */
  city_district?: string;
  /** District / taluka */
  district?: string;
  /** City */
  city?: string;
  /** County / tehsil */
  county?: string;
  /** State / province */
  state?: string;
  /** Postcode / PIN */
  postcode?: string;
  /** Country name */
  country?: string;
  /** ISO 3166-1 alpha-2 country code */
  country_code?: string;
  /** Full formatted address string */
  formatted?: string;
  /** Latitude of the result */
  lat?: number;
  /** Longitude of the result */
  lon?: number;
  /** Unique place identifier */
  place_id?: string;
  /** Result type (e.g. "street", "building", "amenity") */
  result_type?: string;
  /** POI category */
  category?: string;
  /** Confidence score (0–1) */
  rank?: { confidence?: number };
}

/** A single GeoJSON feature in a Geoapify response */
export interface GeoapifyFeature {
  type: 'Feature';
  properties: GeoapifyProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  };
  bbox?: [number, number, number, number];
}

/** Top-level Geoapify GeoJSON FeatureCollection */
export interface GeoapifyResponse {
  type: 'FeatureCollection';
  features: GeoapifyFeature[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalised search result — returned by /api/location/search
// Shape is stable regardless of underlying provider
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoapifySearchResult {
  /** Stable place identifier */
  place_id: string;
  /** Latitude as string (for compatibility with map.flyTo) */
  lat: string;
  /** Longitude as string */
  lon: string;
  /** Human-readable name for the primary line */
  display_name: string;
  /** Supporting locality text (city, state, postcode) */
  display_secondary?: string;
}
