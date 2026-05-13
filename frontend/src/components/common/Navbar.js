'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Customized Trips', href: '/customized-trips' },
  { label: 'Upcoming Departures', href: '/upcoming-departures' },
  { label: 'Discover the world', href: '/discover' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

function linkIsActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [homeScrollPast, setHomeScrollPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scrolled = isHome ? homeScrollPast : false;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setHomeScrollPast(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    queueMicrotask(() => setIsOpen(false));
  }, [pathname]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/upcoming-departures?q=${encodeURIComponent(q)}`);
    else router.push('/upcoming-departures');
  };

  const glassOnHero =
    isHome &&
    !scrolled &&
    'border-white/15 bg-white/10 text-white shadow-none backdrop-blur-xl';

  const navLinkClass = (active) => {
    if (isHome && !scrolled) {
      return active ? 'font-semibold text-white' : 'text-white/88 hover:text-white';
    }
    return active ? 'font-semibold text-primary' : 'text-foreground/85 hover:text-primary';
  };

  const logoTextClass = isHome && !scrolled ? 'text-white' : 'text-primary';

  const mobilePanelBorder =
    isHome && !scrolled ? 'border-white/15 bg-[#1F4E79]/95 text-white backdrop-blur-xl' : 'border-[#eaf4fb] bg-white';

  const desktopNavShellClass = isHome && !scrolled ? 'gap-1.5' : 'gap-1';

  const searchShellClass = isHome && !scrolled
    ? 'border-white/18 bg-white/8 text-white shadow-none'
    : 'border-[#d8e6f0] bg-white/94 text-foreground shadow-none';

  const searchIconClass = isHome && !scrolled ? 'text-white/70' : 'text-primary/55';

  const searchInputClass = isHome && !scrolled
    ? 'text-white placeholder:text-white/60'
    : 'text-foreground placeholder:text-gray-500';

  const searchButtonClass = isHome && !scrolled
    ? 'bg-white text-[#1F4E79] hover:bg-[#f4f8fb]'
    : 'bg-primary text-white hover:bg-[#163a5c]';

  const mobileMenuButtonClass = isHome && !scrolled
    ? 'border-white/15 bg-white/8 text-white hover:bg-white/12'
    : 'border-[#dce8f2] bg-white/92 text-primary hover:bg-[#f8fbff]';

  return (
    <motion.nav
      id="site-navigation"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`z-50 w-full border-b transition-colors duration-500 ${
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } ${
        glassOnHero
          ? glassOnHero
          : 'border-[#dce8f2] bg-white/93 shadow-[0_8px_30px_-10px_rgba(31,78,121,0.12)] backdrop-blur-xl'
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-2.5 md:px-5 md:py-3">
        <div className="flex items-center justify-between gap-3 md:gap-5 lg:gap-6">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm transition md:h-11 md:w-11 ${
                isHome && !scrolled ? 'bg-white/20 ring-1 ring-white/25' : 'bg-white ring-1 ring-[#dceaf7]'
              }`}
            >
              <Image
                src="/happy-feet-logo.png"
                alt="Happy Feet Travellers logo"
                width={40}
                height={40}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <span className={`hidden truncate font-bold sm:inline sm:max-w-[11rem] sm:text-base md:max-w-none md:text-lg ${logoTextClass}`}>
              Happy Feet Travellers
            </span>
            <span className={`sm:hidden text-base font-bold ${logoTextClass}`}>HFT</span>
          </Link>

          <form
            onSubmit={onSearchSubmit}
            className="mx-1 hidden min-w-0 max-w-md flex-1 items-stretch lg:mx-2 lg:flex xl:mx-3 xl:max-w-lg"
            role="search"
            aria-label="Site search"
          >
            <div
              className={`flex min-w-0 flex-1 items-center rounded-full border px-2 py-1 transition focus-within:ring-2 focus-within:ring-secondary/60 ${searchShellClass}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5" aria-hidden>
                <svg
                  className={`h-4.5 w-4.5 ${searchIconClass}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                name="q"
                placeholder="Search tours, destinations or routes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm font-medium focus:outline-none focus:ring-0 ${searchInputClass}`}
                aria-label="Search tours and destinations"
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Search"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${searchButtonClass}`}
              >
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className={`hidden shrink-0 items-center md:flex ${desktopNavShellClass}`}>
            {navItems.map((item) => {
              const active = linkIsActive(pathname, item.href);
              return (
                <motion.div key={item.href} whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={item.href}
                    className={`group relative whitespace-nowrap px-1.5 py-2 text-[13px] font-medium transition lg:px-2 ${navLinkClass(active)}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-1 left-1.5 right-1.5 h-0.5 origin-left rounded-full transition ${
                        active ? 'scale-x-100 bg-secondary' : 'scale-x-0 bg-secondary group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            className={`rounded-full border p-2.5 transition md:hidden ${mobileMenuButtonClass}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
          >
            {isOpen ? (
              <svg className={`h-6 w-6 ${isHome && !scrolled ? 'text-white' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`h-6 w-6 ${isHome && !scrolled ? 'text-white' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className={`overflow-hidden rounded-b-2xl border-x border-b pb-3 pt-2 md:hidden ${mobilePanelBorder}`}
            >
              <form onSubmit={onSearchSubmit} className="px-3 py-2" role="search">
                <div
                  className={`flex items-center rounded-full border px-2 py-1.5 transition focus-within:ring-2 focus-within:ring-secondary/70 ${
                    isHome && !scrolled ? 'border-white/20 bg-white/10' : 'border-[#d6e4f1] bg-[#f8fbff]'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5" aria-hidden>
                    <svg
                      className={`h-4.5 w-4.5 ${isHome && !scrolled ? 'text-white/70' : 'text-primary/55'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="q"
                    placeholder="Search tours or destinations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm font-medium focus:outline-none focus:ring-0 ${
                      isHome && !scrolled ? 'text-white placeholder:text-white/60' : 'text-foreground placeholder:text-gray-500'
                    }`}
                    aria-label="Search tours"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${searchButtonClass}`}
                  >
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
              <nav className="flex flex-col" aria-label="Mobile">
                {navItems.map((item, index) => {
                  const active = linkIsActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link
                        href={item.href}
                        className={`block border-b px-4 py-3 text-sm last:border-b-0 ${
                          isHome && !scrolled ? 'border-white/10' : 'border-[#eef5fa]'
                        } ${
                          isHome && !scrolled
                            ? active
                              ? 'bg-white/10 font-semibold text-cta'
                              : 'text-white/95 hover:bg-white/10'
                            : active
                              ? 'bg-section-alt font-semibold text-primary'
                              : 'text-foreground hover:bg-section-alt'
                        }`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
