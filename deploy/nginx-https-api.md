# HTTPS for the API (fix Vercel mixed-content)

Vercel admin/site is **HTTPS**. The API must be **HTTPS** too, or the browser blocks requests (`blocked:mixed-content`).

**You need a domain** (e.g. `happyfeet.com`) with a subdomain for the API, e.g. `api.happyfeet.com`.

---

## 1. DNS

At your domain registrar / Cloudflare:

| Type | Name | Value |
|------|------|--------|
| A | `api` | `103.22.140.216` |

Wait a few minutes for DNS to propagate.

Test:

```bash
dig +short api.YOURDOMAIN.com
```

Should show `103.22.140.216`.

---

## 2. Nginx on the VPS

SSH in, then:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create config (replace `api.YOURDOMAIN.com`):

```bash
sudo nano /etc/nginx/sites-available/happy-feet-api
```

```nginx
server {
    listen 80;
    server_name api.YOURDOMAIN.com;

    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:5080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable:

```bash
sudo ln -sf /etc/nginx/sites-available/happy-feet-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 3. SSL (Let’s Encrypt)

Port **80** must be open to the internet.

```bash
sudo certbot --nginx -d api.YOURDOMAIN.com
```

Follow prompts (email, agree, redirect HTTP→HTTPS: **Yes**).

Test:

```bash
curl -s https://api.YOURDOMAIN.com/api/health
```

---

## 4. Backend CORS

```bash
cd ~/happy-feet-travellers/backend
nano .env
```

```env
CORS_ORIGINS=https://happy-feet-travellers-frontend.vercel.app,https://YOURDOMAIN.com,https://www.YOURDOMAIN.com
CORS_ALLOW_VERCEL=true
```

```bash
docker compose restart api
```

---

## 5. Vercel

**Environment variable:**

`NEXT_PUBLIC_API_URL` = `https://api.YOURDOMAIN.com/api`

**Redeploy** the frontend (required).

---

## Alternative: Cloudflare (no certbot on VPS)

If DNS is on Cloudflare:

1. A record `api` → `103.22.140.216`
2. **Proxy status: Proxied** (orange cloud)
3. SSL/TLS mode: **Flexible** (HTTPS visitor → Cloudflare → HTTP to your VPS:5080)  
   Better long-term: **Full** + certbot on VPS.

Then use `https://api.YOURDOMAIN.com/api` on Vercel (same as step 5).

---

## No domain?

Use [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) (`cloudflared`) for a free `https://….trycloudflare.com` URL, or buy/connect a domain first.
