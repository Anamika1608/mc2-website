# Press Releases Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A new `/press-releases` page (hero + PDF-thumbnail card grid, one card today) matching the MC²+ site's existing design system, linked from the header (before Apply) and the footer ENGAGE column.

**Architecture:** An Astro page composing two new components (`PressHero`, `PressGrid`) with releases as a typed data array (`src/data/press.ts`), cloning the ContactHero pattern for the hero and the site's card-grid conventions for the grid. Spec: `docs/superpowers/specs/2026-07-10-press-releases-page-design.md`.

**Tech Stack:** Astro 7 + Bun; `astro:assets` for the cover image; Playwright (`playwright-core` from the session scratchpad's node_modules) for browser verification; no unit-test framework exists in this repo — the established verification cycle is `bunx astro check` + Playwright measurements + `bun run build`.

## Global Constraints

- Work ONLY in worktree `.claude/worktrees/press-releases-page`, branch `feat/press-releases-page`.
- Nav/footer label is exactly `Press releases` (sentence case); URL is exactly `/press-releases`.
- Copy must match the spec verbatim (H1 `Press releases.`; lede and card fields as written in Task 1/2).
- No co-author trailer in commits. No push/merge to main.
- Dev server: `bun run dev -- --port 4410` (4321 and 4400-4409 may be taken; check the log for the actual port and substitute it in verification commands).
- Every task ends with `bunx astro check` reporting 0 errors before its commit.

---

### Task 1: Assets + data module

**Files:**
- Create: `public/press/oil-ptrc-collaboration-2026-06-11.pdf` (copy from `/private/tmp/claude-501/-Users-anamika-work-mc2-website/f791b7c1-6011-4071-94d5-9933507916a9/scratchpad/press/press-release-oil-ptrc.pdf`)
- Create: `src/assets/press/press-cover.jpg` (copy from `/private/tmp/claude-501/-Users-anamika-work-mc2-website/f791b7c1-6011-4071-94d5-9933507916a9/scratchpad/press/press-cover.jpg`)
- Create: `src/data/press.ts`

**Interfaces:**
- Produces: `RELEASES: Release[]` where `Release = { title: string; date: string; summary: string; cover: ImageMetadata; pdf: string }` — consumed by Task 3's `PressGrid.astro`.

- [ ] **Step 1: Copy the two downloaded assets into the worktree**

```bash
cd /Users/anamika/work/mc2-website/.claude/worktrees/press-releases-page
mkdir -p public/press src/assets/press
cp "/private/tmp/claude-501/-Users-anamika-work-mc2-website/f791b7c1-6011-4071-94d5-9933507916a9/scratchpad/press/press-release-oil-ptrc.pdf" public/press/oil-ptrc-collaboration-2026-06-11.pdf
cp "/private/tmp/claude-501/-Users-anamika-work-mc2-website/f791b7c1-6011-4071-94d5-9933507916a9/scratchpad/press/press-cover.jpg" src/assets/press/press-cover.jpg
file public/press/*.pdf src/assets/press/*.jpg
```

Expected: `PDF document, version 1.7, 2 pages` and `JPEG image data ... 1000x845`.

- [ ] **Step 2: Create the data module**

Create `src/data/press.ts` with exactly:

```ts
// Press releases shown on /press-releases. Content migrated verbatim from the
// previous site (https://mc2plus.in/press-release/) per user directive
// 2026-07-10 — see docs/superpowers/specs/2026-07-10-press-releases-page-design.md.
// To add a release: drop its PDF in public/press/, its cover in
// src/assets/press/, and append an entry here (newest first).
import type { ImageMetadata } from "astro";
import oilPtrcCover from "../assets/press/press-cover.jpg";

export interface Release {
  title: string;
  date: string;
  summary: string;
  cover: ImageMetadata;
  pdf: string;
}

export const RELEASES: Release[] = [
  {
    title:
      "Oil India Limited (OIL) and Petroleum Technology Research Centre (PTRC), Canada sign a Collaboration Framework at the Global Energy Show 2026, Calgary",
    date: "11 June 2026",
    summary:
      "Oil India Limited (OIL) and Petroleum Technology Research Centre (PTRC), Canada sign a Collaboration Framework at the Global Energy Show 2026, Calgary, with mc²+ identified as the designated platform for collaborative startup research.",
    cover: oilPtrcCover,
    pdf: "/press/oil-ptrc-collaboration-2026-06-11.pdf",
  },
];
```

- [ ] **Step 3: Verify it type-checks**

```bash
cd /Users/anamika/work/mc2-website/.claude/worktrees/press-releases-page
bun install && bunx astro check 2>&1 | tail -3
```

Expected: `0 errors` (an "unused" hint for RELEASES is acceptable until Task 3 consumes it).

- [ ] **Step 4: Commit**

```bash
git add public/press src/assets/press src/data/press.ts
git commit -m "feat: press release assets and data module"
```

---

### Task 2: PressHero component

**Files:**
- Create: `src/components/press/PressHero.astro`

**Interfaces:**
- Consumes: shared assets `src/assets/contact/hero-curves.svg`, `src/assets/home/scroll-arrow.svg`, `src/assets/shared/reveal-star.svg`; shared reveal classes from `src/styles/global.css` (`reveal`, `reveal-line*`, `reveal-rise`, `reveal-rise--after-1-line`).
- Produces: `<PressHero />` (no props) — consumed by Task 4's page.

- [ ] **Step 1: Create the component**

Create `src/components/press/PressHero.astro` with exactly:

```astro
---
// No Figma exists for this page (user-confirmed) — the hero is structurally
// cloned from ContactHero.astro, the site's simplest hero, reusing its shared
// tokens/animation classes and the contact curves asset verbatim so the page
// matches the established design system rather than inventing new vocabulary.
// Copy adapted from the previous site (https://mc2plus.in/press-release/):
// old "MC² Plus" normalized to this site's own "MC²+" convention.
// Scroll arrow reused from home (HowItWorks.astro precedent: the per-page
// scroll-arrow.svg exports are byte-identical).
import HeroCurves from "../../assets/contact/hero-curves.svg";
import ScrollArrow from "../../assets/home/scroll-arrow.svg";
import RevealStar from "../../assets/shared/reveal-star.svg";
---

<section class="hero">
  <div class="orbit" aria-hidden="true">
    <HeroCurves class="curves" />
  </div>

  <div class="hero-inner reveal">
    <p class="eyebrow">PRESS RELEASES</p>
    <div class="underline" aria-hidden="true"></div>

    <h1>
      <span class="line reveal-line">
        <span class="reveal-line-box">
          <span class="reveal-line-text">Press <span class="accent">releases</span>.</span>
          <RevealStar class="reveal-star" aria-hidden="true" />
        </span>
      </span>
    </h1>

    <p class="lede reveal-rise reveal-rise--after-1-line">
      Announcements and updates from MC&sup2;+ and India&rsquo;s oil &amp; gas
      sector partners.
    </p>

    <button type="button" class="scroll" aria-label="Scroll to next section">
      <ScrollArrow aria-hidden="true" />
    </button>
  </div>
</section>

<script>
  // Same scroll-chevron behavior as the other heroes: scroll to the next
  // section smoothly.
  document.querySelector(".hero .scroll")?.addEventListener("click", () => {
    document
      .querySelector(".hero")
      ?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
  });
</script>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    background: var(--color-cream);
    padding-block: 6rem 0;
  }
  @media (min-width: 1024px) {
    .hero {
      /* Content stack (eyebrow → chevron) is shorter than Contact's (1-line
         H1, shorter lede), so Contact's 47rem floor would leave dead space;
         36rem verified visually to clear the content with the same
         chevron-to-next-section rhythm as the other heroes. */
      min-height: 36rem;
    }
  }

  .orbit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 0;
    pointer-events: none;
  }
  .curves {
    display: block;
    width: 100%;
    height: auto;
  }

  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 57.25rem;
    margin-inline: auto;
    padding-inline: 1.25rem;
    text-align: center;
  }

  .eyebrow {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--text-hero-eyebrow);
    letter-spacing: 0.25em;
    color: var(--color-gray);
  }
  .underline {
    width: 11.77rem;
    height: 1px;
    margin: 2.82rem auto 1.72rem;
    background: #000; /* same one-off hairline literal as the sibling heroes */
  }

  h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: var(--text-hero-h1);
    line-height: var(--text-hero-h1-lh);
    color: #1e1e3e; /* sibling heroes' documented H1 literal */
  }
  h1 .line {
    display: block;
  }
  h1 .accent {
    color: var(--color-orange-bright);
  }

  .lede {
    max-width: 50.31rem;
    margin: 1.54rem auto 0;
    font-family: var(--font-sans);
    font-size: var(--text-hero-lede);
    line-height: var(--text-hero-lede-lh);
    color: #1e1e3e;
    text-align: center;
  }

  .scroll {
    display: block;
    margin: 5rem auto 0; /* shorter stack than Contact's 8.54rem — keeps the chevron from floating in dead space under a 1-line H1 */
  }

  @media (max-width: 1023.98px) {
    h1 {
      font-size: var(--text-hero-h1-fluid);
    }
    .lede {
      max-width: 90%;
    }
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
bunx astro check 2>&1 | tail -3
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add src/components/press/PressHero.astro
git commit -m "feat: press releases hero, cloned from the shared hero pattern"
```

---

### Task 3: PressGrid component

**Files:**
- Create: `src/components/press/PressGrid.astro`

**Interfaces:**
- Consumes: `RELEASES` from `src/data/press.ts` (Task 1); `Image` from `astro:assets`.
- Produces: `<PressGrid />` (no props) — consumed by Task 4's page.

- [ ] **Step 1: Create the component**

Create `src/components/press/PressGrid.astro` with exactly:

```astro
---
// PDF-thumbnail grid for /press-releases: each card links straight to its
// release PDF in a new tab (same interaction as AdvisoryBoard's profile-PDF
// links). Grid breakpoints follow the site's established set (1023.98 /
// 639.98). One release today; future ones are a data entry + two assets
// (see src/data/press.ts).
import { Image } from "astro:assets";
import { RELEASES } from "../../data/press";
---

<section class="press">
  <div class="container">
    <div class="grid">
      {RELEASES.map((r) => (
        <a class="card" href={r.pdf} target="_blank" rel="noopener" aria-label={`Read the press release (PDF): ${r.title}`}>
          <Image
            src={r.cover}
            alt=""
            widths={[480, 960]}
            sizes="(max-width: 639.98px) 90vw, (max-width: 1023.98px) 45vw, 480px"
            class="cover"
          />
          <p class="date">{r.date}</p>
          <h2 class="title">{r.title}</h2>
          <p class="summary">{r.summary}</p>
        </a>
      ))}
    </div>
  </div>
</section>

<style>
  .press {
    background: var(--color-cream);
    padding-block: 2rem 7rem; /* hero owns the gap above; generous bottom before the footer, matching sibling last-sections */
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3rem; /* AdvisoryBoard's grid gap convention */
  }

  .card {
    display: block;
    color: inherit;
    text-decoration: none;
  }
  .card:hover .title,
  .card:focus-visible .title {
    text-decoration: underline; /* the affordance — AdvisoryBoard pdf-link convention */
  }

  .cover {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--color-line); /* the cover is a white document page on a cream background — hairline keeps its edges defined, same token as the site's other hairlines */
  }

  .date {
    margin: 1.25rem 0 0.5rem;
    font-family: var(--font-sans);
    font-size: 0.9375rem; /* 15px — the site's small-label size (ContactForm labels) */
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-gray);
  }

  .title {
    margin: 0 0 0.75rem;
    font-family: var(--font-display);
    font-size: 1.5rem; /* 24px — AdvisoryBoard card-name scale */
    line-height: 1.3;
    font-weight: 400;
    color: var(--color-ink-alt);
  }

  .summary {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 1.0625rem; /* 17px — the site's body-copy scale */
    line-height: 1.5;
    color: var(--color-gray);
  }

  @media (max-width: 1023.98px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 639.98px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
bunx astro check 2>&1 | tail -3
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add src/components/press/PressGrid.astro
git commit -m "feat: press release PDF-thumbnail grid"
```

---

### Task 4: Page + header/footer navigation

**Files:**
- Create: `src/pages/press-releases.astro`
- Modify: `src/data/nav.ts` (append one item)
- Modify: `src/components/Footer.astro` (ENGAGE array, ~line 8-12)

**Interfaces:**
- Consumes: `PressHero`, `PressGrid` (Tasks 2-3); `BaseLayout` from `src/layouts/BaseLayout.astro`.
- Produces: the routable page; nav entries.

- [ ] **Step 1: Create the page**

Create `src/pages/press-releases.astro` with exactly:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PressHero from "../components/press/PressHero.astro";
import PressGrid from "../components/press/PressGrid.astro";
---

<BaseLayout title="Press Releases · MC²+">
  <PressHero />
  <PressGrid />
</BaseLayout>
```

- [ ] **Step 2: Append the nav item**

In `src/data/nav.ts`, append to `NAV_ITEMS` after the Contact entry (the header renders NAV_ITEMS then the hardcoded Apply pill, so this lands exactly "just before the Apply button" per the user directive):

```ts
  { label: "Press releases", href: "/press-releases" },
```

- [ ] **Step 3: Add the footer ENGAGE entry**

In `src/components/Footer.astro`, the `ENGAGE` array becomes:

```ts
const ENGAGE = [
  { label: "Coming soon", href: "/contact" },
  { label: "Contact", href: "/contact" },
  { label: "Partners", href: "/contact" },
  { label: "Press releases", href: "/press-releases" },
];
```

(Note: footer EXPLORE is `NAV_ITEMS.slice(0, 5)` — unaffected by Step 2's append at index 6.)

- [ ] **Step 4: Type-check and build**

```bash
bunx astro check 2>&1 | tail -3 && bun run build 2>&1 | tail -3
ls dist/press-releases/index.html dist/press/
```

Expected: `0 errors`; build reports **8 page(s)**; both dist paths exist.

- [ ] **Step 5: Commit**

```bash
git add src/pages/press-releases.astro src/data/nav.ts src/components/Footer.astro
git commit -m "feat: press releases page, header + footer nav entries"
```

---

### Task 5: Browser verification sweep

**Files:**
- Create (scratchpad, not committed): `$SCRATCH/press-page-check.mjs`

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/anamika/work/mc2-website/.claude/worktrees/press-releases-page
nohup bun run dev -- --port 4410 > "$SCRATCH/press-dev.log" 2>&1 < /dev/null & disown
sleep 3 && tail -1 "$SCRATCH/press-dev.log"
```

Note the actual port from the log (Astro auto-picks if 4410 is taken); substitute below.

- [ ] **Step 2: Run the verification script**

Write `$SCRATCH/press-page-check.mjs`:

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch();
for (const w of [1920, 1366, 1024, 768, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, reducedMotion: "reduce" });
  await page.goto("http://localhost:4410/press-releases?t=" + Date.now(), { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const m = await page.evaluate(() => {
    const card = document.querySelector(".press .card");
    const nav = document.querySelector(".nav-list");
    return {
      cardHref: card?.getAttribute("href"),
      cardTarget: card?.getAttribute("target"),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      navHeight: nav ? Math.round(nav.getBoundingClientRect().height) : null,
      hasPressNav: !!document.querySelector('a[href="/press-releases"]'),
    };
  });
  console.log(w, JSON.stringify(m));
  if (w === 1920 || w === 390) await page.screenshot({ path: `${process.env.SCRATCH}/press-${w}.png`, fullPage: true });
  await page.close();
}
// PDF served?
const p = await browser.newPage();
const r = await p.request.get("http://localhost:4410/press/oil-ptrc-collaboration-2026-06-11.pdf");
console.log("pdf status:", r.status());
await browser.close();
```

Run: `SCRATCH="$SCRATCH" node "$SCRATCH/press-page-check.mjs"`

Expected at every width: `cardHref: "/press/oil-ptrc-collaboration-2026-06-11.pdf"`, `cardTarget: "_blank"`, `overflow: false`, `hasPressNav: true`, `pdf status: 200`. At ≥1024px, `navHeight` must equal the other pages' single-row height (~same value at 1366 and 1920 — a jump at 1366 means the 7-item nav wrapped: fix by tightening `.nav-list` gap in Header.astro before proceeding).

- [ ] **Step 3: Visual review**

Read `$SCRATCH/press-1920.png` and `$SCRATCH/press-390.png`: hero anatomy matches sibling heroes (eyebrow/underline/H1 with orange accent/lede/chevron + curves), card reads cleanly (cover, date label, display title, summary), footer shows "Press releases" under ENGAGE, header shows PRESS RELEASES before Apply. Also screenshot `/contact` at 1920px once to confirm the nav addition didn't disturb an existing page's header.

- [ ] **Step 4: Final commit (only if fixes were needed in Step 2-3)**

```bash
git add -A src && git commit -m "fix: press page verification adjustments"
```

---

## Self-review notes

- Spec coverage: route/label/nav placement (Task 4), hero copy + pattern (Task 2), card anatomy + PDF link behavior (Task 3), verbatim content + assets (Task 1), verification incl. 7-item nav wrap risk (Task 5). Out-of-scope items (CMS, detail pages, redirects) have no tasks — correct.
- Types consistent: `Release`/`RELEASES` defined in Task 1, consumed by name in Task 3.
- No placeholders; all code complete.
