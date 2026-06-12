/**
 * Validate JSON-LD blocks on public pages (dev server must be running).
 * Usage: node scripts/validate-jsonld.mjs [baseUrl]
 */
const BASE = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
);

const PAGES = [
  { name: 'Home (Organization + Reviews)', path: '/', expect: ['TravelAgency', 'Review'] },
  { name: 'Rann landing (FAQ + Reviews)', path: '/rann-of-kutch-season-2026-27', expect: ['FAQPage', 'Review', 'TravelAgency'] },
  { name: 'Upcoming departures', path: '/upcoming-departures', expect: ['TravelAgency'] },
];

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(match[1].trim()));
    } catch (err) {
      blocks.push({ __parseError: err.message });
    }
  }
  return blocks;
}

function collectTypes(node, types = new Set()) {
  if (!node || typeof node !== 'object') return types;
  if (Array.isArray(node)) {
    node.forEach((item) => collectTypes(item, types));
    return types;
  }
  if (node['@type']) {
    const t = node['@type'];
    if (Array.isArray(t)) t.forEach((x) => types.add(x));
    else types.add(t);
  }
  Object.values(node).forEach((value) => collectTypes(value, types));
  return types;
}

function validateBlock(block) {
  const errors = [];
  if (block.__parseError) return [`Invalid JSON: ${block.__parseError}`];
  if (block['@context'] !== 'https://schema.org') {
    errors.push(`Missing or invalid @context (got ${block['@context']})`);
  }
  if (!block['@type']) errors.push('Missing @type');
  return errors;
}

function validateFaqPage(block) {
  const errors = validateBlock(block);
  if (!Array.isArray(block.mainEntity) || !block.mainEntity.length) {
    errors.push('FAQPage requires non-empty mainEntity');
  } else {
    block.mainEntity.forEach((item, i) => {
      if (item['@type'] !== 'Question') errors.push(`FAQ item ${i}: expected Question`);
      if (!item.name) errors.push(`FAQ item ${i}: missing name`);
      if (!item.acceptedAnswer?.text) errors.push(`FAQ item ${i}: missing acceptedAnswer.text`);
    });
  }
  return errors;
}

function validateTravelAgency(block) {
  const errors = validateBlock(block);
  if (!block.name) errors.push('TravelAgency missing name');
  if (!block.url && !block['@id']) errors.push('TravelAgency missing url/@id');
  return errors;
}

function validateTouristTrip(block) {
  const errors = validateBlock(block);
  if (!block.name) errors.push('TouristTrip missing name');
  if (!block.provider?.name && !block.provider?.['@id']) {
    errors.push('TouristTrip missing provider');
  }
  return errors;
}

function validateByType(block) {
  const type = block['@type'];
  const types = Array.isArray(type) ? type : [type];
  const errors = [];
  if (types.includes('FAQPage')) errors.push(...validateFaqPage(block));
  if (types.includes('TravelAgency')) errors.push(...validateTravelAgency(block));
  if (types.includes('TouristTrip')) errors.push(...validateTouristTrip(block));
  if (!errors.length) errors.push(...validateBlock(block));
  return [...new Set(errors)];
}

async function checkPage({ name, path, expect }) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { headers: { Accept: 'text/html' } });
  if (!res.ok) {
    return { name, url, ok: false, detail: `HTTP ${res.status}` };
  }

  const html = await res.text();
  const blocks = extractJsonLd(html);
  if (!blocks.length) {
    return { name, url, ok: false, detail: 'No JSON-LD blocks found' };
  }

  const allTypes = new Set();
  blocks.forEach((block) => collectTypes(block, allTypes).forEach((t) => allTypes.add(t)));

  const typeErrors = blocks.flatMap(validateByType);
  const missingExpected = (expect || []).filter((t) => !allTypes.has(t));

  if (typeErrors.length || missingExpected.length) {
    return {
      name,
      url,
      ok: false,
      detail: [
        ...typeErrors,
        ...missingExpected.map((t) => `Expected @type ${t} not found`),
      ].join('; '),
      types: [...allTypes],
    };
  }

  return { name, url, ok: true, types: [...allTypes], blockCount: blocks.length };
}

async function findTourAndPackagePaths() {
  const apiBase = BASE.replace(':3000', ':5000');
  const paths = [];

  try {
    const toursRes = await fetch(`${apiBase}/api/tours?limit=1`);
    if (toursRes.ok) {
      const body = await toursRes.json();
      const tour = body?.data?.tours?.[0];
      if (tour) {
        const key = tour.slug || tour.id;
        paths.push({
          name: 'Tour detail (TouristTrip)',
          path: `/tour/${key}`,
          expect: ['TouristTrip', 'TravelAgency'],
        });
      }
    }
  } catch {
    /* optional dynamic path */
  }

  try {
    const landingRes = await fetch(`${apiBase}/api/landing-pages/rann-of-kutch-season-2026-27`);
    if (landingRes.ok) {
      const body = await landingRes.json();
      const slug = body?.data?.slug || 'rann-of-kutch-season-2026-27';
      const pkg = body?.data?.packages?.find((p) => p.active !== false && p.slug);
      if (pkg?.slug) {
        paths.push({
          name: 'Rann package (TouristTrip)',
          path: `/${slug}/packages/${pkg.slug}`,
          expect: ['TouristTrip', 'TravelAgency'],
        });
      }
    }
  } catch {
    /* optional dynamic path */
  }

  return paths;
}

async function main() {
  console.log(`\nJSON-LD validation — ${BASE}\n`);

  const dynamic = await findTourAndPackagePaths();
  const pages = [...PAGES, ...dynamic];

  let failed = 0;
  for (const page of pages) {
    try {
      const result = await checkPage(page);
      if (result.ok) {
        console.log(`  ✓ ${result.name} — ${result.blockCount} block(s), types: ${result.types.join(', ')}`);
      } else {
        failed += 1;
        console.log(`  ✗ ${result.name}: ${result.detail}`);
      }
    } catch (err) {
      failed += 1;
      console.log(`  ✗ ${page.name}: ${err.message}`);
    }
  }

  console.log(`\n${pages.length - failed}/${pages.length} pages passed`);
  console.log('\nAlso test live URLs in Google Rich Results Test:');
  console.log('https://search.google.com/test/rich-results\n');

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
