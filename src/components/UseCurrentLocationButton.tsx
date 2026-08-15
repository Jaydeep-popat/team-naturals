'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { LocationData } from '@/src/lib/location/types';

export type { LocationData };

interface Props {
  onLocationFound: (data: LocationData) => void;
  className?: string;
}

type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

export function UseCurrentLocationButton({ onLocationFound, className = '' }: Props) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !('geolocation' in navigator)) {
      setIsSupported(false);
    }
  }, []);

  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) return;
    
    setStatus('loading');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/location/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.error || `Failed to fetch location`);
          }

          if (data && !data.error) {
            onLocationFound(data as LocationData);
            setStatus('success');
            
            // Keep the success state visible for 3 seconds then gracefully revert
            setTimeout(() => {
              setStatus('idle');
            }, 3000);
          } else {
            console.error("Geocoding returned an error or empty data:", data);
            setErrorMsg("We couldn't find your address right now.");
            setStatus('error');
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setErrorMsg("We couldn't find your address right now.");
          setStatus('error');
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg("Location access was denied. Please enter your address manually.");
        } else if (error.code === error.TIMEOUT) {
          setErrorMsg("Location request timed out. Please try again.");
        } else {
          setErrorMsg("We couldn't detect your location.");
        }
        setStatus('error');
      },
      // Using a balanced timeout (10s) and maxAge (5 mins) for quick but accurate location
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  if (!isSupported) return null;

  return (
    <div className={`flex flex-col items-start w-full ${className}`}>
      {status === 'success' ? (
        <div className="flex items-center gap-3 rounded-[16px] bg-green-50 px-5 py-4 text-[14px] font-medium text-green-700 border border-green-200 transition-all duration-300 w-full sm:w-auto shadow-sm">
          <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
          <span>Location detected. Address filled successfully.</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={status === 'loading'}
          className="group flex items-center gap-4 rounded-[16px] bg-white px-5 py-3.5 text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm w-full sm:w-auto"
        >
          {status === 'loading' ? (
            <Loader2 size={18} className="animate-spin text-gray-400 flex-shrink-0" />
          ) : (
            <MapPin size={18} className="text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
          )}
          
          <div className="flex flex-col items-start text-left">
            <span>{status === 'loading' ? "Detecting your location..." : "Use Current Location"}</span>
            {status !== 'loading' && (
              <span className="text-[13px] font-normal text-gray-500 group-hover:text-gray-700 transition-colors mt-0.5">
                Automatically detect your address
              </span>
            )}
          </div>
        </button>
      )}
      
      {status === 'error' && errorMsg && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1 w-full sm:w-auto">
          <p className="text-[14px] font-medium text-red-600">
            {errorMsg}
          </p>
          <button 
            type="button" 
            onClick={() => setStatus('idle')}
            className="mt-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
