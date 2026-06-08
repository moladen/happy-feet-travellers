import Link from 'next/link';
import { USER_MESSAGES } from '@/lib/userMessages';

export const metadata = {
  title: 'Page not found — Happy Feet Travellers',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="section-state section-state--empty max-w-md text-center">
        <p className="section-eyebrow mb-2">404</p>
        <h1 className="section-title text-primary">Page not found</h1>
        <p className="section-state__message mt-3">{USER_MESSAGES.notFound}</p>
        <div className="section-state__actions mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="section-state__action section-state__action--primary">
            Back to home
          </Link>
          <Link href="/upcoming-departures" className="section-state__action">
            View departures
          </Link>
        </div>
      </div>
    </div>
  );
}
