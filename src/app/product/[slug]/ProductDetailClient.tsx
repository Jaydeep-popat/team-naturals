'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LeafIcon, LockIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon, PackageX, Loader2 } from 'lucide-react';
import { products as productsApi, reviews as reviewsApi } from "@/src/lib/api";
import { useCart } from "@/src/contexts/CartContext";
import toast from 'react-hot-toast';
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StarRating } from "@/src/components/StarRating";
import { QtyStepper } from "@/src/components/QtyStepper";
import dynamic from 'next/dynamic';
const PromiseBanner = dynamic(() => import("@/src/components/PromiseBanner").then(mod => mod.PromiseBanner), { ssr: true });
import { ProductCard } from "@/src/components/ProductCard";
const AuthModal = dynamic(() => import("@/src/components/AuthModal").then(mod => mod.AuthModal), { ssr: false });
import { useAuth } from "@/src/contexts/AuthContext";
import { ProductDetailSkeleton, ProductCardSkeleton } from "@/src/components/Skeletons";
import { Reveal } from "@/src/components/Reveal";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { OptimizedImage } from '@/src/components/OptimizedImage';
import { extractProductImageAlt } from '@/src/lib/seo';

export default function ProductDetailClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const loading = usePageLoad(750);
  const [product, setProduct] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const galleryCycleRef = React.useRef<number | null>(null);

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
    setActiveImage(0);
    setQty(1);
  }, [slug]);

  useEffect(() => {
    const imagesCount = product?.images?.length || 1;
    if (imagesCount > 1) {
      galleryCycleRef.current = window.setInterval(() => {
        setActiveImage((current) => (current + 1) % imagesCount);
      }, 2000);
    }
    return () => {
      if (galleryCycleRef.current) {
        window.clearInterval(galleryCycleRef.current);
      }
    };
  }, [product]);

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

  const buyNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addToCart(product, qty);
    router.push('/checkout/address');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addToCart(product, qty);
  };

  return (
    <div className="w-full bg-white">
      <div className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-6xl px-5 py-5 lg:px-8">
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

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* Gallery */}
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-3xl border border-forest/8 bg-cream">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, x: 40, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <OptimizedImage
                  src={displayImages[activeImage]}
                  alt={imageAlts[activeImage]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={activeImage === 0}
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators (Bottom of image) */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {displayImages.map((_: string, i: number) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full bg-white/40 overflow-hidden transition-all duration-300 ${
                      i === activeImage ? 'w-8' : 'w-2'
                    }`}
                  >
                    {i === activeImage && (
                      <motion.div
                        key={activeImage}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'linear' }}
                        className="h-full bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setActiveImage((i) => (i - 1 + displayImages.length) % displayImages.length)
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
            >
              <ChevronLeftIcon size={17} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((i) => (i + 1) % displayImages.length)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
            >
              <ChevronRightIcon size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            {displayImages.map((img: string, i: number) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === activeImage}
                className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition-colors ${
                  i === activeImage ? 'border-forest' : 'border-transparent opacity-70 hover:opacity-100'
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

        {/* Info */}
        <div>
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
            <StarRating rating={product.rating || 5} size={15} />
            <span className="text-sm text-muted">
              {product.rating || 5} ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            {(() => {
              const activeDiscount = (product as any).activeDiscount;
              const originalPrice = Number(product.price || 0);
              const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
              
              let finalPrice = originalPrice;
              let discountLabel = '';
              
              if (activeDiscount) {
                if (activeDiscount.type === 'percent') {
                  finalPrice = originalPrice - (originalPrice * Number(activeDiscount.value) / 100);
                  discountLabel = `${activeDiscount.value}% off`;
                } else if (activeDiscount.type === 'flat') {
                  finalPrice = Math.max(0, originalPrice - Number(activeDiscount.value));
                  discountLabel = `₹${activeDiscount.value} off`;
                }
              }

              return (
                <>
                  <span className="font-display text-3xl text-forest">₹{finalPrice.toFixed(2)}</span>
                  {(activeDiscount || (compareAtPrice && compareAtPrice > originalPrice)) && (
                    <>
                      <span className="text-lg text-muted line-through">₹{compareAtPrice || originalPrice}</span>
                      <span className="text-lg font-semibold text-[#388E3C]">
                        {activeDiscount ? discountLabel : `${Math.round((((compareAtPrice || originalPrice) - originalPrice) / (compareAtPrice || originalPrice)) * 100)}% off`}
                      </span>
                    </>
                  )}
                </>
              );
            })()}
          </div>
          {product.activeDiscount && (
            <div className="mt-2">
              <span className="inline-block bg-[#FFC5C5] text-forest font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.activeDiscount.event}
              </span>
            </div>
          )}
          <p className="mt-1 text-xs text-muted">MRP incl. of all taxes · {product.weight || product.size || '100g'}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.shortDescription || product.description || ''}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label={product.name} />
            {user?.role === 'admin' ? (
              <div className="flex-1 flex gap-3">
                <div className="flex-1 flex items-center justify-center rounded-full bg-gray-100 px-6 py-3.5 text-sm font-medium text-gray-500 cursor-not-allowed border border-gray-200">
                  Admins cannot purchase
                </div>
              </div>
            ) : product.stockQty === 0 ? (
              <div className="flex-1 flex gap-3">
                <div className="flex-1 flex items-center justify-center rounded-full bg-gray-50 px-6 py-3.5 text-sm font-medium text-forest/50 cursor-not-allowed border border-forest/15">
                  Out of Stock
                </div>
              </div>
            ) : (
              <>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-forest px-6 py-3.5 text-sm text-cream transition-colors hover:bg-forest-deep sm:flex-none sm:px-8"
                >
                  Add to Cart
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={buyNow}
                  className="flex-1 rounded-full bg-gold px-6 py-3.5 text-sm text-forest-deep transition-colors hover:bg-gold/90 sm:flex-none sm:px-8"
                >
                  Buy Now
                </motion.button>
              </>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Save to wishlist"
              aria-pressed={wished}
              className="rounded-full border border-forest/15 p-3.5 text-forest transition-colors hover:bg-cream"
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

          <p className="mt-7 border-t border-forest/8 pt-6 text-sm leading-relaxed text-muted">
            {product.fullDescription}
          </p>
        </div>
      </div>

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

      {/* Details table */}
      <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8" aria-labelledby="details-heading">
        <Reveal>
          <h2 id="details-heading" className="font-display text-2xl text-forest">
            Product details
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-forest/8">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-forest/8">
                <Row label="Name" value={product.name} />
                <Row label="Weight" value={product.weight || product.size || '100g'} />
                <Row label="Price" value={`₹${product.price} (MRP incl. of all taxes)`} />
                <Row
                  label="Category"
                  value={categoryLabel}
                />
              </tbody>
            </table>
          </div>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="bg-white">
      <th scope="row" className="w-40 bg-cream-soft px-5 py-3.5 font-normal text-muted">
        {label}
      </th>
      <td className="px-5 py-3.5 text-forest">{value}</td>
    </tr>
  );
}

function Reviews({ product }: { product: any }) {
  const { isAuthenticated } = useAuth();
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review.');
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await reviewsApi.add(product.productId || product.id, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // Refetch to show the review immediately
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h2 id="reviews-heading" className="font-display text-2xl text-forest">
          Reviews
        </h2>

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
      </Reveal>
    </section>
  );
}