'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, DropletIcon, HandHeartIcon, LeafIcon, SparklesIcon, FlaskConicalIcon, ClockIcon } from 'lucide-react';
import { heroImage, storyImage } from "@/src/data/products";
import { Reveal } from "@/src/components/Reveal";
import { PromiseBanner } from "@/src/components/PromiseBanner";
import { FAQAccordion } from "@/src/components/FAQAccordion";
import { usePageLoad } from "@/src/hooks/usePageLoad";
import { PageSkeleton } from "@/src/components/Skeletons";

const pillars = [
  {
    icon: LeafIcon,
    title: 'Ingredients First',
    copy: 'Neem, multani mitti, rice bran, coffee, rose — chosen for their potent benefits, not just their scent. We use raw, unrefined ingredients to preserve their natural efficacy.',
  },
  {
    icon: HandHeartIcon,
    title: 'Made by Hand',
    copy: 'Automation has no place in our curing room. Every batch is poured, cut, and cured in small numbers, then wrapped one bar at a time to ensure absolute perfection.',
  },
  {
    icon: DropletIcon,
    title: 'Kind to Skin',
    copy: 'No sulphates, no synthetic fragrance, no artificial colour. Nothing your skin has to recover from. Just pure, clean hydration.',
  },
];

const craftSteps = [
  {
    icon: SparklesIcon,
    title: 'Sourcing the Best',
    description: 'We partner with local farmers to harvest the finest botanical extracts, clays, and essential oils at their peak potency.'
  },
  {
    icon: FlaskConicalIcon,
    title: 'Cold-Processing',
    description: 'By avoiding external heat, our cold-process method ensures that the natural glycerin and active nutrients remain intact within the soap.'
  },
  {
    icon: ClockIcon,
    title: 'The 6-Week Cure',
    description: 'Patience is an active ingredient. A long cure time allows excess water to evaporate, resulting in a significantly harder, longer-lasting, and milder bar.'
  }
];

export default function AboutPage() {
  const loading = usePageLoad(600);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-cream overflow-hidden">
      
      {/* 1. Immersive Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-forest flex items-center justify-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-forest/60 z-10" />
          <img src={heroImage} alt="Artisanal soap crafting" className="h-full w-full object-cover object-center" />
        </motion.div>
        
        <div className="relative z-20 mx-auto max-w-5xl px-5 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[12px] uppercase tracking-[0.3em] text-cream/80 mb-6"
          >
            Team Naturals
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-cream leading-[1.1]"
          >
            Rooted in Nature.<br />Crafted with Patience.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 w-px h-24 bg-gradient-to-b from-cream/50 to-transparent mx-auto"
          />
        </div>
      </section>

      {/* 2. Our Story (SEO/Editorial Layout) */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-32">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="absolute -inset-4 bg-forest/5 rounded-[2.5rem] transform -rotate-3 z-0" />
            <img src={storyImage} alt="Fresh natural handmade soap being cut" className="relative z-10 rounded-3xl object-cover shadow-2xl" />
          </div>
          <div>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight text-forest mb-6">
              Fewer ingredients, <br/><span className="text-terracotta">better behaved skin.</span>
            </h2>
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted">
              <p>
                Team Naturals started in a home kitchen with one simple, persistent question: <strong>why does everyday skincare require so many synthetic chemicals nobody can pronounce?</strong>
              </p>
              <p>
                Most commercial soap on the market today is effectively a detergent bar loaded with artificial fragrances and harsh surfactants. It cleans by stripping the skin of its natural lipid barrier, leaving a tight, squeaky feeling that actually signals dehydration and damage.
              </p>
              <p>
                We took a step back. Our bars are entirely cold-processed. This traditional method keeps the natural glycerin—a powerful humectant—locked inside. We let cold-pressed oils, pure clays, and rich botanicals do the heavy lifting. The result? Skin that is thoroughly cleansed, yet remarkably soft, balanced, and nourished.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 3. The Craft & Process (AEO Optimized) */}
      <section className="bg-forest text-cream py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/70 mb-4">The Craft</p>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight">How we make it matters.</h2>
            <p className="mt-6 text-cream/80 text-lg leading-relaxed">
              We do not take shortcuts. Every bar of Team Naturals soap represents weeks of meticulous craftsmanship, designed to deliver the highest quality natural skincare.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent z-0" />
            
            {craftSteps.map((step, idx) => (
              <Reveal key={step.title} delay={idx * 0.2} className="relative z-10 text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-forest-deep flex items-center justify-center border-4 border-forest mb-6 shadow-xl">
                  <step.icon size={36} className="text-terracotta" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-4">{step.title}</h3>
                <p className="text-cream/70 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Pillars (Interactive Values) */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:py-32 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="font-display text-4xl text-forest">What we stand for</h2>
        </Reveal>
        
        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, copy }, idx) => (
            <Reveal key={title} delay={idx * 0.15}>
              <motion.div 
                whileHover={{ y: -8 }}
                className="group h-full rounded-[2rem] border border-forest/10 bg-white p-8 sm:p-10 shadow-sm transition-shadow hover:shadow-xl hover:shadow-forest/5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-soft text-forest group-hover:bg-forest group-hover:text-cream transition-colors duration-500">
                  <Icon size={24} strokeWidth={1.5} />
                </span>
                <h3 className="mt-8 font-display text-2xl text-forest">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{copy}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Frequently Asked Questions (AEO/SEO Focus) */}
      <section className="bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted mb-4">Curious?</p>
            <h2 className="font-display text-4xl text-forest">Frequently Asked Questions</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <FAQAccordion />
          </Reveal>
        </div>
      </section>

      {/* 6. Founder Note */}
      <section className="mx-auto max-w-5xl px-5 py-20 lg:py-32 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[3rem] bg-cream-soft px-8 py-16 sm:px-16 sm:py-24 text-center">
          <div className="absolute top-0 left-0 w-32 h-32 bg-terracotta/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-forest/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <p className="relative z-10 text-[11px] uppercase tracking-[0.3em] text-muted mb-8">A Note from the Founder</p>
          <blockquote className="relative z-10 font-display text-3xl sm:text-4xl leading-[1.4] text-forest max-w-3xl mx-auto">
            &ldquo;I formulated the very first Neem bar for my brother&rsquo;s severe acne. Two years and countless batches later, we still make every single bar the exact same way — slowly, in small numbers, with raw ingredients we proudly put on our own skin.&rdquo;
          </blockquote>
          <p className="relative z-10 mt-10 font-display italic text-xl text-terracotta">
            — The Team Naturals Family
          </p>
        </Reveal>
      </section>

      {/* 7. Promise Banner */}
      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8">
        <Reveal>
          <PromiseBanner />
        </Reveal>
      </section>

      {/* 8. Call to Action */}
      <section className="bg-forest text-cream py-24 text-center">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl mb-8">Experience the difference.</h2>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-8 py-4 text-base font-medium text-white transition-all hover:bg-[#c25a41] hover:shadow-xl hover:shadow-terracotta/20 active:scale-[0.98]"
          >
            Shop the Collection 
            <ArrowRightIcon size={18} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
      
    </div>
  );
}