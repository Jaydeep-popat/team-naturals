'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  LeafIcon,
  PackageX,
} from 'lucide-react';
import { categories as staticCategories, heroImage, storyImage } from '@/src/data/products';
import { products as productsApi, categories as categoriesApi } from '@/src/lib/api';
import { ProductCard } from '@/src/components/ProductCard';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { PromiseBanner } from '@/src/components/PromiseBanner';
import type { EventBannerModel } from '@/src/components/EventBanner';
import { EventBanner } from '@/src/components/EventBanner';
import { events as eventsApi } from '@/src/lib/api';
import { SectionHeading } from '@/src/components/SectionHeading';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';
import { ProductCardSkeleton } from '@/src/components/Skeletons';
import { FirstTimeLoginPrompt } from '@/src/components/FirstTimeLoginPrompt';
import { withCloudinaryAuto } from '@/src/lib/cloudinary';

const IngredientSpotlight = dynamic(
  () => import('@/src/components/IngredientSpotlight').then((mod) => mod.IngredientSpotlight),
  { ssr: true }
);
const TrustBadges = dynamic(
  () => import('@/src/components/TrustBadges').then((mod) => mod.TrustBadges),
  { ssr: true }
);
const TestimonialsCarousel = dynamic(
  () => import('@/src/components/TestimonialsCarousel').then((mod) => mod.TestimonialsCarousel),
  { ssr: false }
);
const WhyChooseUs = dynamic(
  () => import('@/src/components/WhyChooseUs').then((mod) => mod.WhyChooseUs),
  { ssr: true }
);
const OrderProcess = dynamic(
  () => import('@/src/components/OrderProcess').then((mod) => mod.OrderProcess),
  { ssr: true }
);
const InstagramFeed = dynamic(
  () => import('@/src/components/InstagramFeed').then((mod) => mod.InstagramFeed),
  { ssr: false }
);
const CatalogCTA = dynamic(
  () => import('@/src/components/CatalogCTA').then((mod) => mod.CatalogCTA),
  { ssr: true }
);
const FAQAccordion = dynamic(
  () => import('@/src/components/FAQAccordion').then((mod) => mod.FAQAccordion),
  { ssr: true }
);

const SECTION_PAD = 'mx-auto max-w-7xl px-5 pt-10 sm:pt-14 lg:px-10';

function normalizeProductImages(product: any) {
  const images = (product.images || []).map((img: string | { url?: string }) =>
    withCloudinaryAuto(typeof img === 'string' ? img : img?.url || '/placeholder.png')
  );
  return { ...product, images };
}

function categoryLinkLabel(slug: string, label: string): string {
  if (slug === 'soaps') return 'Neem, rose, coffee & rice soaps';
  if (slug === 'face-wash') return 'Multani mitti face wash';
  return `Browse ${label}`;
}

export default function HomePageClient() {
  const [liveProducts, setLiveProducts] = React.useState<any[]>([]);
  const [liveCategories, setLiveCategories] = React.useState<any[]>([]);
  const [activeEvent, setActiveEvent] = React.useState<EventBannerModel | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user?.role === 'admin' && !sessionStorage.getItem('admin_initial_redirect')) {
      sessionStorage.setItem('admin_initial_redirect', 'true');
      router.replace('/admin');
      return;
    }

    productsApi
      .list({ limit: '8' })
      .then((res) => setLiveProducts(res.data.products.map(normalizeProductImages)))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load products');
      })
      .finally(() => setLoading(false));

    categoriesApi
      .list()
      .then((res) => setLiveCategories(res.data.categories))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load categories');
      });

    eventsApi
      .getActiveHomepageEvent()
      .then((res) => {
        if (res.data?.event) {
          setActiveEvent(res.data.event);
        }
      })
      .catch((err) => console.error('Failed to load active event', err));
  }, [router, user?.role]);

  const bestSellers = liveProducts;
  const categoriesToDisplay = liveCategories.length > 0 ? liveCategories : staticCategories;

  return (
    <div className="w-full bg-white">
      <FirstTimeLoginPrompt />
      <Hero />

      {/* Brand intro */}
      <section className={`${SECTION_PAD} pt-8 sm:pt-10`} aria-labelledby="intro-heading">
        <Reveal className="max-w-3xl">
          <h2 id="intro-heading" className="font-display text-xl text-forest sm:text-2xl">
            Soap bars and a clay face wash, made by hand
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
            We work in small batches — no palm oil, no harsh chemicals. Our soaps use neem, rose,
            multani mitti, coffee, and rice. The face wash is a multani mitti clay cleanser for
            daily use and de-tanning.
          </p>
        </Reveal>
      </section>

      {activeEvent && (
        <section className={`${SECTION_PAD} pt-6 sm:pt-8`}>
          <EventBanner event={activeEvent} />
        </section>
      )}

      {/* Product line highlights */}
      <section className={SECTION_PAD} aria-labelledby="categories-heading">
        <Reveal className="text-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-muted">What we make</p>
          <h2 id="categories-heading" className="mt-2 font-display text-2xl text-forest sm:text-3xl">
            Soaps and face wash
          </h2>
        </Reveal>

        <motion.ul
          key={loading ? 'loading' : 'loaded'}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px' }}
          className="mt-6 flex items-start justify-center gap-4 sm:mt-8 sm:gap-10 lg:gap-16"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.li
                  key={`cat-skel-${i}`}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative h-24 w-24 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                    <div className="h-full w-full animate-pulse rounded-full bg-forest/10" />
                  </div>
                  <div className="mt-1 h-4 w-20 animate-pulse rounded bg-forest/10" />
                </motion.li>
              ))
            : categoriesToDisplay.map((cat) => {
                const isComingSoon = (cat as typeof cat & { comingSoon?: boolean }).comingSoon;
                const catLabel = cat.name || cat.label;
                const catImage = cat.imageUrl || cat.image || '/placeholder.png';
                const catSlug = cat.slug;
                const isCloudinary = /cloudinary\.com/i.test(catImage);

                return (
                  <motion.li key={catSlug} variants={staggerItem} className="flex flex-col items-center">
                    {isComingSoon ? (
                      <div className="flex cursor-default flex-col items-center gap-2 opacity-50">
                        <div className="relative h-24 w-24 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                          <div className="h-full w-full overflow-hidden rounded-full border-2 border-dashed border-forest/20 bg-cream-soft">
                            {isCloudinary ? (
                              <Image
                                src={withCloudinaryAuto(catImage)}
                                alt=""
                                aria-hidden="true"
                                width={176}
                                height={176}
                                className="h-full w-full object-cover grayscale"
                              />
                            ) : (
                              <Image
                                src={catImage}
                                alt=""
                                aria-hidden="true"
                                width={176}
                                height={176}
                                className="h-full w-full object-cover grayscale"
                              />
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-display text-sm font-semibold text-forest/60 sm:text-base">
                            {catLabel}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted/60">
                            <ClockIcon size={10} strokeWidth={1.6} /> Coming Soon
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/shop/${catSlug}`}
                        className="group flex flex-col items-center gap-2"
                        aria-label={`${categoryLinkLabel(catSlug, catLabel)} — ${cat.description || ''}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.06 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative h-24 w-24 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                        >
                          <div className="h-full w-full overflow-hidden rounded-full border-2 border-forest/10 bg-cream shadow-soft transition-shadow duration-300 group-hover:border-forest/30 group-hover:shadow-lift">
                            {isCloudinary ? (
                              <Image
                                src={withCloudinaryAuto(catImage)}
                                alt={`${catLabel} — handmade natural skincare from Team Naturals`}
                                width={176}
                                height={176}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <Image
                                src={catImage}
                                alt={`${catLabel} — handmade natural skincare from Team Naturals`}
                                width={176}
                                height={176}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            )}
                          </div>
                          <div
                            className="absolute inset-0 rounded-full ring-2 ring-forest/0 transition-all duration-300 group-hover:ring-forest/20 group-hover:ring-offset-2"
                            aria-hidden="true"
                          />
                        </motion.div>
                        <div className="text-center">
                          <p className="font-display text-sm font-semibold text-forest sm:text-[17px]">
                            {catLabel}
                          </p>
                          <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] font-medium text-terracotta transition-gap duration-200 group-hover:gap-1.5 sm:text-[12px]">
                            {categoryLinkLabel(catSlug, catLabel)}
                            <ArrowRightIcon
                              size={11}
                              strokeWidth={2.2}
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </p>
                        </div>
                      </Link>
                    )}
                  </motion.li>
                );
              })}
        </motion.ul>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl pt-10 sm:pt-14" aria-labelledby="best-heading">
        <Reveal className="flex items-end justify-between gap-4 px-5 lg:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Popular picks</p>
            <SectionHeading className="mt-2" id="best-heading">
              Best-selling soaps and face wash
            </SectionHeading>
          </div>
          <Link
            href="/shop"
            className="flex flex-shrink-0 items-center gap-1.5 text-sm text-forest transition-colors hover:text-forest-soft"
          >
            Full shop <ArrowRightIcon size={15} strokeWidth={1.7} />
          </Link>
        </Reveal>

        <BestSellersSection loading={loading} bestSellers={bestSellers} />
      </section>

      <section className={SECTION_PAD}>
        <Reveal>
          <IngredientSpotlight />
        </Reveal>
      </section>

      <section className={SECTION_PAD}>
        <TestimonialsCarousel />
      </section>

      <section className={SECTION_PAD}>
        <WhyChooseUs />
      </section>

      <div className="mt-10 sm:mt-14">
        <OrderProcess />
      </div>

      <section className={SECTION_PAD}>
        <CatalogCTA />
      </section>

      <section className={SECTION_PAD} aria-labelledby="story-heading">
        <Reveal className="grid items-center gap-6 overflow-hidden rounded-3xl border border-forest/8 bg-cream-soft sm:grid-cols-2 sm:gap-8">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full min-h-[200px]">
            <Image
              src={storyImage}
              alt="Hand-cut soap bars curing on a wooden rack in a small-batch workshop"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">How we make it</p>
            <h2 id="story-heading" className="mt-3 font-display text-2xl leading-tight text-forest sm:text-3xl">
              Cut, cured, and wrapped by hand
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Each bar is poured and cut in small runs. We do not use palm oil or harsh chemicals —
              just ingredients we can list without a glossary.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-forest/15 px-5 py-2.5 text-sm text-forest transition-colors hover:bg-white"
            >
              About Team Naturals <ArrowRightIcon size={15} strokeWidth={1.7} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className={SECTION_PAD}>
        <FAQAccordion />
      </section>

      <section className={`${SECTION_PAD} pt-12 sm:pt-16`}>
        <InstagramFeed />
      </section>

      <ClosingCTA />
    </div>
  );
}

function BestSellersSection({
  loading,
  bestSellers,
}: {
  loading: boolean;
  bestSellers: any[];
}) {
  const mobileProducts = bestSellers.slice(0, 4);

  return (
    <>
      {/* Mobile: 2×2 compact grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 px-5 sm:hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={`mobile-skel-${i}`}>
                <ProductCardSkeleton />
              </div>
            ))
          : mobileProducts.length === 0
            ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-8 text-forest/40">
                  <PackageX size={40} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">No products available right now.</p>
                </div>
              )
            : mobileProducts.map((p) => (
                <ProductCard key={(p as any).productId || p.id} product={p} compact />
              ))}
      </div>

      {/* Desktop: horizontal carousel */}
      <div className="hidden sm:block">
        <BestSellersCarousel loading={loading} bestSellers={bestSellers} />
      </div>
    </>
  );
}

function BestSellersCarousel({
  loading,
  bestSellers,
}: {
  loading: boolean;
  bestSellers: any[];
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);
  const [activeIdx, setActiveIdx] = React.useState(0);

  function updateState() {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cardEls = el.querySelectorAll('[data-card]');
    if (cardEls.length === 0) return;
    let closestIdx = 0;
    let closestDist = Infinity;
    cardEls.forEach((card, i) => {
      const dist = Math.abs(
        (card as HTMLElement).getBoundingClientRect().left - el.getBoundingClientRect().left
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    setActiveIdx(closestIdx);
  }

  function scroll(dir: 'prev' | 'next') {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[data-card]') as HTMLElement | null;
    const cardW = firstCard ? firstCard.clientWidth + 12 : 300;
    el.scrollBy({ left: dir === 'next' ? cardW : -cardW, behavior: 'smooth' });
  }

  function scrollToCard(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('[data-card]');
    (cards[i] as HTMLElement)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  const cardCount = loading ? 6 : bestSellers.length;

  return (
    <div className="relative mt-6">
      <motion.button
        type="button"
        aria-label="Previous products"
        onClick={() => scroll('prev')}
        animate={{ opacity: canPrev ? 1 : 0, scale: canPrev ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute -left-5 top-[45%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:flex lg:-left-6"
        style={{ pointerEvents: canPrev ? 'auto' : 'none' }}
      >
        <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.8} />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Next products"
        onClick={() => scroll('next')}
        animate={{ opacity: canNext ? 1 : 0, scale: canNext ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute -right-5 top-[45%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:flex lg:-right-6"
        style={{ pointerEvents: canNext ? 'auto' : 'none' }}
      >
        <ChevronRightIcon className="h-5 w-5" strokeWidth={1.8} />
      </motion.button>

      <div
        ref={trackRef}
        onScroll={updateState}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-none"
        style={
          {
            paddingLeft: 'max(20px, calc((100vw - min(1280px, 100vw)) / 2 + 20px))',
            paddingRight: 20,
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties
        }
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                data-card=""
                className="w-[260px] flex-none snap-start lg:w-[calc((100%-48px)/4)]"
              >
                <ProductCardSkeleton />
              </div>
            ))
          : bestSellers.length === 0
            ? (
                <div className="flex w-full flex-col items-center justify-center py-12 text-forest/40">
                  <PackageX size={48} className="mb-4 opacity-50" />
                  <p className="font-medium">No products available at the moment.</p>
                </div>
              )
            : bestSellers.map((p, i) => {
                const productId = (p as any).productId || p.id;
                return (
                  <motion.div
                    key={productId}
                    data-card=""
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="w-[260px] flex-none snap-start lg:w-[calc((100%-48px)/4)]"
                  >
                    <ProductCard product={p} />
                  </motion.div>
                );
              })}

        <div className="w-[1px] flex-none" aria-hidden="true" />
      </div>

      {cardCount > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: cardCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to product ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-5 bg-forest' : 'w-1.5 bg-forest/20'
              }`}
            />
          ))}
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-8 bg-gradient-to-r from-white to-transparent sm:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-8 bg-gradient-to-l from-white to-transparent sm:block"
        aria-hidden="true"
      />
    </div>
  );
}

function Hero() {
  const heroStaggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const heroItemVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <section
        className="relative overflow-hidden bg-white pb-8 pt-20 sm:pb-12 sm:pt-24"
        aria-labelledby="hero-heading"
      >
        {/* Static Background Blobs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-[560px] w-[560px] rounded-[46%_54%_38%_62%/56%_44%_56%_44%] bg-forest-mist/70 sm:-right-16 lg:right-4"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          aria-hidden="true"
          className="pointer-events-none absolute -left-[240px] bottom-0 h-[480px] w-[480px] rounded-full bg-cream/80"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-2 lg:gap-10 lg:px-10">
          {/* Left Text & CTA Content - Entrance from Left */}
          <motion.div
            variants={heroStaggerContainer}
            initial="hidden"
            animate="visible"
            className="order-1 relative lg:order-1"
          >
            <div
              className="absolute -left-[10%] -top-[20%] -z-10 h-[140%] w-[120%] rounded-full bg-cream blur-[80px]"
              aria-hidden="true"
            />

            {/* Leaf Icon - Entrance Fade */}
            <motion.div
              className="absolute -left-2 -top-6 text-forest-soft sm:-left-20 sm:-top-12"
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <LeafIcon size={36} strokeWidth={1} className="sm:h-[72px] sm:w-[72px]" />
            </motion.div>

            {/* Top Badge */}
            <motion.span
              variants={heroItemVariant}
              className="inline-flex items-center gap-2 rounded-full border border-forest/12 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-forest shadow-sm"
            >
              Handmade in small batches
            </motion.span>

            {/* Main Title */}
            <motion.h1
              variants={heroItemVariant}
              id="hero-heading"
              className="mt-4 font-display text-[40px] font-extrabold leading-[1.05] text-forest sm:text-[56px] lg:text-[64px]"
            >
              Handmade natural soaps
              <br />
              <span className="font-extrabold text-forest-soft">&amp; face wash</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={heroItemVariant}
              className="mt-4 max-w-md text-[15px] font-medium leading-relaxed text-forest/90 sm:text-[16px]"
            >
              Neem, rose, multani mitti, coffee, and rice soaps — plus a clay face wash. No palm
              oil. No harsh chemicals.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={heroItemVariant} className="mt-6 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/shop/soaps"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-semibold text-cream shadow-md transition-all hover:bg-forest-deep hover:shadow-lg"
                >
                  Browse handmade soaps <ArrowRightIcon size={16} strokeWidth={2} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Bullets */}
            <motion.ul
              variants={heroItemVariant}
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted"
            >
              <li className="flex items-center gap-1.5">
                <LeafIcon size={14} strokeWidth={1.8} className="text-forest-soft" />
                No palm oil
              </li>
              <li className="flex items-center gap-1.5">
                <LeafIcon size={14} strokeWidth={1.8} className="text-forest-soft" />
                No harsh chemicals
              </li>
              <li className="flex items-center gap-1.5">
                <LeafIcon size={14} strokeWidth={1.8} className="text-forest-soft" />
                Handmade
              </li>
            </motion.ul>
          </motion.div>

          {/* Right Product Images - Slide in from Right & Bottom */}
          <div className="relative order-2 mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:order-2">
            {/* Main Product Image - Slide in from Right */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative ml-auto w-[85%] overflow-hidden rounded-t-[140px] rounded-b-[40px] border-[6px] border-white shadow-2xl"
            >
              <Image
                src="/facewash/wash_1.webp"
                alt="Team Naturals multani mitti face wash bottle beside a lathered clay cleanser on stone"
                width={480}
                height={640}
                priority
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Secondary Inset Image - Slide up from Bottom */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-4 left-0 w-[45%] overflow-hidden rounded-full border-[6px] border-white shadow-2xl sm:-bottom-6"
            >
              <Image
                src="/facewash/wash_2.webp"
                alt="Close-up of multani mitti face wash lather on skin during a gentle cleanse"
                width={240}
                height={240}
                className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <TrustBadges />
    </>
  );
}

function ClosingCTA() {
  const [sent, setSent] = React.useState(false);

  return (
    <section
      className="mx-auto mt-10 max-w-7xl px-5 sm:mt-14 lg:px-10"
      aria-labelledby="closing-cta-heading"
    >
      <Reveal className="grid overflow-hidden rounded-3xl bg-forest sm:grid-cols-2">
        <div className="p-7 sm:p-10">
          <h2 id="closing-cta-heading" className="font-display text-2xl text-cream sm:text-3xl">
            Ready to try the soaps or face wash?
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
            Pick a bar or the clay face wash — same small-batch recipe we use every day in the
            workshop.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/shop/soaps"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-white"
            >
              Handmade soaps <ArrowRightIcon size={15} strokeWidth={1.7} />
            </Link>
            <Link
              href="/shop/face-wash"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-sm text-cream transition-colors hover:bg-cream/10"
            >
              Face wash
            </Link>
          </div>
          <form
            className="mt-6 flex max-w-sm overflow-hidden rounded-full bg-white p-1"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Email for restock notes"
              className="w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/70"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 rounded-full bg-terracotta px-5 py-2.5 text-sm text-white transition-colors hover:bg-terracotta/90"
            >
              Join
            </motion.button>
          </form>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-cream/80"
            >
              You&apos;re on the list.
            </motion.p>
          )}
        </div>
        <div className="relative hidden min-h-[220px] sm:block">
          <Image
            src={heroImage}
            alt="Assorted Team Naturals soap bars and face wash arranged on a wooden board"
            fill
            sizes="50vw"
            className="object-cover opacity-90"
          />
        </div>
      </Reveal>
    </section>
  );
}
