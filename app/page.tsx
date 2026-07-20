'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Mail } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const logoSrc = '/logo.jpeg'
  
export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1700)
    return () => window.clearTimeout(timer)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3200)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f2e8] text-[#223428]">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#f7f2e8]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
          >
            <motion.div
              className="relative h-32 w-32 sm:h-40 sm:w-40"
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
              animate={{
                opacity: 1,
                scale: [0.82, 1.08, 1],
                filter: 'blur(0px)',
              }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={logoSrc} alt="Team Naturals Logo" fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.86)_0%,rgba(247,242,232,0.9)_46%,rgba(239,220,189,0.74)_100%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(48,74,55,0.18)_1px,transparent_1px),linear-gradient(rgba(48,74,55,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full shadow-sm">
              <Image src={logoSrc} alt="Team Naturals Logo" fill className="object-contain" priority />
            </div>
            <span className="text-sm font-bold uppercase tracking-[0.26em] text-[#344d37]">Team Naturals</span>
          </div>
          <a
            href="mailto:hello@teamnaturals.com"
            aria-label="Email Team Naturals"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#344d37]/15 bg-white/65 text-[#344d37] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Mail className="h-4 w-4" />
          </a>
        </motion.header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.03fr)_minmax(340px,0.72fr)] lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.28 }}
            className="max-w-3xl"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#344d37]/15 bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6c7f49] shadow-sm">
              Small batch skin care
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] text-[#223428] sm:text-6xl lg:text-7xl">
              Natural care is almost ready.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#64705d] sm:text-lg">
              Pure soaps and face washes crafted with gentle botanicals, clean oils, and skin-loving
              ingredients. No harsh feeling, no loud promises, just a calmer daily ritual.
            </p>

            <form onSubmit={handleSubscribe} className="mt-9 max-w-xl">
              <div className="flex flex-col gap-3 rounded-[2rem] border border-[#344d37]/12 bg-white/75 p-2 shadow-[0_24px_70px_rgba(52,77,55,0.14)] backdrop-blur sm:flex-row sm:items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 flex-1 bg-transparent px-5 text-[#223428] placeholder:text-[#8a927f] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2f4d35] px-6 text-sm font-bold text-white shadow-[0_12px_24px_rgba(47,77,53,0.26)] transition hover:-translate-y-0.5 hover:bg-[#243e2a] focus:outline-none focus:ring-2 focus:ring-[#2f4d35]/35"
                >
                  Notify Me
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 min-h-6">
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f4d35]"
                  >
                    <Check className="h-4 w-4" />
                    Thanks. We will let you know when we launch.
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.36 }}
            className="mx-auto w-full max-w-[420px]"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[#344d37]/12 bg-[#fdfaf2]/82 p-10 shadow-[0_30px_90px_rgba(45,58,37,0.16)] backdrop-blur">
              <div className="absolute inset-x-10 top-10 h-px bg-[#344d37]/10" />
              <div className="absolute inset-y-10 left-10 w-px bg-[#344d37]/10" />

              <motion.div
                className="relative grid h-full place-items-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="relative h-52 w-52 sm:h-60 sm:w-60">
                  <Image src={logoSrc} alt="Team Naturals Logo" fill className="object-contain" priority />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.62 }}
          className="flex flex-col gap-3 border-t border-[#344d37]/10 py-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b816d] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Handcrafted with care</span>
          <span>Natural ingredients / Coming soon</span>
        </motion.footer>
      </section>
    </main>
  )
}
