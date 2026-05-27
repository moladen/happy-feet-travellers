import { TRUSTINDEX_PROFILE_URL } from '@/lib/trustindex';

const DEFAULT_PROFILE = 'https://www.trustindex.io/';

/**
 * Static “Verified by Trustindex” badge (when using custom testimonials without full widget).
 */
export default function TrustindexVerifiedBadge({ className = '' }) {
  const href = TRUSTINDEX_PROFILE_URL || DEFAULT_PROFILE;

  return (
    <a
      href={href}
      className={`trustindex-verified-badge ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Verified by Trustindex — view reviews"
    >
      <span className="trustindex-verified-badge__text">Verified by Trustindex</span>
      <span className="trustindex-verified-badge__info" aria-hidden>
        i
      </span>
    </a>
  );
}
