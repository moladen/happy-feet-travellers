import GoogleLogo from '@/components/home/GoogleLogo';
import GoogleStarRating from '@/components/home/GoogleStarRating';
import { GOOGLE_REVIEWS_PROFILE_URL, GOOGLE_REVIEWS_SUMMARY } from '@/lib/googleReviews';

/**
 * Google Reviews summary badge — overall rating and link to profile.
 */
export default function GoogleReviewsBadge({ className = '' }) {
  const { rating, maxRating, totalReviews, label } = GOOGLE_REVIEWS_SUMMARY;

  return (
    <a
      href={GOOGLE_REVIEWS_PROFILE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`google-reviews-badge ${className}`.trim()}
      aria-label={`${label} — ${rating} out of ${maxRating} from ${totalReviews} reviews`}
    >
      <span className="google-reviews-badge__logo-wrap">
        <GoogleLogo className="google-reviews-badge__logo" />
      </span>
      <span className="google-reviews-badge__body">
        <span className="google-reviews-badge__label">{label}</span>
        <span className="google-reviews-badge__rating-row">
          <span className="google-reviews-badge__score">{rating.toFixed(1)}</span>
          <GoogleStarRating rating={rating} max={maxRating} size="sm" />
        </span>
        <span className="google-reviews-badge__count">{totalReviews} reviews</span>
      </span>
    </a>
  );
}
