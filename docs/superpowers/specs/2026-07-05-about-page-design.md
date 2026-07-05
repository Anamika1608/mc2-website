# About Page — Design Spec

**Goal:** Build the MC²+ **About** page as an exact replica of the Figma design (file `u4NLOVKuXUTKULhSn0sAJQ`, frame `1:8060` "Desktop", 1920×4673), responsive below desktop per our established rules. Same method and fidelity bar as the home page.

**Branch:** `feat/about-page` (cut from clean `main`).

## The design source (read this first)

The frame is an **Illustrator import** (like the home frame): 1494 vector nodes, only **17 real text nodes**, no auto-layout, **no Figma variables** (`get_variable_defs` → `{}`). Therefore:

- **Geometry** (positions, sizes, spacing): exact, from `get_metadata` / `get_design_context` on section nodes.
- **Typography of headings**: survives as real text nodes → exact styles via `get_design_context` (values captured below).
- **Body paragraphs / captions / stat numbers**: outlined into vectors → **copy is transcribed from high-res screenshots** (done, verbatim below); sizes derived from bounding boxes + the captured type scale.
- **Colors**: read from `get_design_context` fills; never eyeballed. Every fill seen so far maps to an existing token — **no new tokens required**.
- **Assets**: exported by node ID with `download_assets` (SVG for vectors; PNG for the raster video still), curled to disk immediately (URLs expire), and visually verified.

**Content lives in** child frame `1:8061` "about test 1" → `1:8062`/`1:8063` "Layer_1". The header group (`1:9623`, y0–110) and footer group (`1:9686`, y4103+) are rendered by our existing `Header.astro`/`Footer.astro` and are **not** rebuilt.

## Verified type scale (from `get_design_context`)

| Role | Font | Size | Color | Notes |
|---|---|---|---|---|
| Hero H1 (3 lines) | Faculty Glyphic | **81.3px** | `#1e1e3c` (`--color-ink-alt`); middle line `#f37d2c` (`--color-orange`) | nodes `1:9505/1:9506/1:9507` |
| Hero eyebrow "ABOUT" | Faculty Glyphic | **27.07px** | `#959595` (`--color-gray`) | letter-spacing ≈6.77px (~0.25em), centered; node `1:9501` |
| Section H2 ("Our Mission", "The Vision", "Seven sponsors. One platform.", "The industrial weight behind / every venture.") | Faculty Glyphic | **65px** | `#1e1e3c` | nodes `1:8066`, `1:8262`, `1:9126`, `1:9177/1:9178` |
| Stat number + unit ("4OO+", "acres", "12+", "Pan India", "7") | Faculty Glyphic | **35.23px** | `#f37d2c` | nodes `1:9309/1:9310`, `1:9354`, `1:9388`, `1:9429` |
| Body / lede / stat descriptions / eyebrows-2 | Sora | ~20px (derive from bbox in implementation) | `#1e1e3a`/`#1e1e3c` body, `#959595` for muted eyebrows/descriptions | outlined — verify exact px per section |

Line-height for the multi-line Faculty headings is derived from the baseline deltas of the stacked text nodes during implementation (hero lines sit ~87.5px apart at 81.3px ≈ 1.08).

## Page architecture

`src/pages/about.astro` replaces the current `<StubPage>` and composes sections through `BaseLayout` (`title="About · MC²+"`, default description), mirroring how `index.astro` composes the home page. Sections are focused, no-prop components in `src/components/about/`. The one shared primitive, `PillButton`, lives in `src/components/`.

```
src/
├── assets/about/                 # all About assets (exported in Task 1)
├── components/
│   ├── PillButton.astro          # shared, created here with variant prop
│   └── about/
│       ├── AboutHero.astro
│       ├── Mission.astro
│       ├── Vision.astro          # composes VideoFeature
│       ├── VideoFeature.astro
│       ├── SponsorStrip.astro
│       └── Scale.astro
└── pages/about.astro             # composes the sections
```

## Sections (copy is verbatim from the design)

### 1. `AboutHero.astro` — y≈311–835 (nodes `1:9499`, H1 `1:9503/1:9504`, lede `1:9508`, curves `1:9164`)
- Eyebrow: `ABOUT`
- H1 (3 centered lines, Faculty 81.3px): `Where India's` / `Energy Innovation` (orange accent line) / `gets built.`
- Lede (Sora, centered): `MC²+ exists with a single mandate: to catalyse Indian energy innovation and accelerate the country's energy security and transition.`
- Scroll chevron centered below.
- Orbital line-art curves + 4-point sparks behind the copy (absolute, `overflow:hidden` on the section), from `hero-curves.svg` + `spark-*.svg`. Exact curve geometry and spark positions from `1:9164` metadata/screenshot in implementation.

### 2. `Mission.astro` — y≈1230 (group `1:8065`, heading `1:8066`, body `1:8067`)
Two-column: heading left, body right.
- Heading (Faculty 65px): `Our Mission`
- Body (Sora, `--color-ink`): `Take energy ventures from idea to industrial deployment through unmatched access to infrastructure, capital, mentorship and market access.`
- Decorative spark(s) per design.

### 3. `Vision.astro` — y≈1506–2091 (group `1:8261`, heading `1:8262`, body `1:8263`)
Two-column: heading left, three paragraphs right; then composes `VideoFeature` below.
- Heading (Faculty 65px): `The Vision`
- P1 (Sora, `--color-ink`): `MC²+ is India's commitment to backing the founders, researchers, and builders creating the technologies that will define India's energy future. By opening up the infrastructure, capital, piloting sites, and expertise of India's largest energy majors, we are creating an unprecedented platform for energy entrepreneurship at a scale no single organization could offer alone.`
- P2 (Sora, `--color-ink`): `MC²+ brings HPCL, ONGC, Indian Oil, BPCL, GAIL, Oil India and Petronet LNG under one mandate. Where a startup once knocked on different doors hoping one would open, there is now a single, serious, well-funded door, backed by $232 billion in combined industrial scale.`
- P3 (Sora, **bold, `#f37d2c`**): `Our goal is to make India the world's most vibrant hub for energy innovations that define a secure, sustainable, globally competitive energy future.`

### 4. `VideoFeature.astro` — y≈2146–2694 (video group `1:8194`, still `1:8195`, caption `1:8198`)
Caption block (left) + video still thumbnail (right).
- Caption line 1 (orange): `Watch the Vision:`
- Caption lines 2–3 (Sora): `Dr Neeraj Mittal, Secretary,` / `MoP&NG, on why MC2+ exists` (verbatim — plain "MC2+" as designed).
- Still exported to `video-vision.png`; rendered as a clickable thumbnail with a play-button overlay. Wrapped in an `<a>` with a **placeholder `href`** (`#`-style TODO) and `target="_blank" rel="noopener"`, with an in-code comment: `<!-- TODO: real "Watch the Vision" video URL; placeholder approved by user 2026-07-05 -->`. Accessible label describing the video.

### 5. `SponsorStrip.astro` — y≈2755–3221 (group `1:8931`, heading `1:9126`, logos `1:9102`, pills `1:8932`/`1:8953`)
- Eyebrow (muted, centered): `Promoted by India's leading energy majors`
- H2 (Faculty 65px): `Seven sponsors. One platform.`
- Seven logo cards + captions, in order: `Hindustan Petroleum`, `Oil & Natural Gas`, `Indian Oil Corp`, `Bharat Petroleum`, `Gas Authority`, `Oil India Ltd`, `Petronet LNG`. Alt text = full company names.
- Two pills below (centered): `Meet the team` → `/team` (**ghost** variant), `Explore initiatives` → `/initiatives` (**filled** variant). Decorative spark below.

### 6. `Scale.astro` — y≈3409–4033 (group `1:9174`, H2 `1:9177/1:9178`, intro `1:9179`, stats `1:9306`)
- Eyebrow (muted, letter-spaced, centered): `THE SCALE BEHIND YOU`
- H2 (Faculty 65px, two centered lines): `The industrial weight behind` / `every venture.`
- Intro (Sora, muted, centered): `Seven energy majors contribute infrastructure, domain mentorship, pilot sites and anchor demand, assets no standalone incubator can replicate.`
- Four stat columns separated by thin vertical hairlines with small orange sparks at the line tops/bottoms (per screenshot). Each: orange Faculty label (may wrap two lines) + gray Sora description:
  1. `4OO+` `acres` — `Dedicated R&D campuses across the energy majors`
  2. `12+` — `R&D centres and labs open to startups`
  3. `Pan India` — `Refining, E&P, gas, LNG and retail operations`
  4. `7` (with a small right-arrow glyph, per design) — `Balance sheets behind a single mandate`

## Shared: `src/components/PillButton.astro`

Props `{ label: string; href: string; variant?: "filled" | "ghost"; newTab?: boolean }` (default `variant="filled"`).
- **filled**: navy bg (`--color-ink`), white Sora label, orange (`--color-orange`) circle with white right-arrow (inline SVG path, no asset file).
- **ghost**: transparent/cream bg, navy hairline border, navy label, navy arrow (outline; no filled circle) — matching the "Meet the team" pill.
- Exact paddings/sizes/arrow treatment come from the Figma pills (`1:8932` ghost, `1:8953` filled) during implementation.

**Coordination note:** the home agent also creates a `PillButton` on `feat/home-page` (filled-only). If that version lands on `main` first, merging `feat/about-page` will conflict on `src/components/PillButton.astro`; resolve by **keeping this variant-aware superset**. Flag at merge time.

## Assets → `src/assets/about/`
Exported by node ID in Task 1, verified visually:
- `hero-curves.svg` (orbital line art behind hero, from `1:9164`; split L/R if exported as separate groups)
- `spark-orange.svg`, `spark-navy.svg` (4-point stars — export whichever colors appear; navy only if present)
- `scroll-arrow.svg` (down chevron)
- `sponsor-hpcl.*`, `sponsor-ongc.*`, `sponsor-indianoil.*`, `sponsor-bpcl.*`, `sponsor-gail.*`, `sponsor-oilindia.*`, `sponsor-petronet.*` (svg preferred, png if raster — these are the same emblems as the home page)
- `video-vision.png` (raster still from `1:8195`)

## Responsive (our decision — the design is desktop-only)
Reuse the established breakpoint: desktop layout **≥1024px** matching Figma geometry. Below that, per section:
- Hero H1 uses `clamp()`; lede max-width relaxes; curves scale with the section (allow crop).
- Mission / Vision two-column layouts stack to a single column (heading above body).
- VideoFeature: caption stacks above (or below) the still; still goes full-width of the column.
- SponsorStrip: 7 logos wrap (e.g. 4+3), then 2-per-row on narrow; pills stack.
- Scale: 4 stat columns → 2×2 → single column; vertical hairlines drop on stacked layouts. No elements removed at any width.

Hover states are undefined in the static design — keep minimal and consistent with existing chrome (color/underline/arrow-nudge).

## Deviations to document in-code
1. **Video** → placeholder `href` opening in a new tab (approved by user 2026-07-05); real URL dropped in later.
2. **Responsive behavior + hover states** — designed by us (design is desktop-only).
3. **Orange-on-cream accent text** (H1 accent line, Vision orange callout, orange stat numerals) fails WCAG contrast — this is the **known deferred item** carried over from the home-page decision. Replicate the design colors; do **not** "fix" contrast.
4. Copy is kept **byte-for-byte** as drawn, including `4OO+` (letter O's) and the plain `MC2+` in the video caption (user decision 2026-07-05).

## Verification
- `bunx astro check` clean (0 errors, 0 warnings) for new files; `bun run build` exit 0 (8 pages).
- Copy-fidelity grep sweep over `dist/about/index.html` for each verbatim string above (count ≥ 1).
- Dev server: all 7 routes return 200; the About page's anchor-scoped `aria-current="page"` count is 1 (the About nav link); header (`id="site-header"`) and footer (`<footer`) still render.
- Full-frame Figma screenshot of `1:8060` saved to `.superpowers/…` for side-by-side human review against `http://localhost:4321/about` at 1920px.

## Out of scope
- The remaining inner pages (Team, Initiatives, Support, Portfolio, Contact) — later plans.
- Real video URL and any video analytics.
- Scroll animations/motion (none specified).
- Contrast remediation (deferred), woff2 pass, deploy.
