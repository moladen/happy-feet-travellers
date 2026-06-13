/**
 * Tour hero + gallery image flow — run against dev server on :5000
 * node scripts/test-tour-gallery-images.js
 */
const fs = require('fs');
const path = require('path');

const API = process.env.API_URL || 'http://127.0.0.1:5000/api';
const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@happyfeet.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
};

const SAMPLE_JPG = path.resolve(__dirname, '../../frontend/public/hero/tropical-paradise.jpg');
const SAMPLE_JPG_2 = path.resolve(__dirname, '../../frontend/public/hero/mountain-golden.jpg');

let passed = 0;
let failed = 0;

function ok(name, detail = '') {
  passed += 1;
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function bad(name, detail) {
  failed += 1;
  console.log(`  ✗ ${name}: ${detail}`);
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json, headers: res.headers };
}

async function login() {
  const { status, json } = await jsonFetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(ADMIN),
  });
  if (status !== 200 || !json?.data?.token) {
    throw new Error(json?.message || `login failed (${status})`);
  }
  return json.data.token;
}

async function uploadImage(token, filePath, mimeType = '') {
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: mimeType });
  const form = new FormData();
  form.append('image', blob, path.basename(filePath));

  const { status, json } = await jsonFetch(`${API}/media/tour-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: form,
  });
  return { status, json };
}

async function main() {
  console.log('\nTour gallery image test\n');

  if (!fs.existsSync(SAMPLE_JPG)) {
    bad('sample files', 'hero JPG not found');
    process.exit(1);
  }

  let token;
  try {
    token = await login();
    ok('admin login');
  } catch (err) {
    bad('admin login', err.message);
    process.exit(1);
  }

  // Windows-style empty MIME upload
  const up1 = await uploadImage(token, SAMPLE_JPG, '');
  const url1 = up1.json?.data?.url;
  if (up1.status === 201 && url1) ok('upload tour image (empty MIME)', url1);
  else bad('upload tour image (empty MIME)', up1.json?.message || `status ${up1.status}`);

  const up2 = await uploadImage(token, SAMPLE_JPG_2, 'image/jpeg');
  const url2 = up2.json?.data?.url;
  if (up2.status === 201 && url2) ok('upload second gallery image', url2);
  else bad('upload second gallery image', up2.json?.message || `status ${up2.status}`);

  if (!url1 || !url2) {
    console.log(`\n${passed}/${passed + failed} passed\n`);
    process.exit(1);
  }

  const stamp = Date.now();
  const createBody = {
    title: `Gallery Test Tour ${stamp}`,
    slug: `gallery-test-${stamp}`,
    destination: 'Test Destination',
    departureCity: 'Mumbai',
    duration: 3,
    price: 9999,
    startingPrice: 9999,
    category: 'customized',
    status: 'active',
    coverImage: url1,
    images: [url1, url2],
    highlights: ['Test highlight one', 'Test highlight two'],
    inclusions: ['Test inclusion'],
    description: 'Automated gallery test tour with uploaded images.',
  };

  const created = await jsonFetch(`${API}/tours`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(createBody),
  });

  const tourId = created.json?.data?.id;
  if (created.status === 201 && tourId) ok('create tour with cover + gallery', tourId);
  else {
    bad('create tour with cover + gallery', created.json?.message || `status ${created.status}`);
    console.log(`\n${passed}/${passed + failed} passed\n`);
    process.exit(1);
  }

  const fetched = await jsonFetch(`${API}/tours/${tourId}`);
  const tour = fetched.json?.data;
  const images = Array.isArray(tour?.images) ? tour.images : [];
  const hasCover = tour?.coverImage === url1;
  const hasGallery = images.length >= 2 && images.includes(url1) && images.includes(url2);

  if (fetched.status === 200 && hasCover) ok('tour coverImage persisted', tour.coverImage);
  else bad('tour coverImage persisted', `cover=${tour?.coverImage}`);

  if (hasGallery) ok('tour images[] persisted', `${images.length} images`);
  else bad('tour images[] persisted', JSON.stringify(images));

  // Uploaded file should be served
  const uploadPath = url1.startsWith('/uploads') ? url1 : null;
  if (uploadPath) {
    const fileRes = await fetch(`http://127.0.0.1:5000${uploadPath}`);
    if (fileRes.status === 200 && (fileRes.headers.get('content-type') || '').includes('image')) {
      ok('uploaded file served from /uploads', uploadPath);
    } else {
      bad('uploaded file served from /uploads', `status ${fileRes.status}`);
    }

    // Frontend rewrite proxy
    const proxyRes = await fetch(`http://127.0.0.1:3000${uploadPath}`);
    if (proxyRes.status === 200) ok('frontend /uploads proxy', uploadPath);
    else bad('frontend /uploads proxy', `status ${proxyRes.status}`);
  }

  // Cleanup
  const del = await jsonFetch(`${API}/tours/${tourId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (del.status === 200) ok('cleanup test tour');
  else bad('cleanup test tour', del.json?.message || `status ${del.status}`);

  console.log(`\n${passed}/${passed + failed} passed\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
