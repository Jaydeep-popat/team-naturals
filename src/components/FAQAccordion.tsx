'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What exactly is cold-process soap?',
    answer: 'Cold-process soap making is a traditional method that mixes oils and lye without applying external heat. This slow process takes weeks but preserves the natural benefits of the ingredients and naturally produces glycerin, an incredible humectant that keeps skin deeply moisturized.'
  },
  {
    question: 'Are your products vegan and cruelty-free?',
    answer: 'Absolutely. We test exclusively on willing human volunteers. The vast majority of our products are 100% vegan. If we ever use ingredients like locally sourced beeswax or goat milk in specific formulations, it is always clearly stated on the label.'
  },
  {
    question: 'Why do you cure your soap for 4 to 6 weeks?',
    answer: 'Patience is an active ingredient. A 6-week cure time allows all excess water to evaporate, resulting in a significantly harder, longer-lasting bar. It also ensures the soap is perfectly mild and gentle on the most sensitive skin.'
  },
  {
    question: 'Do you use artificial fragrances or colors?',
    answer: 'Never. Our colors come exclusively from natural clays, botanicals, and spices. Our scents are derived purely from therapeutic-grade essential oils. We believe skincare shouldn\'t contain anything synthetic.'
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <motion.div
            key={idx}
            initial={false}
            animate={{ backgroundColor: isOpen ? 'rgba(52,140,49,0.03)' : 'rgba(255,255,255,1)' }}
            className="overflow-hidden rounded-2xl border border-forest/10 transition-colors"
          >
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-medium text-forest sm:text-xl">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/5 text-forest"
              >
                {isOpen ? <MinusIcon size={18} /> : <PlusIcon size={18} />}
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-6 pb-6 text-sm leading-relaxed text-muted sm:text-base">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
