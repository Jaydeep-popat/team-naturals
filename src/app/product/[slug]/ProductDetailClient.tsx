'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LeafIcon, LockIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, PackageX, Loader2, XIcon, ZoomInIcon, StarIcon, ChevronDown, ChevronUp, TagIcon, CheckCircle2 } from 'lucide-react';
import { products as productsApi, reviews as reviewsApi } from "@/src/lib/api";
import { useCart } from "@/src/contexts/CartContext";
import toast from 'react-hot-toast';
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StarRating } from "@/src/components/StarRating";
import { QtyStepper } from "@/src/components/QtyStepper";
import dynamic from 'next/dynamic';
const PromiseBanner = dynamic(() => import("@/src/components/PromiseBanner").then(mod => mod.PromiseBanner), { ssr: true });
import { ProductCard } from "@/src/components/ProductCard";
import { ReviewModal } from '@/src/components/account/ReviewModal';
const AuthModal = dynamic(() => import("@/src/components/AuthModal").then(mod => mod.AuthModal), { ssr: false });
import { useAuth } from "@/src/contexts/AuthContext";
import { ProductDetailSkeleton, ProductCardSkeleton } from "@/src/components/Skeletons";
import { Reveal } from "@/src/components/Reveal";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { OptimizedImage } from '@/src/components/OptimizedImage';
import { extractProductImageAlt } from '@/src/lib/seo';
import { useAvailableDiscounts } from '@/src/hooks/useAvailableDiscounts';
import { triggerFlyToCart } from '@/src/components/FlyToCart';

const GALLERY_AUTOPLAY_MS = 6000;

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const loading = usePageLoad(750);
  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [qty, setQty] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [offersExpanded, setOffersExpanded] = useState(false);
  const { getCouponsForProduct } = useAvailableDiscounts();

  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (slug) {
      productsApi.getBySlug(slug)
        .then(res => {
          setProduct(res.data.product);
          // Fetch related products
          productsApi.list({ limit: '6', categoryId: res.data.product.categoryId })
            .then(relRes => {
              const filtered = relRes.data.products
                .filter((p: any) => p.productId !== res.data.product.productId)
                .slice(0, 4);
              setRelatedProducts(filtered);
            })
            .catch((err: any) => {
              console.error('Failed to load related products:', err);
            })
            .finally(() => setLoadingRelated(false));
        })
        .catch((err: any) => {
          if (err?.statusCode !== 404) {
            console.error('Failed to load product details:', err);
            toast.error('Failed to load product details');
          }
        })
        .finally(() => setLoadingProduct(false));
    }
  }, [slug]);

  useEffect(() => {
    setQty(1);
  }, [slug]);

  if (loading || loadingProduct) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-2xl text-forest">Product not found</h1>
        <p className="mt-3 text-sm text-muted">
          That page may have moved. Browse the full collection instead.
        </p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-sm text-cream">
          Go to Shop
        </Link>
      </div>
    );
  }

  const wished = wishlist.includes(product.productId || product.id);

  const rawImages = product.images || [];
  const images = rawImages.map((img: any) => typeof img === 'string' ? img : (img.url || '/placeholder.png'));
  const displayImages = images.length > 0 ? images : ['/placeholder.png'];
  const imageAlts = displayImages.map((_: string, i: number) =>
    extractProductImageAlt(rawImages, i, product.name)
  );
  const categoryLabel = typeof product.category === 'object' && product.category !== null 
    ? product.category.name 
    : (product.category === 'face-wash' ? 'Face Wash' : 'Soap');
  const categoryUrl = typeof product.category === 'object' && product.category !== null 
    ? product.category.slug 
    : product.category;
  
  const categoryId = typeof product.category === 'object' && product.category !== null 
    ? (product.category as any).categoryId || (product.category as any).id 
    : undefined;
  const applicableCoupons = getCouponsForProduct(product.productId || product.id, categoryId);

  const buyNow = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const rawImages = product.images || [];
    const images = rawImages.map((img: any) =>
      typeof img === 'string' ? img : (img?.url || '/placeholder.png')
    );
    triggerFlyToCart(e, images[0] || '/placeholder.png');
    
    addToCart(product, qty);
    router.push('/checkout/address');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const rawImages = product.images || [];
    const images = rawImages.map((img: any) =>
      typeof img === 'string' ? img : (img?.url || '/placeholder.png')
    );
    triggerFlyToCart(e, images[0] || '/placeholder.png');
    
    addToCart(product, qty);
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-white">
      <div className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Shop', to: '/shop' },
              {
                label: categoryLabel,
                to: `/shop/${categoryUrl}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl w-full gap-8 px-4 py-6 sm:px-5 sm:py-10 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <ProductGallery
          images={displayImages}
          imageAlts={imageAlts}
          productName={product.name}
        />

        {/* Info */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {categoryLabel}
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
              {product.name}
            </h1>
            <span className={`mt-1 flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
              product.stockQty === 0 
                ? 'bg-terracotta/10 text-terracotta'
                : product.stockQty !== undefined && product.stockQty > 0 && product.stockQty <= 5 
                ? 'bg-[#C2185B]/10 text-[#C2185B]'
                : 'bg-forest-mist text-forest'
            }`}>
              {product.stockQty === 0 
                ? 'Out of stock' 
                : product.stockQty !== undefined && product.stockQty > 0 && product.stockQty <= 5 
                ? `Only ${product.stockQty} left`
                : 'In stock'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={product.avgRating || product.rating || 5} size={15} />
            <span className="text-sm text-muted">
              {product.avgRating || product.rating || 5} ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-1">
            {(() => {
              const activeDiscount = (product as any).activeDiscount;
              const mrp = product.compareAtPrice ? Number(product.compareAtPrice) : Number(product.price || 0);
              const productSellingPrice = Number(product.price || 0);
              const productDiscountPercent = mrp > productSellingPrice ? Math.round(((mrp - productSellingPrice) / mrp) * 100) : 0;

              let eventPrice = productSellingPrice;
              if (activeDiscount) {
                if (activeDiscount.type === 'percent') {
                  eventPrice = productSellingPrice - (productSellingPrice * Number(activeDiscount.value) / 100);
                } else if (activeDiscount.type === 'flat') {
                  eventPrice = Math.max(0, productSellingPrice - Number(activeDiscount.value));
                }
              }

              const applicableCoupons = getCouponsForProduct(product.productId, product.categoryId);
              const bogoCoupon = applicableCoupons.find((c: any) => c.type === 'buy_x') || null;

              return (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl text-forest">₹{eventPrice.toFixed(2)}</span>
                    {productDiscountPercent > 0 && (
                      <>
                        <span className="text-lg text-muted line-through">₹{mrp}</span>
                        <span className="text-lg font-semibold text-[#388E3C]">
                          {productDiscountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {bogoCoupon && (
                    <div className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100/50 px-2.5 py-1.5 rounded-lg w-fit uppercase tracking-wide">
                      <span className="mr-1.5">🎁</span>
                      BUY {(bogoCoupon as any).minQuantity || 1} GET {(bogoCoupon as any).getQuantity || 1}{' '}
                      {Number((bogoCoupon as any).value) === 100 ? 'FREE' : `AT ${Number((bogoCoupon as any).value)}% OFF`}
                      {(bogoCoupon as any).minOrderAmount && Number((bogoCoupon as any).minOrderAmount) > 0
                        ? ` · ORDERS ABOVE ₹${Number((bogoCoupon as any).minOrderAmount)}`
                        : ''}
                    </div>
                  )}

                  {activeDiscount && (
                    <div className="flex flex-col rounded-lg border border-blue-100 bg-blue-50/40 p-3 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">🎁</span>
                        <span className="font-semibold text-blue-900 truncate">
                          {activeDiscount.event}
                        </span>
                      </div>
                      <div className="mt-1 pl-7 text-sm font-medium text-blue-800">
                        Extra {activeDiscount.type === 'percent' ? `${activeDiscount.value}%` : `₹${activeDiscount.value}`} OFF
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          
          <p className="mt-2 text-xs text-muted">MRP incl. of all taxes · {product.weight || product.size || '100g'}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.shortDescription || product.description || ''}</p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3 w-full max-w-full">
            <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label={product.name} />
            {user?.role === 'admin' ? (
              <div className="flex-1 min-w-[200px] flex gap-3">
                <div className="flex-1 flex items-center justify-center rounded-full bg-gray-100 px-6 py-3.5 text-sm font-medium text-gray-500 cursor-not-allowed border border-gray-200">
                  Admins cannot purchase
                </div>
              </div>
            ) : product.stockQty === 0 ? (
              <div className="flex-1 min-w-[200px] flex gap-3">
                <div className="flex-1 flex items-center justify-center rounded-full bg-gray-50 px-6 py-3.5 text-sm font-medium text-forest/50 cursor-not-allowed border border-forest/15">
                  Out of Stock
                </div>
              </div>
            ) : (
              <div className="flex flex-1 min-w-[240px] items-center gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-forest px-4 py-3.5 text-xs sm:text-sm font-bold text-cream transition-colors hover:bg-forest-deep"
                >
                  Add to Cart
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={buyNow}
                  className="flex-1 rounded-full bg-gold px-4 py-3.5 text-xs sm:text-sm font-bold text-forest-deep transition-colors hover:bg-gold/90"
                >
                  Buy Now
                </motion.button>
              </div>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(String(product.productId || product.id))}
              aria-label="Save to wishlist"
              aria-pressed={wished}
              className="rounded-full border border-forest/15 p-3.5 text-forest transition-colors hover:bg-cream shrink-0"
            >
              <HeartIcon
                size={17}
                strokeWidth={1.6}
                className={wished ? 'fill-terracotta text-terracotta' : ''}
              />
            </button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
            <LockIcon size={13} strokeWidth={1.8} /> Secure checkout · Free shipping over ₹499
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {(product.tags || []).map((t: string) => (
              <span
                key={t}
                className="rounded-full border border-forest/12 px-3 py-1.5 text-[11px] text-forest"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* About & product details */}
      {(product.description || product.sku || product.size || product.scent) && (
        <section className="mx-auto max-w-6xl px-5 pt-2 lg:px-8" aria-labelledby="about-heading">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
              {product.description && (
                <div className="lg:col-span-3">
                  <div className="rounded-3xl border border-forest/8 bg-cream-soft p-6 sm:p-8">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted">The full story</p>
                    <h2 id="about-heading" className="mt-2 font-display text-2xl text-forest sm:text-3xl">
                      About this product
                    </h2>
                    <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-muted">
                      {String(product.description)
                        .split(/\n{2,}|\r\n\r\n/)
                        .filter(Boolean)
                        .map((paragraph: string, i: number) => (
                          <p key={i}>{paragraph.trim()}</p>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <div className={product.description ? 'lg:col-span-2' : 'lg:col-span-5 lg:max-w-xl'}>
                <div className="rounded-3xl border border-forest/8 bg-white p-6 shadow-soft sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Specifications</p>
                  <h2 className="mt-2 font-display text-2xl text-forest">Product details</h2>
                  <dl className="mt-6 divide-y divide-forest/8">
                    <DetailRow label="Product name" value={product.name} />
                    <DetailRow label="Category" value={categoryLabel} />
                    {(product.size || product.weight) && (
                      <DetailRow label="Size / weight" value={product.size || product.weight} />
                    )}
                    {product.scent && <DetailRow label="Scent" value={product.scent} />}
                    {product.sku && <DetailRow label="SKU" value={product.sku} />}
                    <DetailRow
                      label="Price"
                      value={`₹${Number(product.price).toFixed(2)} (MRP incl. of all taxes)`}
                    />
                    <DetailRow
                      label="Availability"
                      value={
                        product.stockQty === 0
                          ? 'Out of stock'
                          : product.stockQty !== undefined && product.stockQty <= 5
                            ? `Only ${product.stockQty} left`
                            : 'In stock'
                      }
                    />
                  </dl>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Ingredients */}
      <section className="mx-auto max-w-6xl px-5 pt-6 lg:px-8" aria-labelledby="ingredients-heading">
        <Reveal>
          <h2 id="ingredients-heading" className="font-display text-2xl text-forest">
            Key ingredients
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(product.ingredients || []).map((ing: any) => (
              <li key={ing.name} className="flex gap-3 rounded-2xl border border-forest/8 bg-cream-soft p-4">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-forest-soft">
                  <LeafIcon size={17} strokeWidth={1.4} />
                </span>
                <span>
                  <span className="block text-sm text-forest">{ing.name}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">{ing.benefit}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8">
        <Reveal>
          <PromiseBanner compact />
        </Reveal>
      </section>

      <Reviews product={product} />

      <section
        className="mx-auto max-w-6xl px-5 pt-16 lg:px-8"
        aria-labelledby="related-heading"
      >
        <Reveal>
          <h2 id="related-heading" className="font-display text-2xl text-forest">
            You may also like
          </h2>
        </Reveal>
        <div className="scrollbar-none mt-6 flex gap-4 overflow-x-auto pb-4">
          {loadingRelated ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-${i}`} className="w-[240px] flex-shrink-0 sm:w-[260px]">
                <ProductCardSkeleton />
              </div>
            ))
          ) : relatedProducts.length > 0 ? (
            relatedProducts.map((p) => (
              <div key={p.productId || p.id} className="w-[240px] flex-shrink-0 sm:w-[260px]">
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-cream-soft py-14 text-center text-forest/70">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/5 mb-4 border border-forest/10">
                <PackageX size={28} className="text-forest/40" />
              </div>
              <p className="font-display font-semibold text-forest text-lg">No related products found</p>
              <p className="text-sm mt-1 max-w-sm">We couldn&apos;t find any additional products in this category at this time. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Auth gate modal ── */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="text-sm text-forest sm:max-w-[60%] sm:text-right">{value}</dd>
    </div>
  );
}

function ProductGallery({
  images,
  imageAlts,
  productName,
}: {
  images: string[];
  imageAlts: string[];
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const galleryCycleRef = React.useRef<number | null>(null);

  const goTo = (index: number) => {
    setActiveImage((index + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setActiveImage(index);
    setLightboxOpen(true);
    setIsPaused(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (images.length <= 1 || isPaused || lightboxOpen) return;

    galleryCycleRef.current = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, GALLERY_AUTOPLAY_MS);

    return () => {
      if (galleryCycleRef.current) {
        window.clearInterval(galleryCycleRef.current);
      }
    };
  }, [images.length, isPaused, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        setActiveImage((current) => (current - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        setActiveImage((current) => (current + 1) % images.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, images.length]);

  return (
    <>
      <div className="w-full max-w-full overflow-hidden">
        <div
          className="group relative aspect-[4/3] sm:aspect-square w-full max-w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-forest/8 bg-cream"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, x: 24, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 cursor-zoom-in"
              onClick={() => openLightbox(activeImage)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(activeImage);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View larger image of ${productName}`}
            >
              <OptimizedImage
                src={images[activeImage]}
                alt={imageAlts[activeImage]}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={activeImage === 0}
                className="object-cover pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-forest shadow-soft backdrop-blur">
            <ZoomInIcon size={13} strokeWidth={1.8} />
            Tap to enlarge
          </div>

          {images.length > 1 && (
            <div className="pointer-events-none absolute bottom-4 inset-x-0 z-20 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full bg-white/40 overflow-hidden transition-all duration-300 ${
                    i === activeImage ? 'w-8' : 'w-2'
                  }`}
                >
                  {i === activeImage && !isPaused && !lightboxOpen && (
                    <motion.div
                      key={`progress-${activeImage}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: GALLERY_AUTOPLAY_MS / 1000, ease: 'linear' }}
                      className="h-full bg-white"
                    />
                  )}
                  {i === activeImage && (isPaused || lightboxOpen) && (
                    <div className="h-full w-full bg-white" />
                  )}
                </div>
              ))}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeImage - 1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
              >
                <ChevronLeftIcon size={17} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeImage + 1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
              >
                <ChevronRightIcon size={17} strokeWidth={1.8} />
              </button>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => {
                setActiveImage(i);
                openLightbox(i);
              }}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === activeImage}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                i === activeImage
                  ? 'border-forest ring-2 ring-forest/15'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <OptimizedImage
                src={img}
                alt={imageAlts[i]}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/85 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image gallery`}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-cream transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
            >
              <XIcon size={22} strokeWidth={1.8} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeImage - 1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-cream transition-colors hover:bg-white/20 sm:left-8"
                >
                  <ChevronLeftIcon size={22} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(activeImage + 1);
                  }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-cream transition-colors hover:bg-white/20 sm:right-8"
                >
                  <ChevronRightIcon size={22} strokeWidth={1.8} />
                </button>
              </>
            )}

            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative h-[85vh] w-[90vw] max-w-5xl flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <OptimizedImage
                  src={images[activeImage]}
                  alt={imageAlts[activeImage]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  className="object-contain"
                />
              </div>
              <p className="mt-4 text-center text-sm text-cream/80 flex-shrink-0">
                {activeImage + 1} / {images.length} · {imageAlts[activeImage]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Reviews({ product }: { product: any }) {
  const { isAuthenticated } = useAuth();
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await reviewsApi.listProductReviews(product.productId || product.id);
      setReviewsList(res.data?.reviews || []);
    } catch (error: any) {
      if (error?.statusCode !== 403) {
        console.error('Failed to fetch product reviews:', error);
        toast.error('Failed to load reviews');
      }
    } finally {
      setIsLoading(false);
    }
  }, [product.productId, product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // handle submit is managed by ReviewModal now

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsList.filter((r: any) => r.rating === star).length,
  }));
  const total = reviewsList.length || 1;
  const avgRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1) 
    : '0.0';

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 lg:px-8" aria-labelledby="reviews-heading">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 id="reviews-heading" className="font-display text-2xl text-forest">
            Reviews
          </h2>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error('Please login to write a review.');
              } else {
                setShowReviewModal(true);
              }
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-bold text-cream transition-all hover:bg-forest-deep sm:w-auto hover:shadow-md"
          >
            <StarIcon size={16} className="fill-cream/30" /> Write a Review
          </button>
        </div>

        <div className="mt-6 grid gap-8 rounded-3xl border border-forest/8 bg-cream-soft p-6 sm:grid-cols-[180px_1fr] sm:p-8">
          <div className="text-center sm:text-left">
            <p className="font-display text-5xl text-forest">{avgRating}</p>
            <p className="mt-1 text-xs text-muted">out of 5</p>
            <div className="mt-2 flex justify-center sm:justify-start">
              <StarRating rating={Number(avgRating)} size={16} />
            </div>
            <p className="mt-2 text-xs text-muted">({reviewsList.length} reviews)</p>
          </div>
          <ul className="space-y-2">
            {distribution.map(({ star, count }) => (
              <li key={star} className="flex items-center gap-3 text-xs text-muted">
                <span className="w-12">{star} star</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest/10">
                  <motion.span
                    className="block h-full rounded-full bg-gold"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(count / total) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-6 text-right">{count}</span>
              </li>
            ))}
          </ul>
        </div>



        {isLoading ? (
          <div className="flex justify-center p-12 mt-6">
            <Loader2 size={24} className="animate-spin text-forest" />
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {reviewsList.length === 0 ? (
              <li className="text-center py-8 text-forest/50 text-sm">No reviews yet. Be the first to review!</li>
            ) : (
            reviewsList.map((r: any) => (
              <li key={r.reviewId} className="rounded-2xl border border-forest/8 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-mist text-sm text-forest font-semibold uppercase">
                      {r.user?.firstName?.charAt(0) || 'A'}
                    </span>
                    <div>
                      <p className="text-sm text-forest font-semibold">{r.user?.firstName} {r.user?.lastName}</p>
                      <StarRating rating={r.rating} size={11} />
                    </div>
                  </div>
                  <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.comment}</p>
              </li>
            )))}
          </ul>
        )}
        
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            fetchReviews(); // Refresh reviews when modal closes
          }}
          productId={product.productId || product.id}
          productName={product.name}
        />
      </Reveal>
    </section>
  );
}