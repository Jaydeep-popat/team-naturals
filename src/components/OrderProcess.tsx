'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SproutIcon, HammerIcon, PackageIcon, TruckIcon, SparklesIcon, LeafIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Reveal } from './Reveal';
import { heroImage, storyImage, products } from '../data/products';

// Magical floating particles component for the active card
const FloatingParticles = ({ color }: { color: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100, x: (i % 2 === 0 ? 10 : -10) * i }}
          animate={{
            opacity: [0, 0.4, 0],
            y: -100,
            x: (i % 2 === 0 ? -20 : 20) * i,
            rotate: [0, 180],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'linear',
          }}
          className={`absolute bottom-0 left-[${20 + i * 15}%] ${color}`}
          style={{ willChange: 'transform, opacity' }}
        >
          {i % 2 === 0 ? <SparklesIcon size={16} /> : <LeafIcon size={18} />}
        </motion.div>
      ))}
    </div>
  );
};

const steps = [
  {
    id: 1,
    title: 'Ethical Sourcing',
    description: 'We harvest only the finest, 100% organic ingredients from sustainable farms, ensuring a positive impact on the planet.',
    icon: SproutIcon,
    bg: 'bg-forest',
    hoverBg: 'bg-forest/80',
    color: 'text-cream',
    iconBg: 'bg-white/20',
    numberColor: 'text-white/30',
    image: heroImage,
  },
  {
    id: 2,
    title: 'Handcrafted',
    description: 'Each product is carefully formulated and cold-processed in small batches to preserve active natural nutrients.',
    icon: HammerIcon,
    bg: 'bg-gold',
    hoverBg: 'bg-gold/90',
    color: 'text-forest-deep',
    iconBg: 'bg-forest/20',
    numberColor: 'text-forest/30',
    image: products[0]?.images[0] || storyImage,
  },
  {
    id: 3,
    title: 'Eco-Packaging',
    description: 'We pack your order in zero-waste, biodegradable materials. Absolutely no plastics—just earth-friendly packaging.',
    icon: PackageIcon,
    bg: 'bg-terracotta',
    hoverBg: 'bg-terracotta/90',
    color: 'text-cream',
    iconBg: 'bg-white/20',
    numberColor: 'text-white/30',
    image: products[1]?.images[0] || heroImage,
  },
  {
    id: 4,
    title: 'Green Delivery',
    description: 'Your package is shipped through carbon-neutral delivery networks right to your door, completing our green cycle.',
    icon: TruckIcon,
    bg: 'bg-forest-soft',
    hoverBg: 'bg-forest-soft/90',
    color: 'text-cream',
    iconBg: 'bg-white/20',
    numberColor: 'text-white/30',
    image: storyImage,
  },
];

export function OrderProcess() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section aria-labelledby="process-heading" className="w-full bg-white py-20 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <Reveal className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-forest/60 font-bold">The Journey</p>
          <SectionHeading className="mt-3" id="process-heading">
            Our Eco-Friendly Process
          </SectionHeading>
        </Reveal>

        <div className="flex flex-col lg:flex-row h-[600px] lg:h-[500px] gap-2 lg:gap-4 overflow-hidden p-2">
          {steps.map((step) => {
            const isActive = activeStep === step.id;

            return (
              <div
                key={step.id}
                onMouseEnter={() => !isMobile && setActiveStep(step.id)}
                onClick={() => setActiveStep(step.id)}
                style={{
                  flex: isActive ? (isMobile ? 3 : 4) : 1,
                  boxShadow: isActive ? '0 20px 40px -10px rgba(31, 61, 43, 0.3)' : '0 4px 10px -5px rgba(31, 61, 43, 0.1)',
                }}
                className="relative flex flex-col justify-end overflow-hidden rounded-3xl cursor-pointer bg-forest transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group"
              >
                {/* Background Image with Parallax/Zoom */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div
                    className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                    style={{
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <img 
                      src={step.image} 
                      alt="" 
                      className={`h-full w-full object-cover transition-[filter] duration-700 ease-in-out ${isActive ? 'grayscale-0' : 'grayscale'}`} 
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Color Overlay (Blend Mode) - Removed mix-blend-multiply for performance, using standard opacity overlay */}
                <div className={`absolute inset-0 z-0 ${step.bg} opacity-70`} />
                <div className={`absolute inset-0 z-0 ${isActive ? step.hoverBg : step.bg} transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-90' : 'opacity-60'}`} />

                {/* Floating Particles - only render when active to save performance */}
                {isActive && <FloatingParticles color={step.color} />}

                {/* Large Background Graphic */}
                <div className={`absolute -right-10 -top-10 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${step.numberColor}`}
                     style={{ transform: isActive ? 'scale(1.2) rotate(-5deg)' : 'scale(1) rotate(0deg)' }}>
                  <step.icon size={300} />
                </div>

                <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
                  {/* Top section: Icon and Number */}
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${step.iconBg} ${step.color}`}>
                      <step.icon size={22} strokeWidth={1.8} />
                    </div>
                    <span className={`text-4xl font-display font-bold ${step.numberColor}`}>0{step.id}</span>
                  </div>

                  {/* Bottom section: Text content */}
                  <div className="mt-auto">
                    <h3 
                      className={`font-display text-2xl sm:text-3xl font-semibold whitespace-nowrap transition-all duration-700 ease-in-out ${step.color}`}
                      style={{ 
                        writingMode: isActive || isMobile ? 'horizontal-tb' : 'vertical-rl', 
                        transform: isActive || isMobile ? 'rotate(0deg)' : 'rotate(180deg)',
                      }}
                    >
                      {step.title}
                    </h3>

                    <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${isActive ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                      <p className={`max-w-sm text-[15px] leading-relaxed opacity-90 ${step.color}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Trigger HMR rebuild
