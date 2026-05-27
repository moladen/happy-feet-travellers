'use client';

import Link from 'next/link';
import BrandLogo from '@/components/common/BrandLogo';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { buildDeparturesUrl, parseDepartureSearchParams } from '@/lib/departureSearch';
import { AnimatePresence, motion } from 'framer-motion';

/** Primary menu — order & labels per client requirements + reference layout. */
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Personalized Tours', href: '/customized-trips' },
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

function SearchMagnifyIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [homeScrollPast, setHomeScrollPast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scrolled = isHome ? homeScrollPast : false;
  const onHero = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setHomeScrollPast(window.scrollY > 56);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    queueMicrotask(() => setIsOpen(false));
  }, [pathname]);

  useEffect(() => {
    const updateSearchQuery = () => {
      if (!pathname.startsWith('/upcoming-departures')) {
        setSearchQuery('');
        return;
      }
      const q = new URLSearchParams(window.location.search).get('q');
      setSearchQuery(q || '');
    };
    queueMicrotask(updateSearchQuery);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const current = pathname.startsWith('/upcoming-departures')
      ? parseDepartureSearchParams(Object.fromEntries(new URLSearchParams(window.location.search)))
      : parseDepartureSearchParams({});
    const url = buildDeparturesUrl({ ...current, q: searchQuery.trim() });
    router.push(url);
    router.refresh();
    setIsOpen(false);
  };

  const mobilePanelBorder = onHero
    ? 'border-white/18 bg-gradient-to-br from-[#1a4a72]/98 via-[#163d61]/96 to-[#122f4a]/98 text-white ring-1 ring-white/10 backdrop-blur-2xl'
    : 'border-[#dceaf4] bg-gradient-to-b from-white to-[#f8fbff] text-foreground ring-1 ring-[#1f4e79]/[0.05]';

  const mobileMenuButtonClass = onHero
    ? 'border-white/20 bg-white/12 text-white shadow-[0_10px_28px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 hover:bg-white/18'
    : 'border-[#d0e2f0] bg-white/95 text-primary shadow-sm ring-1 ring-[#1f4e79]/[0.04] hover:bg-[#f4f9fd]';

  const barSurface = onHero
    ? 'border-white/10 bg-gradient-to-b from-[#071522]/72 via-[#0f2844]/48 to-transparent text-white shadow-[0_12px_40px_-28px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150'
    : 'border-sand/60 bg-off-white/96 text-foreground shadow-[0_16px_44px_-28px_rgba(15,28,46,0.18)] backdrop-blur-xl';

  /** Hero / glass: wide pill + frosted field; inner pages: light pill */
  const searchOuterHero =
    'border border-white/22 bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_30px_-22px_rgba(0,0,0,0.8)] ring-1 ring-white/10';
  const searchOuterSolid =
    'border border-[#c5d9e8] bg-white/92 shadow-[0_10px_30px_-18px_rgba(31,78,121,0.24)] ring-1 ring-[#1f4e79]/[0.04]';

  const searchInputClass = onHero
    ? 'text-white placeholder:text-white/50'
    : 'text-foreground placeholder:text-gray-500';

  const iconSubmitHero =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] transition hover:bg-[#f4f8fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70';
  const iconSubmitSolid =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_-8px_rgba(31,78,121,0.45)] transition hover:bg-[#163a5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40';

  const desktopLinkBase = onHero
    ? 'border-transparent text-white/86 hover:border-cta/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50'
    : 'border-transparent text-foreground/72 hover:border-cta/75 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/35';

  const desktopLinkActive = onHero
    ? 'border-cta text-white'
    : 'border-cta text-primary';

  const searchOuter = onHero ? searchOuterHero : searchOuterSolid;
  const iconSubmitClass = onHero ? iconSubmitHero : iconSubmitSolid;

  return (
    <nav
      id="site-navigation"
      className={`z-50 w-full border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ${
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } ${barSurface}`}
      aria-label="Main navigation"
    >
      <div className="site-nav__inner container relative mx-auto max-w-[1400px] px-5 py-3.5 sm:px-6 md:px-8 md:py-4 lg:px-10 lg:py-4 xl:px-12">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div onClick={() => setIsOpen(false)} className="min-w-0 shrink-0">
              <BrandLogo
                variant="nav"
                navTone={onHero ? 'hero' : 'solid'}
                priority
                className={onHero ? 'drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]' : ''}
              />
            </div>

            <form
              onSubmit={onSearchSubmit}
              className={`min-w-0 ${onHero ? 'hidden xl:flex' : 'hidden sm:flex'}`}
              role="search"
              aria-label="Search tours"
            >
              <div
                className={`flex w-full items-center gap-1 rounded-full py-1 pl-2.5 pr-1 backdrop-blur-xl ${
                  onHero
                    ? 'w-[12.5rem]'
                    : 'w-full max-w-[min(100%,11rem)] sm:max-w-[13rem] md:max-w-[14rem] lg:max-w-[15rem] xl:max-w-[17rem]'
                } ${searchOuter}`}
              >
                <input
                  type="text"
                  name="q"
                  role="searchbox"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder={onHero ? 'Search tours…' : 'Search tours, destinations'}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className={`min-w-0 flex-1 border-0 bg-transparent py-1.5 text-xs font-medium outline-none sm:py-2 sm:text-sm ${searchInputClass}`}
                  aria-label="Search tours or destinations"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit" className={iconSubmitClass} aria-label="Search">
                  <SearchMagnifyIcon className="h-[18px] w-[18px]" />
                </button>
              </div>
            </form>
          </div>

          <div className="site-nav__desktop hidden min-w-0 items-center lg:flex">
            <nav className="site-nav__links glass-scrollbar flex items-center gap-x-0.5 overflow-x-auto whitespace-nowrap xl:gap-x-1" aria-label="Primary">
              {navItems.map((item) => {
                const active = linkIsActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 border-b-2 px-2 py-2 text-[11px] font-medium tracking-tight transition lg:px-2.5 lg:text-xs xl:px-3 xl:text-sm ${desktopLinkBase} ${
                      active ? desktopLinkActive : ''
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            type="button"
            className={`shrink-0 rounded-2xl p-2.5 transition lg:hidden ${mobileMenuButtonClass}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
          >
            {isOpen ? (
              <svg className={`h-6 w-6 ${onHero ? 'text-white' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`h-6 w-6 ${onHero ? 'text-white' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`mt-3 overflow-hidden rounded-[1.35rem] border shadow-[0_24px_56px_-32px_rgba(31,78,121,0.55)] lg:hidden ${mobilePanelBorder}`}
            >
              <div
                className={`border-b px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] ${
                  onHero ? 'border-white/10 text-white/50' : 'border-[#e3edf6] text-primary/45'
                }`}
              >
                Menu
              </div>
              <nav className="flex flex-col gap-0.5 px-2 py-2" aria-label="Mobile">
                {navItems.map((item, index) => {
                  const active = linkIsActive(pathname, item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        className={`block rounded-2xl px-4 py-3.5 text-[15px] font-medium tracking-tight transition ${
                          onHero
                            ? active
                              ? 'bg-white/18 text-white ring-2 ring-cta/90 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]'
                              : 'text-white/95 hover:bg-white/10'
                            : active
                              ? 'bg-section-alt text-primary ring-1 ring-primary/10'
                              : 'text-foreground hover:bg-section-alt/90'
                        }`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`mx-2 mb-2 mt-1 block rounded-2xl py-3.5 text-center text-[15px] font-bold transition ${
                    onHero
                      ? 'bg-cta text-[#1a1208] shadow-[0_10px_28px_-14px_rgba(244,162,97,0.5)] hover:bg-[#f6b078]'
                      : 'bg-primary text-white shadow-[0_10px_28px_-14px_rgba(31,78,121,0.45)] hover:bg-[#163a5c]'
                  }`}
                >
                  Plan your trip
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
