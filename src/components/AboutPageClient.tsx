'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRightIcon,
  FlaskConicalOffIcon,
  HandHeartIcon,
  HomeIcon,
  LeafIcon,
  MapPinIcon,
  PackageIcon,
  SparklesIcon,
  TruckIcon,
  XIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

const LEAVE_OUT_ITEMS = [
  {
    text: 'Zero Palm Oil — We protect tropical ecosystems.',
    icon: LeafIcon,
  },
  {
    text: 'Zero Sulfates & Detergents — Gentle on skin barriers.',
    icon: FlaskConicalOffIcon,
  },
  {
    text: 'No Synthetic Fragrances — Pure essential botanicals.',
    icon: SparklesIcon,
  },
  {
    text: 'No Chemical Hardeners — Cured naturally for 6 weeks.',
    icon: XIcon,
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Botanical Farm Harvest',
    body: 'Fresh goat milk, neem, multani mitti, and natural extracts sourced directly from our farm in Morbi.',
    icon: HomeIcon,
  },
  {
    step: '02',
    title: 'Cold-Process Crafting',
    body: 'Hand-poured in small batches at low temperatures to preserve active vitamins, minerals, and natural glycerin.',
    icon: HandHeartIcon,
  },
  {
    step: '03',
    title: 'Patience & Curing',
    body: 'A slow 6-week natural curing period creates a durable, long-lasting bar without synthetic hardeners.',
    icon: PackageIcon,
  },
];

const STORY_CHAPTERS = [
  {
    number: '01',
    tag: 'The Frustration',
    title: 'When "100% Natural" Means Anything But',
    text: 'A few years ago, I started inspecting the ingredient labels of commercial "natural" soaps. Behind leaf graphics and green promises were palm oil, synthetic fragrances, and chemical hardeners. What was printed on the front didn\'t match what was inside.',
    image: '/farmhouse.jpg',
    alt: 'Botanical plants growing on our Morbi farm in Gujarat',
  },
  {
    number: '02',
    tag: 'The Breakthrough',
    title: 'Returning to Cold-Process Soapmaking',
    text: 'Rather than accepting dishonest labels, I began formulating cold-process soaps at home in Morbi. Using pure goat milk, unrefined plant oils, neem, rose, and multani mitti, I created recipes that nourished skin without stripping it dry.',
    image: '/process.jpg',
    alt: 'Small-batch artisanal soap bars curing in our workshop',
  },
  {
    number: '03',
    tag: 'Our Commitment',
    title: 'Honest Skincare From Our Farmhouse to You',
    text: 'Team Naturals remains dedicated to small-batch purity. Every bar of soap and jar of face wash is handcrafted, hand-cut, and plastic-free packaged right at our farmhouse.',
    image: '/Owner/owner2.webp',
    alt: 'Vraj Kasundra, Founder of Team Naturals',
  },
];

export default function AboutPageClient() {
  const heroRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div className="w-full overflow-hidden bg-cream">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-white pb-16 pt-20 sm:pb-24 sm:pt-28"
        aria-labelledby="about-heading"
      >
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-forest-mist/60 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div style={{ y: heroY }} className="lg:col-span-6">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-forest shadow-sm"
              >
                <MapPinIcon size={14} className="text-terracotta" />
                Handcrafted in Morbi, Gujarat
              </motion.span>

              <motion.h1
                id="about-heading"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 font-display text-4xl font-extrabold leading-[1.08] text-forest sm:text-5xl lg:text-6xl"
              >
                I&apos;m Vraj Kasundra.
                <span className="mt-2 block text-forest-soft font-semibold text-2xl sm:text-3xl lg:text-4xl">
                  Team Naturals was built on honest, uncompromised ingredients.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-6 max-w-lg text-base font-medium leading-relaxed text-forest/80 sm:text-lg"
              >
                We formulate small-batch cold-process soaps and multani mitti face wash right at our farmhouse workshop. No palm oil. No harsh chemicals. No misleading marketing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 text-sm font-bold text-cream shadow-md transition-colors hover:bg-forest-deep"
                >
                  Explore Products <ArrowRightIcon size={16} strokeWidth={2} />
                </Link>
                <a
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-7 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-cream"
                >
                  Read Our Story
                </a>
              </motion.div>
            </motion.div>

            {/* Owner Image Container - Exclusively owner2.webp */}
            <div className="relative lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[8px] border-white shadow-2xl shadow-forest/15">
                  <Image
                    src="/Owner/owner2.webp"
                    alt="Vraj Kasundra, Founder of Team Naturals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 540px"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-lift backdrop-blur-md">
                    <p className="font-display text-lg font-bold text-forest">Vraj Kasundra</p>
                    <p className="mt-0.5 text-xs font-semibold text-muted">Founder &amp; Maker · Team Naturals</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Storytelling Timeline Chapters ───────────────────────────────── */}
      <section id="story" className="border-y border-forest/10 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
              <CheckCircle2Icon size={13} className="text-terracotta" />
              Our Journey
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-5xl">
              The Story Behind Team Naturals
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-muted sm:text-base">
              How a search for genuine natural skincare turned into a farmhouse soapmaking movement.
            </p>
          </Reveal>

          {/* Chapter Blocks */}
          <div className="mt-16 space-y-16 lg:space-y-24">
            {STORY_CHAPTERS.map((chap, idx) => (
              <div
                key={chap.number}
                className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <Reveal className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-forest/10 font-display text-xs font-bold text-forest">
                      {chap.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
                      {chap.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-forest sm:text-3xl">
                    {chap.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed font-medium text-forest/80 sm:text-base">
                    {chap.text}
                  </p>
                </Reveal>

                <Reveal delay={0.15} className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-4 border-white shadow-xl">
                    <Image
                      src={chap.image}
                      alt={chap.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Steps ─────────────────────────────────────────────────── */}
      <section className="bg-cream-soft py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/6 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
              Craftsmanship
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-forest sm:text-4xl">
              From Farmhouse to Bar
            </h2>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-6 sm:grid-cols-3"
          >
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={staggerItem}
                  className="rounded-3xl border border-forest/10 bg-white p-7 shadow-lift transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-forest/20">
                      {step.step}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-mist text-forest">
                      <Icon size={20} strokeWidth={2} />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-forest">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed font-medium text-muted sm:text-sm">{step.body}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── What We Leave Out Banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest py-16 sm:py-24 text-cream">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cream">
              Pure Ingredients
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-cream sm:text-4xl">
              What We Leave Out
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-relaxed text-cream/70 sm:text-sm">
              If an ingredient isn&apos;t beneficial for your skin health, it never enters our workshop.
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-5 sm:grid-cols-2"
          >
            {LEAVE_OUT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  variants={staggerItem}
                  className="flex items-center gap-4 rounded-3xl border border-cream/15 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream/15 text-cream">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <p className="text-sm font-bold leading-relaxed text-cream sm:text-base">{item.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Final Call to Action ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <div className="rounded-[2.5rem] bg-cream-soft border border-forest/10 p-10 sm:p-16 shadow-lift">
              <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl">
                Experience Genuine Handmade Skincare
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-muted sm:text-base">
                Try our cold-process soaps and multani mitti face wash today, made with love at our farmhouse in Gujarat.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/shop/soaps"
                  className="rounded-full bg-forest px-8 py-3.5 text-sm font-bold text-cream shadow-md transition-colors hover:bg-forest-deep"
                >
                  Shop Handmade Soaps
                </Link>
                <Link
                  href="/shop/face-wash"
                  className="rounded-full border border-forest/20 bg-white px-8 py-3.5 text-sm font-bold text-forest transition-colors hover:bg-cream"
                >
                  Explore Face Wash
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
