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
| Run both apps in dev            | `npm run dev`            |
| Run only frontend               | `npm run dev:frontend`   |
| Run only backend                | `npm run dev:backend`    |
| Production build (frontend)     | `npm run build`          |
| Lint frontend                   | `npm run lint`           |
| Format whole repo with Prettier | `npm run format`         |

## Conventions

- **Controllers stay thin** — HTTP parsing only. All Prisma / business logic lives in `backend/src/services/`.
- **Errors** flow through `AppError` + `asyncHandler` so controllers don't need `try/catch`.
- **API responses** are normalised by `utils/responseFormatter.js` (`{ success, message, data }`).
- **Frontend services** wrap a single Axios client (`lib/apiClient`) and never call `axios` directly from components.
- **Aliases**: backend uses `@/` → `src/` via `module-alias`; frontend uses `@/` → `src/` via `jsconfig.json`.

## Notes

- The `_legacy/` folder contains a duplicate frontend tree and an old zip backup. They are ignored by git and can be deleted once you've verified you don't need them.
