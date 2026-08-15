'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function FirstTimeLoginPrompt() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;
    
    // Wait for the authentication check to finish
    if (isLoading) return;

    const hasSeenPrompt = localStorage.getItem('hasSeenFirstTimeLoginPrompt');
    
    // If they are not logged in and have never seen the prompt before
    if (!isAuthenticated && !hasSeenPrompt) {
      // Wait a short moment before showing it so it's not too jarring
      const timer = setTimeout(() => {
        setShowPrompt(true);
        // Immediately mark it as seen so it never shows again on subsequent visits/refreshes
        localStorage.setItem('hasSeenFirstTimeLoginPrompt', 'true');
      }, 2500); // 2.5 second delay
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  return <AuthModal open={showPrompt} onClose={() => setShowPrompt(false)} />;
}
