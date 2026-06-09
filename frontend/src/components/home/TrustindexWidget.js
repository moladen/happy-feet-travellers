'use client';

import { useEffect, useRef } from 'react';
import {
  isTrustindexBlockedContent,
  TRUSTINDEX_LOADER_SRC,
  TRUSTINDEX_WIDGET_ID,
} from '@/lib/trustindex';

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

function clearTrustindexContent(host) {
  if (!host) return;
  Array.from(host.children).forEach((child) => {
    if (child.tagName !== 'SCRIPT') child.remove();
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
 * Calls onUnavailable when trial expired / paywall message appears.
 */
export default function TrustindexWidget({ className = '', onUnavailable }) {
  const hostRef = useRef(null);
  const unavailableRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !TRUSTINDEX_LOADER_SRC || !TRUSTINDEX_WIDGET_ID) return undefined;

    const markUnavailable = () => {
      if (unavailableRef.current) return;
      unavailableRef.current = true;
      clearTrustindexContent(host);
      onUnavailable?.();
    };

    const syncWidget = () => {
      moveTrustindexIntoHost(host, TRUSTINDEX_WIDGET_ID);
      if (isTrustindexBlockedContent(host.innerText)) {
        markUnavailable();
      }
    };

    if (host.querySelector('script[data-ti-loader="1"]')) {
      syncWidget();
      return undefined;
    }

    const script = document.createElement('script');
    script.src = TRUSTINDEX_LOADER_SRC;
    script.defer = true;
    script.async = true;
    script.dataset.tiLoader = '1';
    host.appendChild(script);

    script.addEventListener('load', syncWidget);

    const observer = new MutationObserver(syncWidget);
    observer.observe(document.body, { childList: true, subtree: true });

    const retries = [400, 1000, 2500, 5000, 8000].map((ms) => setTimeout(syncWidget, ms));

    return () => {
      script.removeEventListener('load', syncWidget);
      observer.disconnect();
      retries.forEach(clearTimeout);
      script.remove();
      clearTrustindexContent(host);
    };
  }, [onUnavailable]);

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
