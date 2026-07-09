# Support-Stack Line Alignment (Figma-Exact) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the support page's decorative grid lines and sparks exactly match Figma file `u4NLOVKuXUTKULhSn0sAJQ`, frame `1:19224` (desktop), replacing the hand-tuned CSS approximation.

**Architecture:** The current implementation draws 7 uniform 1px CSS divs at 70% opacity plus 13 identical 50px sparks — none of which match Figma. In Figma, each of the 4 card sections owns one decorative *group* of 5 **tapered** lines (spindle-shaped paths, solid `#F37D2C`), plus 2 big sparks (60.78px) and 1 small spark (31.36px). We replace the divs with the four exported Figma group SVGs positioned at exact artboard coordinates, add a thin "subtitle divider" overlay SVG per card (z-index above the cards' cream background so it stays visible where it crosses the card box, exactly as in Figma), and re-place 12 sparks at exact positions in two sizes.

**Tech Stack:** Astro 7 (SVGs imported as components, e.g. `import X from "…svg"` then `<X class="…" />` — same pattern the file already uses for `SparkOrange`). Build with `bun run build`.

## Global Constraints

- Work happens in worktree `.claude/worktrees/support-line-alignment`, branch `worktree-support-line-alignment`.
- Desktop (≥1200px) must match Figma exactly; below 1200px all lines/sparks/dividers are hidden (`display: none`), same as today — the mobile stacked layout must not change at all.
- Only `src/components/support/SupportStack.astro` and new files under `src/assets/support/` may change. No other component/page/style file.
- Artboard coordinate system: the `.stage-artboard` is 109.87rem × 168rem (1757.92 × 2688px, 1rem = 16px), origin at Figma canvas (x=81.04, y=1067.23). All positions below are artboard-local rem, rounded to 2 decimals.
- Line/spark color is `#F37D2C` (identical to the project's `--color-orange`), **full opacity** — the old `opacity: 0.7` must not be applied to the new artwork; the taper supplies the lightness.
- Cards keep `background: var(--color-cream)` and `z-index: 2` (masks line overflow when text grows at scaled-down widths). Line groups render at `z-index: 0`, sparks at `z-index: 1`, divider overlays at `z-index: 3`.
- `bun run build` must pass after every task.

## Figma-derived geometry reference (source of truth)

Extracted from `get_metadata` on frame 1:19224 (raw XML saved at
`/private/tmp/claude-501/-Users-anamika-work-mc2-website/f2f3b3c0-6dd1-4716-ada6-469d5e8a37f7/scratchpad/frame-19224.xml`).
Reference renders of the two stack halves (no illustrations — those are separate nodes and don't change):
`…/scratchpad/figma-stack-top.png` (node 1:19227) and `…/scratchpad/figma-stack-bottom.png` (node 1:19947).

Line groups (Figma node → asset → artboard position):

| Node | Asset | left | top | width | natural height |
|---|---|---|---|---|---|
| 1:19574 Capital | `lines-capital.svg` | 0 | 0 | 63.86rem | 63.28rem |
| 1:19936 Expertise | `lines-expertise.svg` | 46.01rem | 35.95rem | 63.86rem | 63.28rem |
| 1:20303 Infrastructure | `lines-infrastructure.svg` | 0 | 71.89rem | 63.86rem | 63.28rem |
| 1:20687 Piloting | `lines-piloting.svg` | 46.01rem | 107.85rem | 63.86rem | 60.16rem |

Each group contains (group-local px): a mid/right vertical, a left/mid vertical, a full-width closing line (y≈853), an opening short line (y≈74.9), and a subtitle divider (y≈278, x 62.34→967.13). Adjacent groups are placed so one group's divider is collinear with the neighbor's closing line — this creates the "one continuous line" look at artboard y 53.29rem, 89.24rem, 125.18rem.

Divider overlays (same geometry as each group's Vector_5 path, re-rendered above the card):

| Card | left | top |
|---|---|---|
| Capital | 3.90rem | 17.34rem |
| Expertise | 49.90rem | 53.29rem |
| Infrastructure | 3.90rem | 89.23rem |
| Piloting | 49.90rem | 125.18rem |

(top = group_top + 277.36px: the XML node `y` is the ink-bounds *top*, not the
line's center — reviewer-verified via Bézier extremes of the spindle path.)

Sparks — **8 big** (3.80rem = 60.78px) at closing-line crossings, **4 small** (1.96rem = 31.36px) on opening lines. Positions are the element's top-left (x, y):

| Spark | size | left | top | Figma node |
|---|---|---|---|---|
| capital-open (mid × opening) | sm | 55.26rem | 3.70rem | 1:19582 |
| capital-left (left-v × closing) | lg | 8.34rem | 51.42rem | 1:19584 |
| capital-mid (mid-v × closing) | lg | 54.34rem | 51.42rem | 1:19581 |
| expertise-open (right-v × opening) | sm | 101.26rem | 39.65rem | 1:19944 |
| expertise-mid (mid-v × closing) | lg | 54.35rem | 87.37rem | 1:19946 |
| expertise-right (right-v × closing) | lg | 100.34rem | 87.37rem | 1:19943 |
| infrastructure-open (left-v × opening) | sm | 9.26rem | 75.59rem | 1:20311 |
| infrastructure-left (left-v × closing) | lg | 8.34rem | 123.31rem | 1:20313 |
| infrastructure-mid (mid-v × closing) | lg | 54.34rem | 123.31rem | 1:20310 |
| piloting-open (right-v × opening) | sm | 101.26rem | 111.54rem | 1:20695 |
| piloting-mid (mid-v × closing) | lg | 54.35rem | 159.26rem | 1:20697 |
| piloting-right (right-v × closing) | lg | 100.34rem | 159.26rem | 1:20694 |

There is **no** spark at the top of the mid line or the top of the left line (the current `spark-a`/`spark-b` have no Figma counterpart). All 13 old sparks and all 7 old `.line-*` divs are superseded.

---

### Task 1: Add the six Figma-exact SVG assets

**Files:**
- Create: `src/assets/support/lines-capital.svg`
- Create: `src/assets/support/lines-expertise.svg`
- Create: `src/assets/support/lines-infrastructure.svg`
- Create: `src/assets/support/lines-piloting.svg`
- Create: `src/assets/support/divider-line.svg`
- Create: `src/assets/support/spark-diagram.svg`

**Interfaces:**
- Produces: six SVG files importable as Astro components. Task 2 imports them by these exact paths.

The contents below are the Figma MCP exports with the wrapper attributes removed (`width="100%" height="100%" preserveAspectRatio="none" style overflow` stripped; `var(--fill-0, #F37D2C)` collapsed to the literal fill) — path data untouched.

- [ ] **Step 1: Write `src/assets/support/lines-capital.svg`** (Figma node 1:19574)

```svg
<svg viewBox="0 0 1021.83 1012.49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M899.79 1012.49C899.21 695.26 899.21 317.22 899.79 0C900.37 317.23 900.37 695.27 899.79 1012.49Z" fill="#F37D2C"/>
<path d="M163.86 930.67C163.25 681.66 163.24 402.33 163.86 153.32C164.48 402.33 164.47 681.66 163.86 930.67Z" fill="#F37D2C"/>
<path d="M1021.83 853.06C701.67 853.64 320.14 853.64 0 853.06C320.16 852.48 701.69 852.48 1021.83 853.06Z" fill="#F37D2C"/>
<path d="M967.13 74.8599C810.21 75.4699 634.19 75.4799 477.28 74.8599C634.2 74.2399 810.22 74.2499 967.13 74.8599Z" fill="#F37D2C"/>
<path d="M967.13 277.98C677.3 278.59 352.17 278.6 62.34 277.98C352.17 277.36 677.3 277.37 967.13 277.98Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 2: Write `src/assets/support/lines-expertise.svg`** (Figma node 1:19936)

```svg
<svg viewBox="0 0 1021.83 1012.49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M899.8 1012.49C899.22 695.26 899.22 317.22 899.8 0C900.38 317.23 900.38 695.27 899.8 1012.49Z" fill="#F37D2C"/>
<path d="M163.87 930.67C163.26 681.66 163.25 402.33 163.87 153.32C164.49 402.33 164.48 681.66 163.87 930.67Z" fill="#F37D2C"/>
<path d="M1021.83 853.06C701.67 853.64 320.14 853.64 0 853.06C320.16 852.48 701.69 852.48 1021.83 853.06Z" fill="#F37D2C"/>
<path d="M967.13 74.8601C790.99 75.4701 593.41 75.4801 417.28 74.8601C593.42 74.2401 791 74.2501 967.13 74.8601Z" fill="#F37D2C"/>
<path d="M967.13 277.98C677.3 278.59 352.17 278.6 62.34 277.98C352.17 277.36 677.3 277.37 967.13 277.98Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 3: Write `src/assets/support/lines-infrastructure.svg`** (Figma node 1:20303)

```svg
<svg viewBox="0 0 1021.83 1012.49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M899.79 1012.49C899.21 695.26 899.21 317.22 899.79 0C900.37 317.23 900.37 695.27 899.79 1012.49Z" fill="#F37D2C"/>
<path d="M163.86 930.67C163.25 634.21 163.24 301.65 163.86 5.18994C164.48 301.65 164.47 634.21 163.86 930.67Z" fill="#F37D2C"/>
<path d="M1021.83 853.05C701.67 853.63 320.14 853.63 0 853.05C320.16 852.47 701.69 852.47 1021.83 853.05Z" fill="#F37D2C"/>
<path d="M554.89 74.8599C397.97 75.4699 221.95 75.4799 65.04 74.8599C221.96 74.2399 397.98 74.2499 554.89 74.8599Z" fill="#F37D2C"/>
<path d="M967.13 277.98C677.3 278.59 352.17 278.6 62.34 277.98C352.17 277.36 677.3 277.37 967.13 277.98Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 4: Write `src/assets/support/lines-piloting.svg`** (Figma node 1:20687)

```svg
<svg viewBox="0 0 1021.83 962.49" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M899.8 962.49C899.28 657.09 899.13 304.77 899.8 0C900.47 304.58 900.32 657.3 899.8 962.49Z" fill="#F37D2C"/>
<path d="M163.87 950.67C163.26 695.25 163.25 408.74 163.87 153.32C164.49 408.74 164.48 695.25 163.87 950.67Z" fill="#F37D2C"/>
<path d="M1021.83 853.06C701.67 853.64 320.14 853.64 0 853.06C320.16 852.48 701.69 852.48 1021.83 853.06Z" fill="#F37D2C"/>
<path d="M967.13 74.8602C790.99 75.4702 593.41 75.4802 417.28 74.8602C593.42 74.2402 791 74.2502 967.13 74.8602Z" fill="#F37D2C"/>
<path d="M967.13 277.98C677.3 278.59 352.17 278.6 62.34 277.98C352.17 277.36 677.3 277.37 967.13 277.98Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 5: Write `src/assets/support/divider-line.svg`** — the shared subtitle-divider spindle. This is every group's fifth path (`M967.13 277.98 …`) rebased to its own bounding box (translate x−62.34, y−277.36):

```svg
<svg viewBox="0 0 904.79 1.24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M904.79 0.62C614.96 1.23 289.83 1.24 0 0.62C289.83 0 614.96 0.01 904.79 0.62Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 6: Write `src/assets/support/spark-diagram.svg`** (Figma node 1:19581 export, exact path — do NOT reuse `about/spark-orange.svg`, whose viewBox is padded 0.46px):

```svg
<svg viewBox="0 0 60.78 60.78" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.54 32.54L0 30.39L15.54 28.24C22.14 27.33 27.33 22.14 28.24 15.54L30.39 0L32.54 15.54C33.45 22.14 38.64 27.33 45.24 28.24L60.78 30.39L45.24 32.54C38.64 33.45 33.45 38.64 32.54 45.24L30.39 60.78L28.24 45.24C27.33 38.64 22.14 33.45 15.54 32.54Z" fill="#F37D2C"/>
</svg>
```

- [ ] **Step 7: Verify build**

Run: `bun run build`
Expected: "7 page(s) built", exit 0 (assets are unused so far; this just proves nothing is broken).

- [ ] **Step 8: Commit**

```bash
git add src/assets/support/lines-*.svg src/assets/support/divider-line.svg src/assets/support/spark-diagram.svg
git commit -m "feat: add Figma-exact support-stack line/spark SVG assets"
```

---

### Task 2: Replace line/spark markup and CSS in SupportStack.astro

**Files:**
- Modify: `src/components/support/SupportStack.astro`

**Interfaces:**
- Consumes: the six assets from Task 1.
- Produces: final DOM — `.lines-*` (4), `.divider-*` (4), `.spark.spark-lg/.spark-sm` (12) inside `.stage-artboard`. Everything else in the file (cards, arts, script, mobile layout) unchanged.

- [ ] **Step 1: Replace the imports.** In the frontmatter, replace

```ts
import SparkOrange from "../../assets/about/spark-orange.svg";
```

with

```ts
import LinesCapital from "../../assets/support/lines-capital.svg";
import LinesExpertise from "../../assets/support/lines-expertise.svg";
import LinesInfrastructure from "../../assets/support/lines-infrastructure.svg";
import LinesPiloting from "../../assets/support/lines-piloting.svg";
import DividerLine from "../../assets/support/divider-line.svg";
import SparkDiagram from "../../assets/support/spark-diagram.svg";
```

and add a `SPARKS` constant after the `CARDS` array (before the closing `---`):

```ts
// Figma sparks: 8 big (60.78px) at closing-line crossings, 4 small (31.36px)
// on the opening lines. Keys map to position classes below; nodes in comments.
const SPARKS = [
  { key: "capital-open", size: "sm" }, // 1:19582
  { key: "capital-left", size: "lg" }, // 1:19584
  { key: "capital-mid", size: "lg" }, // 1:19581
  { key: "expertise-open", size: "sm" }, // 1:19944
  { key: "expertise-mid", size: "lg" }, // 1:19946
  { key: "expertise-right", size: "lg" }, // 1:19943
  { key: "infrastructure-open", size: "sm" }, // 1:20311
  { key: "infrastructure-left", size: "lg" }, // 1:20313
  { key: "infrastructure-mid", size: "lg" }, // 1:20310
  { key: "piloting-open", size: "sm" }, // 1:20695
  { key: "piloting-mid", size: "lg" }, // 1:20697
  { key: "piloting-right", size: "lg" }, // 1:20694
];
```

- [ ] **Step 2: Replace the decoration markup.** Inside `.stage-artboard`, replace the seven `.line` divs

```astro
      <div class="line line-v line-left" aria-hidden="true"></div>
      <div class="line line-v line-mid" aria-hidden="true"></div>
      <div class="line line-v line-right" aria-hidden="true"></div>
      <div class="line line-h line-one" aria-hidden="true"></div>
      <div class="line line-h line-two" aria-hidden="true"></div>
      <div class="line line-h line-three" aria-hidden="true"></div>
      <div class="line line-h line-four" aria-hidden="true"></div>

      {
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"].map((id) => (
          <SparkOrange class={`spark spark-${id}`} aria-hidden="true" />
        ))
      }
```

with

```astro
      <LinesCapital class="lines lines-capital" aria-hidden="true" />
      <LinesExpertise class="lines lines-expertise" aria-hidden="true" />
      <LinesInfrastructure class="lines lines-infrastructure" aria-hidden="true" />
      <LinesPiloting class="lines lines-piloting" aria-hidden="true" />

      <DividerLine class="divider divider-capital" aria-hidden="true" />
      <DividerLine class="divider divider-expertise" aria-hidden="true" />
      <DividerLine class="divider divider-infrastructure" aria-hidden="true" />
      <DividerLine class="divider divider-piloting" aria-hidden="true" />

      {SPARKS.map(({ key, size }) => (
        <SparkDiagram class={`spark spark-${size} spark-${key}`} aria-hidden="true" />
      ))}
```

- [ ] **Step 3: Replace the decoration CSS.** Delete the whole block from `.line {` through the end of `.spark-m { … }` (all `.line*` and `.spark*` rules, including their history comments) and insert:

```css
  /* The four decorative line groups are exported 1:1 from Figma (nodes
     1:19574 / 1:19936 / 1:20303 / 1:20687): tapered spindle-shaped strokes,
     solid #F37D2C, full opacity. Positions are the groups' exact offsets
     inside the 109.87rem x 168rem artboard. Adjacent groups are designed so
     one group's subtitle divider is collinear with its neighbour's closing
     line, which is what makes the long horizontals read as continuous. */
  .lines {
    position: absolute;
    z-index: 0;
    width: 63.86rem; /* 1021.83px, all four groups share this width */
    height: auto;
    pointer-events: none;
  }

  .lines-capital {
    left: 0;
    top: 0;
  }

  .lines-expertise {
    left: 46.01rem; /* 736.09px */
    top: 35.95rem; /* 575.22px */
  }

  .lines-infrastructure {
    left: 0;
    top: 71.89rem; /* 1150.30px */
  }

  .lines-piloting {
    left: 46.01rem;
    top: 107.85rem; /* 1725.52px */
  }

  /* Each card's subtitle divider crosses its own card box (between subtitle
     and intro — Figma places it in that whitespace). The cards keep a cream
     background at z-index 2 to mask line overflow when the counter-scaled
     text grows at narrower desktop widths, so the divider is re-drawn above
     the card (z-index 3). It is the same spindle path as the one inside the
     line groups, at the same coordinates — they overlap exactly. */
  .divider {
    position: absolute;
    z-index: 3;
    width: 56.55rem; /* 904.79px */
    height: auto;
    pointer-events: none;
  }

  .divider-capital {
    left: 3.9rem;
    top: 17.34rem; /* group top + 277.36px (the divider path's ink-bounds top) */
  }

  .divider-expertise {
    left: 49.9rem;
    top: 53.29rem;
  }

  .divider-infrastructure {
    left: 3.9rem;
    top: 89.23rem;
  }

  .divider-piloting {
    left: 49.9rem;
    top: 125.18rem;
  }

  /* Sparks: two Figma sizes — 60.78px (closing-line crossings) and 31.36px
     (opening lines). Offsets are each node's exact top-left. */
  .spark {
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }

  .spark-lg {
    width: 3.8rem;
    height: 3.8rem;
  }

  .spark-sm {
    width: 1.96rem;
    height: 1.96rem;
  }

  .spark-capital-open {
    left: 55.26rem;
    top: 3.7rem;
  }

  .spark-capital-left {
    left: 8.34rem;
    top: 51.42rem;
  }

  .spark-capital-mid {
    left: 54.34rem;
    top: 51.42rem;
  }

  .spark-expertise-open {
    left: 101.26rem;
    top: 39.65rem;
  }

  .spark-expertise-mid {
    left: 54.35rem;
    top: 87.37rem;
  }

  .spark-expertise-right {
    left: 100.34rem;
    top: 87.37rem;
  }

  .spark-infrastructure-open {
    left: 9.26rem;
    top: 75.59rem;
  }

  .spark-infrastructure-left {
    left: 8.34rem;
    top: 123.31rem;
  }

  .spark-infrastructure-mid {
    left: 54.34rem;
    top: 123.31rem;
  }

  .spark-piloting-open {
    left: 101.26rem;
    top: 111.54rem;
  }

  .spark-piloting-mid {
    left: 54.35rem;
    top: 159.26rem;
  }

  .spark-piloting-right {
    left: 100.34rem;
    top: 159.26rem;
  }
```

- [ ] **Step 4: Update the mobile hide rule.** In the `@media (max-width: 1199.98px)` block, replace

```css
    .line,
    .spark {
      display: none;
    }
```

with

```css
    .lines,
    .divider,
    .spark {
      display: none;
    }
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: "7 page(s) built", exit 0, no unused-import warnings for the removed `SparkOrange`.

- [ ] **Step 6: Commit**

```bash
git add src/components/support/SupportStack.astro
git commit -m "fix: replace support-stack lines/sparks with Figma-exact SVG geometry"
```

---

### Task 3: Desktop visual verification against Figma (iterate until identical)

**Files:**
- No source changes expected; fixes loop back into Task 2's files if deviations are found.

**Interfaces:**
- Consumes: reference renders `…/scratchpad/figma-stack-top.png`, `…/scratchpad/figma-stack-bottom.png` and the user-supplied live screenshot showing the old misalignment.

- [ ] **Step 1: Start the dev server**

Run: `bun run dev` (background). Expected: serving on localhost (typically :4321).

- [ ] **Step 2: Screenshot the support page at 1920×** using Chrome MCP tools (resize window to 1920 width; navigate to `http://localhost:4321/support`). Capture the full stack section (scroll through all four cards).

- [ ] **Step 3: Compare against the Figma references, checklist:**
  - Mid vertical line runs at 56.24rem (899.79px artboard, ≈20px right of true center), from artboard top down to 167.26rem — extending ~6.1rem past the last closing line (161.16rem). No spark at its very top (y=0); the first spark on it is capital-open at 3.70rem.
  - Left vertical line: two segments (9.58→58.17rem, then 72.22→130.06rem) — visible gap across the Expertise band.
  - Right vertical line at 102.24rem (not flush to the right edge): segments 35.95→99.23rem and 107.84→168rem.
  - Per card: opening short line above the card with one small spark on it; subtitle divider crossing the card between subtitle and intro; closing line below the card with big sparks where verticals cross it.
  - Long horizontals centered at y 53.32 / 89.27 / 125.21rem read as continuous from the collinear divider+closing pairs; the piloting closing line (center 161.16rem) stops at x 46.01rem on the left.
  - Lines are tapered (fade to points at ends), solid orange, no uniform-opacity look.
  - Sparks: exactly 12; two visibly different sizes; positions on the crossings.
  - Illustrations and card text have NOT moved.
- [ ] **Step 4: Check narrower desktop widths** (1600, 1440, 1280): the artboard scales as a unit; dividers must stay between subtitle and intro; no line may strike through text. Also spot-check <1200px (e.g. 800): no lines/dividers/sparks rendered, stacked layout unchanged.
- [ ] **Step 5: If any deviation from Figma is found**, adjust the corresponding value in `SupportStack.astro` (or the asset), rebuild, re-screenshot, and re-run this checklist until the render matches the references. Commit each fix with a `fix:` message describing the exact deviation corrected.
- [ ] **Step 6: Final `bun run build`** — expected: 7 pages, exit 0.
