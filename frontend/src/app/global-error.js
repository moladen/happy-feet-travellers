'use client';

import { useEffect } from 'react';
import { USER_MESSAGES } from '@/lib/userMessages';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[global-error]', error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#faf6ef' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#1a2b3c', marginBottom: '0.75rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#4a5568', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {USER_MESSAGES.generic}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#1f4e79',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '999px',
                  border: '1px solid #dceaf7',
                  background: '#fff',
                  color: '#1f4e79',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
