# Team Page — Design Spec

**Goal:** Build the MC²+ **Team** (`/team`) route as an exact replica of the Figma design (file `u4NLOVKuXUTKULhSn0sAJQ`, frame `1:11940` "Desktop", 1920×4840), responsive below desktop per our established rules. Same method and fidelity bar as the About page.

**Branch:** `feat/team-page` (cut from `main` after About merged, so `PillButton`, tokens, and chrome are already present).

## The design source (read this first)

Same Illustrator import as home/about: many vector nodes, only ~40 real text nodes in this frame, no auto-layout, **no Figma variables**. Therefore:
- **Heading typography** survives as real text nodes → exact styles via `get_design_context` (captured below).
- **Body/description/role-label/subheading text** is outlined into vectors → **copy is transcribed verbatim from high-res screenshots** (done, below); sizes derived from bounding boxes + the captured scale.
- **Person photos** are raster image fills inside cards → export by node ID with `download_assets` (they are grayscale square/portrait crops).
- **Colors** read from `get_design_context` fills; never eyeballed.
- Content lives in child frame `1:11941` "team test 1". Header group (`1:13481`, y0–110) and Footer are rendered by existing chrome — NOT rebuilt.

## Verified type scale (from `get_design_context`)

| Role | Font | Size | Color | Notes |
|---|---|---|---|---|
| Hero H1 (3 lines) | Faculty Glyphic | **80px** | `#1e1e3e`; accent words `#ff7400` | nodes `1:13357/1:13358/1:13359`; accents are inline spans ("speed", "accountability") |
| Eyebrows ("TEAM & GOVERNANCE", "GOVERNANCE", "GUIDANCE", "OPERATING TEAM") | Faculty Glyphic | **27.07px** | **`#ff7400`** (bright orange) | letter-spacing ≈6.77px; nodes `1:13353`, `1:12888`, `1:12978`, `1:13349` |
| Section H2 ("Board of Directors", "Advisory Board", "A lean team built to deliver.", "Want to build with this team?") | Faculty Glyphic | **65px** | `#1e1e3c` | nodes `1:12889`, `1:12979`, `1:13350`, `1:12483` |
| Person name | Faculty Glyphic | **≈30.1px** | `#1e1e3e` | e.g. `1:13081`, `1:12595` |
| Role/dept label (uppercase, tracked) | Faculty Glyphic | **≈14.88px** | `#949494` (≈`--color-gray`) | letter-spacing ≈1.49px; e.g. `1:13125` |
| Subheadings / descriptions / lede | Sora | ~20–31px (derive from bbox per section) | body `#1e1e3e`/`#1e1e3c`, muted subheads `#959595`-ish | outlined — verify exact px per section |

## New shared token (this page introduces it)

Team uses a **second, brighter orange `#ff7400`** for eyebrows, H1 accent words, and the decorative sparks/dividers (About's brand orange is `#f37d2c` = `--color-orange`). Add to `:root` in `src/styles/global.css`:
```css
  --color-orange-bright: #ff7400;  /* team-page eyebrows, H1 accents, sparks (Figma 1:12888 etc.) */
```
*(Coordination: the `/initiatives` agent may also edit `global.css`; this addition is additive — resolve any merge conflict by keeping both tokens.)*

## Page architecture

`src/pages/team.astro` replaces the current `<StubPage name="Team" />` and composes sections through `BaseLayout` (`title="Team · MC²+"`), mirroring `about.astro`. Sections are focused, no-prop components in `src/components/team/`. `PillButton` (already on `main`) is reused.

```
src/
├── assets/team/                  # exported in Task 1: photos, curves, sparks, chevron
├── components/team/
│   ├── TeamHero.astro
│   ├── BoardOfDirectors.astro
│   ├── AdvisoryBoard.astro
│   ├── OperatingTeam.astro
│   └── TeamCta.astro
├── pages/team.astro              # composes the sections
└── styles/global.css             # +1 token (--color-orange-bright)
```

## Sections (copy is verbatim from the design)

### 1. `TeamHero.astro` — y≈311–860 (eyebrow `1:13353`, H1 group `1:13356`, lede `1:13360`, curves `1:13475`)
- Eyebrow (`#ff7400`, tracked, centered): `TEAM & GOVERNANCE`
- H1 (Faculty 80px `#1e1e3e`, centered, 3 lines; accent words `#ff7400`):
  `Leadership` / `built for `**`speed`** / `and `**`accountability`**`.`
- Lede (Sora, centered): `A board that carries national gravitas, an advisory bench deep in energy and deep-tech, and an operating team that moves like a startup.`
- Scroll chevron centered below; orbital curves + sparks behind (absolute, `overflow:hidden`), same pattern as About/home hero. Curve `1:13475` may bake in its sparks (as About's did — verify).

### 2. `BoardOfDirectors.astro` — y≈1162–1900 (header `1:12887`, cards `1:13078`)
- Eyebrow (`#ff7400`): `GOVERNANCE`
- H2 (Faculty 65px): `Board of Directors`
- Subheading (Sora, muted, centered): `Nominee directors from the seven energy majors, chaired from the Ministry of Petroleum & Natural Gas.`
- 5 director cards, **photo-left (square grayscale, cream border) + text-right**, laid out **3 in row 1, 2 in row 2**. Each card has a small `#ff7400` spark at the photo's top-left corner. Card text = name (Faculty ≈30px) + role label (uppercase gray tracked) + description (Sora):
  1. `Dr. Neeraj Mittal` / `CHAIRMAN & DIRECTOR` / `Secretary, Ministry of Petroleum and Natural Gas`
  2. `Shri Vikas Kaushal` / `DIRECTOR` / `Chairman & Managing Director, HPCL`
  3. `Shri Sanjay Khanna` / `DIRECTOR` / `Chairman & Managing Director, BPCL`
  4. `Shri Akshay Kumar Singh` / `DIRECTOR` / `Managing Director and Chief Executive Officer, Petronet LNG Ltd.`
  5. `Shri Sandeep Maheshwari` / `DIRECTOR & CHIEF EXECUTIVE OFFICER` / `Executive Director, Corporate Strategy & Business Development, HPCL`

### 3. `AdvisoryBoard.astro` — y≈2012–2660 (header `1:12977`, cards `1:12592`)
- Eyebrow (`#ff7400`): `GUIDANCE`
- H2 (Faculty 65px): `Advisory Board`
- Subheading (Sora, muted, centered): `Independent experts across energy, deep-tech research and public policy who guide theme strategy and selection.`
- 4 advisor cards, **photo-top (square grayscale) + name + description, centered**, one row of 4:
  1. `Dr. Abhay Karandikar` / `Member, NITI Aayog. Former Secretary, Department of Science & Technology, Government of India`
  2. `Dr. Madhukar Garg` / `Former President, R&D, Refining and Petrochemicals, Reliance Industries Ltd.`
  3. `Shri Neelkanth Mishra` / `Chief Economist, Axis Bank; Head of Global Research and Board member, Axis Capital`
  4. `Dr. Pawan Goenka` / `Chairperson, IN-SPACe, Department of Space, Government of India`
- `#ff7400` spark centered below the row.

### 4. `OperatingTeam.astro` — y≈2820–3630 (header `1:13348`/`1:13349`, cards group `1:11944`)
- Eyebrow (`#ff7400`): `OPERATING TEAM`
- H2 (Faculty 65px, centered): `A lean team built to deliver.`
- 6 role cards in a **plus/cross grid**: row 1 has 4 cells (cols 1–4), row 2 has 2 cells (cols 2 & 3). Thin hairlines between cells with `#ff7400` sparks at the grid-line intersections (same visual family as About's Scale dividers). Each cell = title (Faculty ≈30px navy) + dept label (uppercase gray tracked) + description (Sora):
  1. `Chief Executive Officer` / `REPORTS TO THE STATUTORY BOARD` / `Sets platform strategy, owns alignment with the energy majors and is accountable to the Board for delivery.`
  2. `Chief Incubation Officer` / `PROGRAMMES, GRANTS AND COHORTS` / `Runs incubation end to end, from sourcing and selection through mentorship and venture readiness.`
  3. `Manager, Programmes` / `COHORT DELIVERY` / `Designs the cohort journey and matches ventures to live energy major challenge briefs and pilots.`
  4. `Manager, Partnerships` / `ENERGY MAJORS AND NODES` / `Builds and manages the network of energy majors, IITs and research labs that host and mentor ventures.`
  5. (row 2, col 2) `Manager, Grants` / `NON-DILUTIVE FUNDING` / `Administers grant flows and milestone-linked disbursement to incubated ventures.`
  6. (row 2, col 3) `Finance Manager` / `CONTROLS AND COMPLIANCE` / `Owns financial controls, Section 8 compliance and fund administration across the platform.`

### 5. `TeamCta.astro` — y≈3851–4110 (group `1:12481`)
- H2 (Faculty 65px, centered): `Want to build with this team?`
- Paragraph (Sora, muted, centered): `We're hiring operators and onboarding mentors as Cohort 1 spins up.`
- Two **filled** pills (centered): `Get in touch` → `/contact`, `Explore initiatives` → `/initiatives`. Decorative `#ff7400` sparks per design.

## Assets → `src/assets/team/`
Exported by node ID in Task 1, verified visually:
- `hero-curves.svg` (orbital line art `1:13475`; split L/R if separate)
- `spark-orange.svg` (4-point star — export the team spark; expect fill `#ff7400`, verify)
- `scroll-arrow.svg` (down chevron)
- Director photos (grayscale): `dir-neeraj.png`, `dir-vikas.png`, `dir-sanjay.png`, `dir-akshay.png`, `dir-sandeep.png`
- Advisor photos (grayscale): `adv-abhay.png`, `adv-madhukar.png`, `adv-neelkanth.png`, `adv-pawan.png`
Export photos from their Figma card nodes (do NOT rely on `MC2_AllPages_Folder/Links/`, whose "Vishal.png" ambiguously maps to Vikas Kaushal — match each photo to its person by card position in Figma).

## Responsive (our decision — the design is desktop-only)
Desktop ≥1024px matches Figma. Below:
- Hero H1 `clamp()`; lede max-width relaxes; curves scale/crop.
- Board: 3+2 photo-left cards → 2 columns → single column (photo-left holds until narrow, then photo-top/stack).
- Advisory: 4 columns → 2×2 → single column.
- Operating: plus-grid 4→ 2×2 → single column (hairlines/sparks drop when stacked).
- CTA: pills stack on narrow. Nothing removed at any width.
Hover states minimal/consistent with chrome.

## Deviations to document in-code
1. Responsive behavior + hover states are ours (design is desktop-only).
2. Orange-on-cream accent text (eyebrows, H1 accents, `#ff7400` on cream) — same **known deferred WCAG contrast** item as About; replicate design colors, do not "fix".
3. Copy kept byte-for-byte.
4. Role label color `#949494` may be rendered via `--color-gray` (`#959595`, imperceptible delta) or a documented literal — implementer's call, documented.

## Verification
- `bunx astro check` clean; `bun run build` exit 0 (7 pages).
- Copy-fidelity grep over `dist/team/index.html` for each verbatim string (count ≥ 1).
- All 7 routes 200; the Team page's anchor-scoped `aria-current="page"` count is 1; header/footer render.
- Full-frame Figma screenshot of `1:11940` saved for side-by-side human review vs `http://localhost:4321/team` at 1920px.

## Out of scope
- Other inner pages (Initiatives — another agent; Support, Portfolio, Contact — later).
- Scroll animations/motion; contrast remediation (deferred); deploy.
