import type { Metadata } from 'next';
import AboutPageClient from '@/src/components/AboutPageClient';
import { SITE_NAME, SITE_URL } from '@/src/lib/seo';

const ABOUT_TITLE = 'Our Story — Handmade Soap from Morbi | Team Naturals';
const ABOUT_DESCRIPTION =
  'Vraj Kasundra makes Team Naturals soap at home in Morbi, Gujarat — goat milk base, farmhouse ingredients, no palm oil.';

const ABOUT_OG_IMAGE = '/Owner/owner1.webp';

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    images: [
      {
        url: ABOUT_OG_IMAGE,
        width: 1200,
        height: 800,
        alt: 'Vraj Kasundra, founder of Team Naturals, at the Morbi farmhouse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [ABOUT_OG_IMAGE],
  },
};

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  url: `${SITE_URL}/about`,
  mainEntity: {
    '@type': 'Person',
    name: 'Vraj Kasundra',
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
};

export default function AboutPage() {
  return (
<<<<<<< HEAD
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <AboutPageClient />
    </>
=======
    <div className="w-full bg-cream overflow-hidden">

      {/* ── 1. HERO — Split layout ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex flex-col md:flex-row min-h-[95vh] w-full overflow-hidden bg-cream pt-16 md:pt-20">
      {/* Left text col */}
        <div className="relative z-10 flex flex-1 w-full flex-col items-center justify-center px-6 py-10 text-center md:w-[48%] md:px-12 lg:px-20 xl:px-28 md:py-0">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-5 text-[11px] font-bold uppercase tracking-[0.35em] text-terracotta"
          >
            Team Naturals
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.08] text-forest"
          >
            Rooted in <span className="italic text-terracotta/90">Nature.</span><br />
            Crafted with <span className="italic">Patience.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base md:text-lg text-muted/80 max-w-sm leading-relaxed"
          >
            Cold-processed in small batches, with ingredients you can actually pronounce. No shortcuts. No synthetics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition-all hover:bg-forest/90 hover:shadow-lg hover:shadow-forest/20 active:scale-[0.98]"
            >
              Shop the Bars <ArrowRightIcon size={15} strokeWidth={2} />
            </Link>
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 px-6 py-3 text-sm font-medium text-forest transition-all hover:border-forest/40 hover:bg-forest/5"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Right photo col (Desktop) */}
        <div className="absolute inset-y-0 right-0 hidden w-[56%] overflow-hidden md:block">
          <motion.img
            src={heroImage}
            alt="Artisanal soap being cut on a wooden board with botanicals"
            style={{ scale: imgScale }}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/10 to-transparent" />
        </div>

        {/* Mobile hero image strip */}
        <div className="relative h-[40vh] w-full shrink-0 overflow-hidden md:hidden mt-auto">
          <img src={heroImage} alt="Artisanal soap" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        </div>

        {/* Scroll cue (Desktop only, mobile image takes space) */}
        <motion.div
          style={{ opacity: scrollOpacity }}
          className="absolute bottom-8 left-8 z-20 hidden md:flex flex-col items-center gap-2 md:left-20 lg:left-28"
        >
          <span className="text-[9px] uppercase tracking-[0.35em] text-forest/40 font-bold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-10 w-px bg-gradient-to-b from-forest/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── 2. OUR STORY ──────────────────────────────────────────────────────── */}
      <section id="story" className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5" direction="right">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-cream-soft via-forest/5 to-transparent blur-xl" />
                <motion.div
                  whileHover={{ scale: 1.02, rotate: -0.5 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl shadow-forest/10"
                >
                  <img
                    src={storyImage}
                    alt="Fresh handmade natural soap being sliced on a wooden board"
                    className="w-full object-cover aspect-[4/5] sm:h-[600px] sm:aspect-auto transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/40 bg-cream/90 backdrop-blur-md shadow-xl text-center"
                >
                  <span className="font-display text-2xl font-bold text-forest">100%</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-terracotta">Natural</span>
                </motion.div>
              </div>
            </Reveal>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-terracotta">Our Story</p>
                <h2 className="mb-8 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-forest">
                  Fewer ingredients,<br />
                  <span className="italic text-terracotta/90">better behaved skin.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg font-medium text-forest/80 leading-snug">
                  Team Naturals started in a home kitchen with one simple question: <strong className="text-forest">why does everyday skincare require so many synthetic chemicals nobody can pronounce?</strong>
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="my-6 h-px w-10 bg-terracotta/30" />
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-base leading-relaxed text-muted/90">
                  Most commercial soap is effectively a detergent bar — loaded with artificial fragrances and harsh surfactants that strip the skin&apos;s natural lipid barrier. The squeaky-clean feeling is actually dehydration.
                </p>
              </Reveal>

              {/* Pull-quote */}
              <Reveal delay={0.55}>
                <blockquote className="my-8 pl-5 border-l-2 border-terracotta/40 font-display text-2xl italic leading-snug text-forest/80">
                  &quot;We let cold-pressed oils, pure clays, and rich botanicals do the heavy lifting — and kept everything else out.&quot;
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MEET THE MAKER ────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24">
            <Reveal direction="right" className="md:w-[42%] shrink-0">
              <div className="overflow-hidden rounded-3xl shadow-xl shadow-forest/8 aspect-square">
                <img
                  src={products[0].images[0]}
                  alt="Hands carefully cutting a fresh bar of natural soap"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2} className="flex-1">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Meet the Maker</p>
              <blockquote className="font-display text-3xl md:text-4xl leading-[1.35] text-forest">
                &ldquo;I formulated the very first Neem bar for my brother&rsquo;s severe acne. Two years and countless batches later, we still make every single bar the exact same way — slowly, in small numbers, with ingredients we proudly put on our own skin first.&rdquo;
              </blockquote>
              <p className="mt-8 text-base font-semibold text-forest/70 tracking-wide">
                The Team Naturals Family
              </p>
              <p className="text-sm text-muted/70">Founders, Mumbai</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. THE CRAFT — Vertical timeline ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-forest text-cream py-24 lg:py-32">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 lg:px-10">
          <Reveal className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-terracotta mb-4">The Craft</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">How we make it matters.</h2>
            <p className="mt-4 text-cream/70 text-lg max-w-xl leading-relaxed">We don&apos;t take shortcuts. Every bar represents weeks of work, not hours of automation.</p>
          </Reveal>

          <div className="mt-12">
            {craftSteps.map((step, idx) => (
              <TimelineStep key={step.num} step={step} index={idx} total={craftSteps.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. INGREDIENT SPOTLIGHT ──────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Inside the Bar</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">Hero ingredients</h2>
            <p className="mt-3 text-muted/80 max-w-xl mx-auto">
              Five botanicals. Each chosen because it works, not because it sounds good on a label.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {ingredients.map((ing, idx) => (
              <Reveal key={ing.name} delay={idx * 0.1}>
                <div className="group flex flex-col items-center text-center w-36">
                  <div className="overflow-hidden rounded-full w-28 h-28 md:w-32 md:h-32 border-2 border-forest/10 shadow-md transition-all duration-500 group-hover:border-terracotta/40 group-hover:shadow-lg group-hover:shadow-terracotta/10">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-forest">{ing.name}</h3>
                  <p className="mt-1 text-[12px] text-muted/80 leading-tight">{ing.benefit}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. VALUES — Asymmetric layout ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f4ece3] py-24 lg:py-32">
        <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] bg-terracotta/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <Reveal className="mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-terracotta mb-4">Values</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-forest">What we stand for.</h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
            {/* Featured value — spans 2 rows */}
            <Reveal className="lg:row-span-2">
              <div className="group relative h-full overflow-hidden rounded-3xl bg-forest p-8 md:p-10 flex flex-col justify-between min-h-[340px]">
                <div className="absolute inset-0 bg-gradient-to-br from-forest to-[#0f2a1a] opacity-90" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream/10 border border-cream/20 text-cream mb-8">
                    <LeafIcon size={24} strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-3xl text-white mb-4">{pillars[0].title}</h3>
                  <p className="text-cream/75 leading-relaxed text-base">{pillars[0].copy}</p>
                </div>
                <p className="relative z-10 mt-8 text-sm italic text-terracotta/90 font-medium">{pillars[0].detail}</p>
              </div>
            </Reveal>

            {/* Smaller values stacked */}
            {pillars.slice(1).map((p, idx) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={0.15 + idx * 0.15}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative rounded-3xl bg-white/60 backdrop-blur-sm border border-white/60 p-7 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 rounded-3xl opacity-60 pointer-events-none" />
                    <div className="relative z-10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-forest/5 text-forest group-hover:bg-forest group-hover:text-cream transition-all duration-500 mb-6">
                        <Icon size={22} strokeWidth={1.5} />
                      </span>
                      <h3 className="font-display text-2xl text-forest mb-3">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-forest/70">{p.copy}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. SUSTAINABILITY STRIP ──────────────────────────────────────────── */}
      <section className="bg-cream border-y border-forest/8 py-8">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-forest/70">
            {[
              { icon: RecycleIcon, text: 'Recyclable & minimal packaging — zero unnecessary plastic' },
              { icon: ShieldCheckIcon, text: 'Cruelty-free, always — never tested on animals' },
              { icon: PackageIcon, text: 'Small-batch only — every bar traced to its production date' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2.5 font-medium">
                <Icon size={15} className="text-terracotta shrink-0" strokeWidth={1.75} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BY THE NUMBERS ─────────────────────────────────────────────────── */}
      <section className="bg-forest text-cream py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="font-display text-4xl md:text-5xl font-bold text-cream">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <span className="text-[11px] uppercase tracking-widest text-cream/50 font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CUSTOMER VOICES ────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28 overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Customer Voices</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">What our customers say.</h2>
          </Reveal>

          {/* Desktop: 3-up grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t, idx) => (
              <Reveal key={t.name} delay={idx * 0.1}>
                <div className="flex h-full flex-col rounded-3xl border border-forest/8 bg-cream/40 p-6 md:p-7">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} size={13} className="text-terracotta fill-terracotta" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="flex-1 text-sm md:text-base leading-relaxed text-forest/80 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 pt-4 border-t border-forest/8">
                    <p className="font-semibold text-sm text-forest">{t.name}</p>
                    <p className="text-[11px] text-muted/70">{t.city} &middot; {t.product}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-forest/8 bg-cream/40 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                    <StarIcon key={i} size={13} className="text-terracotta fill-terracotta" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-forest/80 italic">&ldquo;{testimonials[testimonialIdx].quote}&rdquo;</p>
                <div className="mt-5 pt-4 border-t border-forest/8">
                  <p className="font-semibold text-sm text-forest">{testimonials[testimonialIdx].name}</p>
                  <p className="text-[11px] text-muted/70">{testimonials[testimonialIdx].city} &middot; {testimonials[testimonialIdx].product}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === testimonialIdx ? 'w-6 bg-forest' : 'w-1.5 bg-forest/20'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <Reveal className="mb-12">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Got Questions?</p>
            <h2 className="font-display text-4xl sm:text-5xl text-forest">Answers.</h2>
          </Reveal>

          <div>
            {faqs.map((faq, idx) => (
              <FaqItem key={idx} item={faq} idx={idx} openIdx={openFaq} setOpen={setOpenFaq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CLOSING CTA ───────────────────────────────────────────────────── */}
      <section className="bg-forest text-cream py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-10">
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-terracotta">Ready to try it?</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Skip the ingredient list.<br />
              <span className="italic text-cream/70">Feel the difference.</span>
            </h2>
            <p className="mt-5 text-cream/60 text-base max-w-md mx-auto leading-relaxed">
              Seven bars, one face wash. Each one made the same slow way it has always been made.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-terracotta px-8 py-4 text-base font-medium text-white transition-all hover:bg-[#c05a41] hover:shadow-xl hover:shadow-terracotta/20 active:scale-[0.98]"
            >
              Shop Now
              <ArrowRightIcon size={17} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={0.35} className="mt-12 pt-10 border-t border-white/10">
            <p className="text-sm text-cream/50 mb-4">Not ready yet? Get new batch notifications — no spam, just restocks.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-terracotta/60 focus:bg-white/15 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-cream text-forest px-6 py-3 text-sm font-semibold transition-all hover:bg-cream/90 active:scale-[0.98]"
              >
                Notify Me
              </button>
            </form>
          </Reveal>
        </div>
      </section>

    </div>
>>>>>>> origin/yugal
  );
}
