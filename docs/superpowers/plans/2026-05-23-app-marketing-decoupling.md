# app/ marketing decoupling — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `app/` a marketing-only site that hands all auth/dashboard/onboarding traffic to `next-app/`, with lead capture POSTing to a new `next-app` endpoint and CMS content read from new public `next-app` endpoints.

**Architecture:** Subdomain split. `app/` (Vite, root domain) keeps marketing pages, deletes auth/dashboard/admin, fetches content cross-origin from `next-app`. `next-app/` (Next.js 16, app subdomain) adds a `Lead` model, a `POST /api/leads` route, four read-only `GET /api/public/cms/*` routes, and signup-side lead consumption. Existing `next-app/(marketing)` is left in place as the subdomain root.

**Tech Stack:** Prisma 6 + Postgres, Next.js 16 route handlers, Vite + React 19, TypeScript everywhere. **No test runner is configured in either app** — verification is `npx tsc --noEmit`, `npm run build`, `npm run lint`, and manual curl / browser checks. Reference: `next-app/docs/superpowers/specs/2026-05-23-app-marketing-decoupling-design.md`.

**Spec deviation flagged:** The spec described redirecting leads to `/onboarding?lead=<token>`, but `next-app/src/app/onboarding/layout.tsx` requires an authenticated session and redirects unauthenticated visitors to `/login`. The redirect target is therefore `/signup?lead=<token>` instead. Signup consumes the token, creates the user, and (when the lead carried an `intent`) redirects to `/onboarding`. This plan implements the corrected flow.

---

## Phase 1 — next-app: schema + endpoints + signup wiring

Tasks 1–8 are scoped entirely to `next-app/` and can be implemented before any `app/` change. Tasks 4–7 (CMS read endpoints) are independent of each other and of task 3 once task 2 lands.

---

### Task 1: Add `Lead` model + migrate

**Files:**
- Modify: `next-app/prisma/schema.prisma` (append model + `leads Lead[]` back-relation on `User`)

**Steps:**

- [ ] **Step 1: Add the `leads` back-relation to `User`**

In `next-app/prisma/schema.prisma`, inside `model User { ... }`, add this line alongside the other relations (placement near `emailIntegration` is fine):

```prisma
  leads            Lead[]
```

- [ ] **Step 2: Append the `Lead` model at the end of the file**

```prisma
// ─── Marketing leads ─────────────────────────────────────────────────────────

model Lead {
  id          String    @id @default(cuid())
  email       String
  name        String?
  source      String
  intent      String?
  payload     Json?
  token       String    @unique @default(cuid())
  consumedAt  DateTime?
  userId      String?
  createdAt   DateTime  @default(now())

  user        User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([email])
  @@index([createdAt])
}
```

- [ ] **Step 3: Generate the migration**

```bash
cd next-app
npx prisma migrate dev --name add_lead_model
```

Expected: migration applied, `prisma/migrations/<timestamp>_add_lead_model/migration.sql` created, Prisma client regenerated.

- [ ] **Step 4: Smoke-check the client**

```bash
cd next-app
node -e "const {PrismaClient} = require('@prisma/client'); console.log(typeof new PrismaClient().lead.create)"
```

Expected: prints `function`.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(prisma): add Lead model for marketing-side lead capture"
```

---

### Task 2: CORS helper + `MARKETING_ORIGINS` env

**Files:**
- Create: `next-app/src/lib/cors.ts`
- Modify: `next-app/.env.example` (or create if absent)

**Steps:**

- [ ] **Step 1: Write `src/lib/cors.ts`**

```ts
import { NextResponse } from "next/server"

function allowedOrigins(): string[] {
  const raw = process.env.MARKETING_ORIGINS ?? "http://localhost:5173"
  return raw.split(",").map((s) => s.trim()).filter(Boolean)
}

export function pickOrigin(request: Request): string | null {
  const origin = request.headers.get("origin")
  if (!origin) return null
  return allowedOrigins().includes(origin) ? origin : null
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin) return {}
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  }
}

export function preflight(request: Request): NextResponse {
  const origin = pickOrigin(request)
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export function withCors(request: Request, body: unknown, init: ResponseInit = {}): NextResponse {
  const origin = pickOrigin(request)
  return NextResponse.json(body, {
    ...init,
    headers: { ...(init.headers ?? {}), ...corsHeaders(origin) },
  })
}
```

- [ ] **Step 2: Add `MARKETING_ORIGINS` to `next-app/.env.example`**

Append:

```
# Comma-separated list of origins allowed to call /api/leads and /api/public/cms/*.
MARKETING_ORIGINS=http://localhost:5173
```

If `.env.example` doesn't exist, create it with at least that line.

- [ ] **Step 3: Add the same line to the live `.env`** (not in git) so dev works immediately.

- [ ] **Step 4: Type-check**

```bash
cd next-app
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cors.ts .env.example
git commit -m "feat: cors helper for cross-origin marketing endpoints"
```

---

### Task 3: `POST /api/leads` route

**Files:**
- Create: `next-app/src/app/api/leads/route.ts`

**Steps:**

- [ ] **Step 1: Write the route handler**

```ts
import { NextRequest } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { preflight, withCors, pickOrigin } from "@/lib/cors"

const LeadSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).max(120).optional(),
  source: z.string().trim().min(1).max(64),
  intent: z.string().trim().max(64).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
})

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function POST(request: NextRequest) {
  if (!pickOrigin(request)) {
    return withCors(request, { error: "Origin not allowed" }, { status: 403 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return withCors(request, { error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return withCors(request, { error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 })
  }

  const { email, name, source, intent, payload } = parsed.data
  const lead = await prisma.lead.create({
    data: { email, name, source, intent, payload: payload ?? undefined },
    select: { token: true },
  })

  return withCors(request, { token: lead.token }, { status: 201 })
}
```

- [ ] **Step 2: Type-check + lint**

```bash
cd next-app
npx tsc --noEmit && npm run lint
```

Expected: 0 errors.

- [ ] **Step 3: Manual smoke (dev server must be running)**

```bash
curl -i -X POST http://localhost:3000/api/leads \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","source":"plan-task-3"}'
```

Expected: `HTTP/1.1 201`, body `{"token":"..."}`, headers include `Access-Control-Allow-Origin: http://localhost:5173`.

Also test rejection from disallowed origin:

```bash
curl -i -X POST http://localhost:3000/api/leads \
  -H "Origin: http://evil.example" \
  -H "Content-Type: application/json" \
  -d '{"email":"x@x.com","source":"x"}'
```

Expected: `HTTP/1.1 403`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/leads/route.ts
git commit -m "feat(api): POST /api/leads for marketing-side lead capture"
```

---

### Task 4: `GET /api/public/cms/testimonials` route

**Files:**
- Create: `next-app/src/app/api/public/cms/testimonials/route.ts`

**Steps:**

- [ ] **Step 1: Write the route handler**

```ts
import { NextRequest } from "next/server"
import { getTestimonials } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const all = await getTestimonials()
  const published = all.filter((t) => t.published)
  return withCors(request, { testimonials: published })
}
```

- [ ] **Step 2: Smoke-check**

```bash
curl -i http://localhost:3000/api/public/cms/testimonials -H "Origin: http://localhost:5173"
```

Expected: `200`, JSON `{"testimonials":[...]}`, CORS headers present.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/public/cms/testimonials/route.ts
git commit -m "feat(api): GET /api/public/cms/testimonials"
```

---

### Task 5: `GET /api/public/cms/pricing` route

**Files:**
- Create: `next-app/src/app/api/public/cms/pricing/route.ts`

**Steps:**

- [ ] **Step 1: Write the route handler**

```ts
import { NextRequest } from "next/server"
import { getPricingPlans } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const plans = await getPricingPlans()
  return withCors(request, { plans })
}
```

- [ ] **Step 2: Smoke-check**

```bash
curl -i http://localhost:3000/api/public/cms/pricing -H "Origin: http://localhost:5173"
```

Expected: `200`, JSON `{"plans":[...]}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/public/cms/pricing/route.ts
git commit -m "feat(api): GET /api/public/cms/pricing"
```

---

### Task 6: `GET /api/public/cms/team` route

**Files:**
- Create: `next-app/src/app/api/public/cms/team/route.ts`

**Steps:**

- [ ] **Step 1: Write the route handler**

```ts
import { NextRequest } from "next/server"
import { getTeamMembers } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const members = await getTeamMembers()
  return withCors(request, { team: members })
}
```

- [ ] **Step 2: Smoke-check**

```bash
curl -i http://localhost:3000/api/public/cms/team -H "Origin: http://localhost:5173"
```

Expected: `200`, JSON `{"team":[...]}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/public/cms/team/route.ts
git commit -m "feat(api): GET /api/public/cms/team"
```

---

### Task 7: `GET /api/public/cms/blog-posts` route + `getPublishedBlogPosts` action

**Files:**
- Modify: `next-app/src/actions/cms.ts` (add `getPublishedBlogPosts` — the existing `getPages`/`getPosts` style require admin; we need a public-safe read)
- Create: `next-app/src/app/api/public/cms/blog-posts/route.ts`

**Steps:**

- [ ] **Step 1: Add `getPublishedBlogPosts` to `src/actions/cms.ts`**

Append to the file:

```ts
// Public read: no admin gate, only published posts.
export async function getPublishedBlogPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })
}
```

- [ ] **Step 2: Write the route handler**

```ts
import { NextRequest } from "next/server"
import { getPublishedBlogPosts } from "@/actions/cms"
import { preflight, withCors } from "@/lib/cors"

export function OPTIONS(request: NextRequest) {
  return preflight(request)
}

export async function GET(request: NextRequest) {
  const posts = await getPublishedBlogPosts()
  return withCors(request, { posts })
}
```

- [ ] **Step 3: Smoke-check**

```bash
curl -i http://localhost:3000/api/public/cms/blog-posts -H "Origin: http://localhost:5173"
```

Expected: `200`, JSON `{"posts":[...]}` (possibly empty array).

- [ ] **Step 4: Commit**

```bash
git add src/actions/cms.ts src/app/api/public/cms/blog-posts/route.ts
git commit -m "feat(api): GET /api/public/cms/blog-posts + public read helper"
```

---

### Task 8: Wire signup to consume lead token

**Files:**
- Modify: `next-app/src/actions/auth.ts` (`signup` function, lines 50–100)
- Modify: `next-app/src/app/(auth)/signup/page.tsx` (read `?lead=` from `searchParams`, pass through as hidden field, prefill email/name)

**Steps:**

- [ ] **Step 1: Locate the signup page**

Check it exists:
```bash
ls next-app/src/app/\(auth\)/signup/
```

The page is at `next-app/src/app/(auth)/signup/page.tsx`. Read it before modifying. It receives form data and calls the `signup` action.

- [ ] **Step 2: Update `signup` in `src/actions/auth.ts`**

Replace the body of `export async function signup(...)` (lines 50–100) with:

```ts
export async function signup(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const leadToken = (formData.get("lead") as string | null) || null

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return { error: "User already exists" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      workspaces: {
        create: {
          role: "OWNER",
          workspace: {
            create: {
              name: "Personal Workspace",
              description: "My private workspace",
            },
          },
        },
      },
    },
    include: { workspaces: true },
  })

  let consumedLeadIntent: string | null = null
  if (leadToken) {
    const lead = await prisma.lead.findUnique({ where: { token: leadToken } })
    if (lead && !lead.consumedAt) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { consumedAt: new Date(), userId: user.id },
      })
      consumedLeadIntent = lead.intent ?? null
    }
  }

  const defaultWorkspaceId = user.workspaces[0].workspaceId

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id, workspaceId: defaultWorkspaceId, expires })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  })

  redirect(consumedLeadIntent ? "/onboarding" : "/tasks")
}
```

- [ ] **Step 3: Update signup page to forward `lead` token**

In `next-app/src/app/(auth)/signup/page.tsx`, add `?lead=` reading and prefill. The exact change depends on the existing structure (server component reading `searchParams`, then rendering a client form). Read the file first, then:

1. Destructure `searchParams` (`{ searchParams }: { searchParams: Promise<{ lead?: string }> }`).
2. `const params = await searchParams; const leadToken = params.lead ?? ""`.
3. If `leadToken` is truthy, server-side `await prisma.lead.findUnique({ where: { token: leadToken } })` to fetch the prefill data; pass `defaultEmail` and `defaultName` props into the form.
4. In the client form component, render a hidden `<input type="hidden" name="lead" value={leadToken} />` so the `signup` action receives the token.

Show the exact diff after reading the existing signup page contents — the structure is unknown until you read it.

- [ ] **Step 4: Smoke-check via browser**

1. Create a test lead:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Origin: http://localhost:5173" \
     -H "Content-Type: application/json" \
     -d '{"email":"sig+test@example.com","name":"Sig Test","source":"manual","intent":"audit"}'
   ```
   Capture the returned `token`.

2. Open `http://localhost:3000/signup?lead=<token>` in a browser. Confirm email + name are prefilled. Submit with a password. Expected: redirect to `/onboarding` (because the lead carried `intent: "audit"`).

3. Verify in DB:
   ```bash
   cd next-app
   npx prisma studio
   ```
   Open the `Lead` table. The row should have `consumedAt` set and `userId` populated.

- [ ] **Step 5: Type-check + commit**

```bash
cd next-app
npx tsc --noEmit
git add src/actions/auth.ts "src/app/(auth)/signup/page.tsx"
git commit -m "feat(auth): consume marketing lead token on signup"
```

---

## Phase 2 — app/: env + lib utilities

Tasks 9–11 are independent of each other and can land in any order. They create the infrastructure that Phase 3+ deletions and rewrites depend on.

---

### Task 9: Move app/ Vite dev server to port 5173 + add `VITE_APP_URL`

**Files:**
- Modify: `app/vite.config.ts`
- Create: `app/.env.example`
- Modify: `app/.env` (local-only, not in git)

**Steps:**

- [ ] **Step 1: Read `app/vite.config.ts`** to know the current shape.

- [ ] **Step 2: Add explicit dev server port**

Edit the `defineConfig({ ... })` call to include:

```ts
server: { port: 5173, strictPort: true },
```

(If `server` already exists, set `port` and `strictPort` on it. `strictPort: true` means Vite errors out rather than picking a different port silently — better feedback than a confused dev environment.)

- [ ] **Step 3: Create `app/.env.example`**

```
# URL of the next-app deployment (the authenticated product).
# Dev default below; production should be https://app.successhub.com (or whatever the app subdomain is).
VITE_APP_URL=http://localhost:3000
```

- [ ] **Step 4: Create the live `app/.env`** with the same content (so dev works immediately).

- [ ] **Step 5: Verify dev server boots on 5173**

```bash
cd app
npm run dev
```

Expected output: `Local: http://localhost:5173/`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add app/vite.config.ts app/.env.example
git commit -m "chore(app): pin Vite dev port to 5173 and add VITE_APP_URL env"
```

(Note: `app/` is not the git repo root — `next-app/` is. The change to `app/vite.config.ts` is committed to the `next-app` git repo because that's the only git tree per CLAUDE.md. Confirm `git status` shows the file before committing.)

---

### Task 10: Create `app/src/lib/appUrl.ts`

**Files:**
- Create: `app/src/lib/appUrl.ts`

**Steps:**

- [ ] **Step 1: Write the helper**

```ts
const RAW = import.meta.env.VITE_APP_URL

if (!RAW) {
  // Fail loudly in dev if the env var is missing — silent fallbacks hide misconfigurations.
  console.error("[appUrl] VITE_APP_URL is not set. Marketing CTAs will not work.")
}

export const APP_URL = (RAW ?? "http://localhost:3000").replace(/\/$/, "")

export const loginUrl = () => `${APP_URL}/login`
export const signupUrl = (leadToken?: string) =>
  leadToken ? `${APP_URL}/signup?lead=${encodeURIComponent(leadToken)}` : `${APP_URL}/signup`
export const dashboardUrl = () => `${APP_URL}/dashboard`
export const onboardingUrl = (leadToken?: string) =>
  leadToken ? `${APP_URL}/signup?lead=${encodeURIComponent(leadToken)}` : `${APP_URL}/signup`
export const auditOnboardingUrl = (leadToken: string) =>
  `${APP_URL}/signup?lead=${encodeURIComponent(leadToken)}`
```

(Note: `onboardingUrl` and `auditOnboardingUrl` both target `/signup?lead=…` because marketing leads are unauthenticated and `/onboarding` requires a session — the signup-side lead consumer handles the post-signup redirect to `/onboarding` when an intent is present.)

- [ ] **Step 2: Type-check**

```bash
cd app
npx tsc --noEmit
```

Expected: 0 errors. If `import.meta.env.VITE_APP_URL` is flagged as `any`, add a `vite-env.d.ts` declaration:

```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

(Only add if missing — `app/src/vite-env.d.ts` may already exist.)

- [ ] **Step 3: Commit**

```bash
git add app/src/lib/appUrl.ts app/src/vite-env.d.ts
git commit -m "feat(app): appUrl helpers for cross-origin CTAs"
```

---

### Task 11: Create `app/src/lib/api.ts`

**Files:**
- Create: `app/src/lib/api.ts`

**Steps:**

- [ ] **Step 1: Write the client**

```ts
import { APP_URL } from "./appUrl"

export interface LeadPayload {
  email: string
  name?: string
  source: string
  intent?: string
  payload?: Record<string, unknown>
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${APP_URL}${path}`, { headers: { Accept: "application/json" } })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

export async function postLead(lead: LeadPayload): Promise<{ token: string }> {
  const res = await fetch(`${APP_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => "")
    throw new Error(`POST /api/leads failed: ${res.status} ${err}`)
  }
  return res.json() as Promise<{ token: string }>
}

export interface CmsTestimonial { id: string; name: string; role: string; content: string; rating: number; published: boolean }
export interface CmsPricingPlan { id: string; name: string; price: number; period: string; features: string[]; highlighted?: boolean; cta: string }
export interface CmsTeamMember { id: string; name: string; role: string; bio: string; image: string; color: string }
export interface CmsBlogPost { id: string; title: string; excerpt: string; content: string; publishedAt: string; author: { name: string | null } | null; tags?: string[] }

export const getTestimonials = () => getJson<{ testimonials: CmsTestimonial[] }>("/api/public/cms/testimonials").then((r) => r.testimonials)
export const getPricingPlans = () => getJson<{ plans: CmsPricingPlan[] }>("/api/public/cms/pricing").then((r) => r.plans)
export const getTeam = () => getJson<{ team: CmsTeamMember[] }>("/api/public/cms/team").then((r) => r.team)
export const getBlogPosts = () => getJson<{ posts: CmsBlogPost[] }>("/api/public/cms/blog-posts").then((r) => r.posts)
```

- [ ] **Step 2: Verify shapes match the next-app payloads**

Run dev servers for both apps. From `app/`'s console:

```bash
# In a separate terminal, from a browser DevTools console on http://localhost:5173:
fetch("http://localhost:3000/api/public/cms/testimonials").then(r => r.json()).then(console.log)
```

Inspect the field names. If the next-app `Testimonial` model uses different field names than the interface above, **fix the interface in `api.ts`** — don't change the server response. Repeat for `pricing`, `team`, `blog-posts`. Update the shapes inline.

- [ ] **Step 3: Type-check + commit**

```bash
cd app
npx tsc --noEmit
git add app/src/lib/api.ts
git commit -m "feat(app): cross-origin client for next-app endpoints"
```

---

## Phase 3 — app/: deletions

Tasks 12–14 are mutually independent (they delete disjoint trees). Task 15 depends on all three.

---

### Task 12: Delete dashboard pages, `DashboardLayout`, `ProtectedRoute`

**Files:**
- Delete: `app/src/pages/dashboard/` (entire directory)
- Delete: `app/src/components/DashboardLayout.tsx`
- Delete: `app/src/components/ProtectedRoute.tsx`

**Steps:**

- [ ] **Step 1: Find inbound references first**

```bash
cd app
grep -rln "from .*pages/dashboard" src
grep -rln "DashboardLayout\|ProtectedRoute" src
```

Only `src/App.tsx` should reference them. If anything else does, surface it before deleting (it likely also needs to go).

- [ ] **Step 2: Delete the files**

```bash
cd app
rm -r src/pages/dashboard
rm src/components/DashboardLayout.tsx src/components/ProtectedRoute.tsx
```

- [ ] **Step 3: `App.tsx` will not type-check yet** — that's expected. Task 15 fixes it. Skip type-check at this point.

- [ ] **Step 4: Commit**

```bash
git add -A app/src/pages/dashboard app/src/components/DashboardLayout.tsx app/src/components/ProtectedRoute.tsx
git commit -m "chore(app): remove dashboard pages and layout (moved to next-app)"
```

---

### Task 13: Delete admin pages, `AdminLayout`, `AdminRoute`

**Files:**
- Delete: `app/src/pages/admin/`
- Delete: `app/src/components/AdminLayout.tsx`
- Delete: `app/src/components/AdminRoute.tsx`

**Steps:**

- [ ] **Step 1: Find inbound references**

```bash
cd app
grep -rln "from .*pages/admin" src
grep -rln "AdminLayout\|AdminRoute" src
```

Expected: only `src/App.tsx`.

- [ ] **Step 2: Delete**

```bash
cd app
rm -r src/pages/admin
rm src/components/AdminLayout.tsx src/components/AdminRoute.tsx
```

- [ ] **Step 3: Commit**

```bash
git add -A app/src/pages/admin app/src/components/AdminLayout.tsx app/src/components/AdminRoute.tsx
git commit -m "chore(app): remove admin pages and layout (moved to next-app cms)"
```

---

### Task 14: Delete auth pages, `AuthContext`, `useAuth`

**Files:**
- Delete: `app/src/pages/auth/`
- Delete: `app/src/context/AuthContext.tsx`

**Steps:**

- [ ] **Step 1: Find inbound references**

```bash
cd app
grep -rln "AuthContext\|useAuth\|AuthProvider" src
```

There will be more than just `App.tsx` here — components like `Navbar.tsx` likely call `useAuth()` to decide whether to render Login/Logout. Note each file. Task 19 will rewire them; for now, after deletion, they will fail to type-check.

- [ ] **Step 2: Delete**

```bash
cd app
rm -r src/pages/auth
rm src/context/AuthContext.tsx
```

- [ ] **Step 3: Commit**

```bash
git add -A app/src/pages/auth app/src/context/AuthContext.tsx
git commit -m "chore(app): remove auth pages and AuthContext (moved to next-app)"
```

---

### Task 15: Reduce `app/src/App.tsx` to marketing routes only

**Files:**
- Modify: `app/src/App.tsx`

**Steps:**

- [ ] **Step 1: Replace the file's body**

```tsx
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import { CMSProvider } from './context/CMSContext'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import Home from './pages/Home'
import ZoneOfGenius from './pages/ZoneOfGenius'

const SummerSabbatical = lazy(() => import('./pages/SummerSabbatical'))
const WinterSabbatical = lazy(() => import('./pages/WinterSabbatical'))
const FourHourWorkday = lazy(() => import('./pages/FourHourWorkday'))
const LifestyleExperiences = lazy(() => import('./pages/LifestyleExperiences'))

const AuditOnboarding = lazy(() => import('./pages/AuditOnboarding'))
const IntentionOnboarding = lazy(() => import('./pages/IntentionOnboarding'))
const WorkLifeBalanceAudit = lazy(() => import('./pages/WorkLifeBalanceAudit'))
const IntentionSetting = lazy(() => import('./pages/IntentionSetting'))
const PreparationChecklist = lazy(() => import('./pages/PreparationChecklist'))

const MorningRoutine = lazy(() => import('./pages/MorningRoutine'))
const WorkdayWorkout = lazy(() => import('./pages/WorkdayWorkout'))
const LunchBreak = lazy(() => import('./pages/LunchBreak'))
const DigitalDetox = lazy(() => import('./pages/DigitalDetox'))

const fallback = <LoadingSpinner />

export default function App() {
  return (
    <CMSProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/human-zone-of-genius-team" element={<ZoneOfGenius />} />
          <Route path="/summer-sabbatical" element={<Suspense fallback={fallback}><SummerSabbatical /></Suspense>} />
          <Route path="/winter-sabbatical" element={<Suspense fallback={fallback}><WinterSabbatical /></Suspense>} />
          <Route path="/ceo-workday" element={<Suspense fallback={fallback}><FourHourWorkday /></Suspense>} />
          <Route path="/lifestyle-experiences" element={<Suspense fallback={fallback}><LifestyleExperiences /></Suspense>} />
          <Route path="/audit-onboarding" element={<Suspense fallback={fallback}><AuditOnboarding /></Suspense>} />
          <Route path="/intention-onboarding" element={<Suspense fallback={fallback}><IntentionOnboarding /></Suspense>} />
          <Route path="/work-life-balance-audit" element={<Suspense fallback={fallback}><WorkLifeBalanceAudit /></Suspense>} />
          <Route path="/intention-setting" element={<Suspense fallback={fallback}><IntentionSetting /></Suspense>} />
          <Route path="/preparation-checklist" element={<Suspense fallback={fallback}><PreparationChecklist /></Suspense>} />
          <Route path="/morning-routine" element={<Suspense fallback={fallback}><MorningRoutine /></Suspense>} />
          <Route path="/workday-workout" element={<Suspense fallback={fallback}><WorkdayWorkout /></Suspense>} />
          <Route path="/lunch-break" element={<Suspense fallback={fallback}><LunchBreak /></Suspense>} />
          <Route path="/digital-detox" element={<Suspense fallback={fallback}><DigitalDetox /></Suspense>} />
        </Route>
      </Routes>
    </CMSProvider>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd app
npx tsc --noEmit
```

Will still error on any component that used `useAuth()` — those are fixed in Task 19. Note the remaining errors but proceed.

- [ ] **Step 3: Commit**

```bash
git add app/src/App.tsx
git commit -m "refactor(app): trim App.tsx to marketing routes; drop AuthProvider"
```

---

## Phase 4 — app/: CMS refactor

---

### Task 16: Convert `CMSContext` from static mock to async-fetch

**Files:**
- Modify: `app/src/context/CMSContext.tsx` (major rewrite)

The current `CMSContext` is mock with mutation methods (`updateHero`, `addTeamMember`, etc.). Since `app/` is read-only marketing, **all mutation methods are removed**. Components that called mutations were admin-only and have been deleted in Task 13.

**Steps:**

- [ ] **Step 1: Find consumers and the read-only API they need**

```bash
cd app
grep -rln "useCMS\|CMSContext" src
```

For each non-deleted consumer, note which CMS fields it reads (`useCMS().data.testimonials`, `useCMS().data.pricing`, etc.).

- [ ] **Step 2: Rewrite the file**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  getTestimonials, getPricingPlans, getTeam, getBlogPosts,
  type CmsTestimonial, type CmsPricingPlan, type CmsTeamMember, type CmsBlogPost,
} from '../lib/api'

interface HeroData { headline: string; subtitle: string; ctaText: string; backgroundImage: string }
interface SettingsData { siteName: string; tagline: string; primaryColor: string; secondaryColor: string; features: Record<string, boolean> }

interface CMSData {
  hero: HeroData
  team: CmsTeamMember[]
  pricing: CmsPricingPlan[]
  testimonials: CmsTestimonial[]
  blog: CmsBlogPost[]
  settings: SettingsData
}

interface CMSContextValue {
  data: CMSData
  loading: boolean
  error: string | null
}

// Hero + settings are not in the CMS yet — keep them as compile-time constants.
const staticHero: HeroData = {
  headline: 'Make Time For More™',
  subtitle: 'We help women CEOs build 6-figure+ businesses while making time for family, friends, hobbies, and rest.',
  ctaText: 'Start Your Journey',
  backgroundImage: '/hero-bg.jpg',
}

const staticSettings: SettingsData = {
  siteName: 'Success Hub',
  tagline: 'Make Time For More',
  primaryColor: '#8FB573',
  secondaryColor: '#E07A6E',
  features: { blog: true, testimonials: true, pricing: true, analytics: true },
}

const emptyData: CMSData = {
  hero: staticHero,
  team: [],
  pricing: [],
  testimonials: [],
  blog: [],
  settings: staticSettings,
}

const CMSContext = createContext<CMSContextValue | null>(null)

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([getTeam(), getPricingPlans(), getTestimonials(), getBlogPosts()])
      .then(([teamRes, pricingRes, testRes, blogRes]) => {
        if (cancelled) return
        setData({
          hero: staticHero,
          team: teamRes.status === 'fulfilled' ? teamRes.value : [],
          pricing: pricingRes.status === 'fulfilled' ? pricingRes.value : [],
          testimonials: testRes.status === 'fulfilled' ? testRes.value : [],
          blog: blogRes.status === 'fulfilled' ? blogRes.value : [],
          settings: staticSettings,
        })
        const anyFailed = [teamRes, pricingRes, testRes, blogRes].some((r) => r.status === 'rejected')
        if (anyFailed) {
          console.warn('[CMS] one or more CMS reads failed; sections will render with empty data')
          setError('Some content could not be loaded.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return <CMSContext.Provider value={{ data, loading, error }}>{children}</CMSContext.Provider>
}

export function useCMS(): CMSContextValue {
  const ctx = useContext(CMSContext)
  if (!ctx) throw new Error('useCMS must be used within CMSProvider')
  return ctx
}
```

- [ ] **Step 3: Update any consumer that destructured the old mutation methods**

```bash
cd app
grep -rln "updateHero\|addTeamMember\|updateTeamMember\|removeTeamMember\|addPricingTier\|updatePricingTier\|removePricingTier\|addTestimonial\|removeTestimonial\|addBlogPost\|updateBlogPost\|toggleBlogPublished\|updateSettings" src
```

Any results should be in already-deleted admin files; if not, delete the references (mutations no longer exist).

- [ ] **Step 4: Type-check**

```bash
cd app
npx tsc --noEmit
```

Address any remaining type errors caused by the data-shape change (e.g., if `team[0].image` was a `string` and the new `CmsTeamMember` type made it optional). Adjust consuming components to handle the new shape.

- [ ] **Step 5: Smoke-test in the browser**

Run both dev servers. Visit `http://localhost:5173/`. Watch the Network tab — confirm four GETs to `http://localhost:3000/api/public/cms/*`. Sections that read `useCMS().data.testimonials` should render once data arrives. Sections should not crash when arrays are empty during the initial loading window.

- [ ] **Step 6: Commit**

```bash
git add app/src/context/CMSContext.tsx
git commit -m "refactor(app): fetch CMS content from next-app via api.ts"
```

---

## Phase 5 — app/: lead capture rewrites + CTA wiring

Tasks 17 and 18 are independent. Task 19 depends on Phase 3 being done.

---

### Task 17: Rewrite `IntentionOnboarding.tsx` as a single-step lead-capture form

**Files:**
- Modify: `app/src/pages/IntentionOnboarding.tsx` (replace contents)

**Steps:**

- [ ] **Step 1: Read the current file** to capture any visual styling worth preserving (heading copy, background image, etc.).

- [ ] **Step 2: Replace the contents with a single-step form**

```tsx
import { useState, type FormEvent } from 'react'
import { postLead } from '../lib/api'
import { onboardingUrl } from '../lib/appUrl'

export default function IntentionOnboarding() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [intent, setIntent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { token } = await postLead({
        email,
        name: name || undefined,
        source: 'intention-onboarding',
        intent: intent || 'intention',
      })
      window.location.assign(onboardingUrl(token))
    } catch (err) {
      setError("Couldn't reach the app — please try again.")
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Set Your Intention</h1>
          <p className="text-muted-foreground">Tell us your name and where to send next steps. We'll guide you the rest of the way.</p>
        </header>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">What's your intention?</span>
            <textarea
              value={intent} onChange={(e) => setIntent(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary py-2 text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Type-check, smoke-test**

```bash
cd app
npx tsc --noEmit
```

Run both dev servers. Visit `http://localhost:5173/intention-onboarding`. Fill in the form. Verify:
- POST to `http://localhost:3000/api/leads` returns 201.
- Browser navigates to `http://localhost:3000/signup?lead=<token>`.

- [ ] **Step 4: Commit**

```bash
git add app/src/pages/IntentionOnboarding.tsx
git commit -m "refactor(app): IntentionOnboarding becomes lead-capture form"
```

---

### Task 18: Rewrite `AuditOnboarding.tsx` as a single-step lead-capture form

**Files:**
- Modify: `app/src/pages/AuditOnboarding.tsx`

**Steps:**

- [ ] **Step 1: Read the current file** to preserve voice/copy.

- [ ] **Step 2: Replace the contents**

Same structure as Task 17 but with `source: 'audit-onboarding'`, `intent: 'audit'`, and a different heading/lede. Use `auditOnboardingUrl(token)` for the redirect:

```tsx
import { useState, type FormEvent } from 'react'
import { postLead } from '../lib/api'
import { auditOnboardingUrl } from '../lib/appUrl'

export default function AuditOnboarding() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { token } = await postLead({
        email,
        name: name || undefined,
        source: 'audit-onboarding',
        intent: 'audit',
      })
      window.location.assign(auditOnboardingUrl(token))
    } catch (err) {
      setError("Couldn't reach the app — please try again.")
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Work-Life Balance Audit</h1>
          <p className="text-muted-foreground">Get a clear read on where your time is going. Enter your details and we'll send you straight into the audit.</p>
        </header>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input
              required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              autoComplete="email"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary py-2 text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Start the audit'}
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Type-check, smoke-test**

Visit `http://localhost:5173/audit-onboarding`. Fill in and submit. Expected: redirect to `http://localhost:3000/signup?lead=<token>` with email/name prefilled (Task 8 already handled prefill).

- [ ] **Step 4: Commit**

```bash
git add app/src/pages/AuditOnboarding.tsx
git commit -m "refactor(app): AuditOnboarding becomes lead-capture form"
```

---

### Task 19: Rewire all Login/SignUp/Dashboard/Get Started CTAs

**Files:**
- Modify: every file under `app/src/components/` and `app/src/sections/` that previously rendered `<Link to="/auth/login">`, `<Link to="/auth/signup">`, `<Link to="/dashboard">`, or used `useAuth()` to gate Login/Logout/Dashboard buttons.

**Steps:**

- [ ] **Step 1: Find all CTA targets**

```bash
cd app
grep -rln 'to="/auth/login"\|to="/auth/signup"\|to="/dashboard"\|/auth/login\|/auth/signup' src
grep -rln "useAuth" src
```

Each hit is a place that needs to swap a `react-router` `<Link>` for an `<a href>` pointing at `next-app`, or remove an `isAuthenticated`-style branch entirely (since `app/` has no auth, all "Login" buttons are always visible and always link out).

- [ ] **Step 2: Pattern for each file**

For files that import `useAuth`:

```tsx
// Remove
import { useAuth } from '../context/AuthContext'
// ...
const { isAuthenticated, logout } = useAuth()
```

For each `<Link to="/auth/login">…</Link>`:

```tsx
// Replace
import { Link } from 'react-router'
<Link to="/auth/login">Login</Link>

// With
import { loginUrl } from '../lib/appUrl'
<a href={loginUrl()}>Login</a>
```

(Adjust the relative `../lib/appUrl` path per file location.)

Same for `signupUrl()` and `dashboardUrl()`. For any "Logout" button: remove it entirely (no auth in `app/`).

- [ ] **Step 3: Walk each file from the grep results in Step 1**

For each file:
1. Open it.
2. Replace each `<Link>`-to-auth/dashboard with `<a href={…Url()}>`.
3. Remove `useAuth()` calls and conditional auth-aware rendering.
4. Save.

- [ ] **Step 4: Type-check and build the app**

```bash
cd app
npx tsc --noEmit
npm run build
```

Both must pass with 0 errors. If anything still references `AuthContext`, `useAuth`, `ProtectedRoute`, `AdminRoute`, `DashboardLayout`, or `AdminLayout` — those are leftovers; remove them.

- [ ] **Step 5: End-to-end smoke**

Run both dev servers:

```bash
# Terminal 1
cd next-app && npm run dev
# Terminal 2
cd app && npm run dev
```

In the browser:
1. Open `http://localhost:5173/`. Marketing site renders.
2. Click "Login" anywhere. Browser navigates to `http://localhost:3000/login`.
3. Back to `http://localhost:5173/audit-onboarding`. Submit the form. Browser navigates to `http://localhost:3000/signup?lead=<token>` with email/name prefilled.
4. Complete signup. Confirm post-signup landing is `/onboarding` (because `intent: "audit"` was set).
5. From a fresh browser session at `http://localhost:5173/`, click "Get Started" / "Sign Up". Browser navigates to `http://localhost:3000/signup`.

- [ ] **Step 6: Commit**

```bash
git add -A app/src/components app/src/sections
git commit -m "refactor(app): rewire Login/SignUp/Dashboard CTAs to next-app subdomain"
```

---

## Self-review checklist

1. **Spec coverage:**
   - Subdomain topology + ports → Task 9
   - Lead model + token flow → Tasks 1, 3, 8
   - `MARKETING_ORIGINS` + CORS → Task 2 (used by Tasks 3–7)
   - `POST /api/leads` → Task 3
   - `GET /api/public/cms/*` (4 endpoints) → Tasks 4–7
   - Onboarding accepts `?lead=` token → Task 8 (corrected to `/signup?lead=`)
   - `app/` deletions (auth, dashboard, admin) → Tasks 12–14
   - `app/src/lib/api.ts` + `appUrl.ts` → Tasks 10, 11
   - `CMSContext` async refactor → Task 16
   - Lead-capture onboarding rewrites → Tasks 17, 18
   - CTA rewiring → Task 19
   - `next-app/(marketing)` untouched → no task needed (confirmed by spec)
2. **No placeholders.** Each task has runnable code and exact commands.
3. **Type consistency.** `LeadPayload`, `Cms*` interfaces, `appUrl()` helpers used uniformly across Tasks 11, 16, 17, 18.
4. **Spec deviation flagged.** Lead redirect target is `/signup?lead=` not `/onboarding?lead=` — documented at the top of this plan and the rationale (onboarding layout requires auth).
