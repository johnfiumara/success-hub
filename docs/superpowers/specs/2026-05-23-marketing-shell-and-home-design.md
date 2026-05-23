# Marketing shell and Home — design

Date: 2026-05-23
Scope: `next-app/` (the Next.js 16 rewrite). The legacy Vite `app/` is unaffected and acts as the canonical design reference.

This is **sub-project 1 of 4** in the broader marketing port from `app/` to `next-app/`. The other three sub-projects (Zone of Genius; Sabbatical + Lifestyle pages; Onboarding + Co-Work pages) will be brainstormed and specced separately and will build on the foundations laid here.

## Goal

Port the public marketing landing page from the Vite `app/` into `next-app/` so that:

- Visiting `http://localhost:3000/` (already public per `src/proxy.ts`) renders a Home page that matches `app/`'s `/` 1:1 visually, including all 13 sections, smooth scroll, Framer Motion entries, GSAP scroll triggers, and the Three.js Cherry Blossom scene.
- A real marketing shell (Navbar, Footer, smooth-scroll wrapper) lives at the route-group level so subsequent marketing routes inherit it for free.
- Section content (testimonials, pricing, hero copy, etc.) is read from Postgres via the existing CMS server actions — **no mock data is introduced**.
- The existing dashboard, auth, Prisma schema, server actions, and `src/components/ui/` are untouched. The working `next-app/` keeps working.

## Non-goals

- Other marketing routes (`/human-zone-of-genius-team`, `/summer-sabbatical`, `/winter-sabbatical`, `/ceo-workday`, `/lifestyle-experiences`, `/audit-onboarding`, `/intention-onboarding`, `/work-life-balance-audit`, `/intention-setting`, `/preparation-checklist`, `/morning-routine`, `/workday-workout`, `/lunch-break`, `/digital-detox`). Reserved for later sub-projects.
- Replacing dashboard's `@base-ui/react` components.
- New Prisma models or new server actions. Existing CMS reads are sufficient.
- Admin UI redesign. Existing `/cms/*` views remain the only authoring surface.
- Accessibility audit of Lenis smooth scroll.
- Bundle-size / performance budgets.
- SEO metadata beyond a basic page `<title>` and description.
- Wiring the marketing surface to a CDN/edge caching strategy.

## Architecture

### Route topology

New route group: `src/app/(marketing)/`, sibling to existing `(auth)/` and `(dashboard)/`.

```
src/app/
├── (marketing)/
│   ├── layout.tsx        # server component; fetches session via getCurrentUser(); wraps in <MarketingShell>
│   └── page.tsx          # server component; Promise.all over CMS reads; renders the 13 sections
├── (auth)/               # unchanged
├── (dashboard)/          # unchanged
└── layout.tsx            # root layout, unchanged
```

The marketing route group means subsequent marketing routes drop into `src/app/(marketing)/<slug>/page.tsx` and inherit the shell.

`src/proxy.ts` already lists `/` in `publicRoutes`. No change needed for Home. Later sub-projects will need to add their slugs to `publicRoutes`; out of scope here but flagged.

### Marketing shell components

```
src/components/marketing/
├── MarketingShell.tsx    # client wrapper: <SmoothScroll><Navbar user={user} /><main>{children}</main><Footer /></SmoothScroll>
├── SmoothScroll.tsx      # client; initializes Lenis in useEffect; drives RAF; cleans up on unmount
├── Navbar.tsx            # client; ported from app/src/components/Navbar.tsx; accepts user prop
├── Footer.tsx            # client; ported from app/src/components/Footer.tsx
├── NavLink.tsx           # client; wraps next/link + usePathname for an active state matching app/'s NavLink API
├── router-shim.ts        # re-exports Next equivalents under react-router-ish names (see below)
├── gsap-setup.ts         # client; idempotent gsap.registerPlugin(ScrollTrigger) guarded by typeof window
├── ui/                   # marketing-only shadcn primitives (Radix-based)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── accordion.tsx
│   └── tabs.tsx
└── sections/             # the 13 Home sections, each its own client component
    ├── Hero.tsx
    ├── Onboarding.tsx
    ├── SundayShift.tsx
    ├── CoWorkSchedule.tsx
    ├── SanctuarySection.tsx
    ├── CherryBlossomSuite.tsx
    ├── WellnessDashboard.tsx
    ├── IntegrationWeek.tsx
    ├── SuccessStories.tsx
    ├── Community.tsx
    ├── Sabbaticals.tsx
    ├── Pricing.tsx
    └── Contact.tsx
```

The exact list of `ui/` primitives is the planning task's job to confirm by importing audit; the names above are best-estimate.

### Router shim

To minimize divergence between ported sections and their `app/` originals, `src/components/marketing/router-shim.ts` re-exports Next equivalents under the names `react-router` used:

```ts
export { default as Link } from 'next/link';
export { default as NavLink } from './NavLink';
export { usePathname as useLocation } from 'next/navigation';
export { useRouter } from 'next/navigation';
export function useNavigate() {
  const router = useRouter();
  return (path: string) => router.push(path);
}
```

Ported sections change one import line: `from 'react-router'` → `from '@/components/marketing/router-shim'`. The shim grows as later sub-projects need more APIs.

### Styling stack

- **Tailwind v4 stays.** No downgrade. Color tokens, custom utilities, and `@theme` definitions go in `next-app/src/app/globals.css`.
- **Color tokens.** Read `app/tailwind.config.js`, port its custom palette (`sage`, `coral`, `cream`, `dark`, and any others) into the `@theme` block as `--color-*` so the exact same Tailwind classes (`text-sage`, `bg-cream`, `border-sage/20`, etc.) work in ported sections without code edits.
- **Custom utilities.** `app/`'s sections reference at least `.btn-primary`. Grep `app/src/index.css` and any `@layer components` rules, port them into `globals.css` `@layer components`.
- **Fonts.** Read what `app/`'s `index.html`/CSS uses. If Google Fonts, mirror via `next/font` and apply via root layout `className`. If local fonts, copy files into `next-app/public/` and add `@font-face` rules.
- **Marketing-only UI primitives** live in `src/components/marketing/ui/`. The existing dashboard `src/components/ui/` (@base-ui-based) is untouched. Marketing pages import from `@/components/marketing/ui/*`; dashboard keeps importing from `@/components/ui/*`. Two folders, clean separation.
- **Radix peer packages** get added to `next-app/package.json` lazily per shadcn primitive that's actually used. Don't pre-install the full set.

### Client-side effects

The marketing page is a server component that composes client-component sections. Effects libraries are confined to the marketing route group.

- **Lenis** — wrapped once in `MarketingShell` via `SmoothScroll.tsx`. Pure client. Does not affect dashboard or auth routes.
- **GSAP + ScrollTrigger** — `gsap-setup.ts` registers the plugin in a client module, guarded by `typeof window !== 'undefined'`. Sections that need GSAP import this setup module and animate in `useGSAP`/`useEffect`. Same code shape as `app/`'s sections.
- **Framer Motion** — works directly in any client component. No SSR config.
- **Three.js / React Three Fiber** — `CherryBlossomSuite.tsx` is loaded via `next/dynamic(..., { ssr: false })` from `(marketing)/page.tsx` with a lightweight skeleton fallback so R3F never tries to SSR. Adds `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` to dependencies (`three` is already present).

### Data sourcing

`(marketing)/page.tsx` is a Server Component. It runs one `Promise.all` against the existing public CMS reads and passes typed props down to each section:

```tsx
const [settings, testimonials, posts, plans] = await Promise.all([
  getSiteSettings(),
  getTestimonials(),
  getPosts(),
  getPricingPlans(),
]);
```

Per-section data wiring:

| Section | Source |
|---|---|
| Hero | `settings` keys: `hero_headline`, `hero_subheadline`, `hero_cta_primary`, `hero_cta_secondary`, `hero_image` |
| Onboarding | `settings` keys, one per step (`onboarding_step_1_title`, …) |
| SundayShift, SanctuarySection, IntegrationWeek, Sabbaticals, Contact | `settings` namespaced keys (e.g. `sunday_shift_headline`) |
| CoWorkSchedule | `settings` for headline/copy; schedule items are static visual structure |
| CherryBlossomSuite, WellnessDashboard | `settings` for any displayed copy; the scenes themselves are static visual structure |
| SuccessStories | `testimonials` from `getTestimonials()` |
| Community | `posts` filtered to `status === 'PUBLISHED'`, latest N |
| Pricing | `plans` from `getPricingPlans()` |

Sections themselves stay client components (they need animation hooks) but accept content via props. They render nothing for their data slot if the corresponding array is empty or a setting key is missing.

### Seed

New `next-app/prisma/seed.ts` populates the baseline content matching `app/`'s current Home visual: a starter set of `Testimonial` rows, the three `PricingPlan` rows, the team members, and the `SiteSetting` keys the Home sections need. Wired into `package.json` under `prisma.seed`. Run by `npx prisma db seed`.

This is **real DB content**, not mock data — admins can edit it through `/cms/*` after seeding.

### Navbar auth wiring

Navbar in `app/` reads `useAuth()` from a mock context. In next-app it reads the real session via prop drilling from the server layout:

1. `(marketing)/layout.tsx` (server) calls `getCurrentUser()`.
2. It renders `<MarketingShell user={user}>`.
3. `MarketingShell` passes `user` to `<Navbar user={user} />`.
4. Logout button calls the existing `logoutAction` server action (already in `src/actions/auth.ts`) wrapped in a tiny client form. No new auth code.
5. URL diffs: `/auth/login` → `/login`, `/auth/signup` → `/signup`, `/dashboard` stays `/dashboard`.
6. `app/`'s "hide on `/auth/*`" check is removed — the marketing layout is never rendered on `/login` or `/signup` because those live in the `(auth)` route group with its own layout.

No edits to existing files under `src/lib/`, `(auth)/`, `(dashboard)/`, or `proxy.ts`. **One narrow, additive edit to `src/actions/cms.ts`:** add `revalidatePath('/')` calls to the CMS mutations whose data the Home page consumes — `createTestimonial`, `updateTestimonial`, `deleteTestimonial`, `createPricingPlan`, `updatePricingPlan`, `deletePricingPlan`, `createPost`, `updatePost`, `deletePost`, `createTeamMember`, `updateTeamMember`, `deleteTeamMember`. The existing `/cms/*` revalidations stay. Without this, acceptance criterion 3 cannot pass. No signature changes, no behavior changes to the dashboard CMS UI.

### Section porting mechanic

For each of the 13 sections, the ported file is byte-for-byte identical to the `app/` original except for these mechanical changes:

1. Add `'use client'` at the top.
2. Swap `from 'react-router'` → `from '@/components/marketing/router-shim'`.
3. Where a section imports local UI primitives (`@/components/ui/<name>`), repoint to `@/components/marketing/ui/<name>`.
4. Where a section reads from `useCMS()` or similar mock context, change the signature to accept data as a prop (typed against the relevant Prisma model) and remove the context import.

### Asset audit

Before any code lands in implementation, one pass over `app/`'s referenced public assets:

- Run `grep -rh 'src="/' app/src/sections/ app/src/components/Layout.tsx app/src/components/Navbar.tsx app/src/components/Footer.tsx` to enumerate.
- Copy each from `app/public/` to `next-app/public/` at the same path so `<img src="/..." />` works without code changes.
- Same for any `@font-face` URL references.

## Acceptance criteria

1. `npm run dev` in `next-app/` starts cleanly. `http://localhost:3000/` renders the ported Home page.
2. All 13 sections render in the same order and styling as `app/`'s Home, with content sourced from Prisma. After `npx prisma db seed`, the visual matches `app/` 1:1, including Hero animations, the CherryBlossomSuite Three.js scene (loaded via `next/dynamic`, with a skeleton during load), GSAP scroll-triggered animations, and Lenis smooth scroll across the page.
3. Editing a testimonial / pricing plan / SiteSetting through `/cms/*` shows the update on `/` after the page revalidates (the existing actions already call `revalidatePath('/')`).
4. Navbar shows correct buttons:
   - Logged out → "Log In" + "Get Started" → route to `/login` / `/signup`.
   - Logged in (real next-app session) → "Dashboard" + "Log Out" → route to `/dashboard` / call `logoutAction` and clear session.
5. Mobile drawer (under `lg` breakpoint) opens, closes, and navigates correctly.
6. `/login`, `/signup`, `/dashboard`, and every existing `(dashboard)/*` route behave exactly as they did before this sub-project. Manual click-through of one or two dashboard pages confirms no visual or functional regression.
7. `npm run build` succeeds with no new type errors. `npm run lint` passes.
8. No regression in `src/proxy.ts` behavior: protected routes still redirect to `/login` when unauthenticated; `/login` and `/signup` still redirect to `/dashboard` when authenticated.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Color tokens in `app/tailwind.config.js` use nested palette objects that don't map cleanly to `@theme`. | Read the file first; flatten manually into `--color-*` tokens. Plan task explicitly does this read before touching `globals.css`. |
| A ported section pulls in 3–4 transitive Radix primitives not in the initial estimate. | Per-section import audit; install Radix peers lazily as each section needs them. |
| `CherryBlossomSuite` accidentally SSR'd → R3F crash at build time. | `next/dynamic({ ssr: false })` wrapper. Verified in acceptance step 2. |
| `app/` uses custom utility classes (`.btn-primary` confirmed; others possible) not native to Tailwind. | Grep before implementation; port rules into `globals.css` `@layer components`. |
| Lenis hijacks scroll → poor reduced-motion or screen-reader experience. | Out of scope here. Flagged for a later accessibility sub-project. |
| `getCurrentUser()` runs on every visit and adds latency. | Acceptable for now — same call runs in `(dashboard)/layout.tsx`. Cache later if needed. |
| Router shim doesn't cover an API a ported section uses (e.g. `useSearchParams`, `useParams`). | Extend the shim when the first section needs it. Home sections are expected to use only `Link`/`NavLink`/`useNavigate`. |
| A section needs structured content that doesn't fit any existing CMS model and there's no clean editable structure. | Reuse an existing model first (CommunityPost, Post, etc.). If genuinely no fit, defer that single piece of content to a follow-up sub-project rather than add a new Prisma model in this one. |
| Seed re-running overwrites admin-edited content in development. | Seed uses `upsert` keyed on stable identifiers (e.g. `Testimonial.name + role`, `PricingPlan.name`, `SiteSetting.key`) where possible; otherwise the seed only inserts when the target table is empty. |
