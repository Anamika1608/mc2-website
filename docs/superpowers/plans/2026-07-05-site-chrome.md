# Site Chrome (Header/Footer/Stubs) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every page the shared MC²+ chrome — sticky header with responsive nav, orange footer — plus stub pages so all six nav routes resolve.

**Architecture:** Header/Footer are Astro components rendered by `BaseLayout.astro` around its `<slot/>` (approved design: pages contain content only). One nav data module feeds both. `Logo.astro` renders a text fallback until the user's Figma SVG export lands. All interactivity is two small vanilla scripts inside `Header.astro`.

**Tech Stack:** Astro 7.0.6, Bun 1.3.x, vanilla TS component scripts, scoped Astro styles + existing design tokens.

**Spec:** `docs/superpowers/specs/2026-07-05-header-footer-design.md` (approved). Where this plan and the spec disagree, stop and escalate.

## Global Constraints

- Working directory: `/Users/anamika/work/mc2-website`. All work on branch `feat/site-chrome` (created in Task 1 from a clean `main`).
- Package manager: **Bun only** (`bun run dev|build`, `bunx`) — never npm/npx/yarn/pnpm.
- Git commits: plain messages only. **Never** add `Co-Authored-By: Claude ...` or "Generated with Claude Code" trailers.
- Colors ONLY via existing tokens in `src/styles/global.css` (`--color-ink`, `--color-orange`, `--color-cream`, `--color-line`, `--color-gray`, `--color-white`) — the sole exceptions are the two `rgba(30, 30, 58, …)` shadow/divider values given verbatim in this plan (they are alpha variants of `--color-ink`).
- Breakpoints exactly: hamburger below `1024px`, footer stack below `768px`.
- Footer copy must be rendered verbatim as written in the code blocks below (uppercase treatment of "Explore"/"Engage" comes from CSS `text-transform`, not the source text).
- No new dependencies of any kind.
- Verify-don't-assume: if any command output deviates from an Expected line, re-check docs.astro.build before improvising; if still stuck, report BLOCKED.

## File Structure After This Plan

```
src/
├── components/
│   ├── Header.astro      # Task 1 — sticky bar, nav, active state, mobile menu
│   ├── Footer.astro      # Task 2 — orange band, link columns, bottom bar
│   └── Logo.astro        # Task 1 — text fallback now; SVG drop-in later
├── data/
│   └── nav.ts            # Task 1 — single source of nav items
├── layouts/
│   └── BaseLayout.astro  # Task 1 adds skip link + Header + <main>; Task 2 adds Footer
├── pages/
│   ├── index.astro       # Task 1 — drop own <main> (BaseLayout provides it)
│   └── {about,team,initiatives,support,portfolio,contact}.astro  # Task 3 — stubs
└── styles/
    └── global.css        # Task 1 — .container, .skip-link, .sr-only utilities
```

---

### Task 1: Header, nav data, Logo fallback, BaseLayout wiring

**Files:**
- Create: `src/data/nav.ts`, `src/components/Logo.astro`, `src/components/Header.astro`
- Modify: `src/styles/global.css` (append utilities), `src/layouts/BaseLayout.astro` (body), `src/pages/index.astro` (own `<main>` → `<div class="hero">`)

**Interfaces:**
- Consumes: tokens from `src/styles/global.css`; `--font-display`/`--font-sans`; BaseLayout props `{ title, description? }` (unchanged).
- Produces: `NAV_ITEMS: NavItem[]` and `interface NavItem { label: string; href: string }` exported from `src/data/nav.ts` (Task 2 footer consumes `NAV_ITEMS.slice(0, 5)`); `Logo.astro` with prop `variant?: "header" | "footer"` (default `"header"`); BaseLayout renders `<main id="main">` around the slot (Task 3 stubs rely on it).

- [ ] **Step 1: Create branch from clean main**

Run: `git status --porcelain && git checkout -b feat/site-chrome`
Expected: empty status, then `Switched to a new branch 'feat/site-chrome'`. If status is non-empty, stop and report BLOCKED.

- [ ] **Step 2: Append layout utilities to `src/styles/global.css`**

Append at the end of the file:

```css

/* Layout utilities */
.container {
  max-width: 1760px;
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 5rem);
}

/* Visually hidden until focused (keyboard users) */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--color-ink);
  color: var(--color-white);
  padding: 0.6rem 1rem;
  border-radius: 0 0 0.5rem 0;
}
.skip-link:focus {
  left: 0;
}

/* Visually hidden, available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 3: Create `src/data/nav.ts`**

```ts
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Support", href: "/support" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];
```

- [ ] **Step 4: Create `src/components/Logo.astro`**

```astro
---
interface Props {
  variant?: "header" | "footer";
}
const { variant = "header" } = Astro.props;

// The real logo arrives later as src/assets/logo.svg (optional logo-footer.svg
// variant for the orange footer). import.meta.glob tolerates absent files,
// so the text fallback below ships until the export lands — a static import
// would fail the build. Astro ≥5.7 imports SVGs as inline components.
const svgs = import.meta.glob("../assets/logo{,-footer}.svg", {
  eager: true,
}) as Record<string, { default: any }>;
const HeaderSvg = svgs["../assets/logo.svg"]?.default;
const FooterSvg = svgs["../assets/logo-footer.svg"]?.default ?? HeaderSvg;
const Svg = variant === "footer" ? FooterSvg : HeaderSvg;
---

{
  Svg ? (
    <Svg class={`logo logo--${variant}`} aria-hidden="true" />
  ) : (
    <span class={`logo logo--${variant} logo--text`} aria-hidden="true">
      mc<sup>2</sup><span class="plus">+</span>
    </span>
  )
}

<style>
  .logo--text {
    font-family: var(--font-display);
    color: var(--color-ink);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .logo--header.logo--text {
    font-size: 1.75rem;
  }
  .logo--footer.logo--text {
    font-size: 2.5rem;
  }
  .logo--text sup {
    font-size: 0.6em;
  }
  .logo--text .plus {
    color: var(--color-orange);
  }
</style>
```

Note: when the SVG lands, verify the glob-imported component renders; if it misbehaves, switch to a static `import Logo from "../assets/logo.svg";` (docs-verified) in the same file — the fallback branch then never triggers.

- [ ] **Step 5: Create `src/components/Header.astro`**

```astro
---
import Logo from "./Logo.astro";
import { NAV_ITEMS } from "../data/nav";

const pathname = Astro.url.pathname.replace(/\/+$/, "") || "/";
const isActive = (href: string) =>
  pathname === href || pathname.startsWith(href + "/");
---

<header id="site-header">
  <div class="container bar">
    <a class="home-link" href="/" aria-label="MC²+ home">
      <Logo />
    </a>

    <button
      id="menu-button"
      type="button"
      aria-expanded="false"
      aria-controls="site-nav"
    >
      <span class="sr-only">Menu</span>
      <span class="burger" aria-hidden="true"></span>
    </button>

    <nav id="site-nav" aria-label="Main">
      <ul class="nav-list">
        {
          NAV_ITEMS.map((item) => (
            <li>
              <a
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  </div>
</header>

<script>
  const header = document.getElementById("site-header")!;
  const button = document.getElementById("menu-button")!;

  const setScrolled = () =>
    header.classList.toggle("scrolled", window.scrollY > 4);
  setScrolled();
  addEventListener("scroll", setScrolled, { passive: true });

  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const setOpen = (open: boolean) => {
    button.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
  };

  button.addEventListener("click", () => setOpen(!isOpen()));

  header.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("#site-nav a")) setOpen(false);
  });

  addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
</script>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-cream);
    border-bottom: 1px solid var(--color-line);
    transition: box-shadow 150ms ease;
  }
  header.scrolled {
    box-shadow: 0 2px 12px rgba(30, 30, 58, 0.08);
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding-block: 1.1rem;
  }
  .home-link {
    display: inline-flex;
    text-decoration: none;
  }
  .nav-list {
    list-style: none;
    display: flex;
    gap: 2.2rem;
    margin: 0;
    padding: 0;
  }
  .nav-list a {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--color-ink);
    transition: color 120ms ease;
  }
  .nav-list a:hover,
  .nav-list a[aria-current="page"] {
    color: var(--color-orange);
  }
  #menu-button {
    display: none;
    background: none;
    border: 0;
    padding: 0.6rem;
    cursor: pointer;
  }
  .burger {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--color-ink);
    box-shadow:
      0 -7px 0 var(--color-ink),
      0 7px 0 var(--color-ink);
  }

  @media (max-width: 1023.98px) {
    #menu-button {
      display: inline-flex;
      order: 2;
    }
    #site-nav {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-cream);
      border-bottom: 1px solid var(--color-line);
      box-shadow: 0 12px 24px rgba(30, 30, 58, 0.08);
    }
    header.menu-open #site-nav {
      display: block;
    }
    .nav-list {
      flex-direction: column;
      gap: 0;
      padding-block: 0.5rem;
    }
    .nav-list a {
      display: block;
      padding: 0.9rem clamp(1.25rem, 4vw, 5rem);
    }
  }
</style>
```

(Component `<script>`s are bundled as deferred `type="module"` and deduped per page — docs-verified; no DOMContentLoaded wrapper needed. Absolute `#site-nav` positions against the sticky header, which is a positioned ancestor.)

- [ ] **Step 6: Rewrite `src/layouts/BaseLayout.astro` body (head stays untouched)**

Replace the entire file with:

```astro
---
import { Font } from "astro:assets";
import Header from "../components/Header.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = "MC²+ — Multiply · Collaborate · Create. India's flagship energy innovation platform.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <Font cssVariable="--font-sora" preload />
    <Font cssVariable="--font-faculty" preload />
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main"><slot /></main>
  </body>
</html>
```

- [ ] **Step 7: Update `src/pages/index.astro` (BaseLayout now owns `<main>`)**

Replace the entire file with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="MC²+ · Multiply · Collaborate · Create">
  <div class="hero">
    <p class="eyebrow">Multiply · Collaborate · Create</p>
    <h1>Where ideas <span class="accent">multiply</span>.</h1>
    <p>Project base is ready — pages arrive in the next step.</p>
  </div>
</BaseLayout>

<style>
  .hero {
    min-height: 60vh;
    display: grid;
    place-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
  }
  .eyebrow {
    color: var(--color-gray);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0;
  }
  h1 {
    font-size: 3rem;
  }
  .accent {
    color: var(--color-orange);
  }
</style>
```

- [ ] **Step 8: Verify the build output**

Run:
```bash
bun run build
grep -c 'id="site-header"' dist/index.html
grep -o 'href="/about"\|href="/team"\|href="/initiatives"\|href="/support"\|href="/portfolio"\|href="/contact"' dist/index.html | sort | uniq -c
grep -c 'id="main"' dist/index.html
grep -c 'aria-current' dist/index.html || true
```
Expected: build exit 0 (1 page); `1` site-header; each of the six hrefs appears exactly once; `1` main; aria-current grep finds nothing on the homepage (exit 1 from grep -c printing 0 is why `|| true`).

- [ ] **Step 9: Commit**

```bash
git add src/data/nav.ts src/components/Logo.astro src/components/Header.astro src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add sticky responsive header with nav and logo fallback"
```

---

### Task 2: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` (add Footer import + render after `</main>`)

**Interfaces:**
- Consumes: `NAV_ITEMS` from `src/data/nav.ts` (first five items = EXPLORE column); `Logo.astro` with `variant="footer"`; `.container` utility.
- Produces: `<Footer />` rendered on every page via BaseLayout (Task 3 stubs inherit it automatically).

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import Logo from "./Logo.astro";
import { NAV_ITEMS } from "../data/nav";

const EXPLORE = NAV_ITEMS.slice(0, 5);
// "Coming soon" and "Partners" have no destination yet — user decision routes
// all ENGAGE items to /contact until dedicated pages exist.
const ENGAGE = [
  { label: "Coming soon", href: "/contact" },
  { label: "Contact", href: "/contact" },
  { label: "Partners", href: "/contact" },
];
---

<footer>
  <div class="container top">
    <div class="brand">
      <Logo variant="footer" />
      <p>
        Multiply. Collaborate. Create. India's flagship energy innovation
        platform – a Section 8 not-for-profit, initiated by the Ministry of
        Petroleum &amp; Natural Gas and backed by energy majors.
      </p>
    </div>

    <nav class="links" aria-label="Footer">
      <div>
        <h2>Explore</h2>
        <ul>
          {
            EXPLORE.map((item) => (
              <li>
                <a href={item.href}>{item.label}</a>
              </li>
            ))
          }
        </ul>
      </div>
      <div>
        <h2>Engage</h2>
        <ul>
          {
            ENGAGE.map((item) => (
              <li>
                <a href={item.href}>{item.label}</a>
              </li>
            ))
          }
        </ul>
      </div>
    </nav>
  </div>

  <div class="bottom">
    <div class="container bottom-row">
      <p>© 2026 MC²+ Foundation · New Delhi, India</p>
      <p>Multiply · Collaborate · Create</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: var(--color-orange);
    color: var(--color-ink);
  }
  .top {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 3rem;
    padding-block: 3.5rem;
  }
  .brand p {
    max-width: 46ch;
    margin: 1.25rem 0 0;
    line-height: 1.6;
  }
  .links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
  .links h2 {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-cream);
    margin: 0 0 1rem;
  }
  .links ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }
  .links a {
    text-decoration: none;
    color: var(--color-ink);
  }
  .links a:hover {
    text-decoration: underline;
  }
  .bottom {
    border-top: 1px solid rgba(30, 30, 58, 0.25);
  }
  .bottom-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 2rem;
    padding-block: 1.25rem;
    font-size: 0.9rem;
  }
  .bottom-row p {
    margin: 0;
  }

  @media (max-width: 767.98px) {
    .top {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }
</style>
```

- [ ] **Step 2: Wire Footer into `src/layouts/BaseLayout.astro`**

Two edits:
1. In the frontmatter, directly after `import Header from "../components/Header.astro";` add:
```astro
import Footer from "../components/Footer.astro";
```
2. In the body, directly after `<main id="main"><slot /></main>` add:
```astro
    <Footer />
```

- [ ] **Step 3: Verify the build output**

Run:
```bash
bun run build
grep -c '<footer' dist/index.html
grep -c 'Section 8 not-for-profit' dist/index.html
grep -c '© 2026 MC²+ Foundation · New Delhi, India' dist/index.html
grep -o 'Multiply · Collaborate · Create' dist/index.html | wc -l
```
Expected: build exit 0; `1` footer; `1` mission paragraph; `1` copyright line; tagline count ≥ 1. (The footer nav links duplicate header hrefs — that is by design.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: add orange footer with brand block and link columns"
```

---

### Task 3: Stub pages + full-route verification

**Files:**
- Create: `src/components/StubPage.astro`, `src/pages/about.astro`, `src/pages/team.astro`, `src/pages/initiatives.astro`, `src/pages/support.astro`, `src/pages/portfolio.astro`, `src/pages/contact.astro`

**Interfaces:**
- Consumes: `BaseLayout` props `{ title }`; `<main id="main">` provided by BaseLayout (stubs must NOT render their own `<main>`).
- Produces: `StubPage.astro` with prop `name: string`; routes `/about`, `/team`, `/initiatives`, `/support`, `/portfolio`, `/contact` — replaced page-by-page in later phases (delete `StubPage.astro` with the last stub).

- [ ] **Step 1: Create `src/components/StubPage.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";

interface Props {
  name: string;
}
const { name } = Astro.props;
---

<BaseLayout title={`${name} · MC²+`}>
  <section class="stub">
    <p class="eyebrow">MC²+</p>
    <h1>{name}</h1>
    <p>This page is being built — check back soon.</p>
  </section>
</BaseLayout>

<style>
  .stub {
    min-height: 60vh;
    display: grid;
    place-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
  }
  .eyebrow {
    color: var(--color-gray);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0;
  }
  h1 {
    font-size: 3rem;
  }
</style>
```

- [ ] **Step 2: Create the six stub pages**

`src/pages/about.astro` — full content:

```astro
---
import StubPage from "../components/StubPage.astro";
---

<StubPage name="About" />
```

The other five files are identical except the `name` prop:

| File | `name` prop |
|---|---|
| `src/pages/team.astro` | `Team` |
| `src/pages/initiatives.astro` | `Initiatives` |
| `src/pages/support.astro` | `Support` |
| `src/pages/portfolio.astro` | `Portfolio` |
| `src/pages/contact.astro` | `Contact` |

- [ ] **Step 3: Verify build page count**

Run: `bun run build 2>&1 | grep -E "page\(s\) built|Complete"`
Expected: `7 page(s) built` and `Complete!`.

- [ ] **Step 4: Verify every route + active nav state on the dev server**

Start the dev server in the background (kill it by PID when done), then:

```bash
for route in / /about /team /initiatives /support /portfolio /contact; do
  printf "%s -> %s\n" "$route" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:4321$route")"
done
```
Expected: every route prints `200`.

```bash
for page in about team initiatives support portfolio contact; do
  printf "%s: %s\n" "$page" "$(curl -s "http://localhost:4321/$page" | grep -o '<a [^>]*aria-current="page"' | wc -l | tr -d ' ')"
done
printf "home: %s\n" "$(curl -s "http://localhost:4321/" | grep -o '<a [^>]*aria-current="page"' | wc -l | tr -d ' ')"
```
Expected: each of the six pages prints `1` (its own nav link is active); the homepage prints `0`. (The pattern is anchor-scoped on purpose: dev-server HTML inlines the page CSS unminified, so a bare `grep 'aria-current="page"'` would also match the Header's CSS attribute selector.)

Also verify the active link is the RIGHT one on a sample:
```bash
curl -s http://localhost:4321/team | grep -o '<a href="/team"[^>]*aria-current="page"'
```
Expected: one match containing `href="/team"` and `aria-current="page"`.

Kill the dev server; confirm nothing listens on 4321 afterwards.

- [ ] **Step 5: Commit**

```bash
git add src/components/StubPage.astro src/pages
git commit -m "feat: add stub pages for all nav routes"
```

---

## Out of Scope (later plans)

- Real page content, portfolio filtering, contact form.
- Logo SVG integration (user exports from Figma later; `Logo.astro` picks it up) and favicon swap.
- woff2/subsetting pass.
