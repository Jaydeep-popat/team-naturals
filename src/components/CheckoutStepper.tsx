'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

const steps = [
  { id: 1, name: 'Cart' },
  { id: 2, name: 'Address' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Confirmation' },
];

export function CheckoutStepper({ currentStep }: { currentStep: number }) {
  const currentStepName = steps.find((s) => s.id === currentStep)?.name || '';

  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-3xl px-4">
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-semibold text-forest">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-forest font-medium">{currentStepName}</span>
          </div>
          <div className="relative h-1.5 w-full bg-forest/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-forest"
              initial={false}
              animate={{ width: `${((currentStep) / steps.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex relative items-center justify-between mt-2">
          {/* Background line */}
          <div className="absolute left-[10%] right-[10%] top-[14px] h-[2px] bg-forest/10" />

          {/* Active progress line */}
          <motion.div
            className="absolute left-[10%] top-[14px] h-[2px] bg-forest origin-left"
            initial={false}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 80}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center w-1/4">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? 'rgb(31,61,43)' : 'rgb(255,255,255)',
                    borderColor: isUpcoming ? 'rgba(31,61,43,0.2)' : 'rgb(31,61,43)',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors bg-white"
                >
                  {isCompleted ? (
                    <CheckIcon size={14} strokeWidth={3} className="text-cream" />
                  ) : (
                    <span
                      className={`text-[11px] font-bold ${
                        isActive ? 'text-forest' : 'text-forest/40'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-[12px] transition-colors ${
                    isActive ? 'text-forest font-bold' : isCompleted ? 'text-forest font-medium' : 'text-forest/40 font-medium'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
