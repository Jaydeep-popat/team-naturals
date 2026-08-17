'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, Share2Icon, CheckCircle2Icon, SparklesIcon } from 'lucide-react';
import { getBlogPost, formatDate } from '@/src/lib/blog';
import { Breadcrumb } from '@/src/components/Breadcrumb';

export default function BlogPostDetailClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <head>
        <title>{`${post.title} | Team Naturals Blog`}</title>
        <meta name="description" content={post.description} />
      </head>

      <div className="w-full bg-cream min-h-screen pb-20">
        {/* Header Breadcrumb */}
        <div className="border-b border-forest/8 bg-cream-soft">
          <div className="mx-auto max-w-4xl px-5 py-4 sm:px-8">
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                { label: 'Blog', to: '/blog' },
                { label: post.title },
              ]}
            />
          </div>
        </div>

        {/* Article Header */}
        <header className="mx-auto max-w-4xl px-5 pt-10 pb-8 sm:px-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="rounded-full bg-forest/8 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-forest">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <ClockIcon size={14} /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <CalendarIcon size={14} /> {formatDate(post.date)}
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight text-forest sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-base font-medium leading-relaxed text-forest/80 sm:text-lg">
            {post.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-y border-forest/10 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-cream font-bold text-sm">
                TN
              </div>
              <div>
                <p className="text-sm font-bold text-forest">{post.author}</p>
                <p className="text-xs text-muted">Farmhouse Workshop, Morbi</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 px-4 py-2 text-xs font-bold text-forest transition-colors hover:bg-white"
            >
              <Share2Icon size={14} /> Share
            </button>
          </div>
        </header>

        {/* Article Body */}
        <main className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="rounded-3xl border border-forest/10 bg-white p-7 sm:p-12 shadow-soft prose prose-stone max-w-none text-forest">
            <p className="text-base sm:text-lg leading-relaxed font-medium text-forest/85">
              Walk into any supermarket or scroll through Instagram for five minutes, and you&apos;ll see it everywhere — &ldquo;100% natural,&rdquo; &ldquo;pure organic,&rdquo; &ldquo;chemical-free,&rdquo; &ldquo;clean beauty.&rdquo; The words are reassuring. They make you feel like you&apos;re making a healthier choice for your skin. But here&apos;s the part most brands hope you never ask: who&apos;s actually checking if any of that is true?
            </p>

            <p className="text-base sm:text-lg font-bold text-terracotta mt-4">
              The uncomfortable answer is — almost no one.
            </p>

            <hr className="my-8 border-forest/10" />

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mt-8 mb-4">
              &ldquo;Natural&rdquo; Isn&apos;t a Legal Word
            </h2>

            <p className="text-base leading-relaxed font-medium text-forest/80">
              Here&apos;s something that surprises most people: in India, and in most of the world, there is no legal definition for the word &ldquo;natural&rdquo; when it comes to cosmetics. Any brand can print it on a label. There&apos;s no regulator standing behind it, no minimum percentage of natural ingredients required, no test that has to be passed. It&apos;s a marketing word, not a safety claim.
            </p>

            <p className="text-base leading-relaxed font-medium text-forest/80 mt-4">
              &ldquo;Organic&rdquo; is a little different — it actually means something, but only when it&apos;s backed by a real certification like COSMOS, Ecocert, or India&apos;s PGS-India. Without one of those, &ldquo;organic&rdquo; on a label is just as unregulated as &ldquo;natural.&rdquo; A product can be 95% water and synthetic filler, with a pinch of aloe vera extract, and still legally call itself natural — because water is technically a natural ingredient too.
            </p>

            <div className="my-6 rounded-2xl bg-cream-soft border border-forest/10 p-5">
              <p className="text-sm font-semibold text-forest">
                This gap between what a label promises and what the bottle actually contains has a name: <strong>greenwashing</strong>. And the beauty industry has become one of its biggest playgrounds.
              </p>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mt-10 mb-4">
              How Brands Get Away With It
            </h2>

            <p className="text-base leading-relaxed font-medium text-forest/80 mb-4">
              A few tricks show up again and again once you start paying attention:
            </p>

            <ul className="space-y-4 my-6">
              <li className="flex items-start gap-3 text-sm sm:text-base text-forest/85">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                <span><strong>Vague, feel-good words.</strong> &ldquo;Clean,&rdquo; &ldquo;pure,&rdquo; &ldquo;gentle,&rdquo; &ldquo;eco-friendly&rdquo; — none of these have an agreed-upon meaning in cosmetics. They&apos;re chosen because they sell, not because they describe anything specific.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-forest/85">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                <span><strong>Green packaging, not green formulas.</strong> Kraft paper, leaf illustrations, earthy colours — a lot of &ldquo;natural&rdquo; branding is really just visual design. The ingredient list underneath often hasn&apos;t changed at all.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-forest/85">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                <span><strong>Burying the truth in the ingredient list.</strong> Ingredients are listed in descending order of concentration. If water, synthetic emulsifiers, or preservatives top the list and the plant extract everyone&apos;s excited about is somewhere near the bottom, that &ldquo;natural&rdquo; hero ingredient might make up less than 1% of the actual product.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-forest/85">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                <span><strong>Fake or borrowed certification logos.</strong> Some brands design their own seal that looks official — a leaf badge, a checkmark, a made-up &ldquo;certified organic&rdquo; stamp — without ever going through an actual certifying body. If you can&apos;t find that logo on the certifier&apos;s own website, it isn&apos;t real.</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-forest/85">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta" />
                <span><strong>Hiding behind &ldquo;fragrance.&rdquo;</strong> A single word like &ldquo;parfum&rdquo; or &ldquo;fragrance&rdquo; on a label can legally represent dozens of undisclosed synthetic chemicals, some of which are known irritants.</span>
              </li>
            </ul>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mt-10 mb-4">
              Why This Matters More Than It Seems
            </h2>

            <p className="text-base leading-relaxed font-medium text-forest/80">
              This isn&apos;t just a marketing annoyance. For people with sensitive skin — which is a huge part of who actually seeks out &ldquo;natural&rdquo; products in the first place — a mislabelled product can mean real irritation, breakouts, or allergic reactions from ingredients they were actively trying to avoid. Counterfeit or poorly regulated &ldquo;natural&rdquo; cosmetics have also tested positive for heavy metals and banned substances in various markets, precisely because oversight is so thin.
            </p>

            <p className="text-base leading-relaxed font-medium text-forest/80 mt-4">
              In India, cosmetics fall under the Drugs and Cosmetics Act and the Cosmetics Rules, but enforcement around claims like &ldquo;natural&rdquo; and &ldquo;organic&rdquo; is still catching up. Regulators are expected to tighten this over the coming years, but until formal definitions exist, the responsibility of verifying a claim largely falls on the customer — which isn&apos;t really fair, but it&apos;s the reality right now.
            </p>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mt-10 mb-4">
              How to Actually Check a Product
            </h2>

            <p className="text-base leading-relaxed font-medium text-forest/80 mb-4">
              You don&apos;t need a chemistry degree to protect yourself. A few habits go a long way:
            </p>

            <div className="space-y-3 my-6">
              {[
                { title: 'Read the ingredient list, not the front label.', desc: 'The front of the bottle is marketing. The ingredient list is the actual product.' },
                { title: 'Look up unfamiliar ingredients', desc: 'Use a free tool like INCIDecoder before you buy.' },
                { title: 'Check certifications at the source.', desc: 'If a brand claims a certification, search for the brand\'s name directly on that certifying body\'s website — don\'t just trust the logo on the packaging.' },
                { title: 'Be wary of claims with no explanation.', desc: 'A real natural or handmade brand should be able to tell you exactly what\'s in the product and why, without hiding behind buzzwords.' },
                { title: 'Buy directly from the brand when you can.', desc: 'Third-party resellers, especially at unusually low prices, are a common source of counterfeit "natural" products.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-cream-soft/60 p-4 border border-forest/8">
                  <CheckCircle2Icon size={18} className="mt-0.5 shrink-0 text-forest" />
                  <p className="text-sm font-medium text-forest/85">
                    <strong>{item.title}</strong> {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest mt-10 mb-4">
              Where We Stand
            </h2>

            <p className="text-base leading-relaxed font-medium text-forest/80">
              We started Team Naturals because we were tired of this exact problem — bottles full of promises and short on honesty. Every bar we make is handmade in small batches, without palm oil, without the harsh chemicals that hide behind &ldquo;fragrance&rdquo; on other labels, and without a single ingredient we wouldn&apos;t be comfortable explaining to you directly.
            </p>

            <div className="mt-8 rounded-3xl bg-forest p-8 text-center text-cream">
              <SparklesIcon size={32} className="mx-auto text-gold mb-3" />
              <h3 className="font-display text-2xl font-bold">We&apos;d rather you check our ingredient list.</h3>
              <p className="mt-2 text-sm text-cream/80 max-w-md mx-auto">
                Ask us questions rather than taking our word for it. That&apos;s the whole point.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3 text-xs font-bold text-forest transition-colors hover:bg-white"
              >
                Browse Honest Soaps
              </Link>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-terracotta transition-colors"
            >
              <ArrowLeftIcon size={16} /> Back to all articles
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
