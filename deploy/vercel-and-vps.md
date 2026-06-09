# Deploy: Vercel frontend + VPS API

**Live frontend:** https://happy-feet-travellers-frontend.vercel.app/

If the site shows “Loading departures…”, the frontend is up but it cannot reach the API (missing `NEXT_PUBLIC_API_URL`, API not deployed, or CORS).

---

## 1. Vercel (frontend) — do this now

1. Open [Vercel project settings → Environment Variables](https://vercel.com/dashboard).
2. Add (all environments: **Production**, **Preview**, **Development**):

   **Option A — recommended (VPS IP, no API domain):**

   | Name | Value |
   |------|--------|
   | `API_PROXY_TARGET` | `http://YOUR_VPS_IP:5080` (no trailing slash) |
   | `NEXT_PUBLIC_API_URL` | `/api` |
   | `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | Your Google Business profile URL (homepage reviews badge) |

   Browser calls same-origin `/api/...`; Vercel proxies to your VPS. Server-side pages use `API_PROXY_TARGET` automatically.

   **Option B — public API URL:**

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | `https://YOUR_API_HOST/api` |
   | `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | Your Google Business profile URL |

   Replace `YOUR_API_HOST` with your real API domain (HTTPS in production).

3. **Redeploy** (Deployments → ⋯ → Redeploy). `NEXT_PUBLIC_*` vars are applied at **build** time; `API_PROXY_TARGET` is read at **runtime** on the server.

4. Project settings (if not already):

   | Setting | Value |
   |---------|--------|
   | Root Directory | `frontend` |
   | Framework | Next.js |

   `frontend/vercel.json` sets install/build for the npm workspace monorepo.

---

## 2. VPS (backend) — CORS must include Vercel

In `backend/.env` on the server, set:

```env
CORS_ORIGINS=https://happy-feet-travellers-frontend.vercel.app
CORS_ALLOW_VERCEL=true
```

`CORS_ALLOW_VERCEL=true` allows Vercel preview URLs (`https://*-*.vercel.app`). When you add a custom domain on Vercel, append it (comma-separated, **no trailing slashes**):

```env
CORS_ORIGINS=https://happy-feet-travellers-frontend.vercel.app,https://happyfeet.com,https://www.happyfeet.com
```

Restart the API after changing `.env`:

```bash
cd backend && docker compose restart api
```

---

## 3. Quick checks

| Check | Command / action |
|-------|------------------|
| API health | `curl https://YOUR_API_HOST/api/health` |
| CORS | Open site → DevTools → Network → any `/api/` request; no CORS error |
| Env baked in | After redeploy, view page source or network: requests go to your API host, not `localhost:5000` |

---

## 4. VPS stack (summary)

See `deploy/nginx-api.conf.example` and `backend/docker-compose.yml`.

```bash
# On VPS
git clone <your-repo>
cd happy-feet-travellers/backend
cp .env.example .env
# Edit .env: JWT_SECRET, DATABASE_URL, CORS_ORIGINS, EmailJS (frontend), etc.
docker compose up --build -d
```

Point `api.yourdomain.com` DNS A record to the VPS, then nginx + certbot (example in `deploy/nginx-api.conf.example`).

---

## 5. What to send next (for hands-on help)

- API URL (or VPS IP + whether nginx/SSL is done)
- Whether Postgres is on VPS (Docker) or Neon
- GitHub repo URL (if different from local folder name)

Do **not** send passwords or full `DATABASE_URL` in chat.
