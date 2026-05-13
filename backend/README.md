# Backend — Happy Feet Travellers API

Express + Prisma + PostgreSQL.

## Layered architecture

```
src/
├── app.js              # Express app: middleware, routes, error handler (no listen)
├── server.js           # HTTP listener + graceful shutdown
├── config/
│   ├── env.js          # Centralised env loader (validated, typed)
│   └── database.js     # Prisma client (singleton, dev-safe HMR)
├── constants/
│   ├── httpStatus.js
│   └── tourCategories.js
├── controllers/        # THIN — only parse req / send res
│   ├── authController.js
│   ├── blogController.js
│   ├── enquiryController.js
│   ├── subscriberController.js
│   ├── testimonialController.js
│   └── tourController.js
├── services/           # Business logic + Prisma queries
│   ├── authService.js
│   ├── blogService.js
│   ├── enquiryService.js
│   ├── subscriberService.js
│   ├── testimonialService.js
│   └── tourService.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── routes/
│   ├── index.js        # Mounts all route groups under /api
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── enquiryRoutes.js
│   ├── subscriberRoutes.js
│   ├── testimonialRoutes.js
│   └── tourRoutes.js
├── validators/
│   ├── schemas.js      # Joi schemas (one source of truth)
│   └── validate.js     # validate(schemaKey) middleware
└── utils/
    ├── AppError.js     # Operational error w/ status code + helpers
    ├── asyncHandler.js # Removes try/catch from controllers
    ├── authUtils.js    # JWT + bcrypt helpers
    ├── logger.js       # Coloured dev logs / plain prod logs
    ├── responseFormatter.js # { success, message, data } envelope
    └── slugGenerator.js
```

## Key conventions

1. **Thin controllers**: HTTP only. All DB / business logic lives in `services/`.
2. **Errors**: throw `AppError` (or `AppError.notFound(...)`) from anywhere. The
   `errorHandler` converts it to a JSON response, including known Prisma codes
   (P2002 / P2025 / P2003).
3. **Async handling**: wrap controllers with `asyncHandler` — no try/catch noise.
4. **Validation**: declare schemas in `validators/schemas.js`, mount with
   `validate('schemaKey')` middleware.
5. **Aliases**: `@/...` resolves to `src/...` (via `module-alias` registered in
   `app.js` AND in `package.json#_moduleAliases`).
6. **Security defaults**: helmet, CORS allow-list, rate limiter, body size limit,
   `x-powered-by` disabled.
7. **Logging**: `morgan('dev')` in dev, `morgan('combined')` in prod.

## Scripts

```bash
npm run dev               # nodemon
npm start                 # node src/server.js
npm run prisma:generate
npm run prisma:migrate    # dev migrations
npm run prisma:deploy     # prod migrations
npm run prisma:seed
npm run prisma:studio
```

## Environment

Copy `.env.example` to `.env` and fill in values. See `src/config/env.js` for
the full schema.

## REST endpoints

Base URL: `/api`

| Method | Path                       | Auth   | Purpose                                         |
| ------ | -------------------------- | ------ | ----------------------------------------------- |
| GET    | `/health`                  | —      | Liveness probe                                  |
| GET    | `/tours`                   | —      | List tours (filters: category, subCategory, minPrice, maxPrice, minDuration, maxDuration, month, year, sort, search, page, limit) |
| GET    | `/tours/:idOrSlug`         | —      | Tour by id _or_ slug                            |
| POST   | `/tours`                   | admin  | Create tour                                     |
| PUT    | `/tours/:id`               | admin  | Update tour                                     |
| DELETE | `/tours/:id`               | admin  | Delete tour                                     |
| GET    | `/blogs`                   | —      | List blogs (filters: category, search, page, limit) |
| GET    | `/blogs/:idOrSlug`         | —      | Blog by id _or_ slug                            |
| POST   | `/blogs`                   | admin  | Create blog                                     |
| PUT    | `/blogs/:id`               | admin  | Update blog                                     |
| DELETE | `/blogs/:id`               | admin  | Delete blog                                     |
| GET    | `/testimonials`            | —      | List testimonials                               |
| POST   | `/testimonials`            | —      | Create testimonial                              |
| DELETE | `/testimonials/:id`        | admin  | Delete testimonial                              |
| POST   | `/enquiry`                 | — *    | Submit a contact enquiry (rate-limited)         |
| GET    | `/enquiry`                 | admin  | List enquiries (filters: status, source, page)  |
| PATCH  | `/enquiry/:id/status`      | admin  | Update status (`new` / `contacted` / `closed`)  |
| DELETE | `/enquiry/:id`             | admin  | Delete enquiry                                  |
| POST   | `/subscribers`             | — *    | Subscribe to newsletter (rate-limited)          |
| POST   | `/subscribers/unsubscribe` | — *    | Mark subscriber inactive                        |
| GET    | `/subscribers`             | admin  | List subscribers                                |
| POST   | `/auth/login`              | —      | Admin login → JWT                               |
| GET    | `/auth/profile`            | admin  | Current admin profile                           |

`*` Public endpoints are protected by an additional per-IP rate limiter on top
of the global one.

The enquiry endpoint accepts either `phone` or `whatsappNumber` for FE
compatibility — the validator normalises to a single `phone` field before it
hits the service.

## Migrations after schema changes

Schema was extended (rich tour/blog fields + `Subscriber` model). To pick up
the changes locally:

```bash
# from the repo root
npm run prisma:generate
npm run prisma:migrate -- --name extend_models
npm run prisma:seed
```

`Blog.content` was changed from `String` to `Json`, which is destructive —
`prisma migrate dev` will prompt to reset the dev database. Re-run the seed
afterwards.

