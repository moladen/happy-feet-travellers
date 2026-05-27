'use client';

import { useEffect, useRef } from 'react';
import { TRUSTINDEX_LOADER_SRC, TRUSTINDEX_WIDGET_ID } from '@/lib/trustindex';

const HOST_ID = 'trustindex-testimonials-widget';

/** Trustindex DOM nodes that belong to our widget (when injected at body end). */
function collectTrustindexNodes(widgetId) {
  if (!widgetId) return [];

  const selectors = [
    `#${HOST_ID} [data-widget-id="${widgetId}"]`,
    `[data-widget-id="${widgetId}"]`,
    `[data-ti-widget-id="${widgetId}"]`,
    `#ti-${widgetId}`,
    `.ti-widget[data-widget-id="${widgetId}"]`,
  ];

  const found = new Set();
  selectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => found.add(el));
    } catch {
      /* invalid selector */
    }
  });

  document.querySelectorAll('[id^="ti-"], [class*="ti-widget"], [class*="ti-review"]').forEach((el) => {
    if (el.closest(`#${HOST_ID}`)) return;
    const html = el.outerHTML || '';
    if (html.includes(widgetId) || el.getAttribute('data-widget-id') === widgetId) {
      found.add(el);
    }
  });

  return Array.from(found).filter((el) => el.tagName !== 'SCRIPT');
}

function removeInternalVerifiedBadge(host) {
  if (!host) return;

  const badgeText = 'Verified by Trustindex';

  // We remove only the actual badge element (usually small link/button),
  // not parent containers that might contain the same text.
  const candidates = host.querySelectorAll('a, button, span, div, p');
  candidates.forEach((el) => {
    try {
      const aria = (el.getAttribute('aria-label') || '').trim();
      const title = (el.getAttribute('title') || '').trim();
      const txt = (el.textContent || '').trim();

      // Avoid removing big container nodes: badge element should be relatively leafy.
      const childCount = el.childElementCount || 0;
      const isLeafy = childCount <= 6;

      const isBadge =
        aria.includes(badgeText) ||
        title.includes(badgeText) ||
        (isLeafy && txt.includes(badgeText));

      if (isBadge) {
        el.remove();
      }
    } catch {
      // ignore
    }
  });
}

function moveTrustindexIntoHost(host, widgetId) {
  if (!host) return;

  collectTrustindexNodes(widgetId).forEach((node) => {
    if (host.contains(node)) return;
    host.appendChild(node);
  });
}

/**
 * Loads Trustindex inside the testimonials section (not at document end).
 * next/script appends to body tail — Trustindex then renders after the footer.
 */
export default function TrustindexWidget({ className = '' }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !TRUSTINDEX_LOADER_SRC || !TRUSTINDEX_WIDGET_ID) return undefined;

    if (host.querySelector('script[data-ti-loader="1"]')) {
      moveTrustindexIntoHost(host, TRUSTINDEX_WIDGET_ID);
      return undefined;
    }

    const script = document.createElement('script');
    script.src = TRUSTINDEX_LOADER_SRC;
    script.defer = true;
    script.async = true;
    script.dataset.tiLoader = '1';
    host.appendChild(script);

    const onLoaded = () => moveTrustindexIntoHost(host, TRUSTINDEX_WIDGET_ID);
    script.addEventListener('load', onLoaded);

    const observer = new MutationObserver(() => {
      moveTrustindexIntoHost(host, TRUSTINDEX_WIDGET_ID);
    });
    observer.observe(document.body, { childList: true });

    const retries = [400, 1000, 2500, 5000].map((ms) => setTimeout(onLoaded, ms));

    return () => {
      script.removeEventListener('load', onLoaded);
      observer.disconnect();
      retries.forEach(clearTimeout);
      script.remove();
      Array.from(host.children).forEach((child) => {
        if (child.tagName !== 'SCRIPT') child.remove();
      });
    };
  }, []);

  if (!TRUSTINDEX_WIDGET_ID || !TRUSTINDEX_LOADER_SRC) return null;

  return (
    <div
      ref={hostRef}
      id={HOST_ID}
      className={`trustindex-widget-host ${className}`.trim()}
      data-widget-id={TRUSTINDEX_WIDGET_ID}
      aria-label="Google reviews"
    />
  );
}
