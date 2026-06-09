'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { USER_MESSAGES } from '@/lib/userMessages';

export default function Error({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[app-error]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="section-state section-state--error max-w-md text-center" role="alert">
        <h1 className="section-state__title">We hit a snag</h1>
        <p className="section-state__message">{USER_MESSAGES.generic}</p>
        <div className="section-state__actions mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="section-state__action section-state__action--primary">
            Try again
          </button>
          <Link href="/" className="section-state__action">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
