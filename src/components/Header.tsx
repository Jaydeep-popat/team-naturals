'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon, ArrowRightIcon, HeartIcon } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  // TODO: Replace with real auth state once backend is connected
  const user = null as { name: string } | null; // e.g. { name: 'Yugal' }

  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const { itemCount, openDrawer, wishlist } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const results = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md"
        animate={{
          borderBottomColor: scrolled ? 'rgba(31,61,43,0.08)' : 'rgba(31,61,43,0)',
          boxShadow: scrolled
            ? '0 10px 30px -10px rgba(31,61,43,0.05)'
            : '0 0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 lg:px-6"
          animate={{ height: scrolled ? 68 : 88 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left: Mobile Menu + Logo */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 rounded-full p-2 text-forest transition-colors hover:bg-forest/5 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon size={22} strokeWidth={1.8} />
            </button>
            <Link href="/" aria-label="Team Naturals home" className="flex-shrink-0">
              <Logo compact={scrolled} useImage={true} />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-10 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-[14px] font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-terracotta' : 'text-forest hover:text-terracotta/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-[2px] left-0 h-[2.5px] w-full rounded-t-full bg-terracotta"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Icons */}
          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-6">
            {/* Inline Search Bar */}
            <div className="relative">
              <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-terracotta/40 bg-white px-2.5 sm:px-4 py-1.5 sm:py-2.5 transition-all focus-within:border-terracotta focus-within:shadow-soft">
                <SearchIcon size={18} className="text-muted" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-20 sm:w-40 bg-transparent text-[14px] font-medium text-forest outline-none focus:outline-none focus:ring-0 placeholder:font-normal placeholder:text-muted/70 transition-all focus:w-32 sm:focus:w-56"
                  aria-label="Search products"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {query.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[calc(100%+8px)] w-80 overflow-hidden rounded-2xl border border-forest/10 bg-white p-2 shadow-lift"
                  >
                    {results.length > 0 ? (
                      <ul className="space-y-1">
                        {results.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => {
                                router.push(`/product/${p.slug}`);
                                setQuery('');
                              }}
                              className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-cream-soft"
                            >
                              <img src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <span className="block truncate text-sm font-semibold text-forest group-hover:text-terracotta">{p.name}</span>
                                <span className="block text-[12px] text-muted">₹{p.price}</span>
                              </div>
                              <ArrowRightIcon size={14} className="text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-3 py-4 text-center text-sm text-muted">No products match &ldquo;{query}&rdquo;.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login / User Profile */}
            {user ? (
              <Link
                href="/account"
                className="group flex items-center gap-2.5 rounded-full bg-forest p-1.5 sm:pr-4 text-cream transition-colors hover:bg-forest/90 shadow-soft"
                aria-label="Account"
              >
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-cream text-forest shadow-soft">
                  <UserIcon size={16} strokeWidth={2} />
                </div>
                <span className="hidden sm:inline-block text-[13px] font-semibold">Hey {user?.name}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 sm:gap-3.5 rounded-full bg-forest px-3 sm:px-6 py-1.5 sm:py-2 text-cream shadow-soft transition-colors hover:bg-forest/90"
                aria-label="Log In"
              >
                <UserIcon size={16} strokeWidth={2} className="transition-transform group-hover:scale-110 sm:h-[18px] sm:w-[18px]" />
                <span className="hidden sm:inline-block text-[13px] font-semibold tracking-wide">
                  Log In
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="group relative ml-1 sm:ml-3 p-1 text-forest transition-colors hover:text-forest/70 block"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <HeartIcon size={24} strokeWidth={1.8} className="transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-terracotta px-1 text-[10px] font-bold text-white shadow-sm"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="group relative ml-2 p-1 text-forest transition-colors hover:text-forest/70 block"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBagIcon size={24} strokeWidth={1.8} className="transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-terracotta px-1 text-[10px] font-bold text-white shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </motion.div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-forest/30 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            className="fixed inset-y-0 left-0 z-[61] flex w-[85%] max-w-sm flex-col bg-cream-soft p-6 shadow-lift lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            aria-label="Mobile navigation"
          >
            <div className="mb-8 flex items-center justify-between">
              <Logo compact useImage={true} disableLayoutAnimation={true} />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-forest hover:bg-forest/5"
                aria-label="Close menu"
              >
                <XIcon size={22} strokeWidth={1.8} />
              </button>
            </div>
            <ul className="space-y-1">
              {navItems.map((item, i) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`block rounded-2xl px-4 py-3.5 font-display text-xl transition-colors ${
                        isActive ? 'bg-white text-terracotta shadow-sm' : 'text-forest hover:bg-white/50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3.5 text-[15px] font-semibold text-cream shadow-soft transition-colors hover:bg-forest/90"
              >
                <UserIcon size={18} strokeWidth={2} /> Sign In
              </Link>
              <p className="text-center text-[12px] text-muted">
                Browsing works without an account.
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}