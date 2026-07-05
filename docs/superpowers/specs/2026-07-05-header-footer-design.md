# Shared Header/Footer & Site Chrome — Design Spec

**Date:** 2026-07-05
**Status:** Approved pending user spec review
**Depends on:** Base setup (merged): design tokens in `src/styles/global.css`, fonts via Fonts API, `BaseLayout.astro`

## Goal

Every page of the MC²+ site gets the shared chrome from the design file — sticky header with nav, orange footer — through one reusable implementation, plus stub pages so all routes resolve immediately.

## User decisions (recorded)

1. **Fully responsive** — mobile/tablet behavior is designed by us (the design file only has 1920px artboards).
2. **Logo**: the user exports the logo from Figma as SVG and drops it into the repo; the build must not block on it (styled text fallback until then).
3. **Sticky header** with a subtle shadow once scrolled.
4. **Stub pages** for all six nav routes now.
5. Footer's "Coming soon" and "Partners" items **link to `/contact`** until dedicated destinations exist.
6. **Architecture: chrome lives inside `BaseLayout.astro`** — pages contain content only.

## Architecture

```
BaseLayout.astro
├─ <head> (existing: fonts, meta)
└─ <body>
   ├─ skip link → #main
   ├─ <Header />
   ├─ <main id="main"><slot /></main>
   └─ <Footer />
```

New files:

| File | Responsibility |
|---|---|
| `src/components/Header.astro` | Sticky top bar: logo, nav, active state, mobile menu |
| `src/components/Footer.astro` | Orange footer: brand block, link columns, bottom bar |
| `src/components/Logo.astro` | Logo rendering + text fallback; shared by header/footer |
| `src/data/nav.ts` | Single source of truth for nav items |
| `src/pages/{about,team,initiatives,support,portfolio,contact}.astro` | Stub pages |

Modified: `src/layouts/BaseLayout.astro` (adds skip link, Header, `<main id="main">` around slot, Footer), `src/pages/index.astro` (drop its own `<main>` wrapper — BaseLayout now provides it), `src/styles/global.css` (container/utility tokens only as needed).

## Component specs

### `src/data/nav.ts`

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

Header renders all six. Footer EXPLORE renders the first five (per design); Footer ENGAGE is footer-local data (below).

### `Logo.astro`

- Props: `variant?: "header" | "footer"` (default `"header"`).
- If `src/assets/logo.svg` exists (build-time check via `import.meta.glob`), render it (footer uses `src/assets/logo-footer.svg` if present, else the same file).
- Fallback (no file yet): text logo — "mc²" in `--font-display` `--color-ink` with a superscript 2, plus an orange `+` accent. Sizing comes from the consumer's CSS (header renders it ~40px tall, footer ~56px), so one component serves both.
- When the real SVG lands, `public/favicon.svg` is also replaced with it (or a mark-only variant if the user provides one) — this closes the "Astro-logo favicon" follow-up from the base-setup review.

### `Header.astro`

- `position: sticky; top: 0` on cream background (`--color-cream`), hairline bottom border (`--color-line`), `z-index` above page content.
- Scrolled state: a ~5-line inline script toggles a `.scrolled` class (adds a soft shadow) when `window.scrollY > 0`. No framework.
- Left: `<Logo />` wrapped in a link to `/` (aria-label "MC²+ home").
- Right (≥1024px): nav links from `NAV_ITEMS` — uppercase, Sora, small size (~0.8rem), letter-spacing ~0.08em, color `--color-ink`; hover → `--color-orange`; active page → `--color-orange` + `aria-current="page"`.
- **Active rule:** normalize trailing slashes; active when `Astro.url.pathname === item.href` or `pathname.startsWith(item.href + "/")` (keeps PORTFOLIO active on future `/portfolio/<venture>` pages). Home (`/`) has no nav item; only the logo links home.
- Mobile (<1024px): nav hidden; hamburger `<button>` (three-line icon, `aria-expanded`, `aria-controls`) toggles a full-width dropdown panel below the header containing the same links stacked. Panel closes on link click and on Escape. Inline vanilla script; no dependencies.

### `Footer.astro`

- Full-width band `--color-orange`, text `--color-ink`.
- Layout ≥768px: grid — left brand block (~50%), right two link columns.
  - Brand block: `<Logo variant="footer" />` + mission paragraph, verbatim:
    > Multiply. Collaborate. Create. India's flagship energy innovation platform – a Section 8 not-for-profit, initiated by the Ministry of Petroleum & Natural Gas and backed by energy majors.
  - Column "EXPLORE" (heading: uppercase, letter-spaced, `--color-cream`): first five `NAV_ITEMS`.
  - Column "ENGAGE" (same heading style): `Coming soon → /contact`, `Contact → /contact`, `Partners → /contact` (footer-local array; revisit when real destinations exist).
- Bottom bar, separated by a hairline in a darker/translucent ink tone: left "© 2026 MC²+ Foundation · New Delhi, India", right "Multiply · Collaborate · Create".
- <768px: brand block stacks above the two link columns (which stay side by side); bottom bar wraps to two lines.

### Container pattern

Shared `.container` utility in `global.css`: `max-width: 1760px; margin-inline: auto; padding-inline: clamp(1.25rem, 4vw, 5rem);` — matches the ~85px gutters of the 1920px artboards. Header inner row and footer inner content both use it; future page sections reuse it.

### Stub pages

Each of the six stubs: `BaseLayout` with title `"<Page name> · MC²+"` (e.g. "About · MC²+") + centered block — gray letter-spaced eyebrow "MC²+", `h1` = page name (Faculty Glyphic), one Sora line "This page is being built — check back soon." Deleted/replaced as real pages land. `index.astro` placeholder stays as-is (minus its `<main>` wrapper).

## Accessibility

- Skip link ("Skip to content" → `#main`), visually hidden until focused.
- `<nav aria-label="Main">` landmark; `aria-current="page"` on active link.
- Hamburger is a real `<button>` with `aria-expanded`/`aria-controls`; Escape closes; focus stays usable (no focus trap needed for a non-modal dropdown).
- Color contrast: navy on cream and navy on orange both clear WCAG AA at the sizes used.

## Error handling / edge cases

- Missing logo file → text fallback renders; build must succeed either way.
- Trailing-slash URLs must not break the active state (normalize before compare).
- JS disabled → desktop nav fully usable (pure CSS); mobile menu button inert — acceptable for now, noted as a future enhancement (CSS-only fallback) if analytics warrant.

## Verification

1. `bun run build` exits 0; 7 pages built (index + 6 stubs, nothing else).
2. Every route curls 200 on the dev server: `/`, `/about`, `/team`, `/initiatives`, `/support`, `/portfolio`, `/contact`.
3. Each built stub page's HTML contains exactly one `aria-current="page"` — on its own nav link; `/` has none.
4. Human visual pass: desktop ≥1280px and narrow ~390px (hamburger works, footer stacks).

## Out of scope

- Real page content (next phases), portfolio filtering, contact form.
- woff2/subsetting pass (recorded follow-up).
- CSS-only mobile menu fallback for no-JS.

## Open items

- **User action:** export logo SVG from Figma → drop in repo (any location; implementation moves it to `src/assets/logo.svg`; optional `logo-footer.svg` variant, optional mark-only favicon variant).
