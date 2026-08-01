'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LeafIcon, LockIcon, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getProductBySlug, getRelated } from "@/src/data/products";
import { useCart } from "@/src/contexts/CartContext";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { StarRating } from "@/src/components/StarRating";
import { QtyStepper } from "@/src/components/QtyStepper";
import { PromiseBanner } from "@/src/components/PromiseBanner";
import { ProductCard } from "@/src/components/ProductCard";
import { ProductDetailSkeleton } from "@/src/components/Skeletons";
import { Reveal } from "@/src/components/Reveal";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import type { Product } from '@/src/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const loading = usePageLoad(750);
  const product = slug ? getProductBySlug(slug) : undefined;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart, wishlist, toggleWishlist } = useCart();

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;

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

  const wished = wishlist.includes(product.id);
  const related = getRelated(product);

  const buyNow = () => {
    addToCart(product, qty);
    router.push('/checkout');
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
                label: product.category === 'face-wash' ? 'Face Wash' : 'Soaps',
                to: `/shop/${product.category}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-forest/8 bg-cream">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={product.images[activeImage]}
                alt={`${product.name} — view ${activeImage + 1}`}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <button
              type="button"
              onClick={() =>
                setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)
              }
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
            >
              <ChevronLeftIcon size={17} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-forest shadow-soft backdrop-blur hover:bg-white"
            >
              <ChevronRightIcon size={17} strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            {product.images.map((img, i) => (
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
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {product.category === 'face-wash' ? 'Face Wash' : 'Soap'}
          </p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl leading-tight text-forest sm:text-4xl">
              {product.name}
            </h1>
            <span className="mt-1 flex-shrink-0 rounded-full bg-forest-mist px-3 py-1 text-[11px] text-forest">
              In stock
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={product.rating} size={15} />
            <span className="text-sm text-muted">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-5 font-display text-3xl text-forest">₹{product.price}</p>
          <p className="mt-1 text-xs text-muted">MRP incl. of all taxes · {product.weight}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.shortDescription}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label={product.name} />
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => addToCart(product, qty)}
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
            {product.tags.map((t) => (
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
            {product.ingredients.map((ing) => (
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
                <Row label="Weight" value={product.weight} />
                <Row label="Price" value={`₹${product.price} (MRP incl. of all taxes)`} />
                <Row
                  label="Category"
                  value={product.category === 'face-wash' ? 'Face Wash' : 'Soap'}
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
          {related.map((p) => (
            <div key={p.id} className="w-[240px] flex-shrink-0 sm:w-[260px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
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

function Reviews({ product }: { product: Product }) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }));
  const total = product.reviews.length || 1;

  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 lg:px-8" aria-labelledby="reviews-heading">
      <Reveal>
        <h2 id="reviews-heading" className="font-display text-2xl text-forest">
          Reviews
        </h2>
        <p className="mt-1 text-xs text-muted">
          Sample reviews shown for layout — this is a demo store.
        </p>

        <div className="mt-6 grid gap-8 rounded-3xl border border-forest/8 bg-cream-soft p-6 sm:grid-cols-[180px_1fr] sm:p-8">
          <div className="text-center sm:text-left">
            <p className="font-display text-5xl text-forest">{product.rating}</p>
            <p className="mt-1 text-xs text-muted">out of 5</p>
            <div className="mt-2 flex justify-center sm:justify-start">
              <StarRating rating={product.rating} size={16} />
            </div>
            <p className="mt-2 text-xs text-muted">({product.reviewCount} reviews)</p>
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

        <ul className="mt-6 space-y-3">
          {product.reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-forest/8 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-mist text-sm text-forest">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm text-forest">{r.name}</p>
                    <StarRating rating={r.rating} size={11} />
                  </div>
                </div>
                <span className="text-xs text-muted">{r.date}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.comment}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}