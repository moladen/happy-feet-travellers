import Link from 'next/link';
import { USER_MESSAGES } from '@/lib/userMessages';

export const metadata = {
  title: 'Article not found — Happy Feet Travellers',
};

export default function BlogArticleNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="section-state section-state--empty max-w-md text-center">
        <h1 className="section-state__title">Article not found</h1>
        <p className="section-state__message mt-3">{USER_MESSAGES.blogNotFound}</p>
        <div className="section-state__actions mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/blog" className="section-state__action section-state__action--primary">
            Travel journal
          </Link>
          <Link href="/" className="section-state__action">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
