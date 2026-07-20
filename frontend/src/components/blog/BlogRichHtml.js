'use client';

import { useRouter } from 'next/navigation';
import { isInternalAppPath } from '@/lib/blogContent';

/**
 * Renders prepared blog HTML. Internal /paths use App Router navigation;
 * external links keep target=_blank from prepareBlogHtml.
 */
export default function BlogRichHtml({ html, className }) {
  const router = useRouter();

  const onClick = (event) => {
    const anchor = event.target.closest?.('a');
    if (!anchor || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (anchor.target && anchor.target !== '_self') return;

    const href = anchor.getAttribute('href');
    if (!isInternalAppPath(href)) return;

    event.preventDefault();
    router.push(href);
  };

  return (
    <div
      className={className}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
