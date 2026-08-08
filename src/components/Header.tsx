'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon, XIcon, ArrowRightIcon, HeartIcon, MapPinIcon, BellIcon, LogOutIcon, ChevronDownIcon, PackageIcon, SettingsIcon } from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { products as productsApi, categories as categoriesApi } from '../lib/api';
import { Product } from '../types/product';
import { ProfileIdentityBlock } from './account/ProfileIdentityBlock';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const { user, isLoading, logout } = useAuth();

  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [prevPath, setPrevPath] = React.useState(pathname);

  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setScrolled(false);
  }
  
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const { itemCount, openDrawer, wishlist } = useCart();
  const router = useRouter();
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    categoriesApi.list().then(res => setCategories(res.data.categories)).catch(() => {});
  }, []);

  React.useEffect(() => {
    setSelectedIndex(-1);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await productsApi.list({ search: query.trim(), limit: '5' });
        setSearchResults(res.data.products);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsProfileOpen(false);
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isProfileOpen]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    setTimeout(onScroll, 50); // Ensure it checks after Next.js scroll restoration
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  // Combine categories and products for unified search
  const matchedCategories = query.trim() 
    ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).map(c => ({ ...c, type: 'category' })) 
    : [];
  const results = [...matchedCategories, ...searchResults.map(p => ({ ...p, type: 'product' }))];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-transparent'
        }`}
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
          animate={{ height: scrolled ? 64 : 80 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left: Mobile Menu + Logo */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 rounded-full p-2 text-forest transition-colors hover:bg-forest/5 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon size={22} strokeWidth={1.8} />
            </button>

            {/* Mobile Search Toggle Button */}
            {!isMobileSearchOpen && (
              <button 
                className="p-2 text-forest transition-colors hover:bg-forest/5 sm:hidden"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Open search"
              >
                <SearchIcon size={20} strokeWidth={2} />
              </button>
            )}

            <Link href="/" aria-label="Team Naturals home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:transform-none flex-shrink-0">
              <Logo compact={scrolled} useImage={true} hideTextOnMobile={true} isNavbar={true} disableLayoutAnimation={true} />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-10 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              if (item.label === 'Shop') {
                return (
                  <div key={item.href} className="group relative py-2">
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1 text-[14px] font-semibold tracking-wide transition-colors ${
                        isActive ? 'text-terracotta' : 'text-forest hover:text-terracotta/70'
                      }`}
                    >
                      {item.label}
                      <ChevronDownIcon size={14} className="transition-transform group-hover:rotate-180" />
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-[2px] left-0 h-[2.5px] w-full rounded-t-full bg-terracotta"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 group-hover:block z-50">
                      <div className="flex min-w-[160px] flex-col gap-1 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                        <Link href="/shop" className="block rounded-xl px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5 hover:text-terracotta transition-colors">
                          All Shop
                        </Link>
                        {categories.map(cat => (
                          <Link 
                            key={cat.slug} 
                            href={`/shop/${cat.slug}`} 
                            className={`block rounded-xl px-4 py-2 text-sm font-medium transition-colors text-forest hover:bg-forest/5 hover:text-terracotta`}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

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
            <div 
              className={
                isMobileSearchOpen 
                  ? "absolute left-0 right-0 top-[100%] z-40 flex items-center bg-white px-4 pb-3 shadow-soft sm:static sm:z-auto sm:block sm:bg-transparent sm:px-0 sm:pb-0 sm:shadow-none"
                  : "hidden sm:block relative"
              }
            >
              <div className="flex w-full items-center gap-1 sm:gap-2 rounded-full border border-terracotta/40 bg-white px-3 sm:px-4 py-1.5 sm:py-2.5 transition-all focus-within:border-terracotta focus-within:shadow-soft">
                <SearchIcon size={18} className="text-muted shrink-0" strokeWidth={2} />
                <input
                  id="mobile-search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedIndex(prev => Math.max(prev - 1, 0));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      const activeItem = selectedIndex >= 0 ? results[selectedIndex] : (results.length > 0 ? results[0] : null);
                      if (activeItem) {
                        const href = activeItem.type === 'category' ? `/shop/${activeItem.slug}` : `/product/${activeItem.slug}`;
                        router.push(href);
                        setQuery('');
                        setIsMobileSearchOpen(false);
                      }
                    }
                  }}
                  placeholder="Search products & categories..."
                  className="w-full sm:w-40 bg-transparent text-[14px] font-medium text-forest outline-none focus:outline-none focus:ring-0 placeholder:font-normal placeholder:text-muted/70 transition-all sm:focus:w-56"
                  aria-label="Search products"
                />
                {isMobileSearchOpen && (
                  <button 
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setQuery('');
                    }} 
                    className="shrink-0 p-1 text-muted sm:hidden"
                    aria-label="Close search"
                  >
                    <XIcon size={18} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {query.trim() && (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, pointerEvents: 'none' }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-4 right-4 sm:left-auto sm:right-0 top-[calc(100%+8px)] sm:w-80 overflow-hidden rounded-2xl border border-forest/10 bg-white p-2 shadow-lift"
                  >
                    {results.length > 0 ? (
                      <ul className="space-y-1">
                        {results.map((item, idx) => {
                          const isCategory = item.type === 'category';
                          const href = isCategory ? `/shop/${item.slug}` : `/product/${item.slug}`;
                          const isSelected = selectedIndex === idx;
                          return (
                            <li key={`${item.type}-${item.slug || item.id}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  router.push(href);
                                  setQuery('');
                                  setIsMobileSearchOpen(false);
                                }}
                                className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-cream-soft ${isSelected ? 'bg-cream-soft ring-1 ring-terracotta/30' : ''}`}
                              >
                                {isCategory ? (
                                  <div className="h-12 w-12 flex shrink-0 items-center justify-center rounded-lg bg-forest/5 text-forest/50">
                                    <PackageIcon size={20} />
                                  </div>
                                ) : (
                                  <img src={typeof item.images?.[0] === 'string' ? item.images[0] : ((item.images?.[0] as any)?.url || '/placeholder.png')} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className="block truncate text-sm font-semibold text-forest group-hover:text-terracotta">{item.name}</span>
                                  {isCategory ? (
                                    <span className="block text-[12px] uppercase tracking-wide text-muted">Category</span>
                                  ) : (
                                    <span className="block text-[12px] text-muted">₹{item.price}</span>
                                  )}
                                </div>
                                <ArrowRightIcon size={14} className={`text-muted transition-all group-hover:opacity-100 group-hover:translate-x-1 ${isSelected ? 'opacity-100 translate-x-1' : 'opacity-0'}`} />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : isSearching ? (
                      <div className="px-4 py-6 text-center text-sm text-muted">Searching...</div>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-muted">No products found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login / User Profile */}
            {!isLoading && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex items-center gap-1.5 px-2 py-1 text-forest transition-colors hover:text-forest/70"
                  aria-label="Account menu"
                  aria-expanded={isProfileOpen}
                >
                  <div className="relative">
                    <UserIcon size={20} strokeWidth={1.5} />
                    {wishlist.length > 0 && (
                      <span className="absolute -right-1 -top-1 sm:hidden flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white bg-terracotta text-[8px] font-bold text-white shadow-sm">
                        {wishlist.length}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline-block text-[14px] font-medium">{user.firstName}</span>
                  <ChevronDownIcon size={16} strokeWidth={1.5} className={`hidden sm:inline-block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-4 z-50"
                    >
                      <div className="w-64 sm:w-72 rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col border border-forest/10">
                        
                        <div className="bg-[#FDFBF9]">
                          <ProfileIdentityBlock />
                        </div>
                        
                        <div className="h-px bg-forest/5 w-full" />
                        
                        <div className="py-2 flex flex-col">
                          {user?.role === 'admin' && (
                            <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest hover:bg-forest/5 flex items-center gap-3 transition-colors font-semibold">
                              <SettingsIcon size={18} strokeWidth={1.8} className="text-forest" /> Admin Panel
                            </Link>
                          )}
                          <Link href="/account" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-forest/5 hover:text-forest flex items-center gap-3 transition-colors font-medium">
                            <UserIcon size={18} strokeWidth={1.8} className="text-forest/60" /> My Profile
                          </Link>
                          <Link href="/account/orders" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-forest/5 hover:text-forest flex items-center justify-between transition-colors font-medium">
                            <div className="flex items-center gap-3">
                              <PackageIcon size={18} strokeWidth={1.8} className="text-forest/60" /> Orders
                            </div>
                            {/* Mock active order badge */}
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D99A3D]" aria-label="Order in progress" />
                          </Link>
                          <Link href="/account/addresses" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-forest/5 hover:text-forest flex items-center gap-3 transition-colors font-medium">
                            <MapPinIcon size={18} strokeWidth={1.8} className="text-forest/60" /> Saved Addresses
                          </Link>
                          <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-forest/5 hover:text-forest flex items-center justify-between transition-colors font-medium">
                            <div className="flex items-center gap-3">
                              <HeartIcon size={18} strokeWidth={1.8} className="text-forest/60" /> Wishlist
                            </div>
                            {wishlist.length > 0 && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white shadow-sm">
                                {wishlist.length}
                              </span>
                            )}
                          </Link>
                          <Link href="/account/settings" onClick={() => setIsProfileOpen(false)} className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-forest/5 hover:text-forest flex items-center justify-between transition-colors font-medium">
                            <div className="flex items-center gap-3">
                              <BellIcon size={18} strokeWidth={1.8} className="text-forest/60" /> Notifications
                            </div>
                            {/* Mock unread notifications badge */}
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">2</span>
                          </Link>
                        </div>
                        
                        <div className="border-t border-forest/5 py-1.5">
                          <button
                            onClick={async () => { setIsProfileOpen(false); await logout(); router.push('/'); }}
                            className="px-5 py-2.5 text-[14px] text-forest/80 hover:bg-terracotta/5 hover:text-terracotta text-left flex items-center gap-3 w-full transition-colors font-medium"
                          >
                            <LogOutIcon size={18} strokeWidth={1.8} className="text-forest/60 group-hover:text-terracotta/70" /> Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 sm:gap-3.5 rounded-full bg-forest p-2 sm:px-6 sm:py-2 text-cream shadow-soft transition-colors hover:bg-forest/90"
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
              className="group relative ml-1 sm:ml-3 p-1 text-forest transition-colors hover:text-forest/70 hidden sm:block"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <HeartIcon size={24} strokeWidth={1.8} className="transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key={wishlist.length}
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} categories={categories} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  categories: any[];
}) {
  const [shopOpen, setShopOpen] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <React.Fragment key="mobile-menu-wrapper">
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 z-[60] bg-forest/30 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            onClick={onClose}
          />
          <motion.nav
            key="mobile-nav"
            className="fixed inset-y-0 left-0 z-[61] flex w-[85%] max-w-sm flex-col bg-cream-soft p-6 shadow-lift lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%', pointerEvents: 'none' }}
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
                if (item.label === 'Shop') {
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i + 0.1 }}
                    >
                      <div className="flex flex-col">
                        <div className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl transition-colors ${isActive ? 'bg-white text-terracotta shadow-sm' : 'text-forest hover:bg-white/50'}`}>
                          <Link href={item.href} onClick={onClose} className="flex-1">
                            {item.label}
                          </Link>
                          <button onClick={() => setShopOpen(!shopOpen)} className="p-2 -mr-2 text-forest/60" aria-label="Toggle Shop Dropdown">
                            <ChevronDownIcon size={20} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {shopOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="pl-6 pt-2 pb-2 space-y-2 border-l-2 border-forest/10 ml-6 mt-2">
                                <Link href="/shop" onClick={onClose} className="block text-lg font-display text-forest/80 hover:text-terracotta transition-colors py-1">
                                  All Shop
                                </Link>
                                {categories.map(c => (
                                  <Link key={c.slug} href={`/shop/${c.slug}`} onClick={onClose} className="block text-lg font-display text-forest/80 hover:text-terracotta transition-colors py-1">
                                    {c.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.li>
                  );
                }

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
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-full border border-forest px-5 py-3.5 text-[15px] font-semibold text-forest shadow-soft transition-colors hover:bg-forest/5"
                  >
                    <UserIcon size={18} strokeWidth={2} /> My Profile
                  </Link>
                  <button
                    onClick={async () => {
                      onClose();
                      await logout();
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3.5 text-[15px] font-semibold text-cream shadow-soft transition-colors hover:bg-forest/90"
                  >
                    <LogOutIcon size={18} strokeWidth={2} /> Logout
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.nav>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}