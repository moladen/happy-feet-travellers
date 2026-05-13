'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const handleExitIntent = (e) => {
      if (shown || e.clientY > 8) return;
      setVisible(true);
      setShown(true);
    };

    window.addEventListener('mouseout', handleExitIntent);
    return () => window.removeEventListener('mouseout', handleExitIntent);
  }, [shown]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-xl backdrop-saturate-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-2xl font-bold text-primary">Wait, before you go</h3>
        <p className="mt-2 text-foreground">
          Need help picking the right tour? Our team can suggest options based on your budget and dates.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/contact" className="rounded-full bg-cta px-5 py-2 font-semibold text-primary">
            Talk to Us
          </Link>
          <button onClick={() => setVisible(false)} className="rounded-full border border-gray-300 px-5 py-2">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
