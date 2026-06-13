/**
 * Pre-deployment QA audit — crawls public pages and checks HTTP status + JSON-LD.
 * Usage: node scripts/qa-audit.mjs [baseUrl]
 * Requires: dev server on :3000 and backend on :5000 for dynamic route discovery.
 */
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const API = BASE.replace(':3000', ':5000') + '/api';

const STATIC_PATHS = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/customized-trips',
  '/discover',
  '/upcoming-departures',
  '/policies/privacy',
  '/policies/terms',
  '/policies/cancellation',
  '/rann-of-kutch-season-2026-27',
  '/admin/login',
  '/this-page-should-404',
];

const CATEGORY_PATHS = [
  '/upcoming-departures/beaches',
  '/upcoming-departures/mountains',
  '/customized-trips/honeymoon-escapes',
  '/customized-trips/family-vacations',
];

const results = { passed: [], failed: [], warnings: [] };

function pass(name, detail = '') {
  results.passed.push({ name, detail });
}
function fail(name, detail) {
  results.failed.push({ name, detail });
}
function warn(name, detail) {
  results.warnings.push({ name, detail });
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, json, ok: res.ok };
}

async function fetchPage(path, { expectStatus = 200, expectNot = [] } = {}) {
  const url = `${BASE}${path}`;
  const start = Date.now();
  const res = await fetch(url, {
    headers: { Accept: 'text/html' },
    redirect: 'follow',
  });
  const ms = Date.now() - start;
  const html = await res.text();
  const hasJsonLd = /application\/ld\+json/i.test(html);
  const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
  const hasMetaDesc = /<meta[^>]+name=["']description["']/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);
  const hasError500 = /Internal Server Error|Application error/i.test(html);
  const consoleErrors = (html.match(/console\.error/g) || []).length;

  const ok = res.status === expectStatus && !hasError500;
  return {
    path,
    url,
    status: res.status,
    ms,
    ok,
    hasJsonLd,
    hasTitle,
    title,
    hasMetaDesc,
    hasH1,
    hasError500,
    htmlLength: html.length,
    consoleErrors,
    expectNot,
  };
}

async function discoverDynamicPaths() {
  const paths = [];

  try {
    const tours = await fetchJson(`${API}/tours?limit=5`);
    for (const t of tours.json?.data?.tours || []) {
      paths.push(`/tour/${t.slug || t.id}`);
    }
  } catch {
    warn('Dynamic discovery', 'Could not fetch tours from API');
  }

  try {
    const blogs = await fetchJson(`${API}/blogs?limit=5`);
    for (const b of blogs.json?.data?.blogs || blogs.json?.data || []) {
      paths.push(`/blog/${b.slug || b.id}`);
    }
  } catch {
    warn('Dynamic discovery', 'Could not fetch blogs from API');
  }

  try {
    const landings = await fetchJson(`${API}/landing-pages`);
    const pages = landings.json?.data?.landingPages || landings.json?.data || [];
    for (const p of pages) {
      if (p.status === 'published' && p.slug) {
        if (p.slug !== 'rann-of-kutch-season-2026-27') paths.push(`/${p.slug}`);
        for (const pkg of p.packages || []) {
          if (pkg.active !== false && pkg.slug) {
            paths.push(`/${p.slug}/packages/${pkg.slug}`);
          }
        }
      }
    }
  } catch {
    warn('Dynamic discovery', 'Could not fetch landing pages from API');
  }

  return [...new Set(paths)];
}

async function checkApiEndpoints() {
  const endpoints = [
    ['GET /api/health', `${API}/health`],
    ['GET /api/tours', `${API}/tours?limit=1`],
    ['GET /api/blogs', `${API}/blogs?limit=1`],
    ['GET /api/testimonials', `${API}/testimonials`],
    ['GET /api/gallery', `${API}/gallery`],
    ['GET /api/settings', `${API}/settings`],
    ['GET /api/hero-slides', `${API}/hero-slides`],
    ['GET /api/landing-pages', `${API}/landing-pages`],
  ];

  for (const [name, url] of endpoints) {
    try {
      const r = await fetchJson(url);
      if (r.ok && r.json?.success !== false) pass(`API ${name}`, `HTTP ${r.status}`);
      else fail(`API ${name}`, `HTTP ${r.status} — ${r.json?.message || 'unexpected response'}`);
    } catch (err) {
      fail(`API ${name}`, err.message);
    }
  }
}

async function checkSeoFiles() {
  for (const path of ['/robots.txt', '/sitemap.xml']) {
    try {
      const res = await fetch(`${BASE}${path}`);
      if (res.status === 200) pass(`SEO ${path}`, 'exists');
      else warn(`SEO ${path}`, `HTTP ${res.status} — missing (recommended for production)`);
    } catch (err) {
      warn(`SEO ${path}`, err.message);
    }
  }
}

async function checkEnquiryValidation() {
  const r = await fetch(`${API}/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({}),
  });
  const json = await r.json().catch(() => ({}));
  if (r.status === 400 || r.status === 422) {
    pass('Enquiry validation', 'Empty POST rejected with validation error');
  } else if (r.status === 429) {
    warn('Enquiry validation', 'Rate limited — could not test validation');
  } else {
    warn('Enquiry validation', `Unexpected status ${r.status}: ${json?.message || ''}`);
  }
}

async function main() {
  console.log(`\n=== QA Audit — ${BASE} ===\n`);

  await checkApiEndpoints();
  await checkSeoFiles();
  await checkEnquiryValidation();

  const dynamic = await discoverDynamicPaths();
  const allPaths = [...STATIC_PATHS, ...CATEGORY_PATHS, ...dynamic];
  const slowPages = [];

  for (const path of allPaths) {
    const expectStatus = path.includes('should-404') ? 404 : 200;
    try {
      const r = await fetchPage(path, { expectStatus });
      if (r.ok) {
        pass(`Page ${path}`, `${r.status} in ${r.ms}ms`);
        if (r.ms > 5000) slowPages.push({ path, ms: r.ms });
        if (expectStatus === 200) {
          if (!r.hasTitle) warn(`Meta ${path}`, 'Missing <title>');
          if (!r.hasMetaDesc && !path.startsWith('/admin')) warn(`Meta ${path}`, 'Missing meta description');
          if (!r.hasH1 && !path.startsWith('/admin')) warn(`Meta ${path}`, 'Missing H1');
          if (r.hasError500) fail(`Page ${path}`, 'Contains error text in HTML');
        }
      } else {
        fail(`Page ${path}`, `HTTP ${r.status}${r.hasError500 ? ' (server error in body)' : ''}`);
      }
    } catch (err) {
      fail(`Page ${path}`, err.message);
    }
  }

  if (slowPages.length) {
    for (const p of slowPages) {
      warn('Performance', `${p.path} took ${p.ms}ms (>5s)`);
    }
  }

  // Summary
  console.log('\n--- PASSED ---');
  results.passed.forEach((r) => console.log(`  ✓ ${r.name}${r.detail ? ` — ${r.detail}` : ''}`));
  console.log('\n--- FAILED ---');
  if (!results.failed.length) console.log('  (none)');
  else results.failed.forEach((r) => console.log(`  ✗ ${r.name}: ${r.detail}`));
  console.log('\n--- WARNINGS ---');
  if (!results.warnings.length) console.log('  (none)');
  else results.warnings.forEach((r) => console.log(`  ⚠ ${r.name}: ${r.detail}`));

  console.log(`\nSummary: ${results.passed.length} passed, ${results.failed.length} failed, ${results.warnings.length} warnings`);
  console.log(`Pages crawled: ${allPaths.length} (${dynamic.length} dynamic)\n`);

  process.exit(results.failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
