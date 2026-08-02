'use client';

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, LeafIcon, RabbitIcon, SparklesIcon } from 'lucide-react';
import { categories, heroImage, products, storyImage } from "@/src/data/products";
import { ProductCard } from "@/src/components/ProductCard";

import { PromiseBanner } from "@/src/components/PromiseBanner";
import { IngredientSpotlight } from "@/src/components/IngredientSpotlight";
import { DiscountPoster } from "@/src/components/DiscountPoster";

import { SectionHeading } from '@/src/components/SectionHeading';
import { TrustBadges } from '@/src/components/TrustBadges';
import { TestimonialsCarousel } from "@/src/components/TestimonialsCarousel";
import { WhyChooseUs } from "@/src/components/WhyChooseUs";
import { OrderProcess } from "@/src/components/OrderProcess";
import { InstagramFeed } from "@/src/components/InstagramFeed";
import { CatalogCTA } from "@/src/components/CatalogCTA";
import { FAQAccordion } from "@/src/components/FAQAccordion";
import { Reveal, staggerContainer, staggerItem } from "@/src/components/Reveal";
import { ProductGridSkeleton } from "@/src/components/Skeletons";

// JSON-LD structured data for best sellers
function ProductJsonLd() {
  const bestSellers = products.filter((p) => p.bestSeller);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Team Naturals Best Sellers',
    itemListElement: bestSellers.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.shortDescription,
        image: `https://teamnaturals.in${p.images[0]}`,
        url: `https://teamnaturals.in/product/${p.slug}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: p.price,
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: p.rating,
          reviewCount: p.reviewCount,
        },
      },
    })),
  };
  return (
    <Script
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

export default function HomePage() {
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 6);

  return (
    <div className="w-full bg-white">
      <ProductJsonLd />
      <Hero />



      {/* Shop by category — circular tiles */}
      <section
        className="mx-auto max-w-7xl px-5 pt-16 lg:px-10"
        aria-labelledby="categories-heading"
      >
        <Reveal className="text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Explore Our Collection</p>
          <h2 id="categories-heading" className="mt-2 font-display text-2xl text-forest sm:text-3xl">
            Shop Natural Skincare by Category
          </h2>
        </Reveal>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-10 flex items-start justify-center gap-6 sm:gap-10 lg:gap-16"
        >
          {categories.map((cat) => {
            const isComingSoon = (cat as typeof cat & { comingSoon?: boolean }).comingSoon;
            return (
              <motion.li key={cat.slug} variants={staggerItem} className="flex flex-col items-center">
                {isComingSoon ? (
                  <div className="flex cursor-default flex-col items-center gap-3 opacity-50">
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                      <div className="h-full w-full overflow-hidden rounded-full border-2 border-dashed border-forest/20 bg-cream-soft">
                        <img
                          src={cat.image}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-[15px] font-semibold text-forest/60 sm:text-base">{cat.label}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted/60">
                        <ClockIcon size={10} strokeWidth={1.6} /> Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="group flex flex-col items-center gap-3"
                    aria-label={`Shop ${cat.label} — ${cat.description}`}
                  >
                    {/* Circle image */}
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                    >
                      <div className="h-full w-full overflow-hidden rounded-full border-2 border-forest/10 bg-cream shadow-soft transition-shadow duration-300 group-hover:border-forest/30 group-hover:shadow-lift">
                        <img
                          src={cat.image}
                          alt={`${cat.label} category — handmade natural skincare`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      {/* Ring pulse on hover */}
                      <div className="absolute inset-0 rounded-full ring-2 ring-forest/0 transition-all duration-300 group-hover:ring-forest/20 group-hover:ring-offset-2" />
                    </motion.div>
                    {/* Label */}
                    <div className="text-center">
                      <p className="font-display text-[15px] font-semibold text-forest sm:text-[17px]">{cat.label}</p>
                      <p className="mt-0.5 flex items-center justify-center gap-1 text-[12px] font-medium text-terracotta transition-gap duration-200 group-hover:gap-1.5">
                        Shop Now
                        <ArrowRightIcon size={11} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* Best Sellers — horizontal carousel */}
      <section
        className="mx-auto max-w-7xl pt-20"
        aria-labelledby="best-heading"
      >
        <Reveal className="flex items-end justify-between gap-4 px-5 lg:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Customer Favorites</p>
            <SectionHeading className="mt-2" id="best-heading">
              Our Best-Selling Skincare
            </SectionHeading>
          </div>
          <Link
            href="/shop"
            className="flex flex-shrink-0 items-center gap-1.5 text-sm text-forest transition-colors hover:text-forest-soft"
          >
            View all <ArrowRightIcon size={15} strokeWidth={1.7} />
          </Link>
        </Reveal>

        <BestSellersCarousel loading={false} bestSellers={bestSellers} />
      </section>

      {/* Discount Poster */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <DiscountPoster />
      </section>

      {/* Ingredient Spotlight */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <Reveal>
          <IngredientSpotlight />
        </Reveal>
      </section>

      {/* Customer Reviews */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <TestimonialsCarousel />
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <WhyChooseUs />
      </section>

      {/* Order Process */}
      <div className="mt-20">
        <OrderProcess />
      </div>

      {/* Our Promise */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <Reveal>
          <PromiseBanner />
        </Reveal>
      </section>

      {/* Catalog / Wholesale CTA */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <CatalogCTA />
      </section>

      {/* Our Craft — Story */}
      <section
        className="mx-auto max-w-7xl px-5 pt-20 lg:px-10"
        aria-labelledby="story-heading"
      >
        <Reveal className="grid items-center gap-8 overflow-hidden rounded-3xl border border-forest/8 bg-cream-soft sm:grid-cols-2">
          <img
            src={storyImage}
            alt="Handmade soap bars being cut and cured by hand in a small batch kitchen"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="p-7 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Our craft</p>
            <h2 id="story-heading" className="mt-3 font-display text-3xl leading-tight text-forest">
              Small batches, honest ingredients
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Every bar is cut, cured and wrapped by hand. No fillers, no synthetic fragrance, no
              shortcuts — just ingredients your skin already understands.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-forest/15 px-5 py-2.5 text-sm text-forest transition-colors hover:bg-white"
            >
              Read our story <ArrowRightIcon size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-10">
        <FAQAccordion />
      </section>

      {/* Instagram Feed */}
      <section className="mx-auto max-w-7xl px-5 pt-24 lg:px-10">
        <InstagramFeed />
      </section>

      <Newsletter />
    </div>
  );
}

function BestSellersCarousel({
  loading,
  bestSellers,
}: {
  loading: boolean;
  bestSellers: ReturnType<typeof products.filter>;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  function updateButtons() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  function scroll(dir: 'prev' | 'next') {
    const el = trackRef.current;
    if (!el) return;
    const cardW = el.querySelector('div')?.clientWidth ?? 300;
    el.scrollBy({ left: dir === 'next' ? cardW + 16 : -(cardW + 16), behavior: 'smooth' });
  }

  return (
    <div className="relative mt-8">
      {/* Prev arrow */}
      <motion.button
        type="button"
        aria-label="Previous products"
        onClick={() => scroll('prev')}
        animate={{ opacity: canPrev ? 1 : 0, scale: canPrev ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:-left-5 sm:h-11 sm:w-11 lg:-left-6"
        style={{ pointerEvents: canPrev ? 'auto' : 'none' }}
      >
        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
      </motion.button>

      {/* Next arrow */}
      <motion.button
        type="button"
        aria-label="Next products"
        onClick={() => scroll('next')}
        animate={{ opacity: canNext ? 1 : 0, scale: canNext ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:-right-5 sm:h-11 sm:w-11 lg:-right-6"
        style={{ pointerEvents: canNext ? 'auto' : 'none' }}
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
      </motion.button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onScroll={updateButtons}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 scrollbar-none lg:px-10"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton w-[220px] flex-none snap-start rounded-[28px] sm:w-[260px] lg:w-[calc((100%-48px)/4)]"
                style={{ aspectRatio: '4/6' }}
              />
            ))
          : bestSellers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="w-[220px] flex-none snap-start sm:w-[260px] lg:w-[calc((100%-48px)/4)]"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
      </div>

      {/* Fade edge hints */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}

function Hero() {
  return (
    <>
    <section
      className="relative overflow-hidden bg-white pb-12 pt-24 sm:pb-16 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      {/* Right organic blob background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-[560px] w-[560px] rounded-[46%_54%_38%_62%/56%_44%_56%_44%] bg-forest-mist/70 sm:-right-16 lg:right-4"
      />
      {/* Left cream circle background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
        className="pointer-events-none absolute -left-[240px] bottom-0 h-[480px] w-[480px] rounded-full bg-cream/80"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="order-2 lg:order-1 relative"
        >
          {/* Decorative organic shape behind text */}
          <div className="absolute -left-[10%] -top-[20%] -z-10 h-[140%] w-[120%] rounded-full bg-cream blur-[80px]" />

          {/* Floating Leaves */}
          <motion.div
            className="absolute -left-12 -top-8 text-forest-soft sm:-left-20 sm:-top-12"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LeafIcon size={48} strokeWidth={1} className="sm:h-[72px] sm:w-[72px]" />
          </motion.div>
          <motion.div
            className="absolute -bottom-10 left-10 text-gold sm:-bottom-16 sm:left-16"
            animate={{ y: [0, 10, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <LeafIcon size={32} strokeWidth={1} className="sm:h-[48px] sm:w-[48px]" />
          </motion.div>

          <motion.span variants={staggerItem} className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white px-3.5 py-1.5 text-[11px] text-forest">
            <SparklesIcon size={13} strokeWidth={1.6} className="text-gold" />
            Handmade in small batches
          </motion.span>
          {/* HERO HEADLINE — visually dominant, bold */}
          <motion.h1
            variants={staggerItem}
            id="hero-heading"
            className="mt-4 font-display text-[48px] font-extrabold leading-[1.02] text-forest sm:text-[60px] lg:text-[68px]"
          >
            Handmade Natural
            <br />
            <span className="text-forest-soft font-extrabold">Skincare & Soaps.</span>
          </motion.h1>

          <motion.p variants={staggerItem} className="mt-4 max-w-md text-[16px] font-medium leading-relaxed text-forest/90">
            Experience the purest cold-processed neem soaps and multani mitti clay face wash. 100% natural, cruelty-free ingredients your skin will love.
          </motion.p>

          <motion.div variants={staggerItem} className="mt-5 flex flex-wrap items-center gap-3">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-forest-deep"
              >
                Shop the Collection <ArrowRightIcon size={16} strokeWidth={1.8} />
              </Link>
            </motion.div>
            <Link
              href="/about"
              className="rounded-full border border-forest/15 px-6 py-3 text-sm text-forest transition-colors hover:bg-cream"
            >
              Our story
            </Link>
          </motion.div>

          <motion.ul variants={staggerItem} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-muted">
            <li className="flex items-center gap-1.5">
              <LeafIcon size={15} strokeWidth={1.5} className="text-forest-soft" /> 100% Natural
            </li>
            <li className="flex items-center gap-1.5">
              <RabbitIcon size={15} strokeWidth={1.5} className="text-forest-soft" /> Cruelty-Free
            </li>
            <li className="flex items-center gap-1.5">
              <SparklesIcon size={15} strokeWidth={1.5} className="text-forest-soft" /> No Harsh
              Chemicals
            </li>
          </motion.ul>
        </motion.div>

        {/* Hero image — eager load for LCP */}
        {/* Hero image composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto w-full max-w-[360px] lg:order-2"
        >
          {/* Main large image (Arch shape) */}
          <div className="relative ml-auto w-[85%] overflow-hidden rounded-t-[140px] rounded-b-[40px] border-[6px] border-white shadow-xl">
            <img
              src="/facewash/wash_1.png"
              alt="Team Naturals facewash styled"
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          {/* Secondary overlapping image (Circle) */}
          <div className="absolute -bottom-6 left-0 w-[45%] overflow-hidden rounded-full border-[6px] border-white shadow-2xl">
            <img
              src="/facewash/wash_2.png"
              alt="Team Naturals facewash alternate styling"
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          {/* Premium floating glass card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute -right-2 top-8 z-10 sm:-right-6 sm:top-12 scale-90 sm:scale-100 origin-right"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              className="flex items-center gap-3.5 rounded-2xl border border-white/50 bg-white/70 p-3 pr-6 shadow-[0_12px_40px_rgba(31,61,43,0.15)] backdrop-blur-md"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-forest text-cream shadow-inner">
                <LeafIcon size={22} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[15px] font-bold text-forest">100% Organic</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest-soft">
                  Dermatologist Tested
                </span>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>

    <TrustBadges />
    </>
  );
}

function Newsletter() {
  const [sent, setSent] = React.useState(false);

  return (
    <section
      className="mx-auto mt-20 max-w-7xl px-5 lg:px-10"
      aria-labelledby="newsletter-heading"
    >
      <Reveal className="grid overflow-hidden rounded-3xl bg-forest sm:grid-cols-2">
        <div className="p-8 sm:p-10">
          <h2 id="newsletter-heading" className="font-display text-2xl text-cream sm:text-3xl">
            Join the Naturals Circle
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
            Restock alerts, small-batch drops and simple skincare notes. No spam, ever.
          </p>
          <form
            className="mt-6 flex max-w-sm overflow-hidden rounded-full bg-white p-1"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/70"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 rounded-full bg-terracotta px-5 py-2.5 text-sm text-white transition-colors hover:bg-terracotta/90"
            >
              Join Now
            </motion.button>
          </form>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-cream/80"
            >
              You&apos;re on the list — welcome in.
            </motion.p>
          )}
        </div>
        <div className="relative hidden sm:block">
          <img
            src={storyImage}
            alt="Natural soap ingredients laid out on a wooden surface"
            loading="lazy"
            className="h-full w-full object-cover opacity-90"
          />
        </div>
      </Reveal>
    </section>
  );
}