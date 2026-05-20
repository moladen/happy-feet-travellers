import Image from 'next/image';
import Link from 'next/link';

/** Same brand artwork site-wide (white type + mountain mark). */
export const BRAND_LOGO_SRC = '/happy-feet-logo-transparent.png';

const VARIANT_CONFIG = {
  nav: {
    className: 'h-11 w-auto max-w-[10.75rem] sm:h-12 sm:max-w-[12rem] lg:h-[3.35rem] lg:max-w-[13rem]',
  },
  footer: {
    className: 'h-[3.25rem] w-auto max-w-[12.5rem] sm:h-[3.75rem] sm:max-w-[14rem]',
  },
};

export default function BrandLogo({
  variant = 'nav',
  className = '',
  priority = false,
  href = '/',
  /** Nav only: `hero` | `solid` (light bar gets navy chip). */
  navTone = 'solid',
}) {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.nav;
  const isNav = variant === 'nav';
  const isFooter = variant === 'footer';
  const onLightNavbar = isNav && navTone === 'solid';

  const image = (
    <Image
      src={BRAND_LOGO_SRC}
      alt="Happy Feet Travellers"
      width={420}
      height={168}
      priority={priority}
      className={`object-contain object-left ${config.className} ${onLightNavbar || isFooter ? '' : className}`}
    />
  );

  let content = image;

  if (onLightNavbar) {
    content = (
      <span
        className={`inline-flex shrink-0 items-center rounded-xl bg-[#0f1c2e] px-2 py-1 shadow-[0_8px_22px_-10px_rgba(15,28,46,0.45)] ring-1 ring-cta/40 sm:px-2.5 sm:py-1.5 ${className}`}
      >
        {image}
      </span>
    );
  } else if (isFooter) {
    content = (
      <span className={`inline-flex shrink-0 items-center ${className}`}>{image}</span>
    );
  }

  if (!href) {
    return <span className="inline-flex shrink-0 items-center">{content}</span>;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="Happy Feet Travellers home">
      {content}
    </Link>
  );
}
