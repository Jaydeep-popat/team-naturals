'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
// maplibre-gl is dynamically imported inside initMap to avoid Webpack/Next.js
// SSR issues where the static import resolves to undefined at runtime.
// The type-only import below is erased at build time; it only satisfies the
// TypeScript compiler so that `maplibregl.Map` resolves as a known namespace.
import type * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ArrowLeft,
  Crosshair,
  MapPin,
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import type { LocationData, GeoapifySearchResult } from '@/src/lib/location/types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LocationPickerModalProps {
  onClose: () => void;
  onConfirm: (data: LocationData) => void;
}

type MapStatus = 'loading' | 'ready' | 'error';
type UIState = 'idle' | 'gps_loading' | 'map_moving' | 'geocoding' | 'success' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

// OSM Raster tiles — dead-simple, always works, no API key, no CORS issues.
// We fall back from the vector CartoDb style to this when style fails.
const MAPTILER_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
// OSM raster style — works everywhere, no API key, fast in India
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster' as const,
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// CartoDB vector style — prettier but requires CDN font/sprite fetch (may fail in some regions)
const CARTO_VECTOR_STYLE = MAPTILER_STYLE;

// Default center is India; only used before GPS/search
const DEFAULT_CENTER: [number, number] = [72.8777, 19.076]; // Mumbai

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function LocationPickerModal({ onClose, onConfirm }: LocationPickerModalProps) {
  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const geocodeDebounce = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const isGpsMoving = useRef(false); // Prevents moveend during flyTo from double-geocoding

  // State
  const [mapStatus, setMapStatus] = useState<MapStatus>('loading');
  const [uiState, setUiState] = useState<UIState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoapifySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounce = useRef<NodeJS.Timeout | null>(null);

  // ── Reverse geocode ─────────────────────────────────────────────────────────
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    if (!isMounted.current) return;
    setUiState('geocoding');

    try {
      const res = await fetch(`/api/location/reverse?lat=${lat}&lon=${lng}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Geocoding failed');
      if (!data?.address) throw new Error('No address data in response');

      if (!isMounted.current) return;
      
      // The API now returns fully parsed/normalized LocationData
      setAddressData(data as LocationData);
      setUiState('success');
    } catch (err) {
      console.error('[LocationPicker] Reverse geocode failed:', err);
      if (!isMounted.current) return;
      setErrorMsg("Couldn't find an address here. Try moving the map slightly.");
      setUiState('error');
    }
  }, []);

  // ── Initialize map ──────────────────────────────────────────────────────────
  const initMap = useCallback(
    (useFallback = false) => {
      const container = mapContainerRef.current;
      if (!container) return;
      if (mapRef.current) return; // Already initialized

      // Wait one rAF so the DOM has painted and container has real dimensions
      requestAnimationFrame(async () => {
        if (!isMounted.current || !mapContainerRef.current) return;

        console.log('[LocationPicker] Initializing map, container dimensions:',
          container.offsetWidth, 'x', container.offsetHeight);

        // Dynamic import avoids Next.js/Webpack SSR issues with maplibre-gl's
        // CommonJS default export resolving to undefined on static import.
        const maplibregl = await import('maplibre-gl');

        if (!isMounted.current || !mapContainerRef.current) return;

        // Use OSM raster as it is extremely reliable and has no CORS/CDN issues.
        const style = OSM_STYLE;

        const MapClass = maplibregl.Map ?? (maplibregl as any).default?.Map;
        if (!MapClass) {
          console.error('[LocationPicker] maplibre-gl Map class not found');
          setMapStatus('error');
          return;
        }

        const map = new MapClass({
          container: mapContainerRef.current,
          style,
          center: DEFAULT_CENTER,
          zoom: 12,
          attributionControl: false,
        });

        mapRef.current = map;

        // ── Style / load errors ─────────────────────────────────────────────
        map.on('error', (e) => {
          console.error('[LocationPicker] MapLibre error:', e.error);
          if (isMounted.current) setMapStatus('error');
        });

        // ── Map loaded ──────────────────────────────────────────────────────
        map.on('load', () => {
          if (!isMounted.current) return;
          console.log('[LocationPicker] Map loaded successfully');

          // Force resize so the map fills the container properly, slightly delayed to guarantee DOM paint
          setTimeout(() => {
            if (mapRef.current) {
               mapRef.current.resize();
            }
          }, 100);
          
          setMapStatus('ready');

          // Auto-request GPS on first load
          requestCurrentLocation();
        });

        // ── Track map movement ──────────────────────────────────────────────
        map.on('dragstart', () => {
          if (!isMounted.current) return;
          if (geocodeDebounce.current) clearTimeout(geocodeDebounce.current);
          setUiState('map_moving');
        });

        map.on('moveend', () => {
          if (!isMounted.current) return;
          if (isGpsMoving.current) return; // GPS flyTo in progress — handled separately

          const c = map.getCenter();
          if (geocodeDebounce.current) clearTimeout(geocodeDebounce.current);
          geocodeDebounce.current = setTimeout(() => {
            reverseGeocode(c.lat, c.lng);
          }, 600);
        });

        // ── ResizeObserver ensures map fills container on layout changes ────
        const resizeObserver = new ResizeObserver(() => {
          if (mapRef.current) {
            mapRef.current.resize();
          }
        });
        resizeObserver.observe(mapContainerRef.current);

        // Also listen to window resize
        const onWindowResize = () => {
          if (mapRef.current) mapRef.current.resize();
        };
        window.addEventListener('resize', onWindowResize);

        // Store cleanup in the map instance so we can access it on unmount
        (map as any)._cleanupFns = () => {
          resizeObserver.disconnect();
          window.removeEventListener('resize', onWindowResize);
        };
      });
    },
    [reverseGeocode],
  );

  // ── Mount / unmount ─────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    initMap(false);

    return () => {
      isMounted.current = false;
      if (geocodeDebounce.current) clearTimeout(geocodeDebounce.current);
      if (searchDebounce.current) clearTimeout(searchDebounce.current);

      const map = mapRef.current;
      if (map) {
        (map as any)._cleanupFns?.();
        map.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Retry if map failed ─────────────────────────────────────────────────────
  const retryMap = () => {
    if (mapRef.current) {
      (mapRef.current as any)._cleanupFns?.();
      mapRef.current.remove();
      mapRef.current = null;
    }
    setMapStatus('loading');
    initMap(false);
  };

  // ── Current Location ────────────────────────────────────────────────────────
  const requestCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setUiState('error');
      return;
    }

    setUiState('gps_loading');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isMounted.current) return;
        const { latitude, longitude } = pos.coords;

        const map = mapRef.current;
        if (map) {
          isGpsMoving.current = true;

          map.flyTo({ center: [longitude, latitude], zoom: 17, essential: true });

          // Once the flyTo animation ends, geocode that position
          map.once('moveend', () => {
            isGpsMoving.current = false;
            if (!isMounted.current) return;
            reverseGeocode(latitude, longitude);
          });
        } else {
          // Map not yet ready — just geocode
          reverseGeocode(latitude, longitude);
        }
      },
      (err) => {
        if (!isMounted.current) return;
        console.error('[LocationPicker] GPS error:', err);

        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setErrorMsg('Location permission denied. Drag the map to your delivery address.');
        } else if (err.code === GeolocationPositionError.TIMEOUT) {
          setErrorMsg('Location request timed out. Drag the map to your delivery address.');
        } else {
          setErrorMsg("Couldn't detect your location. Drag the map to your delivery address.");
        }
        setUiState('error');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, [reverseGeocode]);

  // ── Location search ─────────────────────────────────────────────────────────
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    searchDebounce.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Search failed');
        const results: GeoapifySearchResult[] = await res.json();
        if (isMounted.current) setSearchResults(results.slice(0, 5));
      } catch {
        if (isMounted.current) setSearchResults([]);
      } finally {
        if (isMounted.current) setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectSearchResult = (result: GeoapifySearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSearchQuery(result.display_name.split(',')[0]);
    setSearchResults([]);

    const map = mapRef.current;
    if (map) {
      isGpsMoving.current = true;
      map.flyTo({ center: [lng, lat], zoom: 17, essential: true });
      map.once('moveend', () => {
        isGpsMoving.current = false;
        if (!isMounted.current) return;
        reverseGeocode(lat, lng);
      });
    } else {
      reverseGeocode(lat, lng);
    }
  };

  // ── Panel label based on state ─────────────────────────────────────────────
  const hasLocation = uiState === 'success' && addressData;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white font-sans overflow-hidden">

      {/* ── Global Header ─────────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 flex items-center px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm z-30">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-800 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-[17px] font-semibold">Add new address</span>
        </button>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

        {/* ── MAP SECTION ───────────────────────────────────────────────── */}
        <div
          className="relative flex-1 bg-gray-200 z-10"
          style={{ minHeight: '55vh' }}
        >
          {/* The map renders here — absolutely fills parent */}
          <div
            ref={mapContainerRef}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />

          {/* ── Map loading overlay ──────────────────────────────────────── */}
          {mapStatus === 'loading' && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-20 pointer-events-none">
              <Loader2 size={32} className="animate-spin text-blue-500 mb-3" />
              <p className="text-gray-600 font-medium">Loading map…</p>
            </div>
          )}

          {/* ── Map error overlay ────────────────────────────────────────── */}
          {mapStatus === 'error' && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center z-20 gap-3">
              <AlertTriangle size={36} className="text-orange-500" />
              <p className="text-gray-700 font-semibold">Map couldn't be loaded</p>
              <button
                onClick={retryMap}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          )}

          {/* ── Floating Search Bar ─────────────────────────────────────── */}
          <div className="absolute top-3 left-3 right-3 lg:left-4 lg:right-auto lg:w-[380px] z-20">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center px-3.5 py-3">
                <Search size={18} className="text-gray-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by area, name, street…"
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-700 placeholder-gray-400"
                />
                {isSearching && <Loader2 size={16} className="animate-spin text-gray-400 ml-2" />}
              </div>

              {/* Search Dropdown */}
              {searchResults.length > 0 && (
                <ul className="border-t border-gray-100 max-h-56 overflow-y-auto rounded-b-xl">
                  {searchResults.map((r) => (
                    <li key={r.place_id}>
                      <button
                        onClick={() => handleSelectSearchResult(r)}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-[13px] text-gray-800 flex items-start gap-2 border-b border-gray-50 last:border-b-0"
                      >
                        <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <span className="line-clamp-1 font-medium">{r.display_name}</span>
                          {r.display_secondary && (
                            <span className="line-clamp-1 text-[11px] text-gray-500">{r.display_secondary}</span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Fixed Center Pin ─────────────────────────────────────────── */}
          {mapStatus === 'ready' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              <div className="relative flex flex-col items-center" style={{ marginTop: '-44px' }}>
                <div className="bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap mb-1 opacity-90">
                  Move map to pin location
                </div>
                {/* Tooltip arrow */}
                <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-900 mb-1.5" />
                {/* Pin */}
                <div className="relative">
                  <MapPin
                    size={40}
                    className={`drop-shadow-lg transition-colors ${
                      uiState === 'map_moving' ? 'text-blue-600' : 'text-gray-900'
                    }`}
                    fill={uiState === 'map_moving' ? '#DBEAFE' : 'white'}
                  />
                  <div className="absolute top-[7px] left-[11px] w-[18px] h-[18px] bg-blue-500 rounded-full border-2 border-white shadow" />
                </div>
              </div>
            </div>
          )}

          {/* ── GPS Button (bottom center of map) ───────────────────────── */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={requestCurrentLocation}
              disabled={uiState === 'gps_loading' || uiState === 'geocoding'}
              className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-[14px] border border-gray-100"
            >
              {uiState === 'gps_loading' ? (
                <><Loader2 size={17} className="animate-spin" /> Locating you…</>
              ) : (
                <><Crosshair size={17} /> Use my current location</>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ───────────────────────────────────────────────── */}
        <aside className="w-full lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col bg-white border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto z-30 shadow-[0_-8px_24px_rgba(0,0,0,0.07)] lg:shadow-[-8px_0_24px_rgba(0,0,0,0.05)]">
          <div className="p-6 flex flex-col h-full">

            {/* Panel Header */}
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              {hasLocation ? 'Deliver To' : 'Where should we deliver?'}
            </p>

            {!hasLocation && (
              <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
                Use your current location or search for an area, street, or landmark.
              </p>
            )}

            {/* Use current location CTA (inside panel, prominent) */}
            <button
              onClick={requestCurrentLocation}
              disabled={uiState === 'gps_loading'}
              className="flex items-center gap-3 w-full p-4 mb-5 rounded-2xl border border-blue-100 bg-blue-50/60 hover:bg-blue-50 text-blue-700 transition-all text-left active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uiState === 'gps_loading'
                ? <Loader2 size={20} className="animate-spin shrink-0" />
                : <Crosshair size={20} className="shrink-0" />
              }
              <div>
                <div className="font-semibold text-[15px] leading-tight">
                  {uiState === 'gps_loading' ? 'Locating you…' : 'Use my current location'}
                </div>
                <div className="text-[12px] text-blue-500 mt-0.5">
                  Automatically detect your address
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 font-medium">OR MOVE THE MAP</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Address Preview */}
            <div className="flex-1">
              {(uiState === 'map_moving' || uiState === 'geocoding') && (
                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-[13px]">
                    <Loader2 size={14} className="animate-spin" />
                    {uiState === 'map_moving' ? 'Finding address…' : 'Updating address…'}
                  </div>
                </div>
              )}

              {uiState === 'error' && errorMsg && (
                <div className="border border-orange-100 bg-orange-50 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-semibold text-orange-800">Location issue</p>
                    <p className="text-[13px] text-orange-700 mt-1 leading-snug">{errorMsg}</p>
                  </div>
                </div>
              )}

              {uiState === 'success' && addressData && (
                <div className="border border-gray-200 rounded-2xl p-4 bg-white relative shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-50 p-2 rounded-full shrink-0 mt-0.5">
                      <CheckCircle2 size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0 pr-12">
                      <p className="text-[11px] font-bold text-green-700 uppercase tracking-wide mb-1">
                        Location detected
                      </p>
                      <p className="font-bold text-[16px] text-gray-900 leading-snug mb-0.5 truncate">
                        {addressData.line1 || addressData.city || 'Unnamed location'}
                      </p>
                      {addressData.line2 && (
                        <p className="text-[13px] text-gray-600 leading-snug">{addressData.line2}</p>
                      )}
                      <p className="text-[13px] text-gray-600 leading-snug">
                        {[addressData.city, addressData.state].filter(Boolean).join(', ')}
                      </p>
                      {addressData.postalCode && (
                        <p className="text-[13px] font-medium text-gray-700 mt-0.5">{addressData.postalCode}</p>
                      )}
                      {!addressData.line1?.includes(addressData.line2 || '') && (
                        <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                          Please review — GPS accuracy may vary slightly.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {uiState === 'idle' && !addressData && (
                <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                  <MapPin size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-[14px] text-gray-400">
                    Move the map pin to your delivery location
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <div className="pt-5">
              <button
                onClick={() => addressData && onConfirm(addressData)}
                disabled={uiState !== 'success' || !addressData}
                className="w-full py-4 rounded-xl font-bold text-white bg-[#1D4ED8] hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-[16px] shadow-sm"
              >
                {hasLocation ? 'Add address details' : 'Select a location first'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

