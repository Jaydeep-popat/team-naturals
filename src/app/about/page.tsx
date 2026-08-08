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
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="w-full bg-cream overflow-hidden">
      
      {/* 1. Immersive Hero Section with Parallax & Glassmorphism */}
      <section ref={heroRef} className="relative h-[95vh] min-h-[600px] w-full overflow-hidden bg-forest flex items-center justify-center pt-10">
        <motion.div style={{ y, scale: heroScale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/20 to-forest/80 z-10" />
          <img src={heroImage} alt="Artisanal soap crafting" className="h-full w-full object-cover object-center" />
        </motion.div>
        
        <div className="relative z-20 mx-auto max-w-4xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="rounded-[2.5rem] border border-white/20 bg-white/10 p-8 sm:p-16 backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden relative"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-terracotta/30 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cream/20 blur-[80px] rounded-full pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative z-10 mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/20 text-cream backdrop-blur-sm border border-white/20 shadow-inner"
            >
              <LeafIcon size={24} strokeWidth={1.5} />
            </motion.div>
            <p className="relative z-10 text-[12px] font-bold uppercase tracking-[0.4em] text-cream mb-6">
              Team Naturals
            </p>
            <h1 className="relative z-10 font-display text-4xl sm:text-6xl md:text-7xl font-bold text-cream leading-[1.1]">
              Rooted in Nature.<br />Crafted with Patience.
            </h1>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cream/80">Discover</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-terracotta via-terracotta/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* 2. Our Story (Asymmetric Editorial Layout) */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5 lg:col-start-1" direction="right">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-cream-soft via-forest/5 to-transparent blur-xl transition-all duration-700 group-hover:blur-2xl" />
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-forest/10"
                >
                  <img src={storyImage} alt="Fresh natural handmade soap being cut" className="w-full object-cover aspect-[4/5] sm:aspect-auto sm:h-[600px] transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
                
                {/* Floating decorative badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-6 -right-6 z-20 flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/40 bg-cream/80 backdrop-blur-md shadow-xl text-center"
                >
                  <span className="font-display text-3xl font-bold text-forest">100%</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">Natural</span>
                </motion.div>
              </div>
            </Reveal>
            
            <div className="lg:col-span-6 lg:col-start-7 xl:col-start-7 xl:pl-8">
              <Reveal>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-terracotta">Our Story</p>
                <h2 className="mb-8 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-forest">
                  Fewer ingredients, <br/><span className="italic text-terracotta/90">better behaved skin.</span>
                </h2>
              </Reveal>
              
              <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted/90">
                <Reveal delay={0.2}>
                  <p className="text-xl font-medium text-forest/80 leading-snug">
                    Team Naturals started in a home kitchen with one simple, persistent question: <strong className="text-forest">why does everyday skincare require so many synthetic chemicals nobody can pronounce?</strong>
                  </p>
                </Reveal>
                
                <Reveal delay={0.3}>
                  <div className="h-px w-12 bg-terracotta/30 my-6" />
                </Reveal>

                <Reveal delay={0.4}>
                  <p>
                    Most commercial soap on the market today is effectively a detergent bar loaded with artificial fragrances and harsh surfactants. It cleans by stripping the skin of its natural lipid barrier, leaving a tight, squeaky feeling that actually signals dehydration and damage.
                  </p>
                </Reveal>
                <Reveal delay={0.5}>
                  <p>
                    We took a step back. Our bars are entirely cold-processed. This traditional method keeps the natural glycerin—a powerful humectant—locked inside. We let cold-pressed oils, pure clays, and rich botanicals do the heavy lifting. The result? Skin that is thoroughly cleansed, yet remarkably soft, balanced, and nourished.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Craft & Process (Interactive Journey) */}
      <section className="relative overflow-hidden bg-forest text-cream py-24 lg:py-32">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terracotta/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-terracotta mb-6">The Craft</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight text-white mb-6">How we make it matters.</h2>
            <p className="text-cream/80 text-lg leading-relaxed max-w-2xl mx-auto">
              We do not take shortcuts. Every bar of Team Naturals soap represents weeks of meticulous craftsmanship, designed to deliver the highest quality natural skincare.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-terracotta/30 to-transparent z-0" />
            
            {craftSteps.map((step, idx) => (
              <Reveal key={step.title} delay={idx * 0.2} className="relative z-10 group h-full">
                <motion.div 
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full flex flex-col items-center text-center rounded-[2rem] bg-white/5 border border-white/10 p-8 lg:p-10 backdrop-blur-sm transition-colors duration-500 hover:bg-white/10 hover:border-terracotta/30"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-terracotta/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-24 h-24 rounded-full bg-forest flex items-center justify-center border-2 border-white/10 group-hover:border-terracotta transition-colors duration-500 shadow-2xl">
                      <step.icon size={32} className="text-cream group-hover:text-terracotta transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cream/40 mb-3">Step 0{idx + 1}</span>
                  <h3 className="font-display text-2xl lg:text-3xl mb-4 text-white">{step.title}</h3>
                  <p className="text-cream/70 text-sm lg:text-base leading-relaxed">{step.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Pillars (Premium Glassmorphism) */}
      <section className="relative overflow-hidden bg-[#f4ece3] py-24 lg:py-32">
        {/* Abstract shapes for glassmorphism background */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-terracotta/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-forest/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-terracotta mb-4">Values</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest">What we stand for</h2>
          </Reveal>
          
          <div className="grid gap-8 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, copy }, idx) => (
              <Reveal key={title} delay={idx * 0.15} className="h-full">
                <motion.div 
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group relative h-full rounded-[2.5rem] bg-white/40 p-8 sm:p-10 shadow-xl shadow-forest/5 backdrop-blur-xl border border-white/60 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/10 opacity-50 pointer-events-none" />
                  
                  {/* Hover glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-terracotta/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative z-10">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-forest/5 text-forest group-hover:bg-forest group-hover:text-cream transition-all duration-500 group-hover:rotate-6">
                      <Icon size={28} strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-8 font-display text-2xl lg:text-3xl text-forest">{title}</h3>
                    <p className="mt-4 text-sm lg:text-base leading-relaxed text-forest/70">{copy}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
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

      {/* 6. Founder Note (Elevated Typography & Mesh Background) */}
      <section className="mx-auto max-w-5xl px-5 py-20 lg:py-32 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[3.5rem] bg-cream p-8 sm:p-16 lg:p-24 text-center shadow-2xl shadow-forest/5 border border-forest/5">
          {/* Animated Gradient Mesh */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-terracotta/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-forest/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cream-soft/50 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10">
            <span className="inline-block mb-10 p-3 rounded-full bg-white shadow-sm text-terracotta border border-forest/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 11H6V7H10V11ZM18 11H14V7H18V11ZM10 13H6V17H10V13ZM18 13H14V17H18V13Z" fill="currentColor" fillOpacity="0.2"/>
                <path d="M11 7H5V17H11V7ZM19 7H13V17H19V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <p className="text-[11px] uppercase font-bold tracking-[0.4em] text-terracotta mb-8">A Note from the Founder</p>
            <blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.3] text-forest max-w-3xl mx-auto">
              &ldquo;I formulated the very first Neem bar for my brother&rsquo;s severe acne. Two years and countless batches later, we still make every single bar the exact same way — slowly, in small numbers, with raw ingredients we proudly put on our own skin.&rdquo;
            </blockquote>
            <p className="mt-12 font-display italic text-2xl text-terracotta">
              — The Team Naturals Family
            </p>
          </div>
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