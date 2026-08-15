import type { Metadata } from 'next';
import HomePageClient from '@/src/components/HomePageClient';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from '@/src/lib/seo';

const HOME_TITLE = 'Handmade Natural Soaps & Face Wash | Team Naturals';
const HOME_DESCRIPTION =
  'No palm oil, no harsh chemicals. Handmade soaps — neem, rose, multani mitti, coffee, rice — and a clay face wash, made in small batches.';

<<<<<<< HEAD
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function HomePage() {
=======
import dynamic from 'next/dynamic';
import { PromiseBanner } from "@/src/components/PromiseBanner";
import type { EventBannerModel } from "@/src/components/EventBanner";
import { EventBanner } from "@/src/components/EventBanner";
import { events as eventsApi } from "@/src/lib/api";
import { SectionHeading } from '@/src/components/SectionHeading';

const IngredientSpotlight = dynamic(() => import("@/src/components/IngredientSpotlight").then(mod => mod.IngredientSpotlight), { ssr: true });
const TrustBadges = dynamic(() => import("@/src/components/TrustBadges").then(mod => mod.TrustBadges), { ssr: true });
const TestimonialsCarousel = dynamic(() => import("@/src/components/TestimonialsCarousel").then(mod => mod.TestimonialsCarousel), { ssr: false });
const WhyChooseUs = dynamic(() => import("@/src/components/WhyChooseUs").then(mod => mod.WhyChooseUs), { ssr: true });
const OrderProcess = dynamic(() => import("@/src/components/OrderProcess").then(mod => mod.OrderProcess), { ssr: true });
const InstagramFeed = dynamic(() => import("@/src/components/InstagramFeed").then(mod => mod.InstagramFeed), { ssr: false });
const CatalogCTA = dynamic(() => import("@/src/components/CatalogCTA").then(mod => mod.CatalogCTA), { ssr: true });
const FAQAccordion = dynamic(() => import("@/src/components/FAQAccordion").then(mod => mod.FAQAccordion), { ssr: true });
import { Reveal, staggerContainer, staggerItem } from "@/src/components/Reveal";
import { ProductGridSkeleton, ProductCardSkeleton } from "@/src/components/Skeletons";
import { FirstTimeLoginPrompt } from "@/src/components/FirstTimeLoginPrompt";
import { OptimizedImage } from "@/src/components/OptimizedImage";

// JSON-LD structured data for best sellers (disabled temporarily for live data)
function ProductJsonLd() {
  return null;
}

export default function HomePage() {
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

    productsApi.list({ limit: '6' })
      .then(res => setLiveProducts(res.data.products))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load products');
      })
      .finally(() => setLoading(false));

    categoriesApi.list()
      .then(res => setLiveCategories(res.data.categories))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load categories');
      });

    eventsApi.getActiveHomepageEvent()
      .then(res => {
        if (res.data?.event) {
          setActiveEvent(res.data.event);
        }
      })
      .catch(err => console.error("Failed to load active event", err));
  }, [router, user?.role]);

  const bestSellers = liveProducts;
  const categoriesToDisplay = liveCategories.length > 0 ? liveCategories : staticCategories;

  return (
    <div className="w-full bg-white">
      <ProductJsonLd />
      <FirstTimeLoginPrompt />
      <Hero />

      {activeEvent && (
        <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-10">
          <EventBanner event={activeEvent} />
        </section>
      )}

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
          key={loading ? 'loading' : 'loaded'}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px' }}
          className="mt-10 flex items-start justify-center gap-6 sm:gap-10 lg:gap-16"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.li key={`cat-skel-${i}`} variants={staggerItem} className="flex flex-col items-center gap-3">
                <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                  <div className="h-full w-full animate-pulse rounded-full bg-forest/10" />
                </div>
                <div className="mt-1 h-5 w-24 animate-pulse rounded bg-forest/10" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-forest/10" />
              </motion.li>
            ))
          ) : categoriesToDisplay.map((cat) => {
            const isComingSoon = (cat as typeof cat & { comingSoon?: boolean }).comingSoon;
            const catLabel = cat.name || cat.label;
            const catImage = cat.imageUrl || cat.image || '/placeholder.png';
            
            return (
              <motion.li key={cat.slug} variants={staggerItem} className="flex flex-col items-center">
                {isComingSoon ? (
                  <div className="flex cursor-default flex-col items-center gap-3 opacity-50">
                    <div className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44">
                      <div className="h-full w-full overflow-hidden rounded-full border-2 border-dashed border-forest/20 bg-cream-soft">
                        <OptimizedImage
                          src={catImage}
                          alt=""
                          aria-hidden="true"
                          width={176}
                          height={176}
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-[15px] font-semibold text-forest/60 sm:text-base">{catLabel}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted/60">
                        <ClockIcon size={10} strokeWidth={1.6} /> Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="group flex flex-col items-center gap-3"
                    aria-label={`Shop ${catLabel} — ${cat.description || ''}`}
                  >
                    {/* Circle image */}
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="relative h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
                    >
                      <div className="h-full w-full overflow-hidden rounded-full border-2 border-forest/10 bg-cream shadow-soft transition-shadow duration-300 group-hover:border-forest/30 group-hover:shadow-lift">
                        <OptimizedImage
                          src={catImage}
                          alt={`${catLabel} category — handmade natural skincare`}
                          width={176}
                          height={176}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      {/* Ring pulse on hover */}
                      <div className="absolute inset-0 rounded-full ring-2 ring-forest/0 transition-all duration-300 group-hover:ring-forest/20 group-hover:ring-offset-2" />
                    </motion.div>
                    {/* Label */}
                    <div className="text-center">
                      <p className="font-display text-[15px] font-semibold text-forest sm:text-[17px]">{catLabel}</p>
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

        <BestSellersCarousel loading={loading} bestSellers={bestSellers} />
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
    // Derive active card index from scroll position
    const cardEls = el.querySelectorAll('[data-card]');
    if (cardEls.length === 0) return;
    let closestIdx = 0;
    let closestDist = Infinity;
    cardEls.forEach((card, i) => {
      const dist = Math.abs((card as HTMLElement).getBoundingClientRect().left - el.getBoundingClientRect().left);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
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
    (cards[i] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  const cardCount = loading ? 6 : bestSellers.length;

  return (
    <div className="relative mt-8">
      {/* Prev arrow — hidden on mobile, visible on sm+ */}
      <motion.button
        type="button"
        aria-label="Previous products"
        onClick={() => scroll('prev')}
        animate={{ opacity: canPrev ? 1 : 0, scale: canPrev ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute -left-2 top-[45%] z-10 hidden sm:flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:-left-5 sm:h-11 sm:w-11 lg:-left-6"
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
        className="absolute -right-2 top-[45%] z-10 hidden sm:flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-forest/12 bg-white text-forest shadow-lift transition-colors hover:bg-forest hover:text-cream sm:-right-5 sm:h-11 sm:w-11 lg:-right-6"
        style={{ pointerEvents: canNext ? 'auto' : 'none' }}
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
      </motion.button>

      {/* Scrollable track — 80vw cards on mobile so next card peeks through */}
      <div
        ref={trackRef}
        onScroll={updateState}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 scrollbar-none px-5 lg:px-10"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                data-card=""
                className="w-[160px] flex-none snap-start sm:w-[200px] lg:w-[calc((100%-36px)/4)]"
              >
                <ProductCardSkeleton />
              </div>
            ))
          : bestSellers.length === 0 ? (
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
                className="w-[160px] flex-none snap-start sm:w-[200px] lg:w-[calc((100%-36px)/4)]"
              >
                <ProductCard product={p} />
              </motion.div>
            )})}

        {/* Last card scroll-margin spacer so final card snaps fully */}
        <div className="w-[1px] flex-none" aria-hidden="true" />
      </div>

      {/* Row-level position dots (mobile only) */}
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

      {/* Fade edge hints on desktop */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent hidden sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent hidden sm:block" />
    </div>
  );
}

function Hero() {
>>>>>>> origin/yugal
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
<<<<<<< HEAD
      <HomePageClient />
=======
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
          className="order-1 lg:order-1 relative"
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
          className="relative order-2 mx-auto w-full max-w-[360px] lg:order-2"
        >
          {/* Main large image (Arch shape) */}
          <div className="relative ml-auto w-[85%] overflow-hidden rounded-t-[140px] rounded-b-[40px] border-[6px] border-white shadow-xl">
            <OptimizedImage
              src="/facewash/wash_1.webp"
              alt="Team Naturals facewash styled"
              width={360}
              height={480}
              priority
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          {/* Secondary overlapping image (Circle) */}
          <div className="absolute -bottom-6 left-0 w-[45%] overflow-hidden rounded-full border-[6px] border-white shadow-2xl">
            <OptimizedImage
              src="/facewash/wash_2.webp"
              alt="Team Naturals facewash alternate styling"
              width={162}
              height={162}
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
>>>>>>> origin/yugal
    </>
  );
}
