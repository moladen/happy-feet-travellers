import Image from 'next/image';
import GoogleLogo from '@/components/home/GoogleLogo';
import GoogleStarRating from '@/components/home/GoogleStarRating';

/**
 * @param {{ review: { name: string; date?: string; rating: number; text: string; image?: string; verified?: boolean } }} props
 */
export default function GoogleReviewCard({ review }) {
  return (
    <article className="google-review-card">
      <header className="google-review-card__header">
        <div className="google-review-card__avatar">
          {review.image ? (
            <Image src={review.image} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <span className="google-review-card__initial" aria-hidden>
              {review.name.slice(0, 1)}
            </span>
          )}
        </div>
        <div className="google-review-card__meta">
          <p className="google-review-card__name">{review.name}</p>
          {review.date ? <p className="google-review-card__date">{review.date}</p> : null}
        </div>
        <GoogleLogo className="google-review-card__google" />
      </header>

      <div className="google-review-card__rating-row">
        <GoogleStarRating rating={review.rating} size="sm" />
        {review.verified !== false ? (
          <span className="google-review-card__verified">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Verified Review
          </span>
        ) : null}
      </div>

      <p className="google-review-card__text">{review.text}</p>
    </article>
  );
}
