# app/ marketing decoupling — design

Date: 2026-05-23
Scope: both `app/` (Vite SPA) and `next-app/` (Next.js 16). This is a structural change across the two applications in the success-hub repo.

## Goal

Reverse the prior "port marketing into next-app" direction. Make `app/` the canonical marketing site and `next-app/` the application — running on separate subdomains and decoupled at the runtime boundary.

After this restructure:

- `app/` is **marketing-only**. Public pages only. Mock auth, mock dashboard, and admin are gone.
- `app/` lives at the root domain (e.g. `successhub.com`).
- `next-app/` continues to host the authenticated product (dashboard, onboarding, CMS authoring, AI guide, meetings) at the app subdomain (e.g. `app.successhub.com`).
- All Login / Sign Up / Get Started / Dashboard CTAs in `app/` point at `next-app/` URLs.
- Onboarding pages in `app/` (`/audit-onboarding`, `/intention-onboarding`, etc.) are compressed into lead-capture forms that POST to a new `next-app` endpoint and then redirect the user into `next-app`'s onboarding with a token.
- Marketing content (testimonials, pricing, blog, team) is read by `app/` from public read endpoints on `next-app`.
- `next-app`'s existing `(marketing)` route group stays in place as a thin "you've landed on the app subdomain" surface — not the primary marketing.

## Non-goals

- Migrating the marketing site to a different framework (Astro / Next.js / etc.). `app/` stays Vite + React 19.
- Rebuilding `app/` from scratch. Surgical strip only — existing GSAP / Three.js / Lenis polish is preserved.
- Re-skinning or restructuring `next-app`'s dashboard, auth, CMS authoring, or any feature inside the (dashboard) group.
- Replacing the existing JWT/cookie session auth in `next-app`.
- Single-sign-on between `app/` and `next-app/`. `app/` has no auth — only `next-app` does.
- Marketing-side analytics, A/B testing, or CRM integration beyond persisting leads to Postgres.
- Production DNS, TLS, or deployment-platform configuration. Spec defines the contract; ops glues the names.
- Cancelling or reversing prior commits in `next-app/(marketing)`. It stays in place with a reduced role (see below).

## Decisions

Settled during brainstorming (2026-05-23):

| Decision | Choice |
|---|---|
| Role of `app/` | Marketing-only front |
| Hosting topology | Subdomain split (root = marketing, `app.` = product) |
| Onboarding pages in `app/` | Lead-capture only (collect → POST → redirect) |
| Lead handoff mechanism | POST to a `next-app` endpoint; persist as `Lead` row; redirect with token |
| Marketing content source | Fetch at runtime from `next-app`'s public CMS read endpoints |
| Existing `next-app/(marketing)` | Keep as fallback lander at the app-subdomain root |

The earlier spec `2026-05-23-marketing-shell-and-home-design.md` framed the work as "sub-project 1 of 4" in a port from `app/` → `next-app/`. That broader port is **superseded** by this spec. Sub-projects 2–4 (Zone of Genius port, Sabbatical/Lifestyle port, Onboarding/Co-Work port) are cancelled.

## Architecture

### Subdomain topology

```
successhub.com           → app/        (Vite, marketing only)
app.successhub.com       → next-app/   (Next.js 16, authenticated product)
```

Local development:

```
http://localhost:5173    → app/        (Vite dev server, port changed from 3000)
http://localhost:3000    → next-app/   (Next.js dev server, unchanged)
```

Port 3000 is occupied by `next-app/`'s `dev` script, so `app/`'s Vite dev server moves to 5173 (Vite's default).

### Cross-app contract

`app/` reaches `next-app/` via a single configurable base URL, exposed as `VITE_APP_URL`:

- Dev: `VITE_APP_URL=http://localhost:3000`
- Prod: `VITE_APP_URL=https://app.successhub.com`

`app/` calls four kinds of endpoints on `next-app/`:

1. **CTAs (browser nav)** — `${VITE_APP_URL}/login`, `/signup`, `/dashboard`. Already exist in `next-app`.
2. **Lead capture (POST)** — `POST ${VITE_APP_URL}/api/leads`. New endpoint.
3. **CMS reads (GET)** — `GET ${VITE_APP_URL}/api/public/cms/<resource>`. New endpoints.
4. **Redirected onboarding** — `${VITE_APP_URL}/onboarding?lead=<token>`, `${VITE_APP_URL}/audit-onboarding?lead=<token>`. Existing onboarding routes accept an optional `lead` query param.

CORS on `next-app` allows the marketing origin (`http://localhost:5173` in dev, `https://successhub.com` in prod) on the routes named above only. The dashboard and authoring surfaces are not exposed cross-origin.

### Data model addition (next-app)

New Prisma model `Lead`:

```
model Lead {
  id          String   @id @default(cuid())
  email       String
  name        String?
  source      String   // e.g. "audit-onboarding", "intention-onboarding", "hero-cta"
  intent      String?  // free-form, captured from the onboarding flow (e.g. "summer-sabbatical")
  payload     Json?    // optional extra answers from the lead form
  token       String   @unique @default(cuid())
  consumedAt  DateTime?
  userId      String?  // set when the lead converts to a User during signup
  createdAt   DateTime @default(now())

  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

The `token` returned to `app/` is the same token included in the onboarding redirect. When the visitor completes signup on `next-app`, the onboarding flow reads the `lead` query param, looks up the row by token, copies the email/name/intent into the new `User` + `Workspace`, and sets `consumedAt` + `userId`. Tokens are single-use; passing a consumed token to onboarding behaves as if no token was passed.

### next-app endpoint additions

All four live under `src/app/api/` (route handlers, not server actions — they need to be reachable cross-origin):

```
src/app/api/
├── leads/
│   └── route.ts                  # POST  → create Lead, return { token }
└── public/
    └── cms/
        ├── blog-posts/route.ts   # GET   → published blog posts
        ├── pricing/route.ts      # GET   → pricing plans
        ├── testimonials/route.ts # GET   → published testimonials
        └── team/route.ts         # GET   → team members
```

Each handler:
- Validates origin against an allowlist read from `MARKETING_ORIGINS` (comma-separated env var).
- Sets `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` accordingly. Handles `OPTIONS` preflight.
- For POST `/api/leads`: validates with a zod schema (`email` required, `name`/`source`/`intent`/`payload` optional), writes via Prisma, returns `{ token }` with `201`.
- For GET CMS endpoints: reads via existing `src/actions/cms.ts` functions (`getBlogPosts`, `getPricingPlans`, `getTestimonials`, `getTeam`) and returns published rows only as JSON.

`src/proxy.ts` adds the four new paths to `publicRoutes`.

### next-app onboarding integration

`src/app/onboarding/page.tsx` and `src/app/audit-onboarding/page.tsx` accept an optional `?lead=<token>` query param. When present:

- Look up the lead by token.
- If found and not consumed: prefill the signup form (email, name) and stash the token in a hidden field.
- On signup completion: `consumedAt = now()`, `userId = <new user id>`. Tie any captured `intent` / `payload` into the existing onboarding state.

If the token is missing, invalid, or consumed, onboarding proceeds normally — no error shown to the user.

### `next-app/(marketing)` reduced role

The existing marketing route group becomes the "you've landed on the app subdomain" lander. It is no longer the primary marketing surface.

- `app.successhub.com/` (root of the app subdomain) renders the existing `(marketing)/page.tsx`. We can decide later whether to leave the full Hero/Features/Testimonials/Pricing in place or trim it to a short "you're at the app — marketing is at successhub.com" panel. **This spec leaves the page contents unchanged** — only the subdomain it lives on changes by virtue of deployment topology. No code change to `next-app/(marketing)` is in scope here.
- The four already-built marketing components (`Hero.tsx`, `Features.tsx`, `TestimonialsSection.tsx`, `PricingSection.tsx`, plus `MarketingNavbar` / `MarketingFooter` / `HeroScene`) stay in place and untouched.

### `app/` changes — deletions

All of these are removed from `app/`:

- `src/pages/auth/` (Login, SignUp, ForgotPassword) — login moves to `next-app`.
- `src/pages/dashboard/` (every Dashboard* page) — dashboard lives in `next-app`.
- `src/pages/admin/` (every Admin* page) — admin lives in `next-app/cms/*`.
- `src/components/ProtectedRoute.tsx`, `src/components/AdminRoute.tsx`, `src/components/DashboardLayout.tsx`, `src/components/AdminLayout.tsx` — no longer needed.
- `src/context/AuthContext.tsx` — `app/` has no auth.
- Any sidebar / nav components unique to the dashboard or admin chrome.
- The `<AuthProvider>` wrapper in `src/App.tsx`.
- All `Route` entries in `src/App.tsx` pointing at deleted pages.

Dependencies referenced only by deleted code (e.g., dashboard-only Radix imports, chart libs used only in dashboard) are dropped from `app/package.json` in a follow-up pass — out of scope for the initial deletion commit, but listed as a cleanup task in the plan.

### `app/` changes — additions

```
app/src/
├── lib/
│   ├── api.ts                # fetch wrapper bound to VITE_APP_URL: postLead, getBlogPosts, getPricingPlans, getTestimonials, getTeam
│   └── appUrl.ts             # exports APP_URL (validated VITE_APP_URL) and helpers: loginUrl(), signupUrl(), dashboardUrl(), onboardingUrl(token), auditOnboardingUrl(token)
└── pages/
    ├── AuditOnboarding.tsx       # rewritten as lead-capture form (single-step)
    └── IntentionOnboarding.tsx   # rewritten as lead-capture form (single-step)
```

`CMSContext` is converted from a static mock into a thin provider that fetches via `api.ts`. The public component API (`useCMS()`, the shape of testimonials/pricing/etc.) stays the same so the marketing sections don't need to change. Loading states render placeholders; fetch failures surface a one-line console warning and fall back to empty arrays (the marketing layout must still render).

All "Login", "Sign Up", "Get Started", "Dashboard" buttons across `app/`'s components, sections, and pages are rewired to use the helpers in `appUrl.ts`. They render as `<a href={loginUrl()}>` etc. (full navigation off-app, not client-side `<Link>`).

### app/ changes — env + dev experience

- New file `app/.env.example` with `VITE_APP_URL=http://localhost:3000`.
- `app/vite.config.ts` sets `server.port = 5173` explicitly to avoid colliding with `next-app`.
- `app/`'s README (or top-of-CLAUDE.md note) documents: run `next-app` and `app` together for local dev; `app` reads `VITE_APP_URL` to know where `next-app` lives.

### next-app changes — env

- `next-app/.env` adds `MARKETING_ORIGINS=http://localhost:5173,https://successhub.com`. Defaults to localhost-only if unset.

## Components in the data flow

### Marketing CTA → next-app

1. User clicks "Sign Up" anywhere in `app/`.
2. `<a href={signupUrl()}>` (= `${VITE_APP_URL}/signup`) does a full-page navigation to `app.successhub.com/signup`.
3. `next-app` renders its existing signup page. No token needed.

### Lead capture → next-app

1. User clicks "Get Started" on the marketing Home, lands on `/audit-onboarding` (still inside `app/`).
2. `AuditOnboarding` renders a single-step form (email + name + a couple of qualifying questions).
3. On submit, `api.postLead({ email, name, source: "audit-onboarding", intent, payload })` POSTs to `${VITE_APP_URL}/api/leads`.
4. `next-app` writes the `Lead` row, returns `{ token }`.
5. `app/` redirects via `window.location.assign(auditOnboardingUrl(token))`.
6. `next-app` `/audit-onboarding?lead=<token>` reads the token, prefills, completes onboarding, marks the lead consumed.

If the POST fails (network error or non-2xx response), the form shows an inline error ("Couldn't reach the app — try again") and stays on the marketing site. No silent redirects on failure.

### CMS reads → next-app

1. `app/` mounts. `<CMSProvider>` calls `api.getTestimonials()`, `api.getPricingPlans()`, etc. on first paint.
2. While loading, sections show their existing skeleton/placeholder states.
3. Responses cache in React state. No revalidation strategy in this spec — refresh = refetch. (A SWR/stale-while-revalidate pass is a follow-up.)
4. The data shape matches what the existing mock `CMSContext` exposed today, so consuming components don't need to change.

## Open questions / risks

- **Subdomain naming is illustrative.** The spec uses `successhub.com` / `app.successhub.com`. Actual production names are deployment-time decisions; the contract only requires that `VITE_APP_URL` is set and that `MARKETING_ORIGINS` includes the marketing origin.
- **Visual sections currently rely on `CMSContext` synchronously.** Converting `CMSContext` from sync mock to async fetch may surface render bugs where components assume data is immediately available. The plan must include a smoke-pass over each section in `app/src/sections/` to confirm loading states render acceptably.
- **`react-router` is unused once auth/dashboard/admin routes are gone.** The remaining marketing routes still need it (multiple pages). Leave the dependency in place.
- **Bundle bloat in `app/` from now-orphaned dependencies.** `recharts`, `cmdk`, `vaul`, `embla-carousel-react`, several Radix packages, `next-themes`, etc. were likely added for the dashboard. Removing them is cleanup that follows after the deletion lands and a build succeeds.
- **Onboarding pages in `app/` currently have multi-step flows.** Trimming them to a single-step lead capture loses UI work. This is intentional per the brainstorming decision (lead-capture only) but is a one-way door — surface this risk to whoever owns the marketing copy before merging.

## Out of scope (explicit follow-ups)

- Removing now-unused npm dependencies from `app/package.json`.
- SWR / stale-while-revalidate for CMS reads in `app/`.
- Production DNS / TLS / deploy-platform configuration.
- Decision on whether to keep `next-app/(marketing)`'s full hero/features content or trim it to a short "you're on the app subdomain" lander.
- Single-sign-on or any shared auth surface between `app/` and `next-app/`.
- Marketing analytics, A/B testing, or third-party CRM forwarding for leads.
- Migrating `app/` off Vite to Astro or Next.js.
