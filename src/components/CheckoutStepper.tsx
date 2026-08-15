'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, CreditCard, CheckCircle2, CheckIcon } from 'lucide-react';

const steps = [
  { id: 1, name: 'Cart', icon: ShoppingBag },
  { id: 2, name: 'Address', icon: MapPin },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Confirm', icon: CheckCircle2 },
];

export function CheckoutStepper({ currentStep }: { currentStep: number }) {
  const currentStepName = steps.find((s) => s.id === currentStep)?.name || '';

  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4">
        {/* Mobile View */}
        <div className="md:hidden flex flex-col items-center">
          <div className="flex items-center justify-between w-full text-sm mb-4">
            <span className="font-semibold text-forest/70 uppercase tracking-widest text-[11px]">
              Step {currentStep} of {steps.length}
            </span>
            <motion.span
              key={currentStepName}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-forest font-bold tracking-wide"
            >
              {currentStepName}
            </motion.span>
          </div>
          <div className="relative h-2 w-full bg-forest/10 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-forest to-[#3A6B4C]"
              initial={false}
              animate={{ width: `${((currentStep) / steps.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex relative items-start justify-between mt-4">
          {/* Background line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[22px] h-[3px] bg-forest/10 rounded-full overflow-hidden" />

          {/* Active progress line (Animated Gradient) */}
          <motion.div
            className="absolute left-[12.5%] top-[22px] h-[3px] bg-gradient-to-r from-forest via-gold to-forest bg-[length:200%_auto] rounded-full origin-left shadow-[0_0_8px_rgba(31,61,43,0.3)]"
            initial={false}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 75}%`,
              backgroundPosition: ['0% center', '200% center']
            }}
            transition={{ 
              width: { type: 'spring', stiffness: 200, damping: 25 },
              backgroundPosition: { repeat: Infinity, duration: 4, ease: "linear" }
            }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isUpcoming = currentStep < step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center w-1/4 group">
                {/* Glowing Halo for Active Step */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-gold/20 rounded-full blur-md"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? 'rgb(31,61,43)' : isActive ? 'rgb(31,61,43)' : 'rgb(255,255,255)',
                    borderColor: isCompleted || isActive ? 'rgb(31,61,43)' : 'rgba(31,61,43,0.15)',
                    scale: isActive ? 1.15 : isCompleted ? 1.05 : 1,
                    y: isActive ? -4 : 0,
                  }}
                  whileHover={!isActive ? { scale: 1.05 } : {}}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] transition-colors bg-white shadow-sm"
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <CheckIcon size={20} strokeWidth={3} className="text-cream" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        color: isActive ? 'rgb(253,251,249)' : 'rgba(31,61,43,0.4)'
                      }}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isActive ? 0 : 4,
                    opacity: isUpcoming ? 0.6 : 1,
                  }}
                  className="mt-5 flex flex-col items-center"
                >
                  <span
                    className={`text-[13px] tracking-wide transition-colors ${
                      isActive 
                        ? 'text-forest font-bold drop-shadow-sm' 
                        : isCompleted 
                          ? 'text-forest font-semibold' 
                          : 'text-forest/50 font-medium'
                    }`}
                  >
                    {step.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeStepDot"
                      className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5"
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
