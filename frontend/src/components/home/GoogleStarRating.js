/**
 * @param {{ rating: number; max?: number; size?: 'sm' | 'md'; showValue?: boolean; className?: string }} props
 */
export default function GoogleStarRating({
  rating,
  max = 5,
  size = 'md',
  showValue = false,
  className = '',
}) {
  const safe = Math.min(max, Math.max(0, Number(rating) || 0));
  const sizeClass = size === 'sm' ? 'google-stars--sm' : 'google-stars--md';

  return (
    <div
      className={`google-stars ${sizeClass} ${className}`.trim()}
      role="img"
      aria-label={`${safe} out of ${max} stars`}
    >
      <div className="google-stars__track" aria-hidden>
        {Array.from({ length: max }, (_, i) => (
          <span key={`empty-${i}`} className="google-stars__star google-stars__star--empty">
            ★
          </span>
        ))}
      </div>
      <div
        className="google-stars__fill"
        style={{ width: `${(safe / max) * 100}%` }}
        aria-hidden
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={`full-${i}`} className="google-stars__star google-stars__star--filled">
            ★
          </span>
        ))}
      </div>
      {showValue ? (
        <span className="google-stars__value">
          {safe.toFixed(1)}/{max}
        </span>
      ) : null}
    </div>
  );
}
