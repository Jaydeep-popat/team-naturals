'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppIcon } from '@/src/components/icons/WhatsAppIcon';
import { getWhatsAppChatUrl, SITE_CONTACT } from '@/src/lib/site-contact';

export function WhatsAppFloat() {
  const chatUrl = getWhatsAppChatUrl();

  return (
    <motion.a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp — ${SITE_CONTACT.phoneDisplay}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed z-[105] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 ring-2 ring-white/80 transition-colors hover:bg-[#20BD5A] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
        bottom-[5.5rem] right-3
        lg:bottom-8 lg:right-8 lg:h-14 lg:w-14"
    >
      <WhatsAppIcon size={26} className="lg:h-7 lg:w-7" />
    </motion.a>
  );
}
