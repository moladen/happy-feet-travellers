/**
 * Quick backend smoke test — run: node scripts/smoke-api.js
 * Requires local PostgreSQL + seeded data (admin@happyfeet.com / Admin@123).
 */
const path = require('path');
require('module-alias').addAliases({ '@': path.resolve(__dirname, '../src') });

const app = require('../src/app');

const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@happyfeet.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
};

let token = null;
let tourId = null;
const results = [];

function pass(name) {
  results.push({ name, ok: true });
  console.log(`  ✓ ${name}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}: ${detail}`);
}

async function request(method, urlPath, { body, auth } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`http://127.0.0.1:${global.__port}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

async function run() {
  const server = await new Promise((resolve, reject) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
    s.on('error', reject);
  });
  global.__port = server.address().port;

  console.log(`\nBackend smoke test on port ${global.__port}\n`);

  try {
    // Health
    const health = await request('GET', '/api/health');
    if (health.status === 200 && health.json?.database?.ok) pass('GET /api/health + DB');
    else fail('GET /api/health + DB', JSON.stringify(health.json?.database || health.json));

    // Public reads
    for (const [name, path] of [
      ['GET /api/tours', '/api/tours?limit=2'],
      ['GET /api/blogs', '/api/blogs?limit=2'],
      ['GET /api/testimonials', '/api/testimonials'],
      ['GET /api/gallery', '/api/gallery'],
      ['GET /api/settings', '/api/settings'],
      ['GET /api/hero-slides', '/api/hero-slides'],
      ['GET /api/team-members', '/api/team-members'],
    ]) {
      const r = await request('GET', path);
      if (r.status === 200 && r.json?.success !== false) pass(name);
      else fail(name, `status ${r.status} — ${r.json?.message || ''}`);
    }

    const tours = await request('GET', '/api/tours?limit=1');
    tourId = tours.json?.data?.tours?.[0]?.id;
    if (tourId) {
      const one = await request('GET', `/api/tours/${tourId}`);
      if (one.status === 200) pass('GET /api/tours/:id');
      else fail('GET /api/tours/:id', `status ${one.status}`);
    } else {
      fail('GET /api/tours/:id', 'no tours in DB — run prisma:seed');
    }

    // Auth
    const login = await request('POST', '/api/auth/login', {
      body: { email: ADMIN.email, password: ADMIN.password },
    });
    token = login.json?.data?.token;
    if (login.status === 200 && token) pass('POST /api/auth/login');
    else fail('POST /api/auth/login', login.json?.message || `status ${login.status}`);

    const profile = await request('GET', '/api/auth/profile', { auth: true });
    if (profile.status === 200 && profile.json?.data?.email) pass('GET /api/auth/profile');
    else fail('GET /api/auth/profile', profile.json?.message || `status ${profile.status}`);

    // Admin reads
    if (token) {
      for (const [name, path] of [
        ['GET /api/enquiry (admin)', '/api/enquiry?limit=5'],
        ['GET /api/subscribers (admin)', '/api/subscribers?limit=5'],
      ]) {
        const r = await request('GET', path, { auth: true });
        if (r.status === 200) pass(name);
        else fail(name, r.json?.message || `status ${r.status}`);
      }
    }

    // Public write — enquiry
    const enquiry = await request('POST', '/api/enquiry', {
      body: {
        name: 'Smoke Test',
        phone: '9876543210',
        email: 'smoke@example.com',
        message: 'Automated smoke test enquiry with enough detail.',
        source: 'smoke',
      },
    });
    if (enquiry.status === 201 || enquiry.status === 200) pass('POST /api/enquiry');
    else fail('POST /api/enquiry', enquiry.json?.message || `status ${enquiry.status}`);

    const phoneOnly = await request('POST', '/api/enquiry', {
      body: {
        name: 'Phone Lead',
        phone: '9123456780',
        message: 'Phone-only enquiry from smoke test with detail.',
        source: 'smoke',
      },
    });
    if (phoneOnly.status === 201 || phoneOnly.status === 200) pass('POST /api/enquiry (phone only)');
    else fail('POST /api/enquiry (phone only)', phoneOnly.json?.message || `status ${phoneOnly.status}`);

    // Subscriber
    const sub = await request('POST', '/api/subscribers', {
      body: { email: `smoke+${Date.now()}@example.com`, source: 'smoke' },
    });
    if (sub.status === 201 || sub.status === 200) pass('POST /api/subscribers');
    else fail('POST /api/subscribers', sub.json?.message || `status ${sub.status}`);

    if (token) {
      const stamp = Date.now();
      const cover = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80';

      const galleryCreate = await request('POST', '/api/gallery', {
        auth: true,
        body: {
          title: 'Smoke gallery',
          altText: 'Smoke test gallery image',
          category: 'smoke',
          image: cover,
        },
      });
      const galleryId = galleryCreate.json?.data?.id;
      if (galleryCreate.status === 201 && galleryId) pass('POST /api/gallery');
      else fail('POST /api/gallery', galleryCreate.json?.message || `status ${galleryCreate.status}`);

      if (galleryId) {
        const galleryUpdate = await request('PUT', `/api/gallery/${galleryId}`, {
          auth: true,
          body: { altText: 'Updated smoke gallery alt text' },
        });
        if (galleryUpdate.status === 200) pass('PUT /api/gallery/:id');
        else fail('PUT /api/gallery/:id', galleryUpdate.json?.message || `status ${galleryUpdate.status}`);

        const galleryDelete = await request('DELETE', `/api/gallery/${galleryId}`, { auth: true });
        if (galleryDelete.status === 200) pass('DELETE /api/gallery/:id');
        else fail('DELETE /api/gallery/:id', galleryDelete.json?.message || `status ${galleryDelete.status}`);
      }

      const testimonialCreate = await request('POST', '/api/testimonials', {
        auth: true,
        body: {
          name: 'Smoke Traveller',
          city: 'Pune',
          review: 'Automated smoke testimonial with enough characters.',
          rating: 5,
          image: cover,
        },
      });
      const testimonialId = testimonialCreate.json?.data?.id;
      if (testimonialCreate.status === 201 && testimonialId) pass('POST /api/testimonials');
      else fail('POST /api/testimonials', testimonialCreate.json?.message || `status ${testimonialCreate.status}`);

      if (testimonialId) {
        const testimonialUpdate = await request('PUT', `/api/testimonials/${testimonialId}`, {
          auth: true,
          body: { review: 'Updated automated smoke testimonial text here.' },
        });
        if (testimonialUpdate.status === 200) pass('PUT /api/testimonials/:id');
        else fail('PUT /api/testimonials/:id', testimonialUpdate.json?.message || `status ${testimonialUpdate.status}`);

        const testimonialDelete = await request('DELETE', `/api/testimonials/${testimonialId}`, {
          auth: true,
        });
        if (testimonialDelete.status === 200) pass('DELETE /api/testimonials/:id');
        else fail('DELETE /api/testimonials/:id', testimonialDelete.json?.message || `status ${testimonialDelete.status}`);
      }

      const blogCreate = await request('POST', '/api/blogs', {
        auth: true,
        body: {
          title: `Smoke Blog ${stamp}`,
          excerpt: 'Smoke test excerpt',
          content: '<p>Automated smoke blog content with sufficient length for validation.</p>',
          coverImage: cover,
          authorName: 'Smoke Author',
        },
      });
      const blogId = blogCreate.json?.data?.id;
      if (blogCreate.status === 201 && blogId) pass('POST /api/blogs');
      else fail('POST /api/blogs', blogCreate.json?.message || `status ${blogCreate.status}`);

      if (blogId) {
        const blogUpdate = await request('PUT', `/api/blogs/${blogId}`, {
          auth: true,
          body: { title: `Smoke Blog Updated ${stamp}` },
        });
        if (blogUpdate.status === 200) pass('PUT /api/blogs/:id');
        else fail('PUT /api/blogs/:id', blogUpdate.json?.message || `status ${blogUpdate.status}`);

        const blogDelete = await request('DELETE', `/api/blogs/${blogId}`, { auth: true });
        if (blogDelete.status === 200) pass('DELETE /api/blogs/:id');
        else fail('DELETE /api/blogs/:id', blogDelete.json?.message || `status ${blogDelete.status}`);
      }

      const settingsPut = await request('PUT', '/api/settings', {
        auth: true,
        body: { footerTagline: 'Smoke-tested footer tagline' },
      });
      if (settingsPut.status === 200) pass('PUT /api/settings');
      else fail('PUT /api/settings', settingsPut.json?.message || `status ${settingsPut.status}`);
    }

    // Tour update (if we have id + token)
    if (token && tourId) {
      const toursRes = await request('GET', `/api/tours/${tourId}`);
      const tour = toursRes.json?.data;
      if (tour) {
        const updated = await request('PUT', `/api/tours/${tourId}`, {
          auth: true,
          body: {
            title: tour.title,
            price: tour.price,
            startingPrice: tour.startingPrice ?? tour.price,
          },
        });
        if (updated.status === 200) pass('PUT /api/tours/:id (update)');
        else fail('PUT /api/tours/:id', updated.json?.message || `status ${updated.status}`);
      }
    }
  } finally {
    server.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log('\nFailed:');
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
  console.log('\nAll backend smoke checks passed.\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
