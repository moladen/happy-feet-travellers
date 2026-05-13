<<<<<<< HEAD
# Frontend — Happy Feet Travellers

Next.js 16 (App Router) + Tailwind v4 + Framer Motion.

## Structure

```
src/
├── app/                # App router (pages, layouts, route groups)
├── components/
│   ├── common/         # Navbar, Footer, popups, generic UI
│   ├── forms/          # Reusable form widgets
│   ├── home/           # Homepage sections
│   ├── tour/           # Tour cards / details
│   └── upcoming/       # Upcoming-departure specific UI
├── constants/          # Site-wide constants (API base URL, etc.)
├── data/               # Static / mock data
├── lib/                # Low-level helpers (axios apiClient)
└── services/           # API service layer — one file per resource
    ├── api.js          # barrel (re-exports per-resource services)
    ├── blogsService.js
    ├── contactService.js
    ├── testimonialsService.js
    └── toursService.js
```

## Conventions

- **Never import `axios` from a component.** Use the `services/` layer or `lib/apiClient`.
- API responses use the `{ success, message, data }` envelope. `lib/apiClient#unwrap` strips it.
- All site-wide values (URLs, phone, social links, nav items) live in `constants/site.js`.
- Path alias: `@/...` maps to `src/...` (configured in `jsconfig.json`).
- Components are organised by feature/domain folder, not by type.

## Scripts

```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm start        # Start production build
npm run lint     # ESLint (src only)
```

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```
=======
# happy-feet-travellers-frontend
Travel website
>>>>>>> 9b32022953f9b20eba58748df774604860567812
