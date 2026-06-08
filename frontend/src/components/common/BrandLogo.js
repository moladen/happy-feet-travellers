import Image from 'next/image';
import Link from 'next/link';
import { getBrandLogoSrc, resolveBrandLogoTone } from '@/lib/brandLogos';

export const BRAND_LOGO_SRC = getBrandLogoSrc('light');

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
 * Brand logo — black artwork on light surfaces; inverted on dark hero/footer.
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
  const logoSrc = getBrandLogoSrc(resolvedTone);

  const image = (
    <Image
      src={logoSrc}
      alt="Happy Feet Travellers"
      width={300}
      height={253}
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
