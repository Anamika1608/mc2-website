# Portfolio Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MC²+ Portfolio page as an exact replica of Figma frame `1:23922` (file `u4NLOVKuXUTKULhSn0sAJQ`, "Desktop", 1920×5068) — the site's first data-driven, interactive page: a venture list filterable by backer and sector.

**Architecture:** A typed dataset (`src/data/ventures.ts`, 50 ventures extracted from the previous website — user-designated content source) drives an `Explorer` section (filter chips + venture rows + client-side filtering script). Hero/info-bar and a dual-CTA band are static sections. Components under `src/components/portfolio/`, composed by `src/pages/portfolio.astro` (replacing the stub). Chrome untouched.

**Tech Stack:** Astro 7.0.6, Bun, scoped styles + tokens, vanilla TS component script (house pattern), Figma MCP as the design source.

## The design source & the captured-state insight (read first)

Frame `1:23922` is an Illustrator import (1628 vectors, 39 real text nodes; content group `1:23924`). Critically, **the artboard captures an INTERACTION STATE, not the landing state**: the backer filter shows GAIL selected (orange chip), the list shows exactly GAIL's 9 ventures, and one row (Xyma Analytics) is captured in its HOVER state (dark photo band — the page's only raster, rounded-rect `1:23932`).

Consequences (all controller-adjudicated, documented deviations where applicable):
- **Landing state is All/All** (sensible default; the artboard state is reachable by clicking GAIL). This is the same class of adaptation as rendering hover states.
- **The fidelity gate runs IN the captured state**: set backer=GAIL in the built page and compare against `figma-portfolio-full.png`; separately hover Xyma and compare the band. The GAIL row ORDER must match the design: H2E Power, Xyma Analytics, Cleanergy Tech, VDT Pipeline Integrity, Urjahub, Bharat Flow Analytics, Shigan NexGen, REVY Environmental, CEID Consultants.
- Real text nodes: venture names, sector labels, `Visit Page`, `BACKED BY`/`SECTOR`, hero `PORTFOLIO`/`The builders`/`we're backing.` (curly apostrophe), CTA headings (`1:25244`, `1:25109`). Chip labels/counts, descriptions, hero paragraph, info bar, CTA paragraphs are OUTLINED — copy comes from this plan (verified against the artboard) and the dataset.

**Dataset (already extracted and reconciled by the controller):**
- Source of truth for content: `https://mc2plus.vercel.app/pages/Portfolio.html` (user-designated; the 50-venture array is INLINE in that page's HTML as `{ name, mono, sector, backer, desc, url }` object literals around line ~705). A reference extraction sits at `.superpowers/sdd/ventures-extracted.json` (gitignored) — Task 1 re-extracts from the live source and must reproduce it.
- Reconciliation results: total 50 ✓; backer counts match the design chips exactly (HPCL 6, ONGC 8, IndianOil 8, BPCL 9, GAIL 9, Oil India 7, Petronet 3) ✓; sector counts match EXCEPT **E-Mobility: design chip prints 4, data has 7 — the design is internally inconsistent (its sector chips sum to 47 ≠ 50). Render the computed 7 with a deviation comment** (user's standing fix-with-comment policy). The 9 design-visible ventures' descriptions match the dataset word-for-word (verified) — one dataset serves both.
- 3 ventures have real URLs (H2E Power, Xyma Analytics, Cleanergy Tech); per user decision, rows with a `url` render `Visit Page →` as a real external link (`rel="noopener"`, new tab); rows without render the identical-looking element as non-link text. URLs can be added to the data file anytime.

**Figma MCP pattern (every implementer):** ToolSearch `select:mcp__figma__get_design_context,mcp__figma__get_screenshot,mcp__figma__get_metadata,mcp__figma__download_assets`; file key `u4NLOVKuXUTKULhSn0sAJQ`; URLs short-lived (curl immediately); tools unavailable → BLOCKED.

**Section → anchor nodes:**

| Section | Known anchors |
|---|---|
| Hero + info bar | eyebrow `1:25510` (y=312), H1 `1:25514`/`1:25515` (y=419/507, accent on `backing.` — verify fill), info bar `i` icon text `1:25507` (y=824); paragraph/info copy outlined; curves+sparks in hero region |
| Filters | `BACKED BY` `1:24015` (y=1185), `SECTOR` `1:24198` (y=1296); chips outlined (labels binding per this plan) |
| Venture rows | names/sectors/links are real text: rows at y≈1566–3789 (`1:24205`…`1:25105`); hover band rounded-rect `1:23932` (y=1731, image fill — the Xyma hover) |
| Dual CTA | `Building one of these?` `1:25244`, `Scouting for deal flow?` `1:25109` (both y=4028); paragraphs outlined; two pills |
| Footer | chrome — untouched. NOTE: the file contains TWO overlapping footer text groups (`1:25854`/`1:25882` and `1:26160`/`1:26190`) — a design-file duplication; ignore both, our chrome footer is already correct |

## Global Constraints

- Working directory: git WORKTREE `/Users/anamika/work/mc2-website-home`, branch `feat/portfolio-page` (created from main@c14f50a). NEVER touch `/Users/anamika/work/mc2-website`. No pushes.
- **Bun only**; plain commit messages, **no AI trailers**.
- Tokens matching Figma fills; one-off literals node-cited (house style); provenance comments on every magic number.
- Chrome untouchable (Header/Footer/Logo/BaseLayout/nav.ts/StubPage); `PillButton` and `SectionHeading` are shared components — consume, don't fork; extensions via their existing APIs with node evidence.
- **Standing render gates: 1024, 1366, 1920 (+768) for every task's smoke check; verify ABSOLUTE anchors from page top (not just inter-section gaps — the initiatives hero lesson); clean captures (plain headless Chrome `--headless=new --no-proxy-server --hide-scrollbars`, NO Playwright debug toolbars; free ports, never 4321).**
- Rasters at 2x (the hover photo); SVGs hygiene-stripped.
- Interactivity: vanilla script in the component (house pattern per Header.astro); filter chips are real `<button>`s with `aria-pressed`; the list region announces changes politely (`aria-live="polite"` on a results-count element is sufficient); everything keyboard-operable.
- WCAG contrast deferral stands; hover minimal outside the designed hover band.
- Verify-don't-assume: Figma wins over this plan's approximations; note corrections node-cited.

## File Structure After This Plan

```
src/
├── data/ventures.ts                    # Task 1 — typed 50-venture dataset + derived counts
├── assets/portfolio/                   # Task 1 exports (contract in Task 1)
├── components/portfolio/
│   ├── Hero.astro                      # Task 2 (hero + info bar)
│   ├── Explorer.astro                  # Task 3 (chips + rows, static) → Task 4 adds the script/interactions
│   └── CtaDuo.astro                    # Task 5
└── pages/portfolio.astro               # Task 6 — replaces StubPage usage
```

---

### Task 1: Dataset + assets

**Files:**
- Create: `src/data/ventures.ts`, `src/assets/portfolio/*`

**Interfaces (produces):**
- `ventures.ts`: `export interface Venture { name: string; mono: string; sector: Sector; backer: Backer; desc: string; url: string; }` with `Backer`/`Sector` string-literal unions; `export const VENTURES: Venture[]` (50 entries, order = old-site order EXCEPT the 9 GAIL entries re-sequenced so the GAIL-filtered order equals the design row order listed above — with a comment); `export const BACKERS: { label: Backer | "All"; count: number }[]` and `SECTORS` likewise, counts COMPUTED from `VENTURES` (E-Mobility will compute 7 — add the deviation comment citing the design's inconsistent chip).
- Asset contract: `src/assets/portfolio/hover-photo-xyma.png` (2x, from `1:23932`'s raster fill via `download_assets`), `info-icon.svg` (the `i` badge, if it's vector — node-verify; the `i` glyph itself is text `1:25507`), `hero-curves.svg` + `spark-*.svg` ONLY if this page's decor nodes differ from existing `src/assets/{home,initiatives}/` assets (compare node geometry; reuse if identical, create nothing).

- [ ] **Step 1:** Verify state: worktree, branch `feat/portfolio-page`, clean tree, HEAD is the plan commit. Else BLOCKED.
- [ ] **Step 2:** Extract the dataset from the live source: `curl -s https://mc2plus.vercel.app/pages/Portfolio.html`, parse the inline venture object literals (fields `name, mono, sector, backer, desc, url`; single-quoted JS strings with `\'` escapes). Cross-check against the controller's reference `.superpowers/sdd/ventures-extracted.json` — any mismatch is BLOCKED (source may have changed). Verify: 50 total; backer tallies HPCL 6/ONGC 8/IndianOil 8/BPCL 9/GAIL 9/Oil India 7/Petronet 3; the 9 design ventures present with descriptions matching this plan's design-copy expectations.
- [ ] **Step 3:** Write `ventures.ts` per the interface (typed unions, computed counts, GAIL re-sequencing comment, E-Mobility deviation comment, `url`-empty semantics documented).
- [ ] **Step 4:** Locate + export assets (metadata drill on the hero region and `1:23932`; the hover photo raster via `download_assets` at 2x — report actual pixel size; decor reuse-vs-export verdicts documented like initiatives Task 1).
- [ ] **Step 5:** `bunx astro check` 0/0/0; `bun run build` exit 0 (7 pages).
- [ ] **Step 6:** Commit: `git add src/data/ventures.ts src/assets/portfolio && git commit -m "feat: add ventures dataset and portfolio assets"`

---

### Task 2: Hero + info bar

**Files:**
- Create: `src/components/portfolio/Hero.astro`

**Interfaces:** Consumes Task 1 assets, tokens, `.container`/`--container-gutter`. Produces `Hero.astro` (no props). Precedent: initiatives Hero (own-markup H1 — verify whether this page's H1 size matches SectionHeading's H2 or needs its own; nodes `1:25514`/`1:25515`; the hero band's vertical anchor must be measured FROM PAGE TOP with the curve canvas convention lesson applied — check whether the curve box starts behind the header).

- [ ] **Step 1:** Fetch design context + screenshots for the hero region. Binding copy (glyph-verify): eyebrow `PORTFOLIO`; H1 `The builders` / `we're backing.` (accent span on `backing.` — confirm exact accent extent + fill from node data; curly apostrophe in `we're`); paragraph `Our individual partners have been backing energy innovations for years. Now, we are all coming together to do it.`; info bar (bordered pill, orange `i` badge): `Ventures backed across the energy majors. A selection of companies incubated through the energy majors' programmes. MC²+ Cohort 1 onboards from August 2026.`; down-chevron; curves/sparks per node evidence.
- [ ] **Step 2:** Build; absolute-anchor check: eyebrow ink lands at the design's page-y (±4px) at 1920.
- [ ] **Step 3:** Smoke-render 1024/1366/1920/768; `bunx astro check` 0/0/0; `bun run build` exit 0.
- [ ] **Step 4:** Commit: `git add src/components/portfolio/Hero.astro && git commit -m "feat: add portfolio hero and info bar"`

---

### Task 3: Explorer — static markup and styles

**Files:**
- Create: `src/components/portfolio/Explorer.astro` (chips + all 50 rows server-rendered; NO script yet)

**Interfaces:** Consumes `VENTURES`/`BACKERS`/`SECTORS` from Task 1. Produces the Explorer DOM contract Task 4 scripts against: chip `<button data-filter="backer|sector" data-value="...">` with `aria-pressed`; row `<article data-backer="..." data-sector="...">`; a results-count element with `aria-live="polite"`.

- [ ] **Step 1:** Fetch design context/screenshots for the filter rows and 2–3 venture rows (incl. the Xyma hover band `1:23932` and a normal row). Binding visuals: label style (`BACKED BY`/`SECTOR` real text nodes); chip shape/selected treatment (GAIL chip = selected state reference; sector `All` likewise); row anatomy: `BACKED BY <MAJOR>` tag chip, venture name (real-text style), sector dot+label, right-column description, `Visit Page →` orange link, hairline separator + right spark; measure geometry per node evidence.
- [ ] **Step 2:** Build static: chips from `BACKERS`/`SECTORS` (counts rendered next to labels exactly as the design's chip anatomy); all 50 rows rendered (visibility controlled later by Task 4; default markup state = All/All, everything visible); `Visit Page` as link vs non-link text per `url` (identical styling, documented). GAIL rows must byte-match the design copy.
- [ ] **Step 3:** Smoke-render 1024/1366/1920/768 (list fully expanded); responsive: chips wrap; rows stack description under name <1024; single column <640 — house-pattern adaptations, documented.
- [ ] **Step 4:** `bunx astro check` 0/0/0; `bun run build` exit 0. Commit: `git add src/components/portfolio/Explorer.astro && git commit -m "feat: add portfolio explorer static markup"`

---

### Task 4: Explorer — filtering interactivity + hover state

**Files:**
- Modify: `src/components/portfolio/Explorer.astro` (add the component `<script>` + hover band styles)

- [ ] **Step 1:** Behavior spec (controller-adjudicated): single-select per dimension; `All` default both dimensions on load; AND-combination across dimensions; chip counts are STATIC (dataset-derived, not recomputed on cross-filter — matches the design's static numbers); rows show/hide via a hidden attribute/class (no re-render); results-count element updates and announces politely; empty combination shows `No ventures in this combination yet.` (small gray line — adaptation, documented); everything keyboard-operable (`<button>` semantics + `aria-pressed` flips).
- [ ] **Step 2:** Hover state: on row hover/focus-within, the dark band appears per the design's Xyma capture — Xyma uses `hover-photo-xyma.png` (2x) as the band's image; ventures without a photo get the identical band WITHOUT the photo (documented adaptation; data field ready for future photos). White text on the band per node fills.
- [ ] **Step 3:** Verify interactivity headlessly (throwaway page or the real page after Task 6 — if the component isn't wired yet, use a throwaway page, DELETED before commit): click GAIL → exactly 9 rows visible, order matches design; click sector `Bio-energy` with GAIL → 3 rows; empty combination shows the empty state; `aria-pressed` correct; keyboard tab+enter operates chips.
- [ ] **Step 4:** `bunx astro check` 0/0/0; `bun run build` exit 0. Commit: `git add src/components/portfolio/Explorer.astro && git commit -m "feat: add portfolio filtering and hover interactions"`

---

### Task 5: Dual CTA band

**Files:**
- Create: `src/components/portfolio/CtaDuo.astro`

- [ ] **Step 1:** Fetch context/screenshot (headings `1:25244`/`1:25109` y=4028 — two side-by-side columns). Binding copy: left `Building one of these?` + paragraph `If your venture fits any of these sectors at TRL 4+, Cohort 1 is open. Bring the technology and a real industrial problem.` + `<PillButton label="Coming soon" href="/contact" />`; right `Scouting for deal flow?` + paragraph `Corporates and investors can plug into a sourcing pipeline built on real industrial validation, co-invest or co-pilot with us.` + `<PillButton label="Partner with MC²+" href="/contact" />` (both hrefs = standing catch-all, comment each). Verify paragraph copy by zoom (outlined); check for decor (sparks between columns per artboard).
- [ ] **Step 2:** Build; columns stack <1024. Smoke-render 4 widths; check + build clean.
- [ ] **Step 3:** Commit: `git add src/components/portfolio/CtaDuo.astro && git commit -m "feat: add portfolio dual cta band"`

---

### Task 6: Assembly + fidelity + interaction gates

**Files:**
- Modify: `src/pages/portfolio.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/portfolio/Hero.astro";
import Explorer from "../components/portfolio/Explorer.astro";
import CtaDuo from "../components/portfolio/CtaDuo.astro";
---

<BaseLayout title="Portfolio · MC²+">
  <Hero />
  <Explorer />
  <CtaDuo />
</BaseLayout>
```

- [ ] **Step 1:** Replace the stub with the block above (byte-exact).
- [ ] **Step 2:** Copy sweep on built page (each ≥1): `The builders`, `we're backing.`, `energy majors' programmes`, `BACKED BY`, `SECTOR`, `H2E Power`, `Xyma Analytics`, `CEID Consultants`, `Detect Technologies` (proves the non-design 41 shipped), `Visit Page`, `Building one of these?`, `Scouting for deal flow?`, `Partner with MC²+`. Build exit 0, 7 pages.
- [ ] **Step 3:** Routes: all 7 → 200; `/portfolio` one anchor-scoped `aria-current="page"`; chrome renders.
- [ ] **Step 4:** **Captured-state fidelity gates** (the core): (a) headless render at 1920 with backer=GAIL applied (click via CDP/scripted) → section-by-section compare vs `.superpowers/sdd/figma-portfolio-full.png` (rows, order, chip states); (b) Xyma hover applied → compare the band region; (c) absolute anchors from page top (hero eyebrow, filter labels, first row) within ±4px at 1920; (d) landing state (All/All) renders all 50 without layout breakage at 1024/1366/1920/768. Cross-section rhythm tuning authorized (carried-item pattern; provenance comments; reviewed geometry/copy frozen). Save `rendered-portfolio-gail-1920.png` + `rendered-portfolio-full-final.png` (clean captures).
- [ ] **Step 5:** Commit: `git add src/pages/portfolio.astro <tuned files> && git commit -m "feat: assemble portfolio page from section components"`

## Out of Scope

- Venture detail pages; adding the remaining venture URLs/photos (data file is ready for them); retrofits of shared heading tokens (recommendation stands); deploy; woff2; contrast decision (deferred).
