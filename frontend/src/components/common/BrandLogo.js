import Image from 'next/image';
import Link from 'next/link';
import { resolveBrandLogoTone } from '@/lib/brandLogos';

/** Original Happy Feet Travellers logo artwork. */
export const BRAND_LOGO_SRC = '/happy-feet-logo-transparent.png';

const VARIANT_CONFIG = {
  nav: {
    className:
      'brand-logo__img h-11 w-auto max-w-[10.75rem] sm:h-12 sm:max-w-[12rem] lg:h-[3.35rem] lg:max-w-[13rem]',
  },
  footer: {
    className:
      'brand-logo__img h-[2.85rem] w-auto max-w-[11rem] sm:h-[3rem] sm:max-w-[12rem]',
  },
};

/**
 * Original brand logo — dual tone without heavy background chip.
 * Dark surfaces: logo as-is (white type on artwork).
 * Light surfaces: invert so typography reads dark on cream/white bars.
 */
export default function BrandLogo({
  variant = 'nav',
  className = '',
  priority = false,
  href = '/',
  tone,
  navTone,
}) {
  const config = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.nav;
  const resolvedTone = resolveBrandLogoTone({ tone, navTone });
  const onLightSurface = resolvedTone === 'light';

  const image = (
    <Image
      src={BRAND_LOGO_SRC}
      alt="Happy Feet Travellers"
      width={420}
      height={168}
      priority={priority}
      className={`object-contain object-left ${config.className} ${
        onLightSurface ? 'brand-logo__img--on-light' : 'brand-logo__img--on-dark'
      } ${className}`.trim()}
    />
  );

  const content = (
    <span className="brand-logo__wrap inline-flex shrink-0 items-center" data-brand-tone={resolvedTone}>
      {image}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="brand-logo__link inline-flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cta/55 focus-visible:ring-offset-2"
      aria-label="Happy Feet Travellers home"
    >
      {content}
    </Link>
  );
}
