# Initiatives Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MC²+ Initiatives page as an exact replica of Figma frame `1:15776` (file `u4NLOVKuXUTKULhSn0sAJQ`, "Desktop", 1920×3966), responsive below desktop per established site rules.

**Architecture:** Four section components under `src/components/initiatives/` composed by `src/pages/initiatives.astro` (replacing the stub), plus one new shared `SectionHeading.astro` (eyebrow + H2 pattern — extracted now per the home final review, used by NEW sections only; retrofitting home/about is out of scope). Reuses `PillButton.astro` (the reconciled version with `variant` prop) and existing assets where the design nodes are identical.

**Tech Stack:** Astro 7.0.6, Bun, scoped styles + tokens, Figma MCP as design source.

## The design source (read this first)

Frame `1:15776` is an Illustrator import like Home: 1231 vectors, 29 real text nodes, no auto-layout/variables. Page content lives in child frame `1:15777` ("initiatives test 1"): one giant group `1:15778` (all content, bleeds x=-70) + footer group `1:17186` (y=3394 — already-built chrome).

- **Geometry:** exact, from `get_metadata`/`get_design_context` per section region.
- **Typography:** real text nodes for headlines/step titles/program titles (exact styles via design context); body copy is outlined — sizes from bbox evidence + house precedents (Home established: eyebrows ~1.69rem/0.25em `--color-gray`; H2 65px/1.07 `--color-ink-alt`; Faculty for display, Sora for UI — but VERIFY per node, Figma wins).
- **Copy:** verbatim strings below for everything visible; text occluded by the overlapping program cards MUST be extracted from the node tree (`get_design_context` on the programs region returns full strings of clipped/overlapped text nodes) — never guessed, never left out.
- **Figma MCP pattern (every implementer):** ToolSearch `select:mcp__figma__get_design_context,mcp__figma__get_screenshot,mcp__figma__get_metadata,mcp__figma__download_assets`; file key `u4NLOVKuXUTKULhSn0sAJQ`; URLs are short-lived (curl immediately); tools unavailable → BLOCKED.

**Section → anchor nodes** (drill down from `1:15778` via `get_metadata` for exact sub-groups):

| Section | Known anchors |
|---|---|
| Hero + notice bar | eyebrow `1:16966` (y=311), H1 `1:16970`/`1:16971` (y=418/505); paragraph + notice bar outlined (hero region y≈180–1100, incl. orbital curves + sparks + down-chevron) |
| How it works | eyebrow `1:15970` (y=1205), H2 `1:15971`; step cards y≈1500–1990: STEP/O-number/title text nodes `1:16081`–`1:16265` (O2 card orange + elevated, body outlined); down-chevron below (y≈2130) |
| Programs stack | region y≈2200–2800: O1 `1:16495`+title `1:16781` (fully visible card); O2 `1:16438`+`1:16444`/`1:16445`; O3 `1:15819`+`1:15815`; O4 title `1:15825` ("Energy" fragment — extract full text); tag chips + headers partially occluded |
| CTA | H2 `1:16268` (y=2978); paragraph outlined; pill "Register your interest" |
| Footer | `1:17186` — chrome, untouched |

## Global Constraints

- Working directory: the git WORKTREE `/Users/anamika/work/mc2-website-home`, branch `feat/initiatives-page` (already created from main@eb11fd8). NEVER touch `/Users/anamika/work/mc2-website` (parallel team-page work). No pushes.
- **Bun only**; plain commit messages, **no AI trailers**.
- Colors via tokens matching Figma fills; one-off literals with house-style node-cited comments. Provenance comments on every magic number (Home's convention).
- Chrome files untouchable: Header/Footer/Logo/BaseLayout/nav.ts/StubPage. `PillButton.astro` is the reconciled shared component — consume, don't fork; if a pill node on this page genuinely differs (evidence!), extend via the existing `variant` API with a comment.
- **Render verification gate (standing, from home final review): 1024, 1366, 1920 widths** for every section task's smoke check AND the assembly; plus one <1024 responsive check (768).
- Responsive: desktop ≥1024 mirrors Figma; each task defines <1024/<768 stacking consistent with Home's patterns. Design is desktop-only; adaptation is ours.
- Any raster export → 2x resolution (Home lesson). Vector → SVG with background-rect artifacts stripped.
- Hover states minimal/house-pattern; WCAG contrast deferral stands (replicate design colors).
- Copy fixes for obvious design-file errors follow the user's standing "fix with documented deviation comment" policy — list every such fix in the report AND the code comment.
- Verify-don't-assume: Figma data wins over this plan's approximations; note corrections node-cited.

## File Structure After This Plan

```
src/
├── components/
│   ├── SectionHeading.astro            # Task 2 — shared eyebrow+H2 (new sections only)
│   └── initiatives/
│       ├── Hero.astro                  # Task 2 (hero + notice bar)
│       ├── HowItWorks.astro            # Task 3
│       ├── Programs.astro              # Task 4
│       └── CtaBand.astro               # Task 5
├── assets/initiatives/                 # Task 1 exports (contract inside Task 1)
├── pages/initiatives.astro             # Task 6 — replaces StubPage usage
└── styles/global.css                   # Task 1 — adds --container-gutter (refactors .container to use it)
```

---

### Task 1: Asset export + `--container-gutter` token

**Files:**
- Create: `src/assets/initiatives/*` (contract below)
- Modify: `src/styles/global.css` (gutter variable refactor only), `src/components/home/Pillars.astro` (consume the variable — sanctioned)

**Interfaces:**
- Produces asset contract: `src/assets/initiatives/hero-curves.svg` (this page's orbital arrangement — different from home's), `notice-icon.svg` (the orange-circled glyph in the notice bar); `spark-orange.svg`/`scroll-arrow.svg` ONLY if this page's nodes differ from home's existing `src/assets/home/` versions (compare geometry via node data first — if identical, REUSE home's files via import and create nothing).
- Produces: `--container-gutter: clamp(1.25rem, 4vw, 5rem);` in `:root`, `.container` refactored to `padding-inline: var(--container-gutter);` (behavior identical), and Pillars' O1 bleed calc consuming the variable (the follow-up the home final review mandated; computed values must remain identical — verify the bleed at 1440/1920 before and after).

- [ ] **Step 1:** Verify state: `git status --porcelain` empty, branch `feat/initiatives-page`, HEAD `eb11fd8`. Else BLOCKED.
- [ ] **Step 2:** Load Figma tools; `get_metadata` on `1:15778` to locate hero curve group(s), notice-bar icon node, sparks, chevrons, anything unique to this page. Compare spark/chevron geometry against home's nodes — document identical-vs-distinct verdicts.
- [ ] **Step 3:** `download_assets` (SVG) for distinct assets; strip no-op background rects/clipPaths; view each file to confirm content; place per contract.
- [ ] **Step 4:** global.css gutter refactor + Pillars calc consumption; verify via build + computed-style probe at 1024/1440/1920 that `.container` padding and the O1 bleed are identical to before.
- [ ] **Step 5:** `bunx astro check` 0/0/0; `bun run build` exit 0 (7 pages).
- [ ] **Step 6:** Commit: `git add src/assets/initiatives src/styles/global.css src/components/home/Pillars.astro && git commit -m "feat: add initiatives assets and shared container-gutter variable"`

---

### Task 2: SectionHeading + Hero + notice bar

**Files:**
- Create: `src/components/SectionHeading.astro`, `src/components/initiatives/Hero.astro`

**Interfaces:**
- Produces: `SectionHeading.astro` props `{ eyebrow: string }` + default slot for H2 content (allows accent spans/line breaks); styles per house pattern (eyebrow `--color-gray` letter-spaced uppercase; H2 Faculty 65px/1.07 `--color-ink-alt` centered with `clamp()` fallback) — BUT verify against THIS page's nodes `1:16966`/`1:16970` and `1:15970`/`1:15971` first; Figma wins.
- Consumes: assets from Task 1, `.container`/`--container-gutter`.

- [ ] **Step 1:** `get_design_context` + screenshots for the hero region (drill via metadata; H1 has an orange accent on `every builder` — confirm which orange; eyebrow underline like home's hero — confirm).
- [ ] **Step 2:** Build `SectionHeading.astro` (must match BOTH this page's hero heading and how-it-works heading nodes — it serves Task 3 too).
- [ ] **Step 3:** Build `Hero.astro`. Copy verbatim (glyph-verify apostrophes/dashes against zoomed screenshots; Figma wins):
  - Eyebrow: `INITIATIVES`
  - H1: `Built for <accent>every builder</accent>` / `in India's energy story.`
  - Paragraph: `Whether you are an early-stage aspiring entrepreneur, a researcher with a lab-stage IP, or an institution ready to co-build the next decade of energy technology, MC²+ is for you.` (the separator before `MC²+` must be glyph-verified — home's audiences used `–`; this page may use `,`)
  - Notice bar (navy rounded pill, orange circular icon left): `Capital, infrastructure and mentorship support every stage, from lab access to pilot sites across the seven energy majors.` followed by orange link `See the full support stack` + arrow, `href="/support"` (text colors from node fills).
  - Orbital curves + sparks behind; down-chevron below.
- [ ] **Step 4:** Smoke-render 1024/1366/1920 (+768) against the region screenshot; `bunx astro check` 0/0/0; `bun run build` exit 0.
- [ ] **Step 5:** Commit: `git add src/components/SectionHeading.astro src/components/initiatives/Hero.astro && git commit -m "feat: add section heading component and initiatives hero"`

---

### Task 3: How-it-works steps

**Files:**
- Create: `src/components/initiatives/HowItWorks.astro`

**Interfaces:** Consumes `SectionHeading`, Task 1 assets. Produces `HowItWorks.astro` (no props).

- [ ] **Step 1:** Fetch region context/screenshot (cards y≈1500–1990 + heading y≈1205 + chevron y≈2130). Four folder-tab cards with pointed arrow connectors (screenshot-verify shape; Home's Pillars notch technique is precedent). Card O2 is `--color-orange`-filled and ELEVATED; others cream/navy-border at differing offsets (text-node y's: O2 top 1502, O3 1638, O1 1713, O4 1701 — trust node data).
- [ ] **Step 2:** Build. Copy verbatim (occluded/truncated strings extracted from node data, not guessed):
  - Heading: eyebrow `HOW IT WORKS`, H2 `From idea, to deployment.`
  - Sub-line (outlined; extract exact): `Come in through a Grand Challenge, as a Fellow, or as an existing venture. Every builder moves through the same four steps.`
  - Cards: `STEP O1` + `Apply`; `STEP O2` + `Find energy-major champions` + body `We match you to the energy majors who own the problem and the assets, your sponsors, mentors and first reference customers.`; `STEP O3` + `Build, test, iterate` + its body (VISIBLY TRUNCATED in the design render — extract the full node string; if the design genuinely cuts mid-sentence that is a design-file error: apply the standing fix-with-comment policy and render the full sentence, documenting the deviation); `STEP O4` + `Scale with capital`.
- [ ] **Step 3:** Smoke-render 1024/1366/1920/768 (cards 2×2 then 1-col below desktop, offsets flattened — Pillars precedent); check + build clean.
- [ ] **Step 4:** Commit: `git add src/components/initiatives/HowItWorks.astro && git commit -m "feat: add how-it-works steps section"`

---

### Task 4: Programs stack (hardest — overlapping cards)

**Files:**
- Create: `src/components/initiatives/Programs.astro`

**Interfaces:** Consumes Task 1 assets, tokens. Produces `Programs.astro` (no props).

- [ ] **Step 1:** Fetch region context/screenshot (y≈2200–2800) at maxDimension 2048. Four program cards OVERLAP like stacked folders: O1 "Grand Challenges" front-most, fully visible (orange title, tag chips); O2/O3/O4 successively tucked behind, clipped by neighbors. Extract from node data the FULL text of ALL cards, including occluded parts: O2 header `FOR FOUNDERS BUILDING FROM SCRATCH`, O3 header `EXISTING VENTURES READY TO SCALE`, O4's full header (visible fragment `…TED, H-STAGE CAPITAL`) and full title (visible fragment `…nergy`; node `1:15825` text is `Energy`), plus every tag chip string (visible: `THEMED BRIEFS`, `CASH AWARDS + PILOTS`, `OPERATING-SITE ACCESS`, `…20 FELLOWS A YEAR`, `…+ SEED`, `LAB RESIDENCY`, `SIX MONTHS`, fragments `ES`/`L`). Report the recovered full strings with node IDs.
- [ ] **Step 2:** Build with real stacking (z-index + offsets from node geometry) so rear-card clipping emerges naturally from occlusion — do NOT bake pre-clipped text. O1 card verbatim: header `O1 FOR RESEARCHERS SOLVING INDUSTRY PROBLEMS`, title `Grand Challenges`, subtitle `ENERGY-MAJOR-DEFINED PROBLEM BRIEFS`, body `Real problems, posted by the people who own the assets. Energy majors publish challenge briefs tied to live operational needs, and researchers solving a specific, industry-relevant problem respond. Winners earn pilots, awards and a fast track into the Accelerator.`
- [ ] **Step 3:** Responsive: <1024 the stack unstacks into full-width sequential cards (each fully readable — occlusion is a desktop composition); <640 single column. Sanctioned adaptation; document it.
- [ ] **Step 4:** Smoke-render 1024/1366/1920/768; check + build clean.
- [ ] **Step 5:** Commit: `git add src/components/initiatives/Programs.astro && git commit -m "feat: add stacked program cards section"`

---

### Task 5: CTA band

**Files:**
- Create: `src/components/initiatives/CtaBand.astro`

**Interfaces:** Consumes `SectionHeading` (or matches its pattern if the design's CTA heading lacks an eyebrow — node-verify), `PillButton`. Produces `CtaBand.astro`.

- [ ] **Step 1:** Fetch region context/screenshot (H2 `1:16268` y=2978). Copy verbatim: H2 `Found your entry point?`; paragraph (outlined; extract/zoom-verify): `The first MC²+ cohort launches in August 2026. Applications open soon. Tell us what you're building in the meantime.`; `<PillButton label="Register your interest" href="/contact" />` (no dedicated destination exists — /contact is the user's standing catch-all; comment it).
- [ ] **Step 2:** Build; smoke-render 1024/1366/1920; check + build clean.
- [ ] **Step 3:** Commit: `git add src/components/initiatives/CtaBand.astro && git commit -m "feat: add initiatives cta band"`

---

### Task 6: Assembly + fidelity verification

**Files:**
- Modify: `src/pages/initiatives.astro` (replace the StubPage usage entirely)

- [ ] **Step 1:** Replace `src/pages/initiatives.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/initiatives/Hero.astro";
import HowItWorks from "../components/initiatives/HowItWorks.astro";
import Programs from "../components/initiatives/Programs.astro";
import CtaBand from "../components/initiatives/CtaBand.astro";
---

<BaseLayout title="Initiatives · MC²+">
  <Hero />
  <HowItWorks />
  <Programs />
  <CtaBand />
</BaseLayout>
```

- [ ] **Step 2:** Copy sweep on the built page (each ≥1): `Built for`, `every builder`, `seven energy majors`, `From idea, to deployment.`, `Find energy-major champions`, `Grand Challenges`, `Entrepreneur-`, `Accelerator`, `Found your entry point?`, `Register your interest`, `See the full support stack`. Build exit 0, 7 pages.
- [ ] **Step 3:** Routes: all 7 return 200 (dev server, free port, killed after); `/initiatives` has exactly one anchor-scoped `aria-current="page"` on its own nav link; chrome renders.
- [ ] **Step 4:** Whole-page fidelity: render 1024/1366/1920 (+768); side-by-side vs `.superpowers/sdd/figma-initiatives-full.png`; reconcile cross-section rhythm (measured gaps); save `rendered-initiatives-full-final.png` (1920). Tuning of the section components' carried approximations is authorized here exactly like home's Task 7 (source comments updated; reviewed geometry/copy frozen).
- [ ] **Step 5:** Commit: `git add src/pages/initiatives.astro && git commit -m "feat: assemble initiatives page from section components"` (plus any tuned section files, named in the report).

## Out of Scope

- Retrofitting SectionHeading into home/about; Team/Support/Portfolio/Contact pages; deploy; woff2; contrast decision (deferred).
