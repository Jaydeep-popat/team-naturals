import React from 'react';
import { CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export type TrackingStep = {
  id: string;
  label: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming' | 'cancelled';
};

export function OrderTrackingTimeline({ steps }: { steps: TrackingStep[] }) {
  return (
    <div className="relative py-4">
      {/* Background Line (Vertical for all breakpoints, but we can make it compact on mobile) */}
      <div className="absolute left-[20px] top-8 bottom-8 w-0.5 bg-forest/10" />

      <div className="space-y-8 relative">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isCancelled = step.status === 'cancelled';
          const isUpcoming = step.status === 'upcoming';

          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-5 relative"
            >
              {/* Timeline dot */}
              <div 
                className={`relative z-10 shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300
                  ${isCompleted ? 'border-forest bg-forest text-white' : 
                    isCurrent ? 'border-forest ring-4 ring-forest/10 text-forest' : 
                    isCancelled ? 'border-terracotta bg-terracotta text-white' : 
                    'border-forest/20 text-forest/20'}`}
              >
                {isCompleted && <CheckIcon size={18} strokeWidth={3} />}
                {isCurrent && <div className="h-2.5 w-2.5 rounded-full bg-forest animate-pulse" />}
                {isCancelled && <div className="h-3 w-3 bg-white" style={{ clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)' }} />}
              </div>

              {/* Text content */}
              <div className="flex flex-col pt-2 min-w-0">
                <span className={`font-bold text-[15px] ${
                  isCompleted || isCurrent ? 'text-forest' : 
                  isCancelled ? 'text-terracotta' : 
                  'text-muted'
                }`}>
                  {step.label}
                </span>
                {step.timestamp && (
                  <span className="text-[13px] text-muted mt-0.5">
                    {step.timestamp}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
