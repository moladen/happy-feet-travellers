import { buildFooterSocialLinks, buildSocialLinks } from '@/lib/siteContact';

const ICON_CLASS = {
  sm: 'h-5 w-5',
  md: 'h-[22px] w-[22px] md:h-6 md:w-6',
  lg: 'h-7 w-7',
};

const BUTTON_CLASS = {
  sm: 'h-10 w-10 rounded-lg',
  md: 'h-11 w-11 rounded-xl md:h-12 md:w-12 md:rounded-2xl',
  lg: 'h-12 w-12 rounded-2xl',
};

export function SocialIcon({ name, size = 'md' }) {
  const iconClass = ICON_CLASS[size] || ICON_CLASS.md;

  switch (name) {
    case 'facebook':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.48H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" aria-hidden>
          <rect width="16" height="16" x="4" y="4" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17" cy="7" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M21.58 7.19a2.64 2.64 0 0 0-1.86-1.87C18.08 4.88 12 4.88 12 4.88s-6.08 0-7.72.44a2.64 2.64 0 0 0-1.86 1.87A27.3 27.3 0 0 0 2 12a27.3 27.3 0 0 0 .42 4.81 2.64 2.64 0 0 0 1.86 1.87c1.64.44 7.72.44 7.72.44s6.08 0 7.72-.44a2.64 2.64 0 0 0 1.86-1.87A27.3 27.3 0 0 0 22 12a27.3 27.3 0 0 0-.42-4.81ZM10 15.11V8.89L15.2 12 10 15.11Z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.09 0C5.53 0 .19 5.34.19 11.9c0 2.1.55 4.15 1.59 5.95L.09 24l6.3-1.65a11.93 11.93 0 0 0 5.69 1.45h.01c6.56 0 11.9-5.34 11.91-11.9 0-3.18-1.24-6.17-3.48-8.42Zm-8.43 18.31h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.51-5.25c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.84 9.84 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.89 9.89Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Row of social profile links (Facebook, Instagram, YouTube, WhatsApp).
 * URLs come from admin Settings when available.
 */
export default function SocialMediaIcons({
  settings,
  size = 'md',
  className = '',
  showLabels = false,
  /** Use saved admin URLs with site defaults on the public footer */
  forFooter = false,
  /** Premium glass styling for the site footer */
  premiumFooter = false,
}) {
  const links = forFooter ? buildFooterSocialLinks(settings) : buildSocialLinks(settings);
  const buttonSize = premiumFooter ? '' : BUTTON_CLASS[size] || BUTTON_CLASS.md;
  const btnClass = premiumFooter
    ? 'site-footer__social-btn group'
    : `group grid ${buttonSize} place-items-center border border-white/25 bg-white/10 text-white shadow-[0_4px_16px_-6px_rgba(0,0,0,0.35)] backdrop-blur-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70`;

  if (!links.length) return null;

  return (
    <ul
      className={`flex flex-wrap items-center gap-2.5 md:gap-3 ${className}`}
      aria-label="Social media"
    >
      {links.map((item) => (
        <li key={item.label} className={showLabels ? 'flex flex-col items-center gap-1.5' : undefined}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Happy Feet Travellers on ${item.label}`}
            title={item.label}
            data-social={item.icon}
            className={`${btnClass} ${premiumFooter ? '' : item.hover}`}
          >
            <span className="transition group-hover:scale-110">
              <SocialIcon name={item.icon} size={size} />
            </span>
          </a>
          {showLabels ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-100/75">
              {item.label}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
