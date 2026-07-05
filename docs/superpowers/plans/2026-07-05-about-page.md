# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MC²+ **About** page as an exact replica of the Figma design (file `u4NLOVKuXUTKULhSn0sAJQ`, frame `1:8060` "Desktop", 1920×4673), responsive below desktop per our established rules.

**Architecture:** Six section components under `src/components/about/` composed by `src/pages/about.astro` (replacing the current `<StubPage>`), plus one shared `PillButton.astro` (with a new `variant` prop). Assets (curves, sparks, chevron, sponsor logos, video still) are exported from Figma once in Task 1 and consumed as local files. The already-built site chrome (Header/Footer/BaseLayout/tokens) is untouched.

**Tech Stack:** Astro 7.0.6, Bun, scoped Astro styles + existing tokens in `src/styles/global.css`, Figma MCP (`mcp__plugin_figma_figma__*` tools) as the design source. No test runner — verification is `bunx astro check` + `bun run build` + `grep` copy sweeps + a Figma screenshot gate (same as the home-page plan).

## The design source (read this first)

The frame is an **Illustrator import**: 1494 vector nodes, only **17 real text nodes**, no auto-layout, **no Figma variables** (`get_variable_defs` → `{}`). That means:

- **Geometry** (positions, sizes, spacing): exact, from `get_metadata` / `get_design_context` on section nodes.
- **Heading typography**: survives as real text nodes → exact styles via `get_design_context` (captured values in the spec's type-scale table and repeated per task below).
- **Body paragraphs / captions / stat numbers**: outlined into vectors → **copy is given verbatim in each task** (already transcribed from the design); font sizes are **derived from bounding boxes** and the captured type scale — fetch the section screenshot and compute the px from the bbox, then document the value you used in a code comment.
- **Colors**: read fills from `get_design_context`; never eyeball. Every fill maps to an existing token — **no new tokens**.
- **Assets**: export by node ID with `download_assets`; `curl` the returned URL to disk immediately (URLs are short-lived); view each file to confirm it depicts the intended asset.

**Figma MCP access pattern for every implementer:** first load tools via ToolSearch `select:mcp__plugin_figma_figma__get_design_context,mcp__plugin_figma_figma__get_screenshot,mcp__plugin_figma_figma__get_metadata,mcp__plugin_figma_figma__download_assets`. File key is always `u4NLOVKuXUTKULhSn0sAJQ`. If the Figma tools are unavailable in your context, report BLOCKED at once; do not improvise from memory.

**Section → node map** (all inside frame `1:8060`; content lives in child frame `1:8061` "about test 1"):

| Section | Key nodes |
|---|---|
| Hero | eyebrow `1:9501`, H1 lines `1:9505`/`1:9506`/`1:9507` (group `1:9503`/`1:9504`), lede `1:9508`, curves group `1:9164`, sparks `1:9483`/`1:9487`/`1:9491` |
| Our Mission | group `1:8065` (heading `1:8066`, body `1:8067`) |
| The Vision | group `1:8261` (heading `1:8262`, body `1:8263`) |
| Video feature | video group `1:8194`, still `1:8195`, caption `1:8198` |
| Sponsor strip | group `1:8931` (heading `1:9126`, logos `1:9102`, captions `1:9000`), pills ghost `1:8932` / filled `1:8953`, spark `1:9496` |
| Scale | group `1:9174` (H2 `1:9177`/`1:9178`, intro `1:9179`), stats row `1:9306` (`1:9309` `4OO+`, `1:9354` `12+`, `1:9388` `Pan India`, `1:9429` `7`) |
| Header/Footer (built already) | `1:9623` / `1:9686` — do not rebuild |

## Verified heading type scale (from `get_design_context`)

- Hero H1: Faculty Glyphic **81.3px**, `#1e1e3c`; middle line "Energy Innovation" `#f37d2c`.
- Hero eyebrow "ABOUT": Faculty Glyphic **27.07px**, `#959595`, letter-spacing ≈6.77px (~0.25em), centered.
- Section H2s ("Our Mission" `1:8066`, "The Vision" `1:8262`, "Seven sponsors. One platform." `1:9126`, "The industrial weight behind"/"every venture." `1:9177`/`1:9178`): Faculty Glyphic **65px**, `#1e1e3c`.
- Stat number+unit ("4OO+" `1:9309`, "acres" `1:9310`, "12+", "Pan India", "7"): Faculty Glyphic **35.23px**, `#f37d2c`.

## Global Constraints

- Working directory `/Users/anamika/work/mc2-website`; all work on branch `feat/about-page` (already cut from clean `main`).
- Package manager: **Bun only** (`bun run dev|build`, `bunx astro check`) — never npm/npx/yarn/pnpm.
- Git commits: **plain messages only** (match the repo's existing history). **Never** add `Co-Authored-By: Claude ...` or "Generated with Claude Code" trailers.
- Colors via existing tokens in `src/styles/global.css` wherever a token matches the Figma fill exactly (`#1e1e3c`→`--color-ink-alt`, `#1e1e3a`→`--color-ink`, `#f37d2c`→`--color-orange`, `#959595`→`--color-gray`, `#f3f2eb`→`--color-cream`, `#e8e6da`→`--color-line`). A fill with no matching token is a one-off documented literal. **No new tokens are expected** — if a section needs one, add it to `:root` and say so in your report.
- Do NOT modify `src/components/Header.astro`, `Footer.astro`, `Logo.astro`, `BaseLayout.astro`, or `src/data/nav.ts`.
- Breakpoints: reuse the established desktop cut **≥1024px**; each task defines its `<1024` and `<768` stacking (the design is desktop-only; responsive adaptation is ours by prior user decision).
- Hover states are undefined in the static design — keep minimal (color/underline/arrow-nudge, consistent with existing chrome).
- The WCAG contrast issue on orange-on-cream accent text (H1 accent line, Vision orange callout, orange stat numerals) is a KNOWN deferred item (user decision) — replicate design colors; do NOT "fix" contrast.
- Copy is **byte-for-byte** as drawn, including `4OO+` (letter O's) and the plain `MC2+` in the video caption (user decision 2026-07-05). Note the hero lede uses superscript `MC²+`.
- Verify-don't-assume: if a fetched style contradicts this plan's stated values, the Figma data wins — note the correction in your report.

## Deviations from the design file (each needs a code comment at the site)

1. **Video** → placeholder `href` opening in a new tab (user approved 2026-07-05); real URL dropped in later.
2. **Responsive behavior + hover states** — designed by us (design is desktop-only).
3. **Orange-on-cream accent text** — KNOWN deferred contrast item; replicate design colors, don't fix.
4. Copy kept byte-for-byte (`4OO+`, `MC2+`).

## File Structure After This Plan

```
src/
├── assets/about/                        # Task 1 exports (names are the contract, listed in Task 1)
├── components/
│   ├── PillButton.astro                 # Task 2 — shared pill CTA with filled|ghost variants
│   └── about/
│       ├── AboutHero.astro              # Task 3
│       ├── Mission.astro                # Task 4
│       ├── VideoFeature.astro           # Task 5
│       ├── Vision.astro                 # Task 6 — composes VideoFeature
│       ├── SponsorStrip.astro           # Task 7 — uses PillButton ×2
│       └── Scale.astro                  # Task 8
└── pages/about.astro                    # Task 9 — composes the sections (replaces StubPage)
```

---

### Task 1: Figma asset export

**Files:**
- Create: `src/assets/about/*` (contract below)

**Interfaces:**
- Consumes: Figma MCP tools (fileKey `u4NLOVKuXUTKULhSn0sAJQ`).
- Produces (asset-name contract later tasks rely on):
  - `src/assets/about/hero-curves.svg` (orbital line art from `1:9164`; if it exports as separate left/right groups, save `hero-curves-left.svg`/`hero-curves-right.svg` and report)
  - `src/assets/about/spark-orange.svg`, and `spark-navy.svg` **only if a navy spark is actually present** (report which colors exist)
  - `src/assets/about/scroll-arrow.svg` (down chevron under the hero)
  - `src/assets/about/sponsor-hpcl.*`, `sponsor-ongc.*`, `sponsor-indianoil.*`, `sponsor-bpcl.*`, `sponsor-gail.*`, `sponsor-oilindia.*`, `sponsor-petronet.*` (`.svg` preferred; `.png` if the emblem is a raster fill — report which)
  - `src/assets/about/video-vision.png` (raster still from `1:8195`)

- [ ] **Step 1: Confirm branch and clean tree**

Run: `git branch --show-current && git status --porcelain`
Expected: `feat/about-page`, then empty status. Anything else → BLOCKED.

- [ ] **Step 2: Load Figma tools and locate exact asset nodes**

Load the tools (ToolSearch select, see access pattern above). Run `get_metadata` on the parent groups to find the smallest node that contains exactly each asset: curves `1:9164`; sparks `1:9483`/`1:9487`/`1:9491` (hero) and `1:9496` (sponsor divider) and the scale-section sparks under `1:9306`; the scroll chevron under the hero column `1:9499`; sponsor emblems under `1:9102`; the video still `1:8195`.

- [ ] **Step 3: Export and place assets**

For each identified node run `download_assets` (fileKey `u4NLOVKuXUTKULhSn0sAJQ`); `curl` the returned URL to the target path immediately. Vectors → `defaultFormat: "svg"`; the video still → `defaultFormat: "png"` (`defaultScale: 2`); a sponsor emblem that is a raster fill → save the raw source image as `.png`. Place per the contract above.

- [ ] **Step 4: Verify each asset**

View every downloaded file (Read renders images; for SVG confirm the XML is non-empty and — except the video still — contains no `<image` embeds). Confirm each depicts the intended asset (one spark, one chevron, one emblem, the curve art, the Dr Neeraj Mittal still). Re-export any that look wrong.

- [ ] **Step 5: Commit**

```bash
git add src/assets/about
git commit -m "feat: export about page figma assets"
```

---

### Task 2: Shared PillButton with variants

**Files:**
- Create: `src/components/PillButton.astro`

**Interfaces:**
- Consumes: tokens (`--color-ink`, `--color-orange`, `--color-white`, `--color-line`), `--font-sans`.
- Produces: `PillButton.astro` with props `{ label: string; href: string; variant?: "filled" | "ghost" }` (default `"filled"`). **filled** = navy pill, white label, orange circle + white right-arrow. **ghost** = transparent pill, navy hairline border, navy label, navy circle-outline + navy right-arrow. Reused by Task 7.

- [ ] **Step 1: Fetch exact pill styles**

`get_design_context` + `get_screenshot` on `1:8953` (filled "Explore initiatives") and `1:8932` (ghost "Meet the team"). Note paddings, height, corner radius, gap, arrow-circle diameter, border width/color. Use these to tune the values below; document any change in a code comment.

- [ ] **Step 2: Create `src/components/PillButton.astro`**

```astro
---
interface Props {
  label: string;
  href: string;
  variant?: "filled" | "ghost";
}
const { label, href, variant = "filled" } = Astro.props;
---

<a class:list={["pill", variant]} href={href}>
  <span class="pill-label">{label}</span>
  <span class="pill-arrow" aria-hidden="true">
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
      <path
        d="M2 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"></path>
    </svg>
  </span>
</a>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--font-sans);
    font-size: 0.95rem; /* confirm against 1:8953 / 1:8932 */
    text-decoration: none;
    border-radius: 999px;
    padding: 0.55rem 0.6rem 0.55rem 1.5rem;
    border: 1px solid transparent;
  }
  .pill-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    transition: transform 150ms ease;
  }
  .pill:hover .pill-arrow {
    transform: translateX(3px);
  }

  /* Filled — navy pill, white label, orange arrow circle (1:8953) */
  .pill.filled {
    background: var(--color-ink);
    color: var(--color-white);
  }
  .pill.filled .pill-arrow {
    background: var(--color-orange);
    color: var(--color-white);
  }

  /* Ghost — transparent pill, navy hairline border, navy arrow outline (1:8932) */
  .pill.ghost {
    background: transparent;
    color: var(--color-ink);
    border-color: var(--color-ink);
  }
  .pill.ghost .pill-arrow {
    background: transparent;
    color: var(--color-ink);
    border: 1px solid var(--color-ink);
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `bunx astro check 2>&1 | tail -5`
Expected: 0 errors, 0 warnings. (Nothing imports it yet — the check compiles the file standalone.)

- [ ] **Step 4: Commit**

```bash
git add src/components/PillButton.astro
git commit -m "feat: add pill button with filled and ghost variants"
```

**Coordination note (report, do not act):** the home agent also creates `PillButton` on `feat/home-page` (filled-only). If home's version lands on `main` first, merging this branch will conflict on this file — resolve by keeping this variant-aware superset.

---

### Task 3: AboutHero section

**Files:**
- Create: `src/components/about/AboutHero.astro`

**Interfaces:**
- Consumes: tokens, `.container`, assets `hero-curves.svg`, `spark-orange.svg` (and `spark-navy.svg` if present), `scroll-arrow.svg`.
- Produces: `AboutHero.astro` (no props).

- [ ] **Step 1: Fetch exact styles and geometry**

`get_design_context` on `1:9501` (eyebrow), `1:9505` (H1 line), `1:9508` (lede geometry); `get_screenshot` on `1:9164` (maxDimension 1536) for curve + spark placement. Binding facts (Figma wins on conflict):
- Eyebrow `ABOUT`: Faculty Glyphic 27px, `--color-gray`, letter-spacing ~0.25em, centered; hairline underline below (confirm width from the screenshot).
- H1 (Faculty 81.3px, `--color-ink-alt`, centered, three lines): `Where India's` / `Energy Innovation` (accent `--color-orange`) / `gets built.` — line-height ≈1.08 (baseline delta ~87.5px; confirm from node y-positions).
- Lede (Sora, centered, `--color-ink`, size from `1:9508` bbox ≈20px): `MC²+ exists with a single mandate: to catalyse Indian energy innovation and accelerate the country's energy security and transition.`
- Scroll chevron centered below the lede; thin orbital curves behind the hero (absolute) with 4-point sparks at intersections (positions as % of the curves SVG box, per the home-hero pattern).

- [ ] **Step 2: Create `src/components/about/AboutHero.astro`**

Structure (fill exact px from Step 1; keep the copy verbatim):

```astro
---
import HeroCurves from "../../assets/about/hero-curves.svg";
import SparkOrange from "../../assets/about/spark-orange.svg";
import ScrollArrow from "../../assets/about/scroll-arrow.svg";
---

<section class="hero">
  <div class="orbit" aria-hidden="true">
    <HeroCurves class="curves" />
    <SparkOrange class="spark spark-a" />
    <SparkOrange class="spark spark-b" />
    <SparkOrange class="spark spark-c" />
  </div>

  <div class="hero-inner">
    <p class="eyebrow">ABOUT</p>
    <div class="underline" aria-hidden="true"></div>

    <h1>
      <span class="line">Where India&rsquo;s</span>
      <span class="line accent">Energy Innovation</span>
      <span class="line">gets built.</span>
    </h1>

    <p class="lede">
      MC&sup2;+ exists with a single mandate: to catalyse Indian energy
      innovation and accelerate the country&rsquo;s energy security and
      transition.
    </p>

    <ScrollArrow class="scroll" aria-hidden="true" />
  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    background: var(--color-cream);
    padding-block: 6rem 4rem; /* confirm hero band height vs Figma y311→~1030 */
  }
  .orbit {
    position: absolute;
    inset: 0 0 auto 0;
    width: 100%;
    z-index: 0;
    pointer-events: none;
  }
  .curves { display: block; width: 100%; height: auto; }
  .spark { position: absolute; transform: translate(-50%, -50%); }
  /* spark-a/-b/-c left/top % from the 1:9164 screenshot; sizes ~1.9–2.7rem */

  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 55rem; /* center column; confirm from H1 line widths */
    margin-inline: auto;
    padding-inline: 1.25rem;
    text-align: center;
  }
  .eyebrow {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1.69rem; /* 27.07px */
    letter-spacing: 0.25em;
    color: var(--color-gray);
  }
  .underline {
    width: 8rem; /* confirm from design */
    height: 1px;
    margin: 1rem auto 2.5rem;
    background: #000; /* one-off literal if design shows black hairline; else --color-line */
  }
  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 5.08rem; /* 81.3px */
    line-height: 1.08;
    color: var(--color-ink-alt);
  }
  h1 .line { display: block; }
  h1 .accent { color: var(--color-orange); }
  .lede {
    max-width: 40rem; /* confirm from 1:9508 width */
    margin: 1.5rem auto 0;
    font-family: var(--font-sans);
    font-size: 1.25rem; /* 20px — confirm from bbox */
    line-height: 1.4;
    color: var(--color-ink);
  }
  .scroll { display: block; margin: 3rem auto 0; }

  @media (max-width: 1023.98px) {
    h1 { font-size: clamp(2.4rem, 7vw, 5.08rem); }
    .lede { max-width: 90%; }
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `bunx astro check 2>&1 | tail -5`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/AboutHero.astro
git commit -m "feat: add about hero section"
```

---

### Task 4: Mission section

**Files:**
- Create: `src/components/about/Mission.astro`

**Interfaces:**
- Consumes: tokens, `.container`, `spark-orange.svg` (if a decorative spark sits in this band).
- Produces: `Mission.astro` (no props).

- [ ] **Step 1: Fetch section context**

`get_design_context` + `get_screenshot` on `1:8065` (maxDimension 1536). Binding facts: heading `Our Mission` Faculty 65px `--color-ink-alt`, left column; body Sora (size from `1:8067` bbox ≈20px) `--color-ink`, right column. Capture the two-column x-positions (heading ends ~x561, body starts ~x600) to set the grid.

- [ ] **Step 2: Create `src/components/about/Mission.astro`**

```astro
---
---

<section class="mission">
  <div class="container grid">
    <h2>Our Mission</h2>
    <p class="body">
      Take energy ventures from idea to industrial deployment through
      unmatched access to infrastructure, capital, mentorship and market
      access.
    </p>
  </div>
</section>

<style>
  .mission { background: var(--color-cream); padding-block: 3rem; }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 22rem) minmax(0, 42rem);
    gap: 2.5rem;
    align-items: start; /* confirm alignment vs design */
  }
  h2 {
    font-family: var(--font-display);
    font-size: 4.06rem; /* 65px */
    color: var(--color-ink-alt);
  }
  .body {
    font-family: var(--font-sans);
    font-size: 1.25rem; /* 20px — confirm from bbox */
    line-height: 1.5;
    color: var(--color-ink);
    margin: 0;
  }
  @media (max-width: 1023.98px) {
    .grid { grid-template-columns: 1fr; gap: 1rem; }
    h2 { font-size: clamp(2.4rem, 6vw, 4.06rem); }
  }
</style>
```

- [ ] **Step 3: Verify** — `bunx astro check 2>&1 | tail -5` → 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/Mission.astro
git commit -m "feat: add about mission section"
```

---

### Task 5: VideoFeature component

**Files:**
- Create: `src/components/about/VideoFeature.astro`

**Interfaces:**
- Consumes: tokens, `astro:assets` `<Image>`, asset `video-vision.png`.
- Produces: `VideoFeature.astro` (no props) — caption block + clickable video still with a play overlay, linking to a placeholder URL in a new tab. Consumed by Task 6.

- [ ] **Step 1: Fetch context**

`get_design_context` + `get_screenshot` on `1:8194` (still, maxDimension 1536) and `1:8198` (caption). Binding facts: caption line 1 `Watch the Vision:` orange (`--color-orange`), lines 2–3 Sora `--color-ink`/`--color-gray` (confirm): `Dr Neeraj Mittal, Secretary,` / `MoP&NG, on why MC2+ exists`. Still is `~907×459` (from `1:8190`); caption sits to its left near the bottom.

- [ ] **Step 2: Create `src/components/about/VideoFeature.astro`**

```astro
---
import { Image } from "astro:assets";
import videoStill from "../../assets/about/video-vision.png";

// TODO: real "Watch the Vision" video URL; placeholder approved by user 2026-07-05
const VIDEO_URL = "#";
---

<section class="video-feature">
  <div class="container layout">
    <div class="caption">
      <p class="caption-title">Watch the Vision:</p>
      <p class="caption-sub">Dr Neeraj Mittal, Secretary,<br />MoP&amp;NG, on why MC2+ exists</p>
    </div>

    <a
      class="thumb"
      href={VIDEO_URL}
      target="_blank"
      rel="noopener"
      aria-label="Watch the Vision — Dr Neeraj Mittal, Secretary MoP&NG, on why MC²+ exists (opens in a new tab)"
    >
      <Image src={videoStill} alt="" widths={[600, 907, 1814]} class="thumb-img" />
      <span class="play" aria-hidden="true">
        <svg viewBox="0 0 68 68" width="68" height="68"><circle cx="34" cy="34" r="34" fill="rgba(30,30,58,0.72)" /><path d="M28 24l18 10-18 10z" fill="#fff" /></svg>
      </span>
    </a>
  </div>
</section>

<style>
  .video-feature { background: var(--color-cream); padding-block: 2rem 4rem; }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 18rem) minmax(0, 56rem);
    gap: 2.5rem;
    align-items: end; /* caption sits low, near the still's bottom — confirm */
  }
  .caption-title {
    font-family: var(--font-sans);
    color: var(--color-orange);
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
  }
  .caption-sub {
    font-family: var(--font-sans);
    color: var(--color-ink);
    line-height: 1.5;
    margin: 0;
  }
  .thumb {
    position: relative;
    display: block;
    border-radius: 0; /* confirm radius from design */
    overflow: hidden;
  }
  .thumb-img { width: 100%; height: auto; display: block; }
  .play {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    transition: transform 150ms ease;
  }
  .thumb:hover .play { transform: scale(1.05); }

  @media (max-width: 1023.98px) {
    .layout { grid-template-columns: 1fr; gap: 1.25rem; align-items: start; }
  }
</style>
```

- [ ] **Step 3: Verify** — `bunx astro check 2>&1 | tail -5` → 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/VideoFeature.astro
git commit -m "feat: add about video feature with placeholder link"
```

---

### Task 6: Vision section

**Files:**
- Create: `src/components/about/Vision.astro`

**Interfaces:**
- Consumes: tokens, `.container`, `VideoFeature` (no props).
- Produces: `Vision.astro` (no props).

- [ ] **Step 1: Fetch section context**

`get_design_context` + `get_screenshot` on `1:8261` (maxDimension 1536). Binding facts: heading `The Vision` Faculty 65px `--color-ink-alt`, left column; three body paragraphs right column (Sora, size from `1:8263` bbox ≈20px). P1/P2 `--color-ink`; P3 **bold `--color-orange`** (confirm weight from screenshot). Two-column geometry matches Mission.

- [ ] **Step 2: Create `src/components/about/Vision.astro`** (copy verbatim)

```astro
---
import VideoFeature from "./VideoFeature.astro";
---

<section class="vision">
  <div class="container grid">
    <h2>The Vision</h2>
    <div class="body">
      <p>
        MC&sup2;+ is India&rsquo;s commitment to backing the founders,
        researchers, and builders creating the technologies that will define
        India&rsquo;s energy future. By opening up the infrastructure, capital,
        piloting sites, and expertise of India&rsquo;s largest energy majors, we
        are creating an unprecedented platform for energy entrepreneurship at a
        scale no single organization could offer alone.
      </p>
      <p>
        MC&sup2;+ brings HPCL, ONGC, Indian Oil, BPCL, GAIL, Oil India and
        Petronet LNG under one mandate. Where a startup once knocked on different
        doors hoping one would open, there is now a single, serious, well-funded
        door, backed by $232 billion in combined industrial scale.
      </p>
      <p class="accent">
        Our goal is to make India the world&rsquo;s most vibrant hub for energy
        innovations that define a secure, sustainable, globally competitive
        energy future.
      </p>
    </div>
  </div>
</section>

<VideoFeature />

<style>
  .vision { background: var(--color-cream); padding-block: 3rem; }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 22rem) minmax(0, 46rem);
    gap: 2.5rem;
    align-items: start;
  }
  h2 {
    font-family: var(--font-display);
    font-size: 4.06rem; /* 65px */
    color: var(--color-ink-alt);
  }
  .body { display: grid; gap: 1.25rem; }
  .body p {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 1.25rem; /* 20px — confirm from bbox */
    line-height: 1.5;
    color: var(--color-ink);
  }
  .body .accent { color: var(--color-orange); font-weight: 600; }
  @media (max-width: 1023.98px) {
    .grid { grid-template-columns: 1fr; gap: 1rem; }
    h2 { font-size: clamp(2.4rem, 6vw, 4.06rem); }
  }
</style>
```

- [ ] **Step 3: Verify** — `bunx astro check 2>&1 | tail -5` → 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/Vision.astro
git commit -m "feat: add about vision section"
```

---

### Task 7: SponsorStrip section

**Files:**
- Create: `src/components/about/SponsorStrip.astro`

**Interfaces:**
- Consumes: tokens, `.container`, `PillButton` (`label`/`href`/`variant`), `sponsor-*.{svg,png}`, `spark-orange.svg`, `astro:assets` `<Image>` for raster logos.
- Produces: `SponsorStrip.astro` (no props).

- [ ] **Step 1: Fetch section context**

`get_design_context` + `get_screenshot` on `1:8931` (maxDimension 2048). Binding facts: eyebrow `Promoted by India's leading energy majors` (Sora, muted `--color-gray`, centered — confirm font); H2 `Seven sponsors. One platform.` Faculty 65px `--color-ink-alt`, centered; 7 logos in one row with captions below (small Sora `--color-gray`); two pills centered below; orange spark under the pills.

- [ ] **Step 2: Create `src/components/about/SponsorStrip.astro`** (verbatim captions/alts)

```astro
---
import { Image } from "astro:assets";
import PillButton from "../PillButton.astro";
import SparkOrange from "../../assets/about/spark-orange.svg";
import hpcl from "../../assets/about/sponsor-hpcl.png";
import ongc from "../../assets/about/sponsor-ongc.png";
import indianoil from "../../assets/about/sponsor-indianoil.png";
import bpcl from "../../assets/about/sponsor-bpcl.png";
import gail from "../../assets/about/sponsor-gail.png";
import oilindia from "../../assets/about/sponsor-oilindia.png";
import petronet from "../../assets/about/sponsor-petronet.png";

// If Task 1 exported any emblem as .svg, import it as an inline component instead
// of via astro:assets and render it directly — adjust the matching item below.
const SPONSORS = [
  { img: hpcl, caption: "Hindustan Petroleum", alt: "Hindustan Petroleum Corporation" },
  { img: ongc, caption: "Oil & Natural Gas", alt: "Oil and Natural Gas Corporation" },
  { img: indianoil, caption: "Indian Oil Corp", alt: "Indian Oil Corporation" },
  { img: bpcl, caption: "Bharat Petroleum", alt: "Bharat Petroleum Corporation" },
  { img: gail, caption: "Gas Authority", alt: "GAIL (India) Limited" },
  { img: oilindia, caption: "Oil India Ltd", alt: "Oil India Limited" },
  { img: petronet, caption: "Petronet LNG", alt: "Petronet LNG Limited" },
];
---

<section class="sponsors">
  <div class="container">
    <p class="eyebrow">Promoted by India&rsquo;s leading energy majors</p>
    <h2>Seven sponsors. One platform.</h2>

    <ul class="logos">
      {SPONSORS.map((s) => (
        <li>
          <Image src={s.img} alt={s.alt} widths={[120, 240]} class="logo" />
          <span class="caption">{s.caption}</span>
        </li>
      ))}
    </ul>

    <div class="ctas">
      <PillButton label="Meet the team" href="/team" variant="ghost" />
      <PillButton label="Explore initiatives" href="/initiatives" variant="filled" />
    </div>

    <SparkOrange class="divider-spark" aria-hidden="true" />
  </div>
</section>

<style>
  .sponsors { background: var(--color-cream); padding-block: 3rem; text-align: center; }
  .eyebrow {
    font-family: var(--font-sans);
    color: var(--color-gray);
    font-size: 1.25rem; /* confirm */
    margin: 0 0 0.75rem;
  }
  h2 {
    font-family: var(--font-display);
    font-size: 4.06rem; /* 65px */
    color: var(--color-ink-alt);
    margin: 0 0 2.5rem;
  }
  .logos {
    list-style: none;
    margin: 0 0 2.5rem;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 1.5rem;
    align-items: end;
  }
  .logos li { display: grid; gap: 0.75rem; justify-items: center; }
  .logo { height: 3.75rem; width: auto; object-fit: contain; } /* confirm size */
  .caption { font-family: var(--font-sans); font-size: 0.8rem; color: var(--color-gray); }
  .ctas { display: flex; gap: 1.25rem; justify-content: center; flex-wrap: wrap; }
  .divider-spark { width: 1.5rem; height: 1.5rem; margin: 2rem auto 0; }

  @media (max-width: 1023.98px) {
    h2 { font-size: clamp(2.2rem, 6vw, 4.06rem); }
    .logos { grid-template-columns: repeat(4, 1fr); row-gap: 2rem; }
  }
  @media (max-width: 559.98px) {
    .logos { grid-template-columns: repeat(2, 1fr); }
    .ctas { flex-direction: column; align-items: center; }
  }
</style>
```

- [ ] **Step 3: Verify** — `bunx astro check 2>&1 | tail -5` → 0 errors, 0 warnings. (If any emblem was exported as `.svg`, adjust that import to an inline SVG component and re-run.)

- [ ] **Step 4: Commit**

```bash
git add src/components/about/SponsorStrip.astro
git commit -m "feat: add about sponsor strip section"
```

---

### Task 8: Scale section

**Files:**
- Create: `src/components/about/Scale.astro`

**Interfaces:**
- Consumes: tokens, `.container`, `spark-orange.svg`.
- Produces: `Scale.astro` (no props).

- [ ] **Step 1: Fetch section context**

`get_design_context` + `get_screenshot` on `1:9174` and `1:9306` (maxDimension 2048). Binding facts: eyebrow `THE SCALE BEHIND YOU` (letter-spaced, muted `--color-gray`, centered — confirm font); H2 two centered lines `The industrial weight behind` / `every venture.` Faculty 65px `--color-ink-alt`; intro (Sora, muted, centered): `Seven energy majors contribute infrastructure, domain mentorship, pilot sites and anchor demand, assets no standalone incubator can replicate.` Four stat columns divided by thin vertical hairlines (`--color-line` or a light orange, confirm) with small orange 4-point sparks at the hairline tops/bottoms. Each stat: orange Faculty 35.23px label (may wrap two lines) + gray Sora description. Confirm whether stat 4 shows a right-arrow glyph after `7`.

- [ ] **Step 2: Create `src/components/about/Scale.astro`** (verbatim)

```astro
---
import SparkOrange from "../../assets/about/spark-orange.svg";

const STATS = [
  { value: "4OO+", unit: "acres", desc: "Dedicated R&D campuses across the energy majors" },
  { value: "12+", unit: "", desc: "R&D centres and labs open to startups" },
  { value: "Pan India", unit: "", desc: "Refining, E&P, gas, LNG and retail operations" },
  { value: "7", unit: "", desc: "Balance sheets behind a single mandate", arrow: true },
];
---

<section class="scale">
  <div class="container">
    <p class="eyebrow">THE SCALE BEHIND YOU</p>
    <h2>The industrial weight behind<br />every venture.</h2>
    <p class="intro">
      Seven energy majors contribute infrastructure, domain mentorship, pilot
      sites and anchor demand, assets no standalone incubator can replicate.
    </p>

    <ul class="stats">
      {STATS.map((s) => (
        <li>
          <SparkOrange class="stat-spark" aria-hidden="true" />
          <p class="stat-value">
            {s.value}{s.unit && <><br />{s.unit}</>}{s.arrow && <span class="stat-arrow" aria-hidden="true"> &rarr;</span>}
          </p>
          <p class="stat-desc">{s.desc}</p>
        </li>
      ))}
    </ul>
  </div>
</section>

<style>
  .scale { background: var(--color-cream); padding-block: 4rem; text-align: center; }
  .eyebrow {
    font-family: var(--font-sans);
    color: var(--color-gray);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.95rem; /* confirm */
    margin: 0 0 1rem;
  }
  h2 {
    font-family: var(--font-display);
    font-size: 4.06rem; /* 65px */
    color: var(--color-ink-alt);
    margin: 0 0 1.5rem;
  }
  .intro {
    max-width: 44rem;
    margin: 0 auto 3rem;
    font-family: var(--font-sans);
    color: var(--color-gray);
    line-height: 1.5;
  }
  .stats {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    text-align: left;
  }
  .stats li {
    position: relative;
    padding: 2.5rem 1.5rem 0;
    border-left: 1px solid var(--color-line); /* confirm color; first item may have no left border */
  }
  .stats li:first-child { border-left: 0; }
  .stat-spark {
    position: absolute;
    top: -0.75rem;
    left: -0.75rem;
    width: 1.4rem;
    height: 1.4rem;
  }
  .stat-value {
    font-family: var(--font-display);
    font-size: 2.2rem; /* 35.23px */
    color: var(--color-orange);
    margin: 0 0 0.75rem;
    line-height: 1.1;
  }
  .stat-desc {
    font-family: var(--font-sans);
    color: var(--color-gray);
    line-height: 1.5;
    margin: 0;
  }
  @media (max-width: 1023.98px) {
    h2 { font-size: clamp(2.2rem, 6vw, 4.06rem); }
    .stats { grid-template-columns: repeat(2, 1fr); row-gap: 2.5rem; }
    .stats li:nth-child(odd) { border-left: 0; }
  }
  @media (max-width: 559.98px) {
    .stats { grid-template-columns: 1fr; }
    .stats li { border-left: 0; }
  }
</style>
```

- [ ] **Step 3: Verify** — `bunx astro check 2>&1 | tail -5` → 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/Scale.astro
git commit -m "feat: add about scale section"
```

---

### Task 9: Assemble the About page + fidelity verification

**Files:**
- Modify: `src/pages/about.astro` (replace the `<StubPage>` entirely)

**Interfaces:**
- Consumes: all six section components; `BaseLayout` `{ title, description? }`.

- [ ] **Step 1: Replace `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import AboutHero from "../components/about/AboutHero.astro";
import Mission from "../components/about/Mission.astro";
import Vision from "../components/about/Vision.astro";
import SponsorStrip from "../components/about/SponsorStrip.astro";
import Scale from "../components/about/Scale.astro";
---

<BaseLayout title="About · MC²+">
  <AboutHero />
  <Mission />
  <Vision />
  <SponsorStrip />
  <Scale />
</BaseLayout>
```

(`Vision` renders `VideoFeature` itself, so it is not imported here.)

- [ ] **Step 2: Copy-fidelity sweep on the built page**

```bash
bun run build
for s in "ABOUT" "Where India" "Energy Innovation" "gets built" "Our Mission" "The Vision" "232 billion" "Watch the Vision" "MC2+ exists" "Seven sponsors. One platform" "Meet the team" "Explore initiatives" "THE SCALE BEHIND YOU" "The industrial weight behind" "4OO+" "Pan India" "Balance sheets behind a single mandate"; do
  printf "%s: %s\n" "$s" "$(grep -c "$s" dist/about/index.html)"
done
```
Expected: build exit 0 (7 pages); every listed string count ≥ 1. Note `4OO+` and `MC2+` must appear literally (letter O's; plain "MC2+" in the caption).

- [ ] **Step 3: Route + chrome regression check**

Start the dev server (`bun run dev`, capture PID, kill when done). Verify:
- All 7 routes (`/`, `/about`, `/team`, `/initiatives`, `/support`, `/portfolio`, `/contact`) return 200.
- On `/about`, the About nav link is current: `curl -s localhost:4321/about | grep -o '<a [^>]*aria-current="page"[^>]*>[^<]*About' | wc -l` is `1`.
- Header and footer still render: `grep -c 'id="site-header"'` → 1, `grep -c '<footer'` → 1.

- [ ] **Step 4: Full-page visual reference for the human gate**

Fetch a fresh full-frame screenshot: `get_screenshot` nodeId `1:8060`, maxDimension 4096; curl to `.superpowers/sdd/figma-about-full.png`. Report its path so the user can compare it side-by-side with `http://localhost:4321/about` at 1920px width.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: assemble about page from section components"
```

---

## Out of Scope (later plans)

- The remaining inner pages (Team, Initiatives, Support, Portfolio, Contact) — same method, one plan each.
- Real "Watch the Vision" video URL and any video embed/analytics.
- Scroll animations/motion (none specified in the design).
- Contrast remediation (deferred), woff2 pass, Netlify deploy.
