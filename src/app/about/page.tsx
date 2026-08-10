'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, LeafIcon, HandHeartIcon, DropletIcon,
  SparklesIcon, FlaskConicalIcon, ClockIcon, StarIcon,
  PackageIcon, ShieldCheckIcon, RecycleIcon, PlusIcon, MinusIcon,
  ChevronDownIcon
} from 'lucide-react';
import { heroImage, storyImage, products } from '@/src/data/products';
import { Reveal } from '@/src/components/Reveal';
import { usePageLoad } from '@/src/hooks/usePageLoad';
import { PageSkeleton } from '@/src/components/Skeletons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const craftSteps = [
  {
    icon: SparklesIcon,
    num: '01',
    title: 'Sourcing the Best',
    stat: '12+ local farms',
    description: 'We partner with local farmers across India to harvest the finest botanical extracts, clays, and essential oils at their peak potency — never from a bulk commodity supplier.'
  },
  {
    icon: FlaskConicalIcon,
    num: '02',
    title: 'Cold-Processing',
    stat: 'No heat, ever',
    description: 'By avoiding external heat, our cold-process method keeps natural glycerin and active nutrients fully intact. The saponification reaction does all the work — slowly, correctly.'
  },
  {
    icon: ClockIcon,
    num: '03',
    title: 'The 6-Week Cure',
    stat: '42 days minimum',
    description: 'Patience is an active ingredient. 42 days of curing lets excess water evaporate, producing a significantly harder, longer-lasting, and milder bar than any commercial alternative.'
  }
];

const ingredients = [
  { name: 'Neem', image: products[0].images[0], benefit: 'Purifies & calms breakouts' },
  { name: 'Multani Mitti', image: products[1].images[0], benefit: 'Deep-cleanses & de-tans' },
  { name: 'Rice Bran', image: products[4].images[0], benefit: 'Softens & gently brightens' },
  { name: 'Coffee', image: products[3].images[0], benefit: 'Exfoliates & energises' },
  { name: 'Rose', image: products[5].images[0], benefit: 'Hydrates & restores glow' },
];

const pillars = [
  {
    icon: LeafIcon,
    title: 'Ingredients First',
    copy: 'Neem, multani mitti, rice bran, coffee, rose — chosen for their proven benefits, not their marketing value. We use raw, unrefined ingredients to preserve their natural efficacy, exactly as nature produced them.',
    detail: 'Every ingredient earns its place on the label.',
  },
  {
    icon: HandHeartIcon,
    title: 'Made by Hand',
    copy: 'Automation has no place in our curing room.',
  },
  {
    icon: DropletIcon,
    title: 'Kind to Skin',
    copy: 'No sulphates, no synthetic fragrance, no artificial colour.',
  },
];

const stats = [
  { value: 42, suffix: ' days', label: 'minimum cure time' },
  { value: 7, suffix: '', label: 'core ingredients' },
  { value: 15, suffix: '+', label: 'states shipped to' },
  { value: 703, suffix: '+', label: 'bars hand-cut' },
];

const testimonials = [
  { name: 'Ananya S.', city: 'Pune', product: 'Neem Soap', rating: 5, quote: 'My breakouts calmed down within two weeks. It doesn\'t dry my face at all — which is the opposite of what I expected from a "purifying" soap.' },
  { name: 'Sneha P.', city: 'Mumbai', product: 'Multani Mitti Soap', rating: 5, quote: 'Perfect for Mumbai summers. My face stays matte till evening and I\'ve stopped using a separate mattifying primer.' },
  { name: 'Nikhil B.', city: 'Bangalore', product: 'Coffee Soap', rating: 5, quote: 'The best body bar I\'ve used. Skin feels polished but not raw. Smells like a proper café, not a chemical lab.' },
  { name: 'Ishita G.', city: 'Delhi', product: 'Rice Soap', rating: 5, quote: 'The only bar my sensitive skin tolerates year-round. No redness, no reaction — just clean, soft skin.' },
  { name: 'Shreya L.', city: 'Chennai', product: 'Rose Soap', rating: 5, quote: 'Feels like a spa bar. My skin is noticeably softer two weeks in and the scent is real rose, not the synthetic version.' },
];

const faqs = [
  { q: 'How long does a bar actually last?', a: 'With proper care — a well-draining soap dish and letting it dry between uses — our 125g bars typically last 4 to 6 weeks for daily face or body use. Keeping the bar dry between showers is the single biggest factor in bar longevity.' },
  { q: 'Which bar suits sensitive or reactive skin?', a: 'Our Rice Soap is formulated specifically for sensitive skin — it uses a milk base with no clays or exfoliants. The Rose Soap is the second gentlest. If you have a known allergy to any ingredient, the full ingredient list is on every product page.' },
  { q: 'Is the soap truly all-natural? Any preservatives?', a: 'Yes — 100% natural, no synthetic preservatives. Cold-process soap is inherently self-preserving because of its high pH. The 6-week cure further stabilises the bar without any chemical intervention.' },
  { q: 'How should I store the soap between uses?', a: 'Keep it on a soap dish with drainage holes so water doesn\'t pool underneath the bar. A bamboo or wood dish works perfectly. Avoid leaving the bar in standing water — that softens any bar, natural or commercial.' },
  { q: 'Do you ship pan-India? What\'s the delivery time?', a: 'Yes, we ship to all serviceable pin codes across India. Standard delivery is typically 4–7 business days. Express options may be available at checkout depending on your location.' },
  { q: 'What\'s your return or exchange policy?', a: 'If a bar arrives damaged or there\'s an issue with your order, contact us within 7 days of delivery. Because our bars are handmade and hygienic consumables, we can\'t accept returns for personal preference — but we\'re always open to a conversation.' },
  { q: 'Are your products safe during pregnancy?', a: 'Most of our bars are very gentle, but we always recommend consulting your doctor before introducing new skincare during pregnancy, as individual sensitivities vary. The Rice Soap and Rose Soap are typically the most conservatively formulated.' },
  { q: 'Do you test on animals?', a: 'Never. We test exclusively on willing human volunteers — friends, family, and ourselves first. All our products are cruelty-free and we have no intention of changing that.' },
];

// ─── Animated Counter ──────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) spring.set(target);
  }, [inView, target, spring]);

  useEffect(() => spring.onChange((v) => setDisplay(Math.round(v))), [spring]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── Timeline Step ─────────────────────────────────────────────────────────────

function TimelineStep({ step, index, total }: { step: typeof craftSteps[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = step.icon;

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-10">
      {/* Left: number + line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: index * 0.15 }}
          className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-terracotta/40 bg-forest text-cream shadow-lg shadow-forest/30"
        >
          <Icon size={22} strokeWidth={1.5} />
        </motion.div>
        {index < total - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: 'easeOut' }}
            className="mt-2 w-[2px] flex-1 origin-top bg-gradient-to-b from-terracotta/40 to-transparent min-h-[60px]"
          />
        )}
      </div>

      {/* Right: content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.1 }}
        className="pb-14 md:pb-16"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta">Step {step.num}</span>
        <h3 className="mt-1 font-display text-2xl md:text-3xl text-white">{step.title}</h3>
        <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cream/80 border border-white/10">{step.stat}</span>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-cream/70 max-w-lg">{step.description}</p>
      </motion.div>
    </div>
  );
}

// ─── FAQ Item ──────────────────────────────────────────────────────────────────

function FaqItem({ item, idx, openIdx, setOpen }: { item: typeof faqs[0]; idx: number; openIdx: number | null; setOpen: (i: number | null) => void }) {
  const isOpen = openIdx === idx;
  return (
    <div className={`border-b border-forest/10 transition-colors ${isOpen ? 'border-terracotta/30' : ''}`}>
      <button
        onClick={() => setOpen(isOpen ? null : idx)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-display text-lg font-medium text-forest">{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${isOpen ? 'border-terracotta bg-terracotta text-white' : 'border-forest/20 text-forest'}`}
        >
          <PlusIcon size={14} strokeWidth={2.5} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm md:text-base leading-relaxed text-muted/90">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const loading = usePageLoad(600);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState('');

  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-cream overflow-hidden">

      {/* ── 1. HERO — Split layout ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex min-h-[95vh] w-full overflow-hidden bg-cream pt-16 md:pt-20">
      {/* Left text col */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center md:w-[48%] md:px-12 lg:px-20 xl:px-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-5 text-[11px] font-bold uppercase tracking-[0.35em] text-terracotta"
          >
            Team Naturals
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.08] text-forest"
          >
            Rooted in <span className="italic text-terracotta/90">Nature.</span><br />
            Crafted with <span className="italic">Patience.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-muted/80 max-w-sm leading-relaxed"
          >
            Cold-processed in small batches, with ingredients you can actually pronounce. No shortcuts. No synthetics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-all hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/20 active:scale-[0.98]"
            >
              Shop the Bars <ArrowRightIcon size={15} strokeWidth={2} />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3 text-sm font-medium text-forest transition-all hover:border-forest/40 hover:bg-forest/5"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Right photo col */}
        <div className="absolute inset-y-0 right-0 hidden w-[56%] overflow-hidden md:block">
          <motion.img
            src={heroImage}
            alt="Artisanal soap being cut on a wooden board with botanicals"
            style={{ scale: imgScale }}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/10 to-transparent" />
        </div>

        {/* Mobile hero image strip */}
        <div className="absolute inset-x-0 bottom-0 h-[38vh] overflow-hidden md:hidden">
          <img src={heroImage} alt="Artisanal soap" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: scrollOpacity }}
          className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2 md:left-20 lg:left-28"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-forest/40 font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-px bg-gradient-to-b from-forest/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── 2. OUR STORY ──────────────────────────────────────────────────────── */}
      <section id="story" className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5" direction="right">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-cream-soft via-forest/5 to-transparent blur-xl" />
                <motion.div
                  whileHover={{ scale: 1.02, rotate: -0.5 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-forest/10"
                >
                  <img
                    src={storyImage}
                    alt="Fresh handmade natural soap being sliced on a wooden board"
                    className="w-full object-cover aspect-[4/5] sm:h-[600px] sm:aspect-auto transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/40 bg-cream/90 backdrop-blur-md shadow-xl text-center"
                >
                  <span className="font-display text-2xl font-bold text-forest">100%</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-terracotta">Natural</span>
                </motion.div>
              </div>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-terracotta">Our Story</p>
                <h2 className="mb-8 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-forest">
                  Fewer ingredients,<br />
                  <span className="italic text-terracotta/90">better behaved skin.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg font-medium text-forest/80 leading-snug">
                  Team Naturals started in a home kitchen with one simple question: <strong className="text-forest">why does everyday skincare require so many synthetic chemicals nobody can pronounce?</strong>
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="my-6 h-px w-10 bg-terracotta/30" />
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-base leading-relaxed text-muted/90">
                  Most commercial soap is effectively a detergent bar — loaded with artificial fragrances and harsh surfactants that strip the skin&apos;s natural lipid barrier. The squeaky-clean feeling is actually dehydration.
                </p>
              </Reveal>

              {/* Pull-quote */}
              <Reveal delay={0.55}>
                <blockquote className="my-8 pl-5 border-l-2 border-terracotta/40 font-display text-2xl italic leading-snug text-forest/80">
                  &quot;We let cold-pressed oils, pure clays, and rich botanicals do the heavy lifting — and kept everything else out.&quot;
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MEET THE MAKER ────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24">
            <Reveal direction="right" className="md:w-[42%] shrink-0">
              <div className="overflow-hidden rounded-3xl shadow-xl shadow-forest/8 aspect-square">
                <img
                  src={products[0].images[0]}
                  alt="Hands carefully cutting a fresh bar of natural soap"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2} className="flex-1">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Meet the Maker</p>
              <blockquote className="font-display text-3xl md:text-4xl leading-[1.35] text-forest">
                &ldquo;I formulated the very first Neem bar for my brother&rsquo;s severe acne. Two years and countless batches later, we still make every single bar the exact same way — slowly, in small numbers, with ingredients we proudly put on our own skin first.&rdquo;
              </blockquote>
              <p className="mt-8 text-base font-semibold text-forest/70 tracking-wide">
                The Team Naturals Family
              </p>
              <p className="text-sm text-muted/70">Founders, Mumbai</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. THE CRAFT — Vertical timeline ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest text-cream py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 lg:px-10">
          <Reveal className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-terracotta mb-4">The Craft</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">How we make it matters.</h2>
            <p className="mt-4 text-cream/70 text-lg max-w-xl leading-relaxed">We don&apos;t take shortcuts. Every bar represents weeks of work, not hours of automation.</p>
          </Reveal>

          <div className="mt-12">
            {craftSteps.map((step, idx) => (
              <TimelineStep key={step.num} step={step} index={idx} total={craftSteps.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. INGREDIENT SPOTLIGHT ──────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Inside the Bar</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">Hero ingredients</h2>
            <p className="mt-3 text-muted/80 max-w-xl mx-auto">
              Five botanicals. Each chosen because it works, not because it sounds good on a label.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {ingredients.map((ing, idx) => (
              <Reveal key={ing.name} delay={idx * 0.1}>
                <div className="group flex flex-col items-center text-center w-36">
                  <div className="overflow-hidden rounded-full w-28 h-28 md:w-32 md:h-32 border-2 border-forest/10 shadow-md transition-all duration-500 group-hover:border-terracotta/40 group-hover:shadow-lg group-hover:shadow-terracotta/10">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-forest">{ing.name}</h3>
                  <p className="mt-1 text-[12px] text-muted/80 leading-tight">{ing.benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. VALUES — Asymmetric layout ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f4ece3] py-24 lg:py-32">
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] bg-terracotta/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-terracotta mb-4">Values</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest">What we stand for.</h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
            {/* Featured value — spans 2 rows */}
            <Reveal className="lg:row-span-2">
              <div className="group relative h-full overflow-hidden rounded-3xl bg-forest p-8 md:p-10 flex flex-col justify-between min-h-[340px]">
                <div className="absolute inset-0 bg-gradient-to-br from-forest to-[#0f2a1a] opacity-90" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/10 border border-cream/20 text-cream mb-8">
                    <LeafIcon size={24} strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-3xl text-white mb-4">{pillars[0].title}</h3>
                  <p className="text-cream/75 leading-relaxed text-base">{pillars[0].copy}</p>
                </div>
                <p className="relative z-10 mt-8 text-sm italic text-terracotta/90 font-medium">{pillars[0].detail}</p>
              </div>
            </Reveal>

            {/* Smaller values stacked */}
            {pillars.slice(1).map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={0.15 + idx * 0.15}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative rounded-3xl bg-white/60 backdrop-blur-sm border border-white/60 p-7 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-3xl opacity-60 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-forest/5 text-forest group-hover:bg-forest group-hover:text-cream transition-all duration-500 mb-6">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <h3 className="font-display text-2xl text-forest mb-3">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-forest/70">{p.copy}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. SUSTAINABILITY STRIP ──────────────────────────────────────────── */}
      <section className="bg-cream border-y border-forest/8 py-8">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-forest/70">
            {[
              { icon: RecycleIcon, text: 'Recyclable & minimal packaging — zero unnecessary plastic' },
              { icon: ShieldCheckIcon, text: 'Cruelty-free, always — never tested on animals' },
              { icon: PackageIcon, text: 'Small-batch only — every bar traced to its production date' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2.5 font-medium">
                <Icon size={15} className="text-terracotta shrink-0" strokeWidth={1.75} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BY THE NUMBERS ─────────────────────────────────────────────────── */}
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="font-display text-4xl md:text-5xl font-bold text-cream">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <span className="text-[11px] uppercase tracking-widest text-cream/50 font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CUSTOMER VOICES ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Customer Voices</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">What our customers say.</h2>
          </Reveal>

          {/* Desktop: 3-up grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t, idx) => (
              <Reveal key={t.name} delay={idx * 0.1}>
                <div className="flex h-full flex-col rounded-3xl border border-forest/8 bg-cream/40 p-6 md:p-7">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} size={13} className="text-terracotta fill-terracotta" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="flex-1 text-sm md:text-base leading-relaxed text-forest/80 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 pt-4 border-t border-forest/8">
                    <p className="font-semibold text-sm text-forest">{t.name}</p>
                    <p className="text-[11px] text-muted/70">{t.city} &middot; {t.product}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-forest/8 bg-cream/40 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                    <StarIcon key={i} size={13} className="text-terracotta fill-terracotta" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-forest/80 italic">&ldquo;{testimonials[testimonialIdx].quote}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-forest/8">
                  <p className="font-semibold text-sm text-forest">{testimonials[testimonialIdx].name}</p>
                  <p className="text-[11px] text-muted/70">{testimonials[testimonialIdx].city} &middot; {testimonials[testimonialIdx].product}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === testimonialIdx ? 'w-6 bg-forest' : 'w-1.5 bg-forest/20'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Got Questions?</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">Answers.</h2>
          </Reveal>

          <div>
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} item={faq} idx={idx} openIdx={openFaq} setOpen={setOpenFaq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CLOSING CTA ───────────────────────────────────────────────────── */}
      <section className="bg-forest text-cream py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-10">
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Ready to try it?</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Skip the ingredient list.<br />
              <span className="italic text-cream/70">Feel the difference.</span>
            </h2>
            <p className="mt-5 text-cream/60 text-base max-w-md mx-auto leading-relaxed">
              Seven bars, one face wash. Each one made the same slow way it has always been made.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-8 py-4 text-base font-medium text-white transition-all hover:bg-[#c05a41] hover:shadow-xl hover:shadow-terracotta/20 active:scale-[0.98]"
            >
              Shop Now
              <ArrowRightIcon size={17} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={0.35} className="mt-12 pt-10 border-t border-white/10">
            <p className="text-sm text-cream/50 mb-4">Not ready yet? Get new batch notifications — no spam, just restocks.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-terracotta/60 focus:bg-white/15 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-cream text-forest px-6 py-3 text-sm font-semibold transition-all hover:bg-cream/90 active:scale-[0.98]"
              >
                Notify Me
              </button>
            </form>
          </Reveal>
        </div>
      </section>

    </div>
  );
}