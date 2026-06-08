import Link from 'next/link';
import { getLoadingLabel } from '@/lib/userMessages';

/**
 * Branded loading, error, and empty states for public pages and sections.
 */
export default function SectionState({
  type = 'empty',
  title,
  message,
  loadingKey = 'content',
  action,
  actionHref,
  actionLabel,
  className = '',
  compact = false,
}) {
  if (type === 'loading') {
    const label = title || getLoadingLabel(loadingKey);
    return (
      <div
        className={`section-state section-state--loading ${compact ? 'section-state--compact' : ''} ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="section-state__spinner" aria-hidden />
        <p className="section-state__loading-text">{label}</p>
      </div>
    );
  }

  const isError = type === 'error';
  const resolvedTitle =
    title || (isError ? 'Something went wrong' : 'Nothing to show yet');
  const resolvedMessage = message || '';

  const actionNode =
    action ||
    (actionHref && actionLabel ? (
      <Link href={actionHref} className="section-state__action">
        {actionLabel}
      </Link>
    ) : null);

  return (
    <div
      className={`section-state section-state--${type} ${compact ? 'section-state--compact' : ''} ${className}`.trim()}
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div className="section-state__icon" aria-hidden>
        {isError ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
          </svg>
        )}
      </div>
      <h3 className="section-state__title">{resolvedTitle}</h3>
      {resolvedMessage ? <p className="section-state__message">{resolvedMessage}</p> : null}
      {actionNode ? <div className="section-state__actions">{actionNode}</div> : null}
    </div>
  );
}
