'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHeading } from '@/src/components/SectionHeading';
import { ChevronDownIcon } from 'lucide-react';
import { Reveal } from './Reveal';

const faqs = [
  {
    id: 'faq1',
    question: 'How long does delivery take?',
    answer:
      'We dispatch within 1-2 business days of receiving your order. Standard shipping across India takes 4-7 business days. Express options are available at checkout for major cities.',
  },
  {
    id: 'faq2',
    question: 'Are your soaps safe for sensitive skin?',
    answer:
      'Yes. Our bars are cold-processed with natural ingredients and contain no SLS, parabens, artificial colours, or synthetic fragrance. The Rice Soap and Rose Soap are specifically formulated for sensitive and reactive skin types. We always recommend a small patch test first.',
  },
  {
    id: 'faq3',
    question: 'What is your return policy?',
    answer:
      "We accept returns within 7 days of delivery if the product is unused and in original packaging. Soaps that have been used cannot be returned for hygiene reasons. If your order arrived damaged, please photograph and contact us within 48 hours and we'll replace it, no questions asked.",
  },
  {
    id: 'faq4',
    question: 'How are the soaps packed?',
    answer:
      "Each bar is wrapped in kraft paper with a printed belly band and sealed with twine. Packaging is minimal, recyclable, and plastic-free. Orders are packed in recycled cardboard boxes with paper fill. We don't use styrofoam or bubble wrap.",
  },
  {
    id: 'faq5',
    question: 'Can I use the soaps on my face?',
    answer:
      'The Neem, Rice, and Rose soaps are gentle enough for facial use. Multani Mitti and Coffee soaps are better suited to the body. The clay and coffee grounds are excellent for arms and legs but can feel too heavy for facial skin. The face wash is formulated specifically for daily facial cleansing.',
  },
];

function FAQItem({ faq }: { faq: (typeof faqs)[number] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-forest/8 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${faq.id}-answer`}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-[17px] text-forest">{faq.question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-forest/12 text-forest"
        >
          <ChevronDownIcon size={16} strokeWidth={1.8} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${faq.id}-answer`}
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-muted">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQAccordion() {
  return (
    <Reveal>
      <section aria-labelledby="faq-heading" className="w-full">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left header */}
          <div className="lg:col-span-1">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Got questions?</p>
            <SectionHeading className="mt-2" id="faq-heading">
              Frequently Asked Questions
            </SectionHeading>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {"Can't find an answer? Write to us at "}
              <a
                href="mailto:hello@teamnaturals.in"
                className="text-forest underline-offset-2 hover:underline"
              >
                hello@teamnaturals.in
              </a>
            </p>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-2">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
