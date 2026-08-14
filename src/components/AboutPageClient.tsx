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
} from 'lucide-react';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

const SECTION_TITLE =
  'font-display text-3xl font-semibold text-forest sm:text-4xl lg:text-[42px] leading-tight';

const LEAVE_OUT_ITEMS = [
  {
    text: 'No palm oil.',
    icon: LeafIcon,
    accent: 'from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
  },
  {
    text: 'No sulfates.',
    icon: FlaskConicalOffIcon,
    accent: 'from-sky-50 to-sky-100/50',
    iconColor: 'text-sky-600',
  },
  {
    text: 'No artificial fragrance.',
    icon: SparklesIcon,
    accent: 'from-amber-50 to-amber-100/50',
    iconColor: 'text-amber-600',
  },
  {
    text: 'No synthetic hardeners just to speed up curing time.',
    icon: XIcon,
    accent: 'from-rose-50 to-rose-100/50',
    iconColor: 'text-rose-600',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Farmhouse ingredients',
    body: 'Goat milk and botanicals from our land in Morbi — same source, every batch.',
    icon: HomeIcon,
  },
  {
    step: '02',
    title: 'Hand-poured at home',
    body: 'No factory line. Every bar is made by hand in small runs.',
    icon: HandHeartIcon,
  },
  {
    step: '03',
    title: 'Cut, cured, wrapped',
    body: 'We wait for the bar to set properly — no chemical shortcuts.',
    icon: PackageIcon,
  },
];

const TIMELINE = [
  {
    year: 'The question',
    title: 'Labels that lied',
    body: 'Most “natural” soaps still hid palm oil, synthetic fragrance, and hardeners behind leaf graphics.',
  },
  {
    year: 'The shift',
    title: 'I started making soap',
    body: 'That gap between what was claimed and what was inside pushed me to make my own.',
  },
  {
    year: 'Today',
    title: 'Team Naturals',
    body: 'Small-batch soaps and a clay face wash — made at home in Morbi, shipped to your door.',
  },
];

export default function AboutPageClient() {
  const heroRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <div className="w-full overflow-hidden bg-cream">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] overflow-hidden bg-cream pt-20 sm:pt-24"
        aria-labelledby="about-heading"
      >
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-forest-mist/60 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-terracotta/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="lg:col-span-6">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium text-forest backdrop-blur-sm"
              >
                <MapPinIcon size={12} strokeWidth={2} className="text-terracotta" />
                Morbi, Gujarat
              </motion.span>

              <motion.h1
                id="about-heading"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 font-display text-[36px] font-semibold leading-[1.08] text-forest sm:text-5xl lg:text-[56px]"
              >
                I&apos;m Vraj Kasundra.
                <span className="mt-2 block text-forest-soft">
                  Team Naturals started because labels kept lying.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-[17px]"
              >
                I got tired of reading &lsquo;100% natural&rsquo; on soap wrappers that were
                anything but — palm oil, synthetic fragrance, and chemical hardeners dressed up with
                leaves on the label.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link
                  href="/shop/soaps"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-forest-deep"
                >
                  See what we make <ArrowRightIcon size={16} strokeWidth={1.8} />
                </Link>
                <a
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/15 px-6 py-3 text-sm text-forest transition-colors hover:bg-white"
                >
                  Read the full story
                </a>
              </motion.div>
            </motion.div>

            <div className="relative lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-[6px] border-white shadow-xl shadow-forest/10">
                  <Image
                    src="/Owner/owner1.webp"
                    alt="Vraj Kasundra, founder of Team Naturals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent" />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute -bottom-4 -left-2 z-10 max-w-[200px] rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lift backdrop-blur-md sm:-left-6"
                >
                  <p className="font-display text-sm font-semibold text-forest">Vraj Kasundra</p>
                  <p className="mt-0.5 text-[11px] text-muted">Founder · Team Naturals</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="absolute -right-2 top-8 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:-right-6 sm:top-12"
                >
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                    <Image
                      src="/Owner/owner3.webp"
                      alt="Handmade Team Naturals soap bars"
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-forest/40">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-8 w-px bg-gradient-to-b from-forest/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Story timeline ─────────────────────────────────────────────────── */}
      <section
        id="story"
        className="border-y border-forest/8 bg-white py-16 sm:py-24"
        aria-labelledby="timeline-heading"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">The journey</p>
            <h2 id="timeline-heading" className={`mt-2 ${SECTION_TITLE}`}>
              Why I started this
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
              A year ago, I began looking closely at what goes into the soaps and face washes most
              brands sell as &lsquo;natural&rsquo; or &lsquo;organic.&rsquo; Most of them still use
              palm oil, synthetic fragrance, and chemical hardeners — just packaged with leaves on
              the label. That gap between what&apos;s claimed and what&apos;s actually inside is what
              pushed me to start making soap myself.
            </p>
          </Reveal>

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {TIMELINE.map((item, i) => (
              <motion.li
                key={item.year}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-3xl border border-forest/8 bg-cream-soft/50 p-6 transition-all duration-300 hover:border-forest/15 hover:shadow-soft"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
                  {item.year}
                </span>
                <h3 className="mt-3 font-display text-xl text-forest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                {i < TIMELINE.length - 1 && (
                  <div
                    className="absolute -right-3 top-1/2 hidden h-px w-6 bg-forest/15 md:block"
                    aria-hidden="true"
                  />
                )}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ── How we make it (bento) ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" aria-labelledby="how-made-heading">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.28em] text-muted">From land to bar</p>
              <h2 id="how-made-heading" className="mt-2 font-display text-3xl text-forest sm:text-4xl">
                How we make it
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted sm:text-[17px]">
                Every soap we make starts with a goat milk base — no synthetic detergent bars, no
                palm oil. The ingredients come from our own farmhouse in Morbi, Gujarat: the same
                land, batch after batch, so we know exactly what&apos;s going into every bar.
                Nothing is outsourced to a factory. Every soap is made by hand, at home, without
                shortcuts or filler chemicals.
              </p>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/8 text-forest">
                  <MapPinIcon size={20} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-forest">Morbi farmhouse</p>
                  <p className="text-xs text-muted">Same land · Same ingredients · Every batch</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="relative">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-xl shadow-forest/10">
                <Image
                  src="/Owner/owner2.webp"
                  alt="Team Naturals farmhouse in Morbi, Gujarat — source of soap ingredients"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-forest/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-sm font-medium text-cream">Made at home, not in a factory</p>
                </div>
              </div>
            </Reveal>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-14 grid gap-4 sm:grid-cols-3"
          >
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={staggerItem}
                  className="rounded-2xl border border-forest/8 bg-white p-5 transition-shadow hover:shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-terracotta/80">
                      {step.step}
                    </span>
                    <Icon size={18} className="text-forest/60" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-3 font-display text-lg text-forest">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── What we leave out ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-forest py-16 sm:py-24"
        aria-labelledby="leave-out-heading"
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-terracotta/10 blur-[100px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cream/50">Our standard</p>
            <h2
              id="leave-out-heading"
              className="mt-2 font-display text-3xl text-cream sm:text-4xl"
            >
              What we leave out
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/65 sm:text-base">
              If an ingredient can&apos;t be explained in one sentence, it doesn&apos;t go in.
            </p>
          </Reveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {LEAVE_OUT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  variants={staggerItem}
                  className="flex items-start gap-4 rounded-2xl border border-cream/10 bg-cream/5 p-5 backdrop-blur-sm transition-colors hover:bg-cream/10"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cream/15">
                    <Icon size={18} className="text-cream" strokeWidth={1.6} />
                  </div>
                  <p className="text-base leading-relaxed text-cream/90">{item.text}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <Reveal delay={0.2} className="mt-10 text-center">
            <Link
              href="/shop/face-wash"
              className="inline-flex items-center gap-2 text-sm font-medium text-terracotta transition-colors hover:text-cream"
            >
              Same rules for our multani mitti face wash
              <ArrowRightIcon size={14} strokeWidth={2} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Small batch + Delivery ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" aria-labelledby="values-heading">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">How we operate</p>
            <h2 id="values-heading" className="mt-2 font-display text-3xl text-forest sm:text-4xl">
              Small batch. Careful delivery.
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article
                className="relative overflow-hidden rounded-3xl border border-forest/8 bg-white p-8 shadow-soft"
                aria-labelledby="small-batch-heading"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-soft text-forest">
                  <HandHeartIcon size={22} strokeWidth={1.5} />
                </div>
                <h3
                  id="small-batch-heading"
                  className="mt-6 font-display text-2xl text-forest"
                >
                  Why we stay small batch
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  We make in small batches because that&apos;s the only way to keep the goat milk
                  base and farmhouse ingredients consistent. It also means a slower turnaround
                  sometimes — we&apos;d rather that than water down what we started this for.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-soft"
                >
                  Our promise on the homepage <ArrowRightIcon size={14} />
                </Link>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article
                className="relative overflow-hidden rounded-3xl border border-forest/8 bg-cream-soft p-8"
                aria-labelledby="delivery-heading"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-forest shadow-soft">
                  <TruckIcon size={22} strokeWidth={1.5} />
                </div>
                <h3 id="delivery-heading" className="mt-6 font-display text-2xl text-forest">
                  Getting it to you
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  Once your order is packed, we hand it off to trusted courier partners who get it
                  to you as quickly as the route allows. We keep close track of every shipment until
                  it reaches your door.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Packed by hand', 'Tracked shipment', 'Pan-India'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-forest/10 bg-white px-3 py-1 text-[11px] font-medium text-forest/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────────────── */}
      <section className="pb-8 sm:pb-12" aria-labelledby="closing-heading">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-14 sm:px-12 sm:py-20">
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-terracotta/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cream/5 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <h2 id="closing-heading" className="sr-only">Closing</h2>
                  <blockquote className="font-display text-2xl leading-snug text-cream sm:text-3xl lg:text-[36px] lg:leading-[1.2]">
                    Team Naturals isn&apos;t trying to be the biggest soap brand in Gujarat.
                    It&apos;s trying to be the one you can trust when you read the label.
                  </blockquote>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/shop/soaps"
                      className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-white"
                    >
                      See what we make <ArrowRightIcon size={16} strokeWidth={1.8} />
                    </Link>
                    <Link
                      href="/shop/face-wash"
                      className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-6 py-3 text-sm text-cream transition-colors hover:bg-cream/10"
                    >
                      Face wash
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white/20 shadow-lg">
                      <Image
                        src="/Owner/owner1.webp"
                        alt="Vraj Kasundra, founder of Team Naturals"
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white/20 shadow-lg">
                        <Image
                          src="/Owner/owner3.webp"
                          alt="Handmade Team Naturals soap bars from the Morbi farmhouse kitchen"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white/20 shadow-lg">
                        <Image
                          src="/Owner/owner2.webp"
                          alt="Farmhouse in Morbi where Team Naturals ingredients are sourced"
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
