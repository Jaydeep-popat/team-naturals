import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCcw } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'You are offline',
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-forest/5 text-forest rounded-full flex items-center justify-center mb-6">
        <WifiOff size={40} />
      </div>
      
      <h1 className="text-3xl font-display font-bold text-forest mb-4">
        You are offline
      </h1>
      
      <p className="text-forest/70 max-w-md mx-auto mb-8">
        It looks like you&apos;ve lost your internet connection. Some parts of the app are available offline, but you&apos;ll need to reconnect to browse new products or checkout.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-forest text-white px-8 py-3 rounded-full font-semibold hover:bg-forest-deep transition-all shadow-soft flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} />
          Try Again
        </Link>
        
        <Link
          href="/"
          className="bg-white text-forest border border-forest/20 px-8 py-3 rounded-full font-semibold hover:bg-forest/5 transition-all flex items-center justify-center"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
