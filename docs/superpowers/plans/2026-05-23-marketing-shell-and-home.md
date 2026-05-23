# Marketing Shell + Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Vite `app/`'s public Home page (13 sections, Lenis smooth scroll, GSAP, Three.js, Framer Motion) into `next-app/` at `/`, backed by real Postgres data via existing CMS server actions. Sub-project 1 of 4 of the broader marketing port.

**Architecture:** New `src/app/(marketing)/` route group with a server-component layout that fetches session, wrapping a client `MarketingShell` (SmoothScroll + Navbar + Footer). `(marketing)/page.tsx` is a server component that `Promise.all`s the existing CMS reads and renders 13 client section components (ported byte-for-byte from `app/src/sections/` with mechanical changes only — add `'use client'`, swap `react-router` → router shim, swap mock-context for props). CherryBlossomSuite is `next/dynamic({ ssr: false })` to keep R3F off the server. Marketing-only Radix/shadcn primitives live in `src/components/marketing/ui/`, parallel to dashboard's `@base-ui` primitives in `src/components/ui/`. A new `prisma/seed.ts` populates baseline content.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 (`@theme` in globals.css), Prisma 6 / Postgres, jose JWT auth (existing), Lenis, GSAP + ScrollTrigger, Framer Motion, React Three Fiber / drei / postprocessing, Radix UI primitives, shadcn/ui components.

**Working directory:** All `git`, `npm`, and `npx` commands assume you are in `C:\Users\fumar\Downloads\success-hub\next-app`. File paths in this plan are relative to that directory unless absolute.

**Note on testing:** `next-app/` has no unit test runner configured. The substitute for "run failing test" / "run passing test" steps is `npm run dev` + browser verification at `http://localhost:3000/`, plus `npm run build` and `npm run lint` for the final acceptance pass. Each section task includes a concrete browser verification step.

**Reference spec:** `docs/superpowers/specs/2026-05-23-marketing-shell-and-home-design.md` (committed at `f40da34`).

---

## Phase A — Foundations

### Task 1: Reset existing marketing scaffold

Someone started a hand-written 4-section marketing page that doesn't match the spec. Scrap it before porting from `app/`.

**Files:**
- Delete: `src/components/marketing/Features.tsx`
- Delete: `src/components/marketing/Hero.tsx`
- Delete: `src/components/marketing/HeroScene.tsx`
- Delete: `src/components/marketing/MarketingFooter.tsx`
- Delete: `src/components/marketing/MarketingNavbar.tsx`
- Delete: `src/components/marketing/PricingSection.tsx`
- Delete: `src/components/marketing/TestimonialsSection.tsx`
- Modify: `src/app/(marketing)/layout.tsx` (replace with a placeholder until Task 14)
- Modify: `src/app/(marketing)/page.tsx` (replace with a placeholder until Task 33)

- [ ] **Step 1: Delete the seven WIP component files**

```bash
rm src/components/marketing/Features.tsx \
   src/components/marketing/Hero.tsx \
   src/components/marketing/HeroScene.tsx \
   src/components/marketing/MarketingFooter.tsx \
   src/components/marketing/MarketingNavbar.tsx \
   src/components/marketing/PricingSection.tsx \
   src/components/marketing/TestimonialsSection.tsx
```

- [ ] **Step 2: Replace `src/app/(marketing)/layout.tsx` with a minimal pass-through placeholder**

Write this content (the real shell arrives in Task 14):

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Success Hub — Work-Life Balance for Women Entrepreneurs",
  description:
    "A holistic platform for ambitious women: habits, sleep, nutrition, workouts, community, and an AI guide tuned to your life.",
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Replace `src/app/(marketing)/page.tsx` with a placeholder home**

```tsx
export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl">Home (under reconstruction)</h1>
      <p className="text-sm text-gray">Sections will appear as porting progresses.</p>
    </main>
  )
}
```

- [ ] **Step 4: Verify `npm run dev` still boots and `/` renders the placeholder**

Run: `npm run dev`
Open `http://localhost:3000/`. Expected: the "Home (under reconstruction)" placeholder. Stop the dev server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add src/app/\(marketing\)/ src/components/marketing/
git commit -m "chore(marketing): reset WIP scaffold before port from app/"
```

---

### Task 2: Audit and copy public assets from app/

Every `<img src="/..." />` in app/'s Home sections, Layout, Navbar, and Footer needs the same file at the same path under `next-app/public/`.

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/public/**`
- Create: matching files under `public/` in next-app

- [ ] **Step 1: Generate the list of asset references**

Run this from inside `next-app/`:

```bash
grep -rho 'src="/[^"]*"' /c/Users/fumar/Downloads/success-hub/app/src/sections \
  /c/Users/fumar/Downloads/success-hub/app/src/components/Layout.tsx \
  /c/Users/fumar/Downloads/success-hub/app/src/components/Navbar.tsx \
  /c/Users/fumar/Downloads/success-hub/app/src/components/Footer.tsx \
  /c/Users/fumar/Downloads/success-hub/app/src/pages/Home.tsx \
  | sort -u > /tmp/marketing-assets.txt
cat /tmp/marketing-assets.txt
```

Expected: a list of paths like `src="/logo-cherry-blossom.svg"`, `src="/images/hero/founder.jpg"`, etc.

- [ ] **Step 2: Also enumerate background-image / url() references in app/'s sections and index.css**

```bash
grep -rhoE "url\(['\"]?/[^'\")]+['\"]?\)" \
  /c/Users/fumar/Downloads/success-hub/app/src/sections \
  /c/Users/fumar/Downloads/success-hub/app/src/index.css \
  /c/Users/fumar/Downloads/success-hub/app/src/App.css 2>/dev/null \
  | sort -u
```

Append any new paths to `/tmp/marketing-assets.txt`.

- [ ] **Step 3: Copy `app/public/` into `next-app/public/`, preserving subdirectory structure**

```bash
cp -rn /c/Users/fumar/Downloads/success-hub/app/public/* public/
ls public/
```

The `-n` flag means "no clobber" — existing next-app assets (`favicon.ico`, etc.) are preserved.

- [ ] **Step 4: Spot-check three referenced assets exist under `next-app/public/`**

Run:
```bash
test -f public/logo-cherry-blossom.svg && echo "logo OK"
# Then run for two more concrete paths picked from /tmp/marketing-assets.txt
```

If any referenced asset isn't in `app/public/` either, note it — it may be imported from `app/src/assets/`. Search there and copy individually.

- [ ] **Step 5: Commit**

```bash
git add public/
git commit -m "chore(marketing): copy public assets from app/"
```

---

### Task 3: Add Plus Jakarta Sans and Playfair Display via next/font

`app/` uses Plus Jakarta Sans (body) and Playfair Display (serif headings). next-app's root layout currently uses Geist.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update the root layout to load the two Google fonts**

Replace the contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Success Hub",
  description: "Work-life balance platform for women entrepreneurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Wire `--font-serif` into the Tailwind theme**

Open `src/app/globals.css`. Inside the existing `@theme inline { ... }` block, find the line `--font-sans: var(--font-sans);` and ensure `--font-serif: var(--font-serif);` is also present. The block should contain both:

```css
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
```

The `font-serif` Tailwind utility now resolves to Playfair Display.

- [ ] **Step 3: Verify with `npm run dev`**

Run: `npm run dev`
Open `http://localhost:3000/`. The placeholder home still renders. Inspect the `<html>` element in DevTools — it should have CSS variables `--font-sans` and `--font-serif` defined. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(marketing): load Plus Jakarta Sans + Playfair Display"
```

---

### Task 4: Port custom CSS layers (gradient vars, btn-primary, gradient-text)

`app/src/index.css` defines CSS variables and `@layer components` rules that ported sections (and Navbar) depend on.

**Files:**
- Modify: `src/app/globals.css`
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/index.css` lines 1–120

- [ ] **Step 1: Read app/src/index.css to identify what to port**

```bash
sed -n '1,120p' /c/Users/fumar/Downloads/success-hub/app/src/index.css
```

Note the `:root` CSS variables (especially `--gradient-primary`, `--ease-smooth`, any other custom vars), the `@layer base` font rules, and `@layer components` rules: `.gradient-text`, `.btn-primary`, `.btn-outline-sage`, etc.

- [ ] **Step 2: Append the ported rules to `src/app/globals.css`**

Add these blocks at the bottom of `src/app/globals.css` (after the existing `@theme inline` and `:root` definitions):

```css
/* ─── Ported from app/src/index.css ─── */

:root {
  --gradient-primary: linear-gradient(135deg, #8FB573 0%, #5D7A4A 100%);
  --gradient-accent: linear-gradient(135deg, #E07A6E 0%, #B35E54 100%);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

@layer base {
  html {
    font-family: var(--font-sans);
  }
  body {
    background: var(--color-cream);
    color: var(--color-dark);
  }
}

@layer components {
  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .btn-primary {
    background: var(--gradient-primary);
    color: white;
    font-weight: 600;
    padding: 14px 28px;
    border-radius: 9999px;
    box-shadow: 0 4px 16px rgba(143, 181, 115, 0.3);
    transition: all 0.3s var(--ease-smooth);
    display: inline-block;
  }
  .btn-primary:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 24px rgba(143, 181, 115, 0.4);
  }
  .btn-primary:active {
    transform: scale(0.98);
  }

  .btn-outline-sage {
    background: transparent;
    border: 2px solid var(--color-sage);
    color: var(--color-sage);
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 9999px;
    transition: all 0.3s ease;
  }
  .btn-outline-sage:hover {
    background: var(--color-sage);
    color: white;
  }

  .font-display {
    font-family: var(--font-serif);
  }
}
```

If app/src/index.css contains additional `@layer components` rules not listed above (e.g. `.glass`, `.section-pad`), copy each verbatim into the same block.

- [ ] **Step 3: Verify with `npm run dev`**

Run: `npm run dev`. Open `http://localhost:3000/`. Page body should now have a cream background and use the Jakarta sans font. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(marketing): port custom CSS layers from app/src/index.css"
```

---

### Task 5: Install Lenis, R3F, drei, postprocessing, and Radix peer packages

Spec calls out exactly which packages are needed.

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install Lenis + R3F + Radix base set**

```bash
npm install lenis @react-three/fiber @react-three/drei @react-three/postprocessing \
  @radix-ui/react-slot \
  @radix-ui/react-accordion \
  @radix-ui/react-tabs
```

(Button uses `@radix-ui/react-slot`; Card/Badge are static; Accordion and Tabs are common in marketing sections. Additional Radix peers — like `@radix-ui/react-dialog` — get installed individually if a later section task surfaces a need.)

- [ ] **Step 2: Verify next.config.ts transpilation (Turbopack)**

Open `next.config.ts`. If it has a `transpilePackages` field, add `'three'` if not already present. R3F and `three` work with Turbopack out of the box but transpiling `three` avoids edge-case mangling. Skip this step if there's no `transpilePackages` field — defaults are fine.

- [ ] **Step 3: Verify the install with a quick import smoke**

Create `/tmp/smoke.ts` (not in the repo):

```bash
node -e "require.resolve('lenis'); require.resolve('@react-three/fiber'); require.resolve('@radix-ui/react-slot'); console.log('OK')"
```

Expected output: `OK`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts
git commit -m "chore(marketing): add Lenis, R3F, drei, postprocessing, Radix peers"
```

---

### Task 6: Create router shim + NavLink

So ported sections from `app/` only need a one-line import swap.

**Files:**
- Create: `src/components/marketing/router-shim.ts`
- Create: `src/components/marketing/NavLink.tsx`

- [ ] **Step 1: Create `src/components/marketing/NavLink.tsx`**

`app/`'s NavLink supports either a string `className` or a function `(({ isActive }) => string)`, plus children-as-function for active state rendering. The shim implements the same API atop `next/link` and `usePathname`.

```tsx
"use client"

import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type ClassNameValue =
  | string
  | ((args: { isActive: boolean }) => string)

type ChildrenValue =
  | ReactNode
  | ((args: { isActive: boolean }) => ReactNode)

type NavLinkProps = Omit<LinkProps, "href" | "className" | "children"> & {
  to: string
  className?: ClassNameValue
  children?: ChildrenValue
  end?: boolean
}

export default function NavLink({
  to,
  className,
  children,
  end,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className
  const resolvedChildren =
    typeof children === "function" ? children({ isActive }) : children
  return (
    <Link href={to} className={resolvedClassName} {...rest}>
      {resolvedChildren}
    </Link>
  )
}
```

- [ ] **Step 2: Create `src/components/marketing/router-shim.ts`**

```ts
"use client"

import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import NavLink from "./NavLink"

export { NextLink as Link }
export { NavLink }
export { usePathname as useLocation }
export { useRouter }

export function useNavigate() {
  const router = useRouter()
  return (path: string) => router.push(path)
}
```

- [ ] **Step 3: Type-check by building**

```bash
npm run build
```

Expected: build succeeds. If you see "unused export" warnings, ignore them — sections will consume the exports as they're ported.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/router-shim.ts src/components/marketing/NavLink.tsx
git commit -m "feat(marketing): add react-router shim atop next/navigation"
```

---

### Task 7: Create GSAP setup module

Centralizes `gsap.registerPlugin(ScrollTrigger)` so each animated section imports a single side-effect module.

**Files:**
- Create: `src/components/marketing/gsap-setup.ts`

- [ ] **Step 1: Write the setup module**

```ts
"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

- [ ] **Step 2: Build to confirm `gsap/ScrollTrigger` resolves**

```bash
npm run build
```

Expected: build succeeds (the module isn't imported by anything yet; it just type-checks).

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/gsap-setup.ts
git commit -m "feat(marketing): centralize GSAP + ScrollTrigger setup"
```

---

### Task 8: Create SmoothScroll component

Wraps the marketing shell with Lenis-driven smooth scroll.

**Files:**
- Create: `src/components/marketing/SmoothScroll.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/SmoothScroll.tsx
git commit -m "feat(marketing): Lenis smooth-scroll wrapper"
```

---

### Task 9: Add the minimum shadcn/Radix UI primitives the Home sections need

Start with Button, Card, Badge. Accordion and Tabs are installed already in Task 5; their wrapper components get added on demand in section tasks that import them.

**Files:**
- Create: `src/components/marketing/ui/button.tsx`
- Create: `src/components/marketing/ui/card.tsx`
- Create: `src/components/marketing/ui/badge.tsx`

- [ ] **Step 1: Copy `app/src/components/ui/button.tsx` to `src/components/marketing/ui/button.tsx`**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/components/ui/button.tsx src/components/marketing/ui/button.tsx
```

Open the new file. The shadcn Button uses `@radix-ui/react-slot`, `class-variance-authority`, and the `cn` helper. Adjust the `cn` import:

- If the file imports `from "@/lib/utils"`, leave it — next-app already has `src/lib/utils.ts` exporting `cn` (verify with `grep "export.*cn" src/lib/utils.ts`; if missing, create it with the standard shadcn helper: `export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }`).
- No other edits.

- [ ] **Step 2: Repeat for Card**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/components/ui/card.tsx src/components/marketing/ui/card.tsx
```

- [ ] **Step 3: Repeat for Badge**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/components/ui/badge.tsx src/components/marketing/ui/badge.tsx
```

- [ ] **Step 4: Verify `src/lib/utils.ts` exports `cn`**

```bash
grep -n "export.*cn" src/lib/utils.ts
```

If not present, add to `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/ui/ src/lib/utils.ts
git commit -m "feat(marketing): port Button, Card, Badge primitives"
```

---

## Phase B — Shell

### Task 10: Port the Footer

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/components/Footer.tsx`
- Create: `src/components/marketing/Footer.tsx`

- [ ] **Step 1: Copy the original**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/components/Footer.tsx src/components/marketing/Footer.tsx
```

- [ ] **Step 2: Apply mechanical edits in `src/components/marketing/Footer.tsx`**

Open the file and apply, in order:

1. Add `"use client"` as the first line if not present.
2. Replace any `from 'react-router'` import with `from '@/components/marketing/router-shim'`.
3. Replace any `from '@/components/ui/<name>'` with `from '@/components/marketing/ui/<name>'`.
4. If Footer uses `useAuth()` or `useCMS()`, remove those imports and the body that depends on them — Footer in `app/` is mostly static. If `useCMS()` is referenced for footer text, substitute hardcoded copy from the original mock context for now (a later sub-project may move footer text to SiteSettings).

Use grep to find what's there:

```bash
grep -n "react-router\|@/components/ui\|useAuth\|useCMS\|useNavigate" src/components/marketing/Footer.tsx
```

Apply edits to whatever lines that lists.

- [ ] **Step 3: Build to type-check**

```bash
npm run build
```

Expected: success. If build fails on a missing UI primitive (e.g. `Separator`), add it via the same copy-from-app pattern as Task 9.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/Footer.tsx src/components/marketing/ui/
git commit -m "feat(marketing): port Footer from app/"
```

---

### Task 11: Create LogoutButton — a client wrapper over the existing logout server action

**Files:**
- Read: `src/actions/auth.ts` (verify the name of the logout action; spec assumes `logoutAction`)
- Create: `src/components/marketing/LogoutButton.tsx`

- [ ] **Step 1: Verify the logout server action's exported name**

```bash
grep -n "^export.*function.*logout\|^export.*logout" src/actions/auth.ts
```

Expected: one line declaring the logout action (likely `export async function logoutAction()` or `export async function logout()`). Record the exact name.

- [ ] **Step 2: Create `src/components/marketing/LogoutButton.tsx`** using the exact name from Step 1

Substitute `<LOGOUT_FN>` with the actual export name found above:

```tsx
"use client"

import { ReactNode } from "react"
import { <LOGOUT_FN> } from "@/actions/auth"

export default function LogoutButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <form
      action={async () => {
        "use server"
        // server action delegation handled by the imported action below
      }}
    >
      <button
        type="button"
        className={className}
        onClick={async () => {
          await <LOGOUT_FN>()
          window.location.href = "/"
        }}
      >
        {children}
      </button>
    </form>
  )
}
```

If `logout` is a server action and importing it inside a client component fails the build, replace the body with a simpler approach — keep the server action import out and use a plain `<form action={logoutAction}>` pattern:

```tsx
"use client"

import { ReactNode } from "react"
import { <LOGOUT_FN> } from "@/actions/auth"

export default function LogoutButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <form action={<LOGOUT_FN>}>
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  )
}
```

Use the second variant unless the existing action requires arguments.

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/LogoutButton.tsx
git commit -m "feat(marketing): logout button wrapping existing server action"
```

---

### Task 12: Port the Navbar with real-auth wiring

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/components/Navbar.tsx`
- Create: `src/components/marketing/Navbar.tsx`

- [ ] **Step 1: Copy the original**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/components/Navbar.tsx src/components/marketing/Navbar.tsx
```

- [ ] **Step 2: Apply Navbar-specific mechanical edits**

Open `src/components/marketing/Navbar.tsx` and apply, in order:

1. Confirm `"use client"` is the first line.
2. Replace `from 'react-router'` → `from '@/components/marketing/router-shim'`.
3. Remove `import { useAuth } from '../context/AuthContext'`.
4. Change the component signature from `export default function Navbar()` to `export default function Navbar({ user }: { user: { id: string; name: string | null; email: string | null } | null })`.
5. Replace `const { isAuthenticated, logout } = useAuth()` with `const isAuthenticated = !!user`.
6. Replace `const handleLogout = () => { logout(); window.location.href = '/' }` and the inline `<button onClick={handleLogout}>` usages with the `LogoutButton` component:

   ```tsx
   import LogoutButton from "./LogoutButton"
   // ...
   <LogoutButton className="flex items-center gap-2 text-sm font-medium text-gray hover:text-coral transition-colors">
     <LogOut size={16} />
     Log Out
   </LogoutButton>
   ```

   (Both the desktop and the mobile drawer logout buttons.)
7. Replace navigation targets:
   - `/auth/login` → `/login` (two occurrences)
   - `/auth/signup` → `/signup` (two occurrences)
   - `/dashboard` and `/dashboard/settings` stay the same.
8. Delete the "Hide navbar on auth pages" block:
   ```ts
   if (location.pathname.startsWith('/auth/')) return null
   ```
   It's dead code in next-app because `/login` and `/signup` live in the `(auth)` route group with its own layout.
9. Update the logo `<img src="/logo-cherry-blossom.svg" .../>` — verify the asset is in `next-app/public/` (copied in Task 2). If absent, copy it now from `app/public/`.

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: success. If you see "useNavigate is not exported", verify Task 6's shim has it.

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/Navbar.tsx
git commit -m "feat(marketing): port Navbar with real session-prop auth wiring"
```

---

### Task 13: Create MarketingShell

Composes SmoothScroll + Navbar + main + Footer.

**Files:**
- Create: `src/components/marketing/MarketingShell.tsx`

- [ ] **Step 1: Write the shell**

```tsx
"use client"

import SmoothScroll from "./SmoothScroll"
import Navbar from "./Navbar"
import Footer from "./Footer"

type ShellUser = { id: string; name: string | null; email: string | null } | null

export default function MarketingShell({
  user,
  children,
}: {
  user: ShellUser
  children: React.ReactNode
}) {
  return (
    <SmoothScroll>
      <div className="min-h-[100dvh] flex flex-col bg-cream text-dark">
        <Navbar user={user} />
        <main className="flex-1 pt-[72px]">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
```

The `pt-[72px]` matches the fixed-Navbar height from `app/Navbar`.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/MarketingShell.tsx
git commit -m "feat(marketing): MarketingShell composing SmoothScroll+Navbar+Footer"
```

---

### Task 14: Replace `(marketing)/layout.tsx` with the real server-component shell

**Files:**
- Read: `src/actions/auth.ts` (verify `getCurrentUser` returns the shape used in Navbar)
- Modify: `src/app/(marketing)/layout.tsx`

- [ ] **Step 1: Check the return shape of `getCurrentUser()`**

```bash
grep -A 20 "export async function getCurrentUser" src/actions/auth.ts
```

Confirm it returns something like `{ user: { id, name, email, ... }, ... } | null`. Note the exact path to the user object (e.g., `result.user` vs `result` itself).

- [ ] **Step 2: Replace `src/app/(marketing)/layout.tsx`**

If `getCurrentUser()` returns `{ user, ... } | null`, use this:

```tsx
import type { Metadata } from "next"
import { getCurrentUser } from "@/actions/auth"
import MarketingShell from "@/components/marketing/MarketingShell"

export const metadata: Metadata = {
  title: "Success Hub — Work-Life Balance for Women Entrepreneurs",
  description:
    "A holistic platform for ambitious women: habits, sleep, nutrition, workouts, community, and an AI guide tuned to your life.",
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await getCurrentUser().catch(() => null)
  const user = context?.user
    ? {
        id: context.user.id,
        name: context.user.name ?? null,
        email: context.user.email ?? null,
      }
    : null

  return <MarketingShell user={user}>{children}</MarketingShell>
}
```

If Step 1 shows `getCurrentUser()` returns the user object directly (not nested under `.user`), adjust the destructuring accordingly.

- [ ] **Step 3: `npm run dev` and verify**

Run: `npm run dev`. Open `http://localhost:3000/`. Expected:
- Navbar visible at top (fixed), styled per `app/`.
- Footer visible below the placeholder.
- "Home (under reconstruction)" placeholder still showing between them.
- Logged out: "Log In" and "Get Started" visible. Clicking them goes to `/login` and `/signup`.
- Open DevTools, scroll the page — Lenis smooth scroll active.

Stop the server.

- [ ] **Step 4: Open `/login` and `/dashboard` to confirm regression-free**

Restart `npm run dev`. Visit `http://localhost:3000/login` — should render the existing auth login, no marketing chrome (auth layout is separate). Log in. Visit `http://localhost:3000/dashboard` — should render normally with the existing dashboard sidebar; no marketing Navbar bleeding in. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(marketing\)/layout.tsx
git commit -m "feat(marketing): real shell with server-fetched session"
```

---

## Phase C — CMS revalidation + seed

### Task 15: Add `revalidatePath('/')` to CMS mutations the Home page consumes

Without this, admin edits in `/cms/*` won't surface on `/` until a manual hard reload.

**Files:**
- Modify: `src/actions/cms.ts`

- [ ] **Step 1: Open `src/actions/cms.ts` and add the revalidation calls**

For each of these functions, **add** a second `revalidatePath("/")` call immediately after the existing `revalidatePath("/cms/...")` line. Do not remove existing calls.

Functions to modify:
- `createTestimonial`
- `updateTestimonial`
- `deleteTestimonial`
- `createPricingPlan`
- `updatePricingPlan`
- `deletePricingPlan`
- `createPost`
- `updatePost`
- `deletePost`
- `createTeamMember`
- `updateTeamMember`
- `deleteTeamMember`

Example pattern (do this for each function):

```ts
// before
export async function createTestimonial(data: {...}) {
  await requireAdmin()
  const t = await prisma.testimonial.create({ data })
  revalidatePath("/cms/testimonials")
  return t
}

// after
export async function createTestimonial(data: {...}) {
  await requireAdmin()
  const t = await prisma.testimonial.create({ data })
  revalidatePath("/cms/testimonials")
  revalidatePath("/")
  return t
}
```

`upsertSiteSetting` and `bulkUpsertSiteSettings` already call `revalidatePath("/")` — leave them as-is.

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/actions/cms.ts
git commit -m "feat(cms): revalidate / when Home-consumed content changes"
```

---

### Task 16: Write `prisma/seed.ts` with baseline Home content

This is real DB content, not mock — admins can edit through `/cms/*` afterward.

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] **Step 1: Create `prisma/seed.ts`**

```ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const SITE_SETTINGS: Record<string, string> = {
  hero_headline: "Work-Life Balance for Women Entrepreneurs",
  hero_subheadline:
    "A sanctuary for ambitious women — where peak performance meets deep rest.",
  hero_cta_primary: "Get Started",
  hero_cta_secondary: "See the Sanctuary",
  hero_image: "/images/hero/founder.jpg",
  onboarding_step_1_title: "Tell us your rhythm",
  onboarding_step_1_body:
    "A 5-minute audit maps your current week, energy, and bottlenecks.",
  onboarding_step_2_title: "Build your Sunday Shift",
  onboarding_step_2_body:
    "Design the week that fits the life you actually want.",
  onboarding_step_3_title: "Live it, with support",
  onboarding_step_3_body:
    "An AI guide and a private community keep you in motion.",
  sunday_shift_headline: "The Sunday Shift",
  sunday_shift_body:
    "One hour, once a week, to choose your week before it chooses you.",
  sanctuary_headline: "Your Sanctuary",
  sanctuary_body:
    "A dedicated space for the practices that hold the rest of your life.",
  cherry_blossom_headline: "The Cherry Blossom Suite",
  cherry_blossom_body:
    "A signature collection of rituals tuned to seasonal energy.",
  wellness_headline: "Your Wellness Dashboard",
  wellness_body:
    "Sleep, nutrition, movement, mood — one view, integrated daily.",
  integration_week_headline: "Integration Week",
  integration_week_body:
    "Every quarter, four days off and a structured reset.",
  community_headline: "The Community",
  community_body:
    "Curated peers — founders who get it, holding standards together.",
  sabbaticals_headline: "Sabbaticals",
  sabbaticals_body:
    "Twice a year, full disconnection — designed for women at the top.",
  contact_headline: "Begin Your Sunday Shift",
  contact_body: "We work with a small cohort each season.",
  contact_email: "hello@successhub.com",
}

const TESTIMONIALS: Array<{
  name: string
  role: string
  company: string
  content: string
  image: string | null
  rating: number
  published: boolean
}> = [
  {
    name: "Maya Chen",
    role: "Founder & CEO",
    company: "Lumen Labs",
    content:
      "Success Hub helped me hold a four-hour workday for an entire quarter while my company grew 22%. The Sunday Shift is non-negotiable now.",
    image: null,
    rating: 5,
    published: true,
  },
  {
    name: "Priya Ramanathan",
    role: "Co-Founder",
    company: "Verdant Studio",
    content:
      "I came in skeptical. Six weeks later I was sleeping eight hours and saying no to meetings I would've taken before.",
    image: null,
    rating: 5,
    published: true,
  },
  {
    name: "Sarah Whitcomb",
    role: "Founder",
    company: "Solstice Wellness",
    content:
      "The community of women who actually run companies is the part I didn't know I needed.",
    image: null,
    rating: 5,
    published: true,
  },
]

const PRICING_PLANS: Array<{
  name: string
  price: string
  interval: string
  features: string[]
  description: string
  isPopular: boolean
}> = [
  {
    name: "Sanctuary",
    price: "$97",
    interval: "month",
    features: [
      "Sunday Shift weekly planning",
      "AI Guide (general use)",
      "Wellness dashboard",
      "Async community",
    ],
    description: "For founders building the habit.",
    isPopular: false,
  },
  {
    name: "Atelier",
    price: "$297",
    interval: "month",
    features: [
      "Everything in Sanctuary",
      "Quarterly Integration Week programming",
      "Small-group cohort calls",
      "1:1 onboarding with a coach",
    ],
    description: "For founders going deep.",
    isPopular: true,
  },
  {
    name: "Sabbatical Circle",
    price: "$8,800",
    interval: "year",
    features: [
      "Everything in Atelier",
      "Two facilitated sabbaticals/year",
      "Annual planning intensive",
      "Member sanctuary access",
    ],
    description: "For founders rebuilding the relationship with work.",
    isPopular: false,
  },
]

async function main() {
  // Site settings (idempotent upsert by key)
  for (const [key, value] of Object.entries(SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  // Testimonials (insert only when table is empty — preserves admin edits)
  const testimonialCount = await prisma.testimonial.count()
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({ data: TESTIMONIALS })
  }

  // Pricing plans (insert only when table is empty)
  const planCount = await prisma.pricingPlan.count()
  if (planCount === 0) {
    await prisma.pricingPlan.createMany({ data: PRICING_PLANS })
  }

  console.log("Seed complete")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

- [ ] **Step 2: Wire the seed into `package.json`**

Open `package.json` and add this top-level field after `"scripts"`:

```json
"prisma": {
  "seed": "ts-node --transpile-only prisma/seed.ts"
}
```

Then install `ts-node` as a dev dep (Prisma's seed runner expects it):

```bash
npm install --save-dev ts-node
```

- [ ] **Step 3: Run the seed**

```bash
npx prisma db seed
```

Expected output ending with `Seed complete`. If you get "Connection refused", check `.env`'s `DATABASE_URL`.

- [ ] **Step 4: Verify data landed**

```bash
npx prisma studio
```

In the browser tab Studio opens: `SiteSetting` has the 20+ keys, `Testimonial` has 3 rows, `PricingPlan` has 3 rows. Close Studio.

- [ ] **Step 5: Commit**

```bash
git add prisma/seed.ts package.json package-lock.json
git commit -m "feat(marketing): seed baseline Home content (settings, testimonials, plans)"
```

---

## Phase D — Section ports

**Pattern for every section task in this phase** (referenced once here so each task can be terse):

For each section in `app/src/sections/<Name>.tsx`:

1. **Copy** to `src/components/marketing/sections/<Name>.tsx`.
2. **Add `"use client"`** at the top if not present.
3. **Swap router import**: `from 'react-router'` → `from '@/components/marketing/router-shim'`.
4. **Swap UI primitive imports**: `from '@/components/ui/<x>'` → `from '@/components/marketing/ui/<x>'`. If `<x>` doesn't exist yet in `src/components/marketing/ui/`, copy it from `app/src/components/ui/<x>.tsx` first (same pattern as Task 9).
5. **Remove mock-context imports**: if the file uses `useCMS()` or `useAuth()`, remove the import and convert to a prop. Type the prop using the Prisma model name (e.g., `Testimonial[]`, `PricingPlan[]`) or a `Record<string, string>` for SiteSettings.
6. **Asset paths**: `<img src="/..." />` — verify each referenced asset exists under `next-app/public/`. If missing, copy from `app/public/` (Task 2 may have missed it).
7. **Build** after edits: `npm run build`. Fix any type errors.
8. **Verify in browser**: temporarily render the section inside `(marketing)/page.tsx`'s placeholder to eyeball it before moving on.
9. **Commit** per section.

Each task below is the section-specific instance of this pattern.

---

### Task 17: Port Hero

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/sections/Hero.tsx`
- Create: `src/components/marketing/sections/Hero.tsx`
- Modify: `src/app/(marketing)/page.tsx` (temporary render)

- [ ] **Step 1: Copy the original**

```bash
mkdir -p src/components/marketing/sections
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Hero.tsx src/components/marketing/sections/Hero.tsx
```

- [ ] **Step 2: Scan for what needs to change**

```bash
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate" src/components/marketing/sections/Hero.tsx
```

Apply the mechanical edits listed in the Phase D pattern. Hero typically uses `useNavigate` for the primary CTA — route it to `/signup`.

- [ ] **Step 3: Add the settings prop**

Add to the file's component signature:

```tsx
type SiteSettings = Record<string, string>

export default function Hero({ settings = {} }: { settings?: SiteSettings }) {
  // ...
  const headline = settings.hero_headline ?? "Work-Life Balance for Women Entrepreneurs"
  const subheadline = settings.hero_subheadline ?? ""
  const ctaPrimary = settings.hero_cta_primary ?? "Get Started"
  const ctaSecondary = settings.hero_cta_secondary ?? "Learn More"
  // ... replace hardcoded strings in JSX with these consts
}
```

Replace the hardcoded headline / subheadline / CTA labels in the JSX with these consts. Keep the visual structure of the rendered markup identical to app/'s Hero.

- [ ] **Step 4: Temporarily render in `(marketing)/page.tsx` to verify**

Replace `src/app/(marketing)/page.tsx` with:

```tsx
import { getSiteSettings } from "@/actions/cms"
import Hero from "@/components/marketing/sections/Hero"

export default async function HomePage() {
  const settings = await getSiteSettings()
  return <Hero settings={settings} />
}
```

- [ ] **Step 5: Browser verify**

Run `npm run dev`. Open `http://localhost:3000/`. Hero renders with the seeded headline, subheadline, and CTA labels. Visually compare against `app/`'s Hero at `http://localhost:3001/` (run `cd ../app && npm run dev -- --port 3001` in a separate terminal). Stop both servers.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/sections/Hero.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Hero section"
```

---

### Task 18: Port Onboarding

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/sections/Onboarding.tsx`
- Create: `src/components/marketing/sections/Onboarding.tsx`

- [ ] **Step 1: Copy and apply Phase D mechanical edits**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Onboarding.tsx src/components/marketing/sections/Onboarding.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate" src/components/marketing/sections/Onboarding.tsx
```

Apply edits. Add `{ settings }: { settings?: Record<string, string> }` prop. Map the three steps' titles/bodies to seeded keys `onboarding_step_1_title`, `onboarding_step_1_body`, `onboarding_step_2_*`, `onboarding_step_3_*`.

- [ ] **Step 2: Wire into `(marketing)/page.tsx` for verification**

Update the page to import + render both Hero and Onboarding, passing `settings` to each.

- [ ] **Step 3: Browser verify + commit**

```bash
npm run dev   # verify at /
# stop server
git add src/components/marketing/sections/Onboarding.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Onboarding section"
```

---

### Task 19: Port SundayShift

**Files:**
- Read: `/c/Users/fumar/Downloads/success-hub/app/src/sections/SundayShift.tsx`
- Create: `src/components/marketing/sections/SundayShift.tsx`

- [ ] **Step 1: Copy + apply Phase D mechanical edits**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/SundayShift.tsx src/components/marketing/sections/SundayShift.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/SundayShift.tsx
```

If file imports `gsap`, change to `import { gsap } from '@/components/marketing/gsap-setup'` so plugin registration is shared. Same for `ScrollTrigger`.

- [ ] **Step 2: Add `settings` prop**, map keys `sunday_shift_headline` / `sunday_shift_body`.

- [ ] **Step 3: Wire, verify, commit**

```bash
# add to (marketing)/page.tsx render list
npm run dev   # verify
git add src/components/marketing/sections/SundayShift.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port SundayShift section"
```

---

### Task 20: Port CoWorkSchedule

**Files:**
- Create: `src/components/marketing/sections/CoWorkSchedule.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/CoWorkSchedule.tsx src/components/marketing/sections/CoWorkSchedule.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/CoWorkSchedule.tsx
```

Apply Phase D edits. Schedule items are static visual structure — no settings prop needed unless the file references `useCMS()`. If it does, replace context reads with a `settings` prop reading `cowork_schedule_*` keys (seed them as-needed via `bulkUpsertSiteSettings` later if the section demands).

- [ ] **Step 2: Wire, verify, commit**

```bash
npm run dev   # verify
git add src/components/marketing/sections/CoWorkSchedule.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port CoWorkSchedule section"
```

---

### Task 21: Port SanctuarySection

**Files:**
- Create: `src/components/marketing/sections/SanctuarySection.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/SanctuarySection.tsx src/components/marketing/sections/SanctuarySection.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/SanctuarySection.tsx
```

Apply Phase D edits. Map `sanctuary_headline`, `sanctuary_body` from `settings`.

- [ ] **Step 2: Wire, verify, commit**

```bash
npm run dev
git add src/components/marketing/sections/SanctuarySection.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port SanctuarySection"
```

---

### Task 22: Port CherryBlossomSuite (R3F + dynamic import)

**Files:**
- Create: `src/components/marketing/sections/CherryBlossomSuite.tsx`
- Modify: `src/app/(marketing)/page.tsx` (use `next/dynamic` with `ssr: false`)

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/CherryBlossomSuite.tsx src/components/marketing/sections/CherryBlossomSuite.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap|@react-three" src/components/marketing/sections/CherryBlossomSuite.tsx
```

Apply Phase D edits. Confirm `'use client'` is present (R3F demands it).

- [ ] **Step 2: Update `(marketing)/page.tsx` to lazy-load this section only**

Where other sections import normally, CherryBlossomSuite uses `next/dynamic`:

```tsx
import dynamic from "next/dynamic"

const CherryBlossomSuite = dynamic(
  () => import("@/components/marketing/sections/CherryBlossomSuite"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)
```

- [ ] **Step 3: Wire, verify, commit**

```bash
npm run dev
# In the browser, scroll to the section; confirm 3D scene loads after a brief loading state
git add src/components/marketing/sections/CherryBlossomSuite.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port CherryBlossomSuite with next/dynamic ssr:false"
```

If `npm run build` fails on the section due to R3F SSR-ing somewhere, double-check the dynamic import has `ssr: false` and the section file has `"use client"`.

---

### Task 23: Port WellnessDashboard

**Files:**
- Create: `src/components/marketing/sections/WellnessDashboard.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/WellnessDashboard.tsx src/components/marketing/sections/WellnessDashboard.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap|recharts" src/components/marketing/sections/WellnessDashboard.tsx
```

Apply Phase D edits. Map `wellness_headline`, `wellness_body`. If section imports `recharts`, it's already in `next-app/package.json` — no install needed.

- [ ] **Step 2: Wire, verify, commit**

```bash
npm run dev
git add src/components/marketing/sections/WellnessDashboard.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port WellnessDashboard section"
```

---

### Task 24: Port IntegrationWeek

**Files:**
- Create: `src/components/marketing/sections/IntegrationWeek.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/IntegrationWeek.tsx src/components/marketing/sections/IntegrationWeek.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/IntegrationWeek.tsx
```

Apply Phase D edits. Map `integration_week_headline`, `integration_week_body`.

- [ ] **Step 2: Wire, verify, commit**

```bash
npm run dev
git add src/components/marketing/sections/IntegrationWeek.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port IntegrationWeek section"
```

---

### Task 25: Port SuccessStories (Testimonials)

**Files:**
- Create: `src/components/marketing/sections/SuccessStories.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/SuccessStories.tsx src/components/marketing/sections/SuccessStories.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/SuccessStories.tsx
```

Apply Phase D edits. **Replace the mock-context testimonial array** with a `testimonials` prop:

```tsx
import type { Testimonial } from "@prisma/client"

export default function SuccessStories({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null
  // ... map over testimonials, replacing the hardcoded array in the original
}
```

If the original uses fields like `quote` or `author`, map them to `Testimonial` fields: `content`, `name`, `role`, `company`, `image`, `rating`.

- [ ] **Step 2: Update `(marketing)/page.tsx`**

Add `getTestimonials()` to the Promise.all and pass `testimonials.filter(t => t.published)` to the section.

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# Verify the 3 seeded testimonials render
git add src/components/marketing/sections/SuccessStories.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port SuccessStories (real testimonials data)"
```

---

### Task 26: Port Community

**Files:**
- Create: `src/components/marketing/sections/Community.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Community.tsx src/components/marketing/sections/Community.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/Community.tsx
```

Apply Phase D edits. Inspect the original section. If it shows recent **blog posts** (the `Post` model), the section should accept `posts: Post[]` and render the latest 3 with `status === "PUBLISHED"`. If instead it shows community avatars/quotes statically, treat it like Section 19 (SundayShift) — just settings-backed copy with no DB list.

Decide based on the original. Type the prop accordingly.

- [ ] **Step 2: Update `(marketing)/page.tsx`** (add `getPosts()` to Promise.all only if Step 1 confirmed posts are needed).

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
git add src/components/marketing/sections/Community.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Community section"
```

---

### Task 27: Port Sabbaticals

**Files:**
- Create: `src/components/marketing/sections/Sabbaticals.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Sabbaticals.tsx src/components/marketing/sections/Sabbaticals.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/Sabbaticals.tsx
```

Apply Phase D edits. Map `sabbaticals_headline`, `sabbaticals_body`. The Summer/Winter Sabbatical links go to routes that don't exist in next-app yet (later sub-projects); for now point both buttons to `/` with a `data-todo="route-pending"` attribute so future sub-projects can grep for them.

- [ ] **Step 2: Verify + commit**

```bash
npm run dev
git add src/components/marketing/sections/Sabbaticals.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Sabbaticals section (sabbatical routes deferred)"
```

---

### Task 28: Port Pricing

**Files:**
- Create: `src/components/marketing/sections/Pricing.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Pricing.tsx src/components/marketing/sections/Pricing.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/Pricing.tsx
```

Apply Phase D edits. Replace any hardcoded plan array with a `plans` prop:

```tsx
import type { PricingPlan } from "@prisma/client"

export default function Pricing({ plans }: { plans: PricingPlan[] }) {
  if (plans.length === 0) return null
  // map over plans, using plan.name, plan.price, plan.interval, plan.features (string[]),
  // plan.description, plan.isPopular
}
```

- [ ] **Step 2: Update `(marketing)/page.tsx`** — add `getPricingPlans()` to the Promise.all.

- [ ] **Step 3: Verify + commit**

```bash
npm run dev
# Verify the 3 seeded plans render with "Atelier" marked popular
git add src/components/marketing/sections/Pricing.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Pricing section (real pricing plans data)"
```

---

### Task 29: Port Contact

**Files:**
- Create: `src/components/marketing/sections/Contact.tsx`

- [ ] **Step 1: Copy + edit**

```bash
cp /c/Users/fumar/Downloads/success-hub/app/src/sections/Contact.tsx src/components/marketing/sections/Contact.tsx
grep -nE "react-router|@/components/ui|useAuth|useCMS|useNavigate|gsap" src/components/marketing/sections/Contact.tsx
```

Apply Phase D edits. Map `contact_headline`, `contact_body`, `contact_email` from settings.

If the original section has a working contact form: in `app/`, that form was a mock (no backend). Keep it as a UI-only form for now — the submit handler does `console.log` or `alert`. A real contact-form action is out of scope; flag it in the section as `// TODO(sub-project follow-up): wire contact form to a server action`.

- [ ] **Step 2: Verify + commit**

```bash
npm run dev
git add src/components/marketing/sections/Contact.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): port Contact section (form submit deferred)"
```

---

## Phase E — Final page composition + acceptance

### Task 30: Compose the final `(marketing)/page.tsx`

Replace the incremental version that's been growing across Phase D with a clean, complete composition.

**Files:**
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Replace with the final composition**

```tsx
import dynamic from "next/dynamic"
import {
  getSiteSettings,
  getTestimonials,
  getPosts,
  getPricingPlans,
} from "@/actions/cms"

import Hero from "@/components/marketing/sections/Hero"
import Onboarding from "@/components/marketing/sections/Onboarding"
import SundayShift from "@/components/marketing/sections/SundayShift"
import CoWorkSchedule from "@/components/marketing/sections/CoWorkSchedule"
import SanctuarySection from "@/components/marketing/sections/SanctuarySection"
import WellnessDashboard from "@/components/marketing/sections/WellnessDashboard"
import IntegrationWeek from "@/components/marketing/sections/IntegrationWeek"
import SuccessStories from "@/components/marketing/sections/SuccessStories"
import Community from "@/components/marketing/sections/Community"
import Sabbaticals from "@/components/marketing/sections/Sabbaticals"
import Pricing from "@/components/marketing/sections/Pricing"
import Contact from "@/components/marketing/sections/Contact"

const CherryBlossomSuite = dynamic(
  () => import("@/components/marketing/sections/CherryBlossomSuite"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-2 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)

export default async function HomePage() {
  const [settings, testimonials, posts, plans] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
    getPosts(),
    getPricingPlans(),
  ])

  const publishedTestimonials = testimonials.filter((t) => t.published)
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").slice(0, 3)

  return (
    <>
      <Hero settings={settings} />
      <Onboarding settings={settings} />
      <SundayShift settings={settings} />
      <CoWorkSchedule settings={settings} />
      <SanctuarySection settings={settings} />
      <CherryBlossomSuite />
      <WellnessDashboard settings={settings} />
      <IntegrationWeek settings={settings} />
      <SuccessStories testimonials={publishedTestimonials} />
      <Community posts={publishedPosts} settings={settings} />
      <Sabbaticals settings={settings} />
      <Pricing plans={plans} />
      <Contact settings={settings} />
    </>
  )
}
```

If Task 26 decided Community doesn't need `posts`, remove the `posts={publishedPosts}` prop and the `getPosts()` from the Promise.all.

- [ ] **Step 2: Build + dev verify**

```bash
npm run build
```

Expected: success. Then:

```bash
npm run dev
```

Open `http://localhost:3000/`. Expected:
- All 13 sections render in order.
- CherryBlossomSuite shows the loader briefly, then the 3D scene.
- Lenis smooth scroll active throughout.
- Hero, Onboarding, etc. show seeded copy.
- Pricing shows 3 plans; SuccessStories shows 3 testimonials.

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/page.tsx
git commit -m "feat(marketing): compose final Home page with all 13 sections"
```

---

### Task 31: Full acceptance pass — visual parity with app/

**Files:** (no code changes; verification only)

- [ ] **Step 1: Start both apps side-by-side**

In one terminal:
```bash
npm run dev   # from next-app/  -> http://localhost:3000
```

In a second terminal:
```bash
cd /c/Users/fumar/Downloads/success-hub/app && npm run dev -- --port 3001
# -> http://localhost:3001
```

- [ ] **Step 2: Side-by-side compare each section**

Open both URLs. Walk through every section top to bottom in both windows. For each, confirm:
- Layout matches (column widths, padding, image positions).
- Typography matches (font, size, weight).
- Colors match (sage greens, coral, cream background).
- Animations behave: Hero entrance, GSAP scroll triggers fire at correct positions, CherryBlossomSuite Three.js scene renders.
- Mobile view (browser DevTools mobile emulation) matches: Navbar collapses, drawer opens, sections reflow.

For each discrepancy, log a finding (text file or sticky notes). Discrepancies that go beyond the spec — e.g., a section uses content the seed doesn't cover — become micro-tasks. Add a follow-up step for each: edit the section to handle missing data gracefully, or extend the seed.

- [ ] **Step 3: Auth flows**

- Logged out at `/`: Navbar shows "Log In" + "Get Started"; both navigate correctly.
- Log in via `/login` (use an existing test account). Verify redirect to `/dashboard`.
- Navigate back to `/`. Navbar now shows "Dashboard" + "Log Out". Click Log Out — confirm session ends and `/` reloads with logged-out Navbar.

- [ ] **Step 4: CMS revalidation**

Log in as admin, open `/cms/testimonials`. Edit one testimonial's `content`. Save. Open `/` in a new tab. The updated content appears within a refresh (no manual cache clear).

- [ ] **Step 5: Stop both servers**

---

### Task 32: Build + lint + dashboard regression check

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: success. Note any new warnings unrelated to dashboard.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: no new errors. Fix any errors introduced by ported sections (most likely unused imports left over from copy-modify).

- [ ] **Step 3: Manual dashboard click-through**

```bash
npm run start
```

Visit each of these and confirm they render with no regression vs. before this sub-project:
- `http://localhost:3000/login`
- `http://localhost:3000/signup`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/dashboard/tasks`
- `http://localhost:3000/dashboard/nutrition`
- `http://localhost:3000/dashboard/cms/posts`

The marketing Navbar should NOT appear on `(dashboard)/*` or `(auth)/*` routes. The dashboard sidebar/styling should be unchanged.

Stop the server.

- [ ] **Step 4: Commit any lint fixes**

```bash
git add -p   # selectively stage lint fixes only
git commit -m "chore(marketing): lint fixes from acceptance pass"
```

(Only commit if there were fixes. If lint was already clean, skip.)

---

### Task 33: Update `src/proxy.ts` only if needed

This is a safety check. Spec says `/` is already in `publicRoutes`. Confirm it.

- [ ] **Step 1: Verify**

```bash
grep -n "publicRoutes" src/proxy.ts
```

Expected: the array includes `'/'`. If it doesn't, add it back (without removing the others) and commit:

```bash
git add src/proxy.ts
git commit -m "fix(proxy): keep / in publicRoutes for marketing landing"
```

If the array is correct, skip the commit.

---

## Self-review of this plan (for the writer, not the executor)

The author of this plan should re-scan it for:
- Spec coverage: every section in the spec has a task above? Hero/Onboarding/SundayShift/CoWorkSchedule/SanctuarySection/CherryBlossomSuite/WellnessDashboard/IntegrationWeek/SuccessStories/Community/Sabbaticals/Pricing/Contact = 13 ✓. MarketingShell, SmoothScroll, Navbar, Footer, NavLink, router-shim, gsap-setup, marketing UI primitives ✓. Seed ✓. CMS revalidation ✓. Auth wiring ✓. Asset audit ✓. Color tokens (already in globals.css per the design discovery) — added .btn-primary / gradient / fonts ✓.
- Placeholder scan: no "TBD" / "implement later" / "similar to" remains. ✓
- Type consistency: `getCurrentUser()` shape is verified in the task that uses it (Task 14 Step 1). `Testimonial`, `PricingPlan`, `Post` use Prisma model names — match `schema.prisma`. ✓
- `useNavigate` defined in shim and used by Navbar/Hero (the only known callers). ✓
- All `git add` paths quote the parens in `(marketing)` correctly with a backslash. ✓
