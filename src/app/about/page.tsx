'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, DropletIcon, HandHeartIcon, LeafIcon } from 'lucide-react';
import { heroImage, storyImage } from "@/src/data/products";
import { Reveal } from "@/src/components/Reveal";
import { PromiseBanner } from "@/src/components/PromiseBanner";
import { Breadcrumb } from "@/src/components/Breadcrumb";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { PageSkeleton } from "@/src/components/Skeletons";

const pillars = [
  {
    icon: LeafIcon,
    title: 'Ingredients first',
    copy: 'Neem, multani mitti, rice bran, coffee, rose — chosen for what they do, not how they market.',
  },
  {
    icon: HandHeartIcon,
    title: 'Made by hand',
    copy: 'Every batch is poured, cut and cured in small numbers, then wrapped one bar at a time.',
  },
  {
    icon: DropletIcon,
    title: 'Kind to skin',
    copy: 'No sulphates, no synthetic fragrance, no artificial colour. Nothing your skin has to recover from.',
  },
];

export default function AboutPage() {
  const loading = usePageLoad(600);
  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-white pb-8">
      <header className="border-b border-forest/8 bg-cream-soft">
        <div className="mx-auto max-w-6xl px-5 py-12 text-center lg:px-8">
          <h1 className="font-display text-4xl text-forest">Our Story</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            Team Naturals started in a home kitchen, with one question: why does skincare need so
            many things nobody can pronounce?
          </p>
          <div className="mt-4 flex justify-center">
            <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <Reveal className="grid items-center gap-8 sm:grid-cols-2">
          <img src={storyImage} alt="Fresh soap being cut by hand" className="rounded-3xl object-cover" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Why natural</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-forest">
              Fewer ingredients, better behaved skin
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Most commercial soap is a detergent bar with fragrance on top — it cleans by
              stripping. Our bars are cold-processed, which keeps the natural glycerin in and lets
              oils, clays and botanicals do the work. Skin ends up clean without the tight, squeaky
              aftermath.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              It takes four to six weeks to cure a batch. We think that wait is the point.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <ul className="grid gap-4 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, copy }) => (
              <li key={title} className="rounded-3xl border border-forest/8 bg-cream-soft p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest">
                  <Icon size={18} strokeWidth={1.4} />
                </span>
                <h3 className="mt-4 font-display text-xl text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8">
        <Reveal className="grid items-center gap-8 overflow-hidden rounded-3xl border border-forest/8 sm:grid-cols-[1fr_320px]">
          <div className="p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted">Founder note</p>
            <blockquote className="mt-4 font-display text-2xl leading-snug text-forest">
              &ldquo;I made the first Neem bar for my brother&rsquo;s acne. Two years later we
              still make every batch the same way — slowly, in small numbers, with ingredients
              we&rsquo;d put on our own skin.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm text-muted">— Founder, Team Naturals</p>
          </div>
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 lg:px-8">
        <Reveal>
          <PromiseBanner />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-14 text-center lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl text-forest">Try a bar, see for yourself</h2>
          <Link
            href="/shop"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm text-cream hover:bg-forest-deep"
          >
            Shop the collection <ArrowRightIcon size={16} strokeWidth={1.8} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}