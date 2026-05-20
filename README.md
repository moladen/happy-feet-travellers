# Happy Feet Travellers

Monorepo for the Happy Feet Travellers website.

| Workspace  | Tech                                    | Path        |
| ---------- | --------------------------------------- | ----------- |
| `frontend` | Next.js 16 (App Router) + Tailwind v4   | `frontend/` |
| `backend`  | Express 4 + Prisma + PostgreSQL         | `backend/`  |

## Project structure

```
happy-feet-travellers/
├── frontend/                    # Next.js app
│   ├── public/
│   ├── src/
│   │   ├── app/                 # App router pages & layouts
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   ├── home/
│   │   │   ├── tour/
│   │   │   └── upcoming/
│   │   ├── constants/           # Site-wide constants
│   │   ├── data/                # Static / mock data
│   │   ├── lib/                 # Low-level utilities (axios client)
│   │   └── services/            # API service layer (one file per resource)
│   ├── eslint.config.mjs
│   ├── next.config.mjs
│   └── package.json
│
├── backend/                     # Express API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/              # env, database, etc.
│   │   ├── constants/           # status codes, enums
│   │   ├── controllers/         # Thin: HTTP I/O only
│   │   ├── middlewares/         # auth, error, rate-limit, ...
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic / Prisma queries
│   │   ├── utils/               # AppError, asyncHandler, logger, ...
│   │   ├── validators/          # Joi schemas + validate middleware
│   │   ├── app.js               # Express app (no listen)
│   │   └── server.js            # HTTP listener + graceful shutdown
│   ├── .env.example
│   └── package.json
│
├── _legacy/                     # Old duplicates kept for reference (gitignored)
├── .editorconfig
├── .gitignore
├── .prettierrc
├── package.json                 # Root workspace + dev scripts
└── README.md
```

## Quick start

```bash
# 1. Install everything (uses npm workspaces)
npm install

# 2. Configure env files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 3. Initialize the database (Postgres must be running)
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Run frontend + backend together
npm run dev
```

| Action                          | Command                  |
| ------------------------------- | ------------------------ |
| Run all apps in dev             | `npm run dev`            |
| Run only frontend               | `npm run dev:frontend`   |
| Run only backend                | `npm run dev:backend`    |
| Production build (frontend)     | `npm run build`          |
| Lint frontend                   | `npm run lint`           |
| Format whole repo with Prettier | `npm run format`         |
| Backend API smoke test          | `npm run smoke -w backend` |

**URLs (local dev)**

| App    | URL |
| ------ | --- |
| Site   | http://localhost:3000 |
| Admin  | http://localhost:3000/admin |
| API    | http://localhost:5000/api |

Default admin login (after seed): `admin@happyfeet.com` / `Admin@123` — change in production.

## Deployment

### 1. Environment variables

**Backend** (`backend/.env` on the server):

| Variable | Example | Notes |
| -------- | ------- | ----- |
| `DATABASE_URL` | `postgresql://…` | Neon/cloud: add `?sslmode=require`; use pooled host if direct connect fails |
| `PORT` | `5000` | Or your host’s assigned port |
| `NODE_ENV` | `production` | |
| `JWT_SECRET` | long random string | **Required** — do not use the example value |
| `CORS_ORIGINS` | `https://yourdomain.com` | Comma-separated; must include the exact frontend origin (no trailing slash) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | | Used on first boot / seed only |

**Frontend** (build-time — set on Vercel/Netlify/etc.):

| Variable | Example |
| -------- | ------- |
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com/api` |

Copy from `frontend/.env.example` and `backend/.env.example` locally.

### 2. Database

On the server (or CI) after Postgres is reachable:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate    # or: npx prisma migrate deploy -w backend
npm run prisma:seed       # optional: demo tours + admin user
```

### 3. Build and run

```bash
# Frontend (static/server)
npm run build -w frontend
npm run start -w frontend   # default port 3000

# Backend
npm run start -w backend    # listens on PORT from .env
```

Or use your host’s process manager (PM2, Docker, Railway, Render, etc.) with the same commands.

### Docker (full stack)

Runs **PostgreSQL**, **Express API**, and **Next.js frontend** together.

```bash
# From repo root
cp backend/.env.docker.example backend/.env
# Edit backend/.env — set JWT_SECRET; optional RUN_SEED=true on first run

npm run docker:up
# Site http://localhost:3000 · API http://localhost:5000/api
```

| Service    | Container port | Host port (default) |
| ---------- | -------------- | ------------------- |
| Frontend   | 3000           | 3000                |
| API        | 5000           | 5000                |
| PostgreSQL | 5432           | 5434                |

- **Uploads** (hero/team images) persist in Docker volume `uploads_data`.
- **Migrations** run on API start (`RUN_MIGRATIONS=true`).
- First-time sample data: set `RUN_SEED=true` in `backend/.env`, then `docker compose up -d` once (re-seed wipes CMS data).
- Backend-only Docker (no frontend): `cd backend && docker compose up --build -d`

### 4. Automated API check

With the backend running and `DATABASE_URL` set:

```bash
cd backend && node scripts/smoke-api.js
```

Expect **27/27** checks (health, public reads incl. hero slides & team, auth, enquiry, subscribers, gallery/blog/testimonial CRUD, settings).

### 5. Manual checklist (before go-live)

Use this in the browser after deploy:

**Public site**

- [ ] Home carousel shows tours from admin (not only old mock cards)
- [ ] Customized section / `/customized-trips` lists `category: customized` tours
- [ ] Gallery section shows images uploaded in admin
- [ ] Testimonials appear when added in admin (section hidden if none)
- [ ] `/blog` lists posts; opening a post works
- [ ] Footer social icons (Facebook, Instagram, YouTube, WhatsApp) open correct URLs
- [ ] Contact form submits → appears in admin **Enquiries**
- [ ] Newsletter signup → **Admin → Subscribers**
- [ ] Lead popup (phone + optional email) submits successfully

**Admin** (`/admin`)

- [ ] Login works with production admin credentials
- [ ] **Tours** — create, edit, delete; public `/tours/{slug}` updates
- [ ] **Blogs** — create with cover image + content; edit/delete
- [ ] **Gallery** — upload/edit/delete; home gallery updates
- [ ] **Testimonials** — CRUD; home section updates
- [ ] **Settings** — WhatsApp, email, social URLs, footer text → reflected in footer
- [ ] **Hero slides** — upload/reorder; homepage hero carousel updates
- [ ] **Team** — add members; About page team section updates
- [ ] **Enquiries** — status change + delete

**Common production issues**

| Symptom | Fix |
| ------- | --- |
| Admin “Failed to fetch” | Wrong `NEXT_PUBLIC_API_URL`, backend down, or CORS origin missing |
| New tours not on homepage | API error — check browser Network tab; ensure `NEXT_PUBLIC_API_URL` points to live API |
| CORS error in console | Add frontend URL to `CORS_ORIGINS` on backend |
| `P1001` database | Wake Neon DB, check `DATABASE_URL`, firewall/VPN |

## Conventions

- **Controllers stay thin** — HTTP parsing only. All Prisma / business logic lives in `backend/src/services/`.
- **Errors** flow through `AppError` + `asyncHandler` so controllers don't need `try/catch`.
- **API responses** are normalised by `utils/responseFormatter.js` (`{ success, message, data }`).
- **Frontend services** wrap a single Axios client (`lib/apiClient`) and never call `axios` directly from components.
- **Aliases**: backend uses `@/` → `src/` via `module-alias`; frontend uses `@/` → `src/` via `jsconfig.json`.

## Notes

- The `_legacy/` folder contains a duplicate frontend tree and an old zip backup. They are ignored by git and can be deleted once you've verified you don't need them.
