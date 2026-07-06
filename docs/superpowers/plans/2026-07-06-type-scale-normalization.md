# Type-Scale Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every page's hero typography identical to the Home hero, and normalize the About page's body-copy sizes to Home's scale — via a new site-wide type-scale token set so the values can never drift again.

**Architecture:** Add type-scale custom properties to `src/styles/global.css` whose values ARE Home's current rendering (Home must not change visually). Refactor Home's components onto the tokens first (proving token == current pixel output), then point the five other heroes and About's sections at the same tokens.

**Tech Stack:** CSS custom properties only; no markup or copy changes; Astro scoped styles edited in place.

## Why (context for implementers/reviewers)

The Figma pages are internally inconsistent: Home's hero H1 is 52px in the design, while About/Initiatives carry 81.3px and Team/Support/Contact 80px — each page's implementation faithfully replicated ITS page's nodes, so all six implementations are "Figma-correct" yet mutually inconsistent. **The user has ruled: Home's typography is canonical site-wide.** This is a user-directed design override of per-page Figma values — the house "Figma wins" rule is superseded for TYPE SCALE ONLY on the affected elements. Every changed value gets a comment citing this directive (2026-07-06) so future Figma-fidelity reviews don't "fix" it back.

## Audited current state (controller-verified by grep, 2026-07-06, re-verified against main@e119dd1 after the contact rebuild merge)

**Already consistent — do NOT touch:** section H2s `4.0625rem`/1.07 (all pages incl. About's Mission/Scale/SponsorStrip/Vision, Home's Pillars/Audiences/CtaBand, SectionHeading.astro); section eyebrows `1.6919rem`/0.25em; About Scale's stat numerals `2.2rem` (matches Home Audiences' `2.2019rem` numeral pattern — keep).

**Delta group A — heroes (5 files):** `about/AboutHero.astro`, `initiatives/Hero.astro`, `team/*Hero*.astro`, `support/*Hero*.astro`, `contact/*Hero*.astro` (exact filenames: `ls src/components/<page>/`):

| Element | Current (those pages) | Target (= Home hero, `src/components/home/Hero.astro`) |
|---|---|---|
| Hero eyebrow | 1.69/1.6919rem (27.07px) | **1.25rem** (20px) |
| Hero H1 | 5.08rem (81.3px, about/init) / 5rem (80px, team/support/contact); lh 1.08/1.095 | **3.25rem** (52px), **lh 1.173** (61/52) |
| Hero lede | 1.9375rem (31px); lh 1.3/1.31 | **1.25rem** (20px), **lh 1.4** (28/20) |
| H1 <1024 clamp | clamp(2.4rem, 7vw, 5rem±) / support 2.65rem floor | **clamp(2.1rem, 5vw, 3.25rem)** (Home's) |
| Lede <1024 clamp (where present, e.g. support `clamp(1.2rem,3vw,1.9375rem)`) | — | fixed 1.25rem with Home's <1024 lede behavior (Home keeps 1.25rem + max-width 90%) |
| Initiatives notice-bar text | 1.7763rem (28.42px) | **1.1463rem** (≈18.34px) — scaled by the lede ratio 20/31 to preserve the design's intra-hero hierarchy (notice text was 0.9168× the lede); comment the derivation |

**Delta group B — About non-hero body copy:**

| File:element | Current | Target (Home role equivalent) |
|---|---|---|
| `Mission.astro` paragraph | 1.9375rem/1.31 | **1.4375rem**/1.4 (Home CtaBand's wrap-verified section paragraph) |
| `Vision.astro` paragraphs | 1.9375rem/1.31 | **1.4375rem**/1.4 |
| `SponsorStrip.astro` intro line | 1.9375rem | **1.25rem** (Home SponsorStrip heading role, `home/SponsorStrip.astro:125`) |
| `SponsorStrip.astro` captions | 1.1125rem (17.8px) | **0.75rem** (12px — Home's sponsor captions, same role) |
| `VideoFeature.astro` primary text | 1.9375rem | **1.4375rem**/1.4 |
| `VideoFeature.astro` secondary 1.25rem | 1.25rem | unchanged (already Home body scale) |
| `Scale.astro` stat support/label texts | 1.64rem (26.25px) / 1.26rem (20.19px) | **1.25rem** / **1rem** (Home body / small-body); stat numerals 2.2rem unchanged |
| Any `clamp()` floors in these files built off the old sizes | various | re-derive from the new sizes keeping each file's existing clamp shape |

**Explicitly out of scope:** copy, colors, spacing/geometry (hero band heights stay unless a shrink visibly breaks balance — see Task 2 Step 3), other pages' non-hero body copy (later pass if the user wants), the in-flight `feat/portfolio-page` and `feat/contact-page-rebuild` branches (see Coordination).

## Coordination risks (two live parallel branches)

- **`feat/portfolio-page`** (another agent, mid-execution): its hero will land with that page's Figma-derived sizes. Do NOT touch that branch. This plan's ledger records a follow-up: after their merge, point the portfolio hero at the hero tokens (a 5-line change). The tokens landing on main FIRST means their merge won't conflict (they don't edit global.css's token block or other pages' heroes).
- **Contact rebuild: RESOLVED** — it merged to main as `e119dd1` while this plan was being written; the rebuilt `ContactHero.astro` carries the same inflated values (1.69rem/5rem/1.9375rem — re-audited post-merge), so Task 2 normalizes it directly. This plan's branch is based on `e119dd1`.

## Global Constraints

- Working directory: git WORKTREE `/Users/anamika/work/mc2-website-fixes`, branch `feat/type-scale-normalization` (already created from main@e119dd1; Task 1 Step 1 just verifies clean state on it). NEVER touch `/Users/anamika/work/mc2-website` or `/Users/anamika/work/mc2-website-home` (both occupied by parallel agents). No pushes.
- **Bun only**; plain commit messages, **no AI trailers**.
- **Home's rendered output is the invariant**: after Task 1, Home at 1920/1366/1024/768 must be pixel-identical to before (fonts unchanged — the tokens merely name its existing values).
- Typography-only diffs: reviewers must reject any hunk that changes markup, copy, colors, or non-typographic geometry (exception: Task 2 Step 3's documented balance adjustments).
- Every changed value carries a comment: old value + node citation preserved, plus `— normalized to home hero scale per user directive 2026-07-06`.
- Standing gates: renders at 1024/1366/1920 (+768) per changed page; clean captures (plain headless Chrome, no debug toolbars; free ports, never 4321); `bunx astro check` 0/0/0 and `bun run build` exit 0 per task.

## File Structure Changes

```
src/styles/global.css                    # Task 1 — type-scale token block
src/components/home/Hero.astro           # Task 1 — consume tokens (zero visual change)
src/components/home/{SponsorStrip,CtaBand}.astro  # Task 1 — consume tokens for the role values Group B maps to
src/components/{about,initiatives,team,support,contact}/*Hero*.astro  # Task 2
src/components/about/{Mission,Vision,SponsorStrip,VideoFeature,Scale}.astro  # Task 3
```

---

### Task 1: Type-scale tokens + Home refactor (the invariant proof)

**Files:** Modify `src/styles/global.css`, `src/components/home/Hero.astro`, `src/components/home/SponsorStrip.astro`, `src/components/home/CtaBand.astro`.

**Interfaces (produces — the site type-scale contract):** in `:root`, directly after the font tokens:

```css
  /* Type scale — canonical values = the Home page's rendering (user directive
     2026-07-06: home typography is the site-wide reference; supersedes
     per-page Figma sizes for these roles). */
  --text-hero-eyebrow: 1.25rem;      /* 20px  — home Hero eyebrow */
  --text-hero-h1: 3.25rem;           /* 52px  — home Hero H1 (Figma 1:23/1:1876) */
  --text-hero-h1-lh: 1.173;          /* 61/52 */
  --text-hero-h1-fluid: clamp(2.1rem, 5vw, 3.25rem);  /* <1024 */
  --text-hero-lede: 1.25rem;         /* 20px */
  --text-hero-lede-lh: 1.4;          /* 28/20 */
  --text-body-lg: 1.4375rem;         /* 23px — section paragraph (home CtaBand, wrap-verified) */
  --text-body: 1.25rem;              /* 20px */
  --text-body-sm: 1rem;              /* 16px */
  --text-caption: 0.75rem;           /* 12px — sponsor captions */
```

- [ ] **Step 1:** `git status --porcelain` empty on `main` in the fixes worktree → `git checkout -b feat/type-scale-normalization`. Else BLOCKED.
- [ ] **Step 2:** BEFORE any edit: capture reference renders of Home at 1920/1366/1024/768 (clean headless Chrome; save under `.superpowers/sdd/typo-before-home-<w>.png`).
- [ ] **Step 3:** Add the token block; refactor `home/Hero.astro` (eyebrow/H1/lh/clamp/lede), `home/SponsorStrip.astro` (heading 1.25rem→`var(--text-body)`, caption→`var(--text-caption)`), `home/CtaBand.astro` (paragraph→`var(--text-body-lg)`) to consume tokens. Values must be IDENTICAL — this is a pure renaming.
- [ ] **Step 4:** Re-render Home at all 4 widths; pixel-diff against Step 2 references — **must be identical** (tooling: PIL ImageChops; zero-diff or antialiasing-only noise ≤2). Any real diff = you changed a value; fix before proceeding.
- [ ] **Step 5:** `bunx astro check` 0/0/0; `bun run build` exit 0 (7 pages).
- [ ] **Step 6:** Commit: `git add src/styles/global.css src/components/home && git commit -m "feat: add type-scale tokens from home reference values"`

---

### Task 2: Hero normalization — five pages

**Files:** Modify the hero component of about, initiatives, team, support, contact (exact filenames via `ls src/components/<page>/`).

- [ ] **Step 1:** For each hero, apply the Group A mapping (table above) by switching the properties to the Task 1 tokens; preserve each file's existing node-citation comments and APPEND the normalization comment. Initiatives notice-bar: `1.1463rem` with the ratio-derivation comment. Support's extra sub-element (`0.58em` relative size) is relative — verify it still reads correctly at the new base; its <1024 lede clamp → fixed `var(--text-hero-lede)` + Home's max-width behavior.
- [ ] **Step 2:** Markup/copy/color hunks are FORBIDDEN — the diff per file should touch only font-size/line-height declarations, related clamps, and comments.
- [ ] **Step 3:** Per-page balance check at 1920: the hero bands keep their heights (min-height driven), so shrinking text increases whitespace. Compare each hero render against its pre-change screenshot: if the text block now floats with visibly broken vertical balance (subjective bar: eyebrow-to-content proportions grossly off), you MAY adjust the hero's internal padding/gap to recenter the text block within the SAME band height — geometry-minimal, documented per edit. Band heights and section boundaries must not change (absolute anchors of the NEXT section stay fixed — verify one anchor per page).
- [ ] **Step 4:** Cross-page equality assertion (the point of the whole exercise): render all 6 pages at 1920; via CDP `getComputedStyle`, assert hero eyebrow/H1/lede `font-size` and `line-height` are IDENTICAL across home/about/initiatives/team/support/contact. Save the assertion output to the report.
- [ ] **Step 5:** 4-width renders per page (sanity, no overflow/collision — H1s now shorter, wraps may change: manually-broken hero lines must still break at the designed points; verify each hero's line breaks match its design's line STRUCTURE (2 or 3 lines as before)).
- [ ] **Step 6:** `bunx astro check` 0/0/0; `bun run build` exit 0. Commit: `git add src/components/about/AboutHero.astro src/components/initiatives/Hero.astro src/components/team src/components/support src/components/contact && git commit -m "fix: normalize all hero typography to home scale"` (adjust paths to actual hero filenames; stage only hero files).

---

### Task 3: About page body-copy normalization

**Files:** Modify `src/components/about/{Mission,Vision,SponsorStrip,VideoFeature,Scale}.astro`.

- [ ] **Step 1:** Apply the Group B mapping via tokens (`--text-body-lg`, `--text-body`, `--text-body-sm`, `--text-caption`); re-derive any dependent clamps; preserve+append comments as in Task 2. Stat numerals (2.2rem) and all section H2s/eyebrows untouched.
- [ ] **Step 2:** Typography-only diff rule applies. Paragraph max-widths stay — wraps will change (31px→23px text wraps looser); that is expected and accepted. If a paragraph block now visibly unbalances its section's two-column layout (Mission/Vision are label+text rows), the same minimal-padding rule as Task 2 Step 3 applies, documented.
- [ ] **Step 3:** Renders of /about at 4 widths; before/after side-by-side saved; check + build clean.
- [ ] **Step 4:** Commit: `git add src/components/about && git commit -m "fix: normalize about page body copy to home scale"`

---

### Task 4: Whole-site verification

- [ ] **Step 1:** Full pass: `bunx astro check` 0/0/0; `bun run build` exit 0 (7 pages); all 7 routes 200 (free port); each page renders at 1920 with a clean capture saved (`.superpowers/sdd/typo-after-<page>.png`).
- [ ] **Step 2:** Re-run the Task 2 cross-page hero equality assertion on the final HEAD (all six pages).
- [ ] **Step 3:** Home invariant re-check: pixel-diff Home's final render vs Task 1's Step 2 reference — still identical.
- [ ] **Step 4:** Grep sweep: no remaining `5rem`/`5.08rem`/`1.9375rem`/`1.69rem`/`1.6919rem` font-size declarations in ANY hero file (`grep -n "font-size" src/components/*/[Hh]ero*.astro`) except token consumption; no `1.9375rem` left in about components.
- [ ] **Step 5:** Ledger entries: the two coordination notes (portfolio hero token adoption post-merge; contact rebuild must consume `--text-hero-*`).
- [ ] **Step 6:** No commit (verification only), unless Steps 1–4 forced a fix — then a single `fix:` commit with the evidence in the report.

## Out of Scope

- Non-hero body copy on initiatives/team/support/contact/portfolio (a later pass if the user wants the "whole other website" beyond heroes — the tokens make it cheap).
- The two in-flight branches (coordination notes only).
- Copy/color/spacing changes; the deferred contrast decision.
