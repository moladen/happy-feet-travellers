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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const mobilePanelBorder = 'border-[#e5d4bc] bg-gradient-to-b from-[#faf6ef] to-[#f5efe3] text-foreground ring-1 ring-primary/[0.06]';

  const mobileMenuButtonClass =
    'border-[#e5d4bc] bg-[#faf6ef]/95 text-primary shadow-sm ring-1 ring-primary/[0.04] hover:bg-[#f5efe3]';

  const barSurface = 'site-nav--solid site-chrome site-chrome--nav';

  const searchOuter =
    'border border-[#e5d4bc] bg-[#faf6ef]/95 shadow-[0_8px_24px_-14px_rgba(26,43,60,0.1)] ring-1 ring-primary/[0.04]';

  const searchInputClass = 'text-foreground placeholder:text-foreground/45';

  const iconSubmitClass =
    'grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cta text-white shadow-[0_6px_16px_-8px_rgba(231,111,81,0.45)] transition hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta/45';

  const desktopLinkBase =
    'border-transparent text-foreground/78 hover:border-cta/70 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/35';

  const desktopLinkActive = 'border-cta text-primary';

  const logoTone = 'light';

  return (
    <nav
      id="site-navigation"
      className={`sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color,color,backdrop-filter] duration-500 ${barSurface}`}
      data-nav-mode="solid"
      aria-label="Main navigation"
    >
      <div className="site-nav__inner container relative mx-auto max-w-[1400px] px-5 py-3.5 sm:px-6 md:px-8 md:py-4 lg:px-10 lg:py-4 xl:px-12">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
            <div onClick={() => setIsOpen(false)} className="min-w-0 shrink-0">
              <BrandLogo variant="nav" tone={logoTone} priority />
            </div>

            <form
              onSubmit={onSearchSubmit}
              className="min-w-0 hidden sm:flex"
              role="search"
              aria-label="Search tours"
            >
              <div
                className={`flex w-full max-w-[min(100%,11rem)] items-center gap-1 rounded-full py-1 pl-2.5 pr-1 backdrop-blur-xl sm:max-w-[13rem] md:max-w-[14rem] lg:max-w-[15rem] xl:max-w-[17rem] ${searchOuter}`}
              >
                <input
                  type="text"
                  name="q"
                  role="searchbox"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder="Search tours, destinations"
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
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              className={`mt-3 overflow-hidden rounded-[1.35rem] border shadow-[0_24px_56px_-32px_rgba(26,43,60,0.18)] lg:hidden ${mobilePanelBorder}`}
            >
              <div
                className="border-b border-[#efe6d8] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-olive/90"
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
                          active
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
                  className="mx-2 mb-2 mt-1 block rounded-2xl bg-cta py-3.5 text-center text-[15px] font-bold text-white shadow-[0_10px_28px_-14px_rgba(231,111,81,0.45)] transition hover:bg-cta-hover"
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
