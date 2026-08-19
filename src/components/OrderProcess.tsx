'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SproutIcon, HammerIcon, PackageIcon, TruckIcon, ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Reveal } from './Reveal';
import { heroImage, storyImage, products } from '../data/products';

const steps = [
  {
    id: 1,
    num: '01',
    title: 'Ethical Sourcing',
    subtitle: '100% Organic & Wildcrafted',
    description: 'We harvest only certified organic botanicals and cold-pressed plant oils from sustainable Indian farms, with zero synthetic additives.',
    icon: SproutIcon,
    image: heroImage,
    accent: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 2,
    num: '02',
    title: 'Cold-Process Handcraft',
    subtitle: 'Small-Batch Precision',
    description: 'Every soap bar is hand-poured, slow-cured for 6 weeks, and cold-processed to preserve active skin-nourishing nutrients.',
    icon: HammerIcon,
    image: products[0]?.images[0] || storyImage,
    accent: '#d97706',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 3,
    num: '03',
    title: 'Zero-Plastic Packaging',
    subtitle: 'Biodegradable & Recyclable',
    description: 'Wrapped strictly in plastic-free butter paper and recyclable paper boxes. No bubble wrap, plastic tapes, or synthetic liners.',
    icon: PackageIcon,
    image: products[1]?.images[0] || heroImage,
    accent: '#e11d48',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 4,
    num: '04',
    title: 'Carbon-Neutral Delivery',
    subtitle: 'Direct Farmhouse to Doorstep',
    description: 'Dispatched directly from our Morbi farmhouse workshop through green delivery channels right to your doorstep.',
    icon: TruckIcon,
    image: storyImage,
    accent: '#2563eb',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
];

export function OrderProcess() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <section aria-labelledby="process-heading" className="w-full bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        {/* Header */}
        <Reveal className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
            <CheckCircle2Icon size={13} className="text-terracotta" />
            Sustainable &amp; Conscious
          </span>
          <SectionHeading className="mt-3" id="process-heading">
            Our Eco-Friendly Process
          </SectionHeading>
          <p className="mt-2 text-xs text-muted sm:text-sm">
            From raw ethical harvest to plastic-free doorstep delivery.
          </p>
        </Reveal>

        {/* 2-Panel Showcase Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Panel: Interactive Step Tabs (5 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-forest/30 bg-forest text-cream shadow-soft ring-1 ring-forest/20'
                      : 'border-forest/8 bg-white text-forest hover:border-forest/20 hover:bg-cream/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
                        isActive ? 'bg-white/15 text-cream' : 'bg-forest-mist text-forest'
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isActive ? 'text-terracotta-soft' : 'text-forest/40'}`}>
                          {step.num}
                        </span>
                        <h3 className={`font-display text-base font-bold sm:text-lg ${isActive ? 'text-cream' : 'text-forest'}`}>
                          {step.title}
                        </h3>
                      </div>
                      <p className={`text-xs font-medium ${isActive ? 'text-cream/70' : 'text-muted'}`}>
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRightIcon
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${
                      isActive ? 'translate-x-0 opacity-100 text-terracotta-soft' : '-translate-x-2 opacity-0 text-forest/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Panel: Highlighting Active Feature Card (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-lift"
              >
                {/* Visual Image Banner with Subtle Zoom */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                  
                  {/* Top Badge */}
                  <span className={`absolute left-6 top-6 rounded-full border px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${current.badgeBg}`}>
                    {current.subtitle}
                  </span>

                  {/* Title overlay over image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-cream/70">
                      Step {current.num}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-cream sm:text-3xl">
                      {current.title}
                    </h3>
                  </div>
                </div>

                {/* Description & Detail Footer */}
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-medium leading-relaxed text-forest/90 sm:text-base">
                    {current.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-forest/8 pt-4">
                    <span className="text-xs font-bold text-forest/60 uppercase tracking-wider">
                      Crafted with Care in Morbi, Gujarat
                    </span>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
