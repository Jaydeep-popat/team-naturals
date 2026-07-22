'use client'

import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Leaf, Mail } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const logoSrc = '/logo.png'

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay },
})

// ─── Preloader component ──────────────────────────────────────────────────────

function Preloader({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<'hold' | 'exit'>('hold')

  useEffect(() => {
    // Brief hold before morphing logo to header
    const holdTimer = window.setTimeout(() => setPhase('exit'), reducedMotion ? 300 : 520)
    return () => window.clearTimeout(holdTimer)
  }, [reducedMotion])

  useEffect(() => {
    if (phase === 'exit') {
      // Fire immediately so the header logo is already visible when the morph lands.
      // A tiny tick lets React flush the preloader unmount first.
      const t = window.setTimeout(onDone, 0)
      return () => window.clearTimeout(t)
    }
  }, [phase, onDone, reducedMotion])

  return (
    <AnimatePresence>
      {phase === 'hold' && (
        <motion.div
          key="preloader-overlay"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7f2e8]"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0, transition: { duration: 0.35 } }
              : { opacity: 0, transition: { duration: 0.55, ease: 'easeInOut', delay: 0.18 } }
          }
        >
          {/* Large centred logo — shares layoutId with the header logo */}
          <motion.div
            layoutId="team-logo"
            className="relative h-36 w-36 sm:h-44 sm:w-44"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.78, filter: 'blur(12px)' }}
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: [0.78, 1.06, 1], filter: 'blur(0px)' }
            }
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={logoSrc} alt="Team Naturals" fill className="object-contain" priority />
          </motion.div>

          {/* Subtle tagline that fades out with overlay */}
          <motion.p
            className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#7a8c6e]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.6, ease: 'easeOut' }}
          >
            Pure · Botanical · Crafted
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const reducedMotion = useReducedMotion()

  // Prevent scroll while preloader is active
  useEffect(() => {
    if (!preloaderDone) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [preloaderDone])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  // Hero content enters only after preloader completes
  const heroDelay = preloaderDone ? 0 : 999

  return (
    <LayoutGroup>
      {/* Preloader */}
      <Preloader onDone={() => setPreloaderDone(true)} />

      <main className="relative min-h-screen overflow-hidden bg-[#f7f2e8] text-[#223428]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_0%,rgba(160,190,140,0.18)_0%,transparent_70%),linear-gradient(160deg,rgba(255,255,255,0.92)_0%,rgba(247,242,232,0.88)_48%,rgba(236,215,182,0.70)_100%)]" />
        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(90deg,rgba(48,74,55,0.22)_1px,transparent_1px),linear-gradient(rgba(48,74,55,0.18)_1px,transparent_1px)] [background-size:80px_80px]" />
        {/* Soft vignette */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_60%,rgba(34,52,40,0.07)_100%)]" />

        <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          {/*
            The logo (layoutId) must NEVER be inside a parent with opacity:0 while the
            morph is in-flight — otherwise the browser composites it as invisible.
            Solution: the header wrapper has no opacity animation. Only the brand name
            text and mail icon get their own staggered fade-in.
          */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo — always visible; layoutId makes it the morph target */}
              <motion.div
                layoutId="team-logo"
                className="relative h-14 w-14 overflow-hidden rounded-full shadow-[0_2px_12px_rgba(34,52,40,0.15)]"
                layout
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 220, damping: 26, mass: 0.85 }
                }
              >
                <Image src={logoSrc} alt="Team Naturals" fill className="object-contain" priority />
              </motion.div>

              {/* Brand name — fades in after logo has docked */}
              <motion.span
                className="text-sm font-bold uppercase tracking-[0.26em] text-[#344d37]"
                initial={{ opacity: 0 }}
                animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.25 }}
              >
                Team Naturals
              </motion.span>
            </div>

            {/* Mail button — fades in alongside brand name */}
            <motion.a
              href="mailto:hello@teamnaturals.com"
              aria-label="Email Team Naturals"
              className="group grid h-10 w-10 place-items-center rounded-full border border-[#344d37]/15 bg-white/70 text-[#344d37] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
              initial={{ opacity: 0 }}
              animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.3 }}
            >
              <Mail className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            </motion.a>
          </header>

          {/* ── Hero grid ──────────────────────────────────────────────────── */}
          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.68fr)] lg:gap-16 lg:py-8">

            {/* Left — copy */}
            <div className="max-w-3xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
                <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#344d37]/18 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#5c7244] shadow-[0_2px_12px_rgba(52,77,55,0.08)] backdrop-blur-sm">
                  <Leaf className="h-3.5 w-3.5 text-[#6c8c50]" />
                  Small-batch · Botanical Skincare
                </p>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="max-w-3xl text-[clamp(2.8rem,7vw,5rem)] font-black leading-[0.94] tracking-[-0.02em] text-[#1e3022]"
              >
                Skin care that<br />
                <em className="not-italic text-[#3d6e47]">earns</em> your trust.
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.34 }}
                className="mt-6 max-w-lg text-[1.0625rem] leading-[1.75] text-[#5a6654]"
              >
                We make pure soaps and face washes with wild botanicals, cold-pressed oils, and nothing
                your skin doesn't need. No fillers. No drama. Just a ritual worth keeping.
              </motion.p>

              {/* CTA form */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.48 }}
              >
                <form onSubmit={handleSubscribe} className="mt-10 max-w-[480px]">
                  <div className="flex flex-col gap-3 rounded-[2rem] border border-[#344d37]/14 bg-white/80 p-2 shadow-[0_20px_60px_rgba(52,77,55,0.16),0_4px_16px_rgba(52,77,55,0.08)] backdrop-blur-sm sm:flex-row sm:items-center">
                    <input
                      id="notify-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="min-h-12 flex-1 bg-transparent px-5 text-[#223428] placeholder:text-[#9aa492] focus:outline-none"
                      required
                    />
                    <button
                      id="notify-btn"
                      type="submit"
                      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2b4a31] px-7 text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(43,74,49,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1f3b25] hover:shadow-[0_12px_32px_rgba(43,74,49,0.42)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2b4a31]/40 active:translate-y-0 active:shadow-none"
                    >
                      Notify Me
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  {/* Microcopy */}
                  <p className="mt-3 px-2 text-[0.78rem] text-[#8a9483] tracking-wide">
                    Early access · No spam, ever · Unsubscribe anytime
                  </p>

                  {/* Success state */}
                  <div className="mt-3 min-h-6">
                    <AnimatePresence>
                      {subscribed && (
                        <motion.p
                          key="success"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="inline-flex items-center gap-2 rounded-full bg-[#e8f2e8] px-4 py-1.5 text-sm font-semibold text-[#2b4a31]"
                        >
                          <Check className="h-4 w-4" />
                          You're in — we'll reach out first.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right — logo showcase card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={preloaderDone ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
              className="mx-auto w-full max-w-[400px]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[#344d37]/12 bg-gradient-to-br from-[#fdfaf3] via-[#f8f3e8] to-[#efe8d8] p-10 shadow-[0_32px_80px_rgba(45,58,37,0.18),0_8px_24px_rgba(45,58,37,0.10)] backdrop-blur">
                {/* Corner accent lines */}
                <div className="absolute inset-x-9 top-9 h-px bg-gradient-to-r from-transparent via-[#344d37]/15 to-transparent" />
                <div className="absolute inset-x-9 bottom-9 h-px bg-gradient-to-r from-transparent via-[#344d37]/15 to-transparent" />
                <div className="absolute inset-y-9 left-9 w-px bg-gradient-to-b from-transparent via-[#344d37]/15 to-transparent" />
                <div className="absolute inset-y-9 right-9 w-px bg-gradient-to-b from-transparent via-[#344d37]/15 to-transparent" />

                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,255,255,0.45)_0%,transparent_75%)]" />

                {/* Floating logo */}
                <motion.div
                  className="relative grid h-full place-items-center"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="relative h-52 w-52 drop-shadow-[0_8px_32px_rgba(34,52,40,0.18)] sm:h-60 sm:w-60">
                    <Image src={logoSrc} alt="Team Naturals Logo" fill className="object-contain" priority />
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <motion.footer
            initial={{ opacity: 0, y: 10 }}
            animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.75, ease: 'easeOut', delay: 0.6 }}
            className="flex flex-col gap-3 border-t border-[#344d37]/10 py-5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#7b816d] sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-1 w-1 rounded-full bg-[#7b816d]/60" />
              Handcrafted with care
            </span>
            <span className="flex items-center gap-3">
              <span>100% Natural</span>
              <span className="text-[#344d37]/25">·</span>
              <span>Cold-Pressed Oils</span>
              <span className="text-[#344d37]/25">·</span>
              <span>Launching Soon</span>
            </span>
          </motion.footer>

        </section>
      </main>
    </LayoutGroup>
  )
}
