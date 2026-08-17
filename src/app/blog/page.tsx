'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpenIcon, ClockIcon, ArrowRightIcon, TagIcon, SparklesIcon } from 'lucide-react';
import { blogPosts, formatDate } from '@/src/lib/blog';
import { Reveal, staggerContainer, staggerItem } from '@/src/components/Reveal';

export default function BlogListingPage() {
  const featured = blogPosts[0];

  return (
    <>
      <head>
        <title>Blog & Stories | Team Naturals – Honest Skincare Insights</title>
        <meta
          name="description"
          content="Read honest articles, ingredient breakdowns, and stories behind cold-process handmade soaps from the Team Naturals workshop in Morbi, Gujarat."
        />
      </head>

      <div className="w-full bg-cream min-h-screen pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest to-forest-deep pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 70%, #D4A96A 0%, transparent 50%), radial-gradient(circle at 70% 30%, #8BBF9F 0%, transparent 50%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-3xl px-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cream">
              <BookOpenIcon size={13} /> Workshop Journal
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl lg:text-6xl">
              Blog &amp; Articles
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-cream/75 sm:text-base">
              Unfiltered truths about cosmetics, ingredient breakdowns, and how we handcraft natural soaps at our Morbi farmhouse.
            </p>
          </motion.div>
        </section>

        {/* Featured Post Hero Card */}
        {featured && (
          <section className="relative -mt-10 mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl border border-forest/10 bg-white p-7 sm:p-12 shadow-soft transition-all duration-300 hover:shadow-lift">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-forest/8 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-forest">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <ClockIcon size={13} /> {featured.readTime}
                  </span>
                  <span className="text-xs font-semibold text-muted">· {formatDate(featured.date)}</span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-extrabold text-forest sm:text-3xl lg:text-4xl group-hover:text-terracotta transition-colors">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>

                <p className="mt-4 text-sm font-medium leading-relaxed text-forest/75 sm:text-base max-w-3xl">
                  {featured.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-forest/8 pt-6">
                  <span className="text-xs font-bold text-forest">By {featured.author}</span>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-xs font-bold text-cream transition-colors hover:bg-forest-deep"
                  >
                    Read Full Article <ArrowRightIcon size={14} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20 sm:px-8">
          <h3 className="font-display text-2xl font-bold text-forest mb-8">All Articles</h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.slug}
                variants={staggerItem}
                className="group flex flex-col justify-between rounded-3xl border border-forest/10 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
                      {post.category}
                    </span>
                    <span className="text-xs font-medium text-muted">{post.readTime}</span>
                  </div>

                  <h4 className="mt-3 font-display text-xl font-bold text-forest group-hover:text-terracotta transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h4>

                  <p className="mt-3 text-xs font-medium leading-relaxed text-muted line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-forest/8 pt-4">
                  <span className="text-xs text-muted font-medium">{formatDate(post.date)}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forest group-hover:text-terracotta transition-colors"
                  >
                    Read <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </div>
    </>
  );
}
