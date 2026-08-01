import React from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, RotateCcwIcon, LockIcon, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    subtitle: 'On orders over ₹499',
  },
  {
    icon: RotateCcwIcon,
    title: 'Easy Returns',
    subtitle: '7-day return window',
  },
  {
    icon: LockIcon,
    title: 'Secure Payments',
    subtitle: '100% protected checkout',
  },
  {
    icon: HeadphonesIcon,
    title: 'Customer Support',
    subtitle: 'Here to help anytime',
  },
];

export function TrustBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 mx-auto max-w-6xl px-5 sm:px-10 mt-[-40px] sm:mt-[-60px]"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-3xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(31,61,43,0.06)] border border-forest-mist/50">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-mist text-forest">
              <feature.icon size={20} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-[15px] font-bold text-forest">
              {feature.title}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted/80">
              {feature.subtitle}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
