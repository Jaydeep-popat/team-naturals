'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FlyEventDetail {
  id: number;
  imgUrl: string;
  startX: number;
  startY: number;
}

export function triggerFlyToCart(event: React.MouseEvent, imgUrl: string) {
  const customEvent = new CustomEvent('fly_to_cart', {
    detail: {
      id: Date.now() + Math.random(),
      imgUrl,
      startX: event.clientX,
      startY: event.clientY,
    },
  });
  window.dispatchEvent(customEvent);
}

export function FlyToCartManager() {
  const [items, setItems] = useState<FlyEventDetail[]>([]);

  useEffect(() => {
    const handleFly = (e: Event) => {
      const customEvent = e as CustomEvent<FlyEventDetail>;
      setItems((prev) => [...prev, customEvent.detail]);

      // Remove after animation completes (800ms)
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== customEvent.detail.id));
      }, 800);
    };

    window.addEventListener('fly_to_cart', handleFly);
    return () => window.removeEventListener('fly_to_cart', handleFly);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]">
      <AnimatePresence>
        {items.map((item) => (
          <motion.img
            key={item.id}
            src={item.imgUrl}
            initial={{ 
              x: item.startX - 25, 
              y: item.startY - 25, 
              scale: 1.2,
              opacity: 1,
              rotate: 0
            }}
            animate={{ 
              x: window.innerWidth / 2 - 20, // Move to center bottom (cart pill)
              y: window.innerHeight - 80, 
              scale: 0.1,
              opacity: 0,
              rotate: 120
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 180,
              damping: 20,
              mass: 0.8
            }}
            className="fixed h-[50px] w-[50px] rounded-full object-cover shadow-xl border-2 border-forest ring-4 ring-white/50"
            alt=""
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
