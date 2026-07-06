# Portfolio Card — Orange Hover Highlight

**Goal:** On the `/portfolio` venture list, hovering (or keyboard-focusing) a card row highlights **that row only**: the row background turns **orange** (`--color-orange` `#f37d2c`) and all its text/marks turn **white**. Smooth transition. Each row highlights independently on its own hover.

**Branch:** `feat/portfolio-hover` (cut from synced `origin/main` `032b46d`).
**Scope:** ONLY `src/components/portfolio/Explorer.astro` (`.row` and its descendants). No other page, no layout change to the resting state.

## Current resting state (for reference)
Each `.row` = `.row-divider` (badge pill `.row-tag` + orange hairline + orange `.row-spark`) then `.row-body` (two columns: `.row-main` = `.row-name` + `.row-sector` w/ `.dot`; `.row-side` = `.row-desc` + `.row-link`). Resting colors: name/desc navy (`--color-ink-alt`), sector + dot gray (`--color-gray`), link orange, badge cream bg / navy border+text, hairline + spark orange.

## The hover behaviour to add
On `.row:hover` **and** `.row:focus-within`:
1. **Background:** the row gets an orange band. Add horizontal padding to `.row` plus a matching negative `margin-inline` (bleed) so the band has breathing room without shifting the resting text alignment, and a `border-radius` (~1.25–1.5rem). Set `background-color: var(--color-orange)` on hover.
2. **Text → white:**
   - `.row-name` → `--color-white`
   - `.row-sector` → `--color-white`; `.row-sector .dot` → `--color-white`
   - `.row-desc` → `--color-white`
   - `.row-link` → `--color-white` (it's orange at rest; would vanish on orange)
3. **Badge pill `.row-tag`:** border → white, text → white, background stays transparent/orange (i.e. becomes a white-outlined pill on the orange band). *(Verify it reads well; alternative = white fill + orange text.)*
4. **Orange marks → white so they stay visible on the orange band:**
   - `.row-divider` hairline: `background` → `--color-white` (it's a plain CSS background — trivial)
   - `.row-spark` (SVG): recolor to white via `filter: brightness(0) invert(1)` (its fill is baked orange), or fade it out — decide at build by rendering.
5. **Transition:** `transition: background-color 250ms ease` on `.row`, and `color 200ms ease` on the recolored descendants, for a smooth highlight.
6. **Only the hovered row** changes — selectors are scoped to `.row:hover …` / `.row:focus-within …`, so siblings are unaffected.

## Accessibility
- Use both `:hover` and `:focus-within` so keyboard users (tabbing to the "Visit Page" link) get the same highlight.
- Orange `#f37d2c` + white text is the same contrast pairing already accepted site-wide (a known, user-approved deferred WCAG item) — no new concern introduced.

## Implementation steps
1. `.row`: add `position: relative` (already), `border-radius`, horizontal padding + negative `margin-inline` bleed, and the `background-color`/`color` transitions.
2. Add the `.row:hover, .row:focus-within { background-color: var(--color-orange); }` rule.
3. Add the descendant white-recolor rules (name, sector, dot, desc, link, badge border/text, hairline background, spark filter).
4. Keep the existing `.row-link:hover { text-decoration: underline }` (or drop underline since it's now white-on-orange — decide by render).
5. Ensure mobile (<~900px) still works — the highlight is fine on touch/stacked layout; verify the bleed doesn't cause horizontal scroll (use `overflow` safe bleed).

## Verify
Render `/portfolio` in headless Chrome; to see the hover state, temporarily apply the hover rules to the first row via a preview class, screenshot, confirm orange band + white text (badge, name, sector, dot, description, Visit Page, hairline, spark all legible), then remove the preview class. Confirm the resting state is unchanged and no horizontal scroll. Commit + push the branch (`Explorer.astro` only).

## Out of scope
- The removed navy/photo hover stays removed.
- No changes to filters, hero, CtaDuo, or other pages.
