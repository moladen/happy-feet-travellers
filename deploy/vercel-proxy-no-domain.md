# Vercel proxy (no domain, no Cloudflare tunnel)

Fixes **mixed content** without `api.yourdomain.com` or Cloudflare.

Browser → `https://your-app.vercel.app/api/...` (HTTPS)  
Vercel server → `http://103.22.140.216:5080/api/...` (server-to-server, allowed)

## Vercel environment variables

| Name | Value |
|------|--------|
| `API_PROXY_TARGET` | `http://103.22.140.216:5080` |
| `NEXT_PUBLIC_API_URL` | `/api` |

Apply to **Production** (and Preview if needed). **Redeploy.**

**Admin image uploads:** Vercel’s `/api` proxy rejects request bodies above ~4.5 MB. The admin panel auto-compresses photos before upload. For very large originals, redeploy after each frontend change. Long-term: add `https://api.YOURDOMAIN.com` and set `NEXT_PUBLIC_API_DIRECT_URL` in Vercel (see `frontend/.env.example`).

## VPS

No HTTPS required on the API. Keep Docker on port 5080.

CORS is optional for browser traffic (same-origin via Vercel). Keep for direct API testing:

```env
CORS_ORIGINS=https://happy-feet-travellers-frontend.vercel.app
CORS_ALLOW_VERCEL=true
```

## Local dev

Do **not** set `API_PROXY_TARGET` locally. Use:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Other methods (comparison)

| Method | Domain needed? | Notes |
|--------|----------------|-------|
| **Vercel proxy** (this doc) | No | Best fit for Vercel + VPS IP |
| Cloudflare Tunnel | No | Extra process on VPS; URL may change |
| nginx + Let's Encrypt | Yes (`api.*`) | Best long-term production |
| Move API to Render/Railway | No | New host; free HTTPS URL |
| ngrok | No | Dev/demo only |
