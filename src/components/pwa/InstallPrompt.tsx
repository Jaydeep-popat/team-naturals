'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isPwaInstalled = localStorage.getItem('pwa-installed') === 'true';
    if (isStandalone || isPwaInstalled) return;

    // 2. iOS Detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    // @ts-ignore
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    // @ts-ignore
    const isIosStandalone = window.navigator.standalone === true;

    if (isIosDevice && isSafari && !isIosStandalone) {
      setIsIOS(true);
    }

    // 3. Android / Desktop Detection
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Separate effect for the custom event to avoid stale closures
  useEffect(() => {
    const handleForceShow = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(({ outcome }) => {
          if (outcome === 'accepted') {
            localStorage.setItem('pwa-installed', 'true');
          }
          setDeferredPrompt(null);
          setShowPrompt(false);
        });
      } else {
        setShowPrompt(true);
      }
    };
    
    window.addEventListener('show-pwa-install', handleForceShow);
    return () => {
      window.removeEventListener('show-pwa-install', handleForceShow);
    };
  }, [deferredPrompt, isIOS]);

  // Track page views and trigger prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't show if already dismissed recently (14 day cooldown)
    const dismissedAt = localStorage.getItem('pwa-install-dismissed-at');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 14) return;
    }

    // Increment page views
    const views = parseInt(sessionStorage.getItem('pwa-page-views') || '0', 10) + 1;
    sessionStorage.setItem('pwa-page-views', views.toString());

    // Only show if the browser has fired the event OR it's a valid iOS device
    if (deferredPrompt || isIOS) {
      // Show immediately on 2nd page view or later
      if (views >= 2) {
        setShowPrompt(true);
      } else if (views === 1) {
        // First visit: wait 30 seconds before showing
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 30000);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, deferredPrompt, isIOS]);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed-at', Date.now().toString());
  };

  const handleInstall = React.useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    }
    setShowPrompt(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  useEffect(() => {
    if (pathname?.startsWith('/checkout')) {
      toast.dismiss('pwa-install');
      return;
    }

    if (showPrompt) {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? 'animate-in slide-in-from-top-4 fade-in' : 'animate-out slide-out-to-top-4 fade-out'} 
              max-w-sm w-full bg-white shadow-xl border border-forest/10 rounded-2xl pointer-events-auto p-4 relative z-50`}
          >
            <button
              onClick={() => {
                handleDismiss();
                toast.dismiss(t.id);
              }}
              className="absolute top-2 right-2 p-1.5 text-forest/50 hover:text-forest hover:bg-forest/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex gap-4 items-center pr-6">
              <div className="w-14 h-14 bg-forest/5 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src="/appstore-images/android/launchericon-192x192.png" alt="App Icon" className="w-full h-full object-contain p-2" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-forest text-sm">Install Team Naturals</h3>
                <p className="text-xs text-forest/70 mt-0.5">Faster shopping, works offline</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {isIOS ? (
                <div className="flex-1 bg-forest/5 text-forest/80 text-xs px-3 py-2.5 rounded-xl border border-forest/10 flex items-center gap-2 leading-relaxed">
                  <Share size={14} className="flex-shrink-0" />
                  <span>Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (deferredPrompt) {
                      handleInstall();
                    }
                    toast.dismiss(t.id);
                  }}
                  className="flex-1 bg-forest text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-forest-deep transition-colors shadow-soft flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Install App
                </button>
              )}
            </div>
          </div>
        ),
        { id: 'pwa-install', duration: Infinity, position: 'top-center' }
      );
    } else {
      toast.dismiss('pwa-install');
    }
  }, [showPrompt, deferredPrompt, isIOS, pathname, handleInstall]);

  return null;
}

