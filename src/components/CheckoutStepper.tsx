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
        {/* Unified Responsive View */}
        <div className="flex relative items-start justify-between mt-2 sm:mt-4">
          {/* Background line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[20px] sm:top-[22px] h-[2px] sm:h-[3px] bg-forest/10 rounded-full overflow-hidden" />

          {/* Active progress line (Animated Gradient) */}
          <motion.div
            className="absolute left-[12.5%] top-[20px] sm:top-[22px] h-[2px] sm:h-[3px] bg-gradient-to-r from-forest via-gold to-forest bg-[length:200%_auto] rounded-full origin-left shadow-[0_0_8px_rgba(31,61,43,0.3)]"
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
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-gold/20 rounded-full blur-md"
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
                  className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-[2px] sm:border-[3px] transition-colors bg-white shadow-sm"
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <CheckIcon strokeWidth={3} className="text-cream w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{
                        color: isActive ? 'rgb(253,251,249)' : 'rgba(31,61,43,0.4)'
                      }}
                    >
                      <Icon strokeWidth={isActive ? 2.5 : 2} className="w-4 h-4 sm:w-5 sm:h-5" />
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
                    className={`text-[10px] sm:text-[13px] tracking-wide transition-colors whitespace-nowrap ${
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
