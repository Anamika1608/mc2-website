# Press Releases page — design spec

Date: 2026-07-10 · Status: approved by user (brainstorm session) · Branch: `feat/press-releases-page`

## Purpose

A new "Press releases" page for the MC²+ site: a simple hub of press-release thumbnails, each
linking to its PDF. Content migrated verbatim from the previous site
(https://mc2plus.in/press-release/), which currently holds exactly one release. No Figma exists
for this page — it must match the design system the rest of the site already follows.

## Route, naming, navigation

- URL: **`/press-releases`** (user choice; clean plural matching `/initiatives` style).
- Label: **"Press releases"** (sentence case) in both header and footer (user directive). The
  header's CSS uppercases nav labels for display; the footer renders them as stored — one data
  entry serves both.
- Header: append `{ label: "Press releases", href: "/press-releases" }` to `NAV_ITEMS`
  (`src/data/nav.ts`) — the header renders NAV_ITEMS then the hardcoded external Apply pill, so
  the new item lands exactly "just before the Apply button" (user directive). Footer's EXPLORE
  column is `NAV_ITEMS.slice(0, 5)` and is therefore unaffected; add the same entry to the
  footer's `ENGAGE` array (`src/components/Footer.astro`) for the footer placement.
- Risk to verify: 7 header items + Apply at 1024–1366px must not wrap/overflow.

## Page composition

`src/pages/press-releases.astro` (BaseLayout, `title="Press Releases · MC²+"`) composing two new
components under `src/components/press/`:

### 1. `PressHero.astro`

The sitewide hero pattern, structurally cloned from ContactHero (the simplest current hero):
- Eyebrow `PRESS RELEASES`, hairline underline, H1 in a single `reveal-line` with `RevealStar`,
  lede as `reveal-rise`, scroll chevron. Same fonts/tokens/sizes/animation classes as the other
  heroes (no new vocabulary), including the ≤767.98px lede centering convention.
- Copy (adapted from the old site):
  - H1: `Press releases.`
  - Lede: `Announcements and updates from MC²+ and India's oil & gas sector partners.`
    (old site wrote "MC² Plus"; the new site's own convention is "MC²+".)
- Decorative curves: reuse an existing hero-curves treatment only if one drops in cleanly
  (Contact hero's asset + orbit CSS); if it fights the layout, ship the hero clean — decoration
  is not a requirement here.

### 2. `PressGrid.astro` + `src/data/press.ts`

- Data module exporting `RELEASES: { title, date, summary, cover (astro asset import), pdf }[]`.
  One entry today:
  - title: `Oil India Limited (OIL) and Petroleum Technology Research Centre (PTRC), Canada sign
    a Collaboration Framework at the Global Energy Show 2026, Calgary`
  - date: `11 June 2026`
  - summary (verbatim from old site): `Oil India Limited (OIL) and Petroleum Technology Research
    Centre (PTRC), Canada sign a Collaboration Framework at the Global Energy Show 2026,
    Calgary, with mc²+ identified as the designated platform for collaborative startup research.`
  - cover: `src/assets/press/press-cover.jpg` (1000×845, downloaded from the old site)
  - pdf: `/press/oil-ptrc-collaboration-2026-06-11.pdf`
- Grid: responsive card grid — 3 columns desktop, 2 at ≤1023.98px, 1 at ≤639.98px (the site's
  established breakpoints; AdvisoryBoard grid conventions for gaps). One card renders today;
  future releases are one data entry + two asset files.
- Card anatomy: cover thumbnail (via `astro:assets` `<Image>`), date in the small label style,
  title in `--font-display`, one-line summary in body style. The WHOLE card is one `<a>` to the
  PDF, `target="_blank" rel="noopener"` (advisor-PDF precedent); title underlines on
  hover/focus-visible as the affordance.

## Assets (already downloaded & content-verified)

- `public/press/oil-ptrc-collaboration-2026-06-11.pdf` — 2-page OIL press release (verified by
  reading page 1: "Collaboration framework between the Petroleum Technology Research Centre
  (PTRC), Canada and Oil India Limited (OIL)", dated June 11 2026).
- `src/assets/press/press-cover.jpg` — the release's cover image from the old site.

## Out of scope

- No CMS/markdown pipeline; a data array is deliberate YAGNI for a page with one item.
- No per-release detail pages — cards link straight to PDFs (user: "just a page with a few
  thumbnails").
- No redirect from the old `/press-release` path.

## Verification

`bunx astro check` (0 errors); Playwright at 1920/1366/1024/768/390px: header nav doesn't
wrap/overflow with 7 items, hero matches sibling heroes' anatomy, card links to the PDF
(HTTP 200, `target="_blank"`), no horizontal overflow anywhere; `bun run build` (now 8 pages);
PDF present in `dist/press/`. Commit on `feat/press-releases-page`; no push/merge until the user
confirms.
