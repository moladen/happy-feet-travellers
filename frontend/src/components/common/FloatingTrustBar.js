'use client';

import Link from 'next/link';
import { FLOATING_TRUST_BAR } from '@/lib/trustBar';

function TrustItem({ item }) {
  const content = (
    <>
      <span className="floating-trust-bar__emoji" aria-hidden>
        {item.emoji}
      </span>
      <span className="floating-trust-bar__label">{item.label}</span>
    </>
  );

  if (item.href) {
    const className = 'floating-trust-bar__item floating-trust-bar__item--link';
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }

  return <span className="floating-trust-bar__item">{content}</span>;
}

export default function FloatingTrustBar() {
  return (
    <aside
      className="floating-trust-bar"
      aria-label="Happy Feet Travellers trust highlights"
    >
      <div className="floating-trust-bar__inner">
        <ul className="floating-trust-bar__list">
          {FLOATING_TRUST_BAR.items.map((item, index) => (
            <li key={item.id} className="floating-trust-bar__list-item">
              {index > 0 ? <span className="floating-trust-bar__divider" aria-hidden /> : null}
              <TrustItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
