'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircleIcon, RotateCcwIcon } from 'lucide-react';
import { SectionHeading } from '@/src/components/SectionHeading';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '01',
    category: 'Craft & Process',
    question: 'Are Team Naturals soaps really handmade?',
    answer: 'Yes! Every bar is handmade in small batches — no mass production or automated lines. We measure, mix, and cut each batch by hand, so slight variations in shape and texture are completely natural.'
  },
  {
    id: '02',
    category: 'Ingredients',
    question: 'Do your products contain palm oil?',
    answer: 'No. None of our soaps or face washes use palm oil. We use alternative natural plant oils and rich seed butters that are kinder to your skin and environmentally sustainable.'
  },
  {
    id: '03',
    category: 'Skin Safety',
    question: 'Are your soaps safe for sensitive skin?',
    answer: 'Our soaps are formulated without harsh chemicals, sulphates, or synthetic fragrances. We recommend a quick patch test on your inner arm before regular use if you have extra sensitive skin.'
  },
  {
    id: '04',
    category: 'Benefits',
    question: 'Can Team Naturals soap help with tanning?',
    answer: 'Our de-tanning range is formulated with natural ingredients traditionally used to gently exfoliate and brighten skin tone with regular use as part of a consistent daily routine.'
  },
  {
    id: '05',
    category: 'Product Care',
    question: 'How long does a bar of soap last?',
    answer: 'With normal daily use, one bar typically lasts 3–4 weeks. Keeping it on a well-draining soap dish between uses makes it last noticeably longer.'
  },
  {
    id: '06',
    category: 'Origin',
    question: 'Where are Team Naturals products made?',
    answer: 'Our products are handcrafted at our workshop in Morbi, Gujarat, where founder Vraj Kasundra oversees production from raw ingredient sourcing to final hand-packaging.'
  },
];

export function FAQAccordion() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
          <HelpCircleIcon size={13} className="text-terracotta" />
          Got Questions?
        </span>
        <SectionHeading className="mt-3">
          Frequently Asked Questions
        </SectionHeading>
        <p className="mt-2 text-xs text-muted sm:text-sm">
          Hover over or tap any card to reveal the answer.
        </p>
      </div>

      {/* Grid of 6 Flip/Reveal Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {faqs.map((faq, idx) => {
          const isFlipped = flippedIndex === idx;

          return (
            <div
              key={faq.id}
              className="group h-[250px] w-full [perspective:1000px]"
              onMouseEnter={() => setFlippedIndex(idx)}
              onMouseLeave={() => setFlippedIndex(null)}
              onClick={() => setFlippedIndex(isFlipped ? null : idx)}
            >
              <motion.div
                className="relative h-full w-full rounded-3xl transition-all [transform-style:preserve-3d] cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Front Side - Question */}
                <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-forest/10 bg-gradient-to-b from-white to-cream/40 p-6 shadow-lift [backface-visibility:hidden] group-hover:border-forest/30 group-hover:shadow-soft">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-forest-mist px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-forest">
                        {faq.category}
                      </span>
                      <span className="font-display text-sm font-bold text-forest/30">
                        {faq.id}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl font-bold leading-snug text-forest group-hover:text-terracotta transition-colors sm:text-[22px]">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-muted/80 pt-3 border-t border-forest/6">
                    <span className="flex items-center gap-1.5 text-forest/70">
                      Hover to flip <RotateCcwIcon size={13} className="transition-transform group-hover:rotate-180 duration-300" />
                    </span>
                    <span className="h-2 w-2 rounded-full bg-terracotta/40 group-hover:bg-terracotta group-hover:scale-125 transition-all" />
                  </div>
                </div>

                {/* Back Side - Answer */}
                <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-terracotta/20 bg-forest p-6 text-cream shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-soft">
                      Answer
                    </span>
                    <p className="mt-2.5 text-sm font-medium leading-relaxed text-cream/95 sm:text-[15px]">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-cream/60 uppercase tracking-widest border-t border-white/10">
                    Team Naturals
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
