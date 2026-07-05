# Astro Project Base Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a working Astro 7 project base in the existing `mc2-website` repo, with the MC²+ brand fonts self-hosted, design tokens defined from exact design-file colors, and a base layout — verified with a passing dev server and production build.

**Architecture:** Static-first Astro site scaffolded from the official `minimal` template into the repo root. Fonts are self-hosted via Astro's stable Fonts API (local provider). Brand colors/typography live as CSS custom properties in one global stylesheet, consumed by a shared `BaseLayout.astro` that every page will use.

**Tech Stack:** Astro 7.0.x (latest 7.0.6 as of 2026-07-05), Bun 1.3.4 (package manager + script runner), Node.js runtime (local v25.2.1; `.nvmrc` pins 24 LTS for CI/deploy), TypeScript (template default config).

## Global Constraints

- Working directory for all commands: `/Users/anamika/work/mc2-website` (repo root).
- Package manager: **Bun** (local v1.3.4). All installs and scripts go through Bun (`bun install`, `bun run dev|build|preview`, `bunx` for one-off CLIs) — never npm/npx/yarn/pnpm. Verified against the official Astro Bun recipe (docs.astro.build/en/recipes/bun) on 2026-07-05. Note: `bun run <script>` still executes the Astro CLI on the Node runtime by default — Bun replaces npm here, not Node.
- Astro requires Node `>=22.12.0` (package.json `engines`); Astro docs support only even-numbered Node majors. Local Node v25.2.1 satisfies `engines` and is acceptable locally; `.nvmrc` must contain `24` so CI/deploy uses LTS.
- Git commits: plain messages only. **Never add `Co-Authored-By: Claude ...` or "Generated with Claude Code" trailers** (user directive).
- Verify-don't-assume: all commands/APIs below were verified against docs.astro.build and the create-astro README on 2026-07-05. If any step's output deviates, re-check the docs before improvising.
- **Do NOT ship `MyriadPro-Regular.otf`** as a webfont — Myriad Pro is Adobe-licensed and not cleared for web embedding. Sora substitutes for its (incidental) uses.
- Brand colors are exact values extracted from `MC2_AllPages_Folder/MC2_AllPages.ai` vector data — do not eyeball or invent hex values.
- Site URL: `https://mcplus.in`.
- Do not modify or move `MC2_AllPages_Folder/` (design source of truth) other than copying font files out of it.

## File Structure After This Plan

```
mc2-website/
├── MC2_AllPages_Folder/          # design package — untouched source of truth
├── docs/superpowers/plans/       # this plan
├── public/                       # from template (favicon.svg)
├── src/
│   ├── assets/fonts/             # Task 2: Sora + Faculty Glyphic (copied from design package)
│   ├── layouts/BaseLayout.astro  # Task 3: html shell, fonts, global css
│   ├── styles/global.css         # Task 3: design tokens + minimal reset
│   └── pages/index.astro         # Task 3: placeholder homepage proving tokens/fonts
├── astro.config.mjs              # Task 2: site + fonts config
├── package.json / bun.lock
├── tsconfig.json                 # template default (extends astro/tsconfigs/strict)
├── .nvmrc                        # Task 1: "24"
├── .gitignore                    # from template
└── README.md                     # Task 1: rewritten project readme
```

---

### Task 1: Scaffold Astro 7 minimal template into the repo root

**Files:**
- Create: `package.json`, `bun.lock`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/`, `.gitignore`, `.nvmrc`
- Modify: `README.md` (template overwrites the 13-byte placeholder; then we rewrite it)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a runnable Astro project at repo root with package.json scripts `dev`, `build`, `preview` (run via `bun run`); Task 2 edits the generated `astro.config.mjs`; Task 3 edits the generated `src/pages/index.astro`.

- [ ] **Step 1: Preflight checks**

Run: `node -v && bun --version && git status --porcelain`
Expected: `v25.2.1` (or any Node ≥22.12.0), Bun `1.3.4` (or newer), and empty git status (clean tree). If the tree is dirty, stop and ask the user before proceeding.

- [ ] **Step 2: Scaffold into a temp subdirectory**

create-astro prompts interactively when the target directory is non-empty (our repo root is), so scaffold into a temp dir and move files in — fully non-interactive.

Run:
```bash
bunx create-astro@latest .scaffold-tmp --template minimal --no-git --no-install --no-ai -y
```
Expected: exit 0; `.scaffold-tmp/` contains `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/`, `.gitignore`, `README.md`. (Flags verified against the create-astro README: `--template`, `--no-git`, `--no-install`, `--no-ai`, `-y`. Unlike `npm create`, `bunx` forwards flags directly — no `--` separator.)

- [ ] **Step 3: Move scaffold into repo root and clean up**

Run:
```bash
rsync -a .scaffold-tmp/ ./ && rm -rf .scaffold-tmp
```
Expected: repo root now has the files listed above (dotfiles included). `MC2_AllPages_Folder/` and `docs/` untouched. Note: the template's `README.md` intentionally replaces the placeholder README — Step 6 rewrites it.

- [ ] **Step 4: Install dependencies and confirm Astro version**

Run:
```bash
bun install && bunx astro --version
```
Expected: install succeeds and creates `bun.lock` (Bun's text lockfile — commit it; there must be no `package-lock.json`); version prints `astro  v7.0.6` (or a newer 7.x — if it prints a different major, stop and re-check docs).

- [ ] **Step 5: Pin Node LTS for CI/deploy**

Create `.nvmrc` containing exactly:
```
24
```
(Local v25 satisfies `engines`, but odd Node majors are unsupported by Astro's policy; hosts like Netlify read `.nvmrc` and will build on 24 LTS.)

- [ ] **Step 6: Rewrite README.md**

Replace the template README content entirely with:
```markdown
# MC²+ Website

Marketing website for MC²+ (Multiply · Collaborate · Create) — India's flagship
energy innovation platform, backed by seven energy majors.

Built with [Astro](https://astro.build). Design source of truth lives in
`MC2_AllPages_Folder/MC2_AllPages.ai` (8 artboards, 1920px wide).

## Commands

| Command           | Action                                    |
| ----------------- | ----------------------------------------- |
| `bun install`     | Install dependencies                      |
| `bun run dev`     | Start dev server at `localhost:4321`      |
| `bun run build`   | Production build to `./dist/`             |
| `bun run preview` | Preview the production build locally      |

## Toolchain

Package manager: [Bun](https://bun.sh) (lockfile: `bun.lock`).
Runtime: Node 24 LTS (see `.nvmrc`). Requires Node >= 22.12.0.
```

- [ ] **Step 7: Verify dev server serves the template page**

Run:
```bash
bun run dev &
sleep 3
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
kill %1
```
Expected: `200`. (If the port differs, the dev command's stdout names the actual URL — use that.)

- [ ] **Step 8: Verify production build**

Run: `bun run build`
Expected: exit 0, output ends with a "Complete!" summary line, `dist/index.html` exists.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 7 minimal project base"
```
(No co-author trailer — plain message exactly as above.)

---

### Task 2: Self-hosted brand fonts via the Fonts API

**Files:**
- Create: `src/assets/fonts/Sora-VariableFont_wght.ttf`, `src/assets/fonts/FacultyGlyphic-Regular.ttf` (copies from the design package)
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: scaffolded `astro.config.mjs` from Task 1.
- Produces: font CSS variables `--font-sora` and `--font-faculty`, registered font family names `"Sora"` and `"Faculty Glyphic"`. Task 3's `<Font />` components and CSS tokens reference exactly these `cssVariable` names.

- [ ] **Step 1: Copy font files (excluding Myriad Pro)**

Run:
```bash
mkdir -p src/assets/fonts
cp "MC2_AllPages_Folder/Fonts/Sora-VariableFont_wght.ttf" src/assets/fonts/
cp "MC2_AllPages_Folder/Fonts/FacultyGlyphic-Regular.ttf" src/assets/fonts/
```
Expected: both files present in `src/assets/fonts/`. Myriad Pro deliberately NOT copied (Adobe license — see Global Constraints).

- [ ] **Step 2: Configure the Fonts API**

Replace the entire contents of `astro.config.mjs` with:
```js
// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mcplus.in",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Sora",
      cssVariable: "--font-sora",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Sora-VariableFont_wght.ttf"],
            weight: "100 800",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Faculty Glyphic",
      cssVariable: "--font-faculty",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/FacultyGlyphic-Regular.ttf"],
            weight: 400,
            style: "normal",
          },
        ],
      },
    },
  ],
});
```
Shape verified verbatim against docs.astro.build/en/guides/fonts (2026-07-05): top-level `fonts` array, `fontProviders.local()`, variants under `options`, variable-font weight as a `"min max"` string. Sora's variable weight axis spans 100–800.

Known risk: the docs example uses `.woff2` sources; `.ttf` is expected to work with the local provider (format inferred from extension). If the Task 2 Step 3 build fails on the font source, do NOT improvise — convert to woff2 with fontTools (`pip3 install fonttools brotli`, then `python3 -m fontTools.ttLib.woff2 compress <file>.ttf`), update the `src` paths, and note it in the commit message.

- [ ] **Step 3: Verify the config builds**

Run: `bun run build`
Expected: exit 0 with no config-validation errors. (Font assets are only emitted once a page uses `<Font />` — that lands in Task 3.)

- [ ] **Step 4: Commit**

```bash
git add src/assets/fonts astro.config.mjs
git commit -m "feat: self-host Sora and Faculty Glyphic via Fonts API"
```

---

### Task 3: Design tokens, base layout, and placeholder homepage

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (replace template content)

**Interfaces:**
- Consumes: `--font-sora` / `--font-faculty` cssVariables from Task 2.
- Produces: `BaseLayout.astro` with props `{ title: string; description?: string }` and a default `<slot />` — every future page imports this. Token names in `global.css` (`--color-ink`, `--color-orange`, `--color-cream`, etc.) are the palette contract for all page builds.

- [ ] **Step 1: Create the design-token stylesheet**

Create `src/styles/global.css`:
```css
/*
 * MC²+ design tokens.
 * Color values are exact, extracted from MC2_AllPages.ai vector data — do not tweak by eye.
 */
:root {
  /* Color */
  --color-ink: #1e1e3a;          /* primary navy — headings, body text, dark pills */
  --color-ink-alt: #1e1e3c;      /* navy variant present in some design fills */
  --color-orange: #f37d2c;       /* vivid orange — highlights, CTAs, footer */
  --color-orange-soft: #e58341;  /* muted orange — decorative curves, illustrations */
  --color-cream: #f3f2eb;        /* page background */
  --color-cream-alt: #f4f3ed;    /* alternate surface */
  --color-line: #e8e6da;         /* hairline borders / dividers */
  --color-gray: #959595;         /* muted text — eyebrows, captions */
  --color-green: #18784c;        /* logo leaf accent */
  --color-green-soft: #397650;   /* logo leaf accent (light) */
  --color-white: #ffffff;

  /* Typography (font cssVariables are injected by Astro's <Font /> components) */
  --font-display: var(--font-faculty), Georgia, serif;
  --font-sans: var(--font-sora), system-ui, sans-serif;
}

/* Minimal reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
  font-weight: 400;
  margin: 0;
}

img,
svg {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
}
```

- [ ] **Step 2: Create the base layout**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import { Font } from "astro:assets";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = "MC²+ — Multiply · Collaborate · Create. India's flagship energy innovation platform.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <Font cssVariable="--font-sora" preload />
    <Font cssVariable="--font-faculty" preload />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```
(`<Font />` import from `astro:assets` and `cssVariable`/`preload` props verified against the fonts guide.)

- [ ] **Step 3: Replace the placeholder homepage**

Replace the entire contents of `src/pages/index.astro` with:
```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="MC²+ · Multiply · Collaborate · Create">
  <main>
    <p class="eyebrow">Multiply · Collaborate · Create</p>
    <h1>Where ideas <span class="accent">multiply</span>.</h1>
    <p>Project base is ready — pages arrive in the next step.</p>
  </main>
</BaseLayout>

<style>
  main {
    min-height: 100vh;
    display: grid;
    place-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
  }
  .eyebrow {
    color: var(--color-gray);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0;
  }
  h1 {
    font-size: 3rem;
  }
  .accent {
    color: var(--color-orange);
  }
</style>
```

- [ ] **Step 4: Verify fonts and tokens are served**

Run:
```bash
bun run dev &
sleep 3
curl -s http://localhost:4321/ > /tmp/mc2-home.html
grep -c "font" /tmp/mc2-home.html
grep -o -- "--font-sora" /tmp/mc2-home.html | head -1
kill %1
```
Expected: the page HTML contains font preload `<link>` tags and the `--font-sora` custom property (injected by `<Font />`). If `--font-sora` is absent, the Fonts API wiring is wrong — re-read the fonts guide before changing code.

- [ ] **Step 5: Verify production build emits font assets**

Run:
```bash
bun run build
ls dist/_astro/fonts 2>/dev/null || grep -ro "fonts/" dist/_astro | head -3
```
Expected: build exit 0 and font files present in the `dist` output (exact emitted path may vary — any font asset under `dist/` confirms emission).

- [ ] **Step 6: Visual spot-check (human)**

Open `http://localhost:4321/` (via `bun run dev`) and confirm: cream background, navy Faculty Glyphic headline with the word "multiply" in orange, Sora body text. This is the human gate before commit.

- [ ] **Step 7: Commit**

```bash
git add src/styles src/layouts src/pages/index.astro
git commit -m "feat: add design tokens, base layout and placeholder homepage"
```

---

## Out of Scope (later plans)

- Header/footer components and the 7 real pages (Home, About, Initiatives, Support, Team, Portfolio, Contact).
- Logo/illustration asset extraction from the .ai file; partner logo sourcing.
- Portfolio filtering interactivity, contact form backend, deployment (Netlify).
- Font subsetting / woff2 optimization pass.
