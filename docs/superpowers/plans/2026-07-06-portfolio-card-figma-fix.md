# Portfolio Venture Card — Figma-Exact Fix Plan

**Goal:** Make each `/portfolio` venture card match Figma frame `1:23922` (file `u4NLOVKuXUTKULhSn0sAJQ`) exactly. Reference card node: `1:24199` ("H2E Power", 1595×244px). Only the venture-card (`.row`) inside `src/components/portfolio/Explorer.astro` changes — filters, hero, CTA, and the hover-photo behaviour stay as-is. (Ignore the Xyma Analytics hover background per the user.)

## Root cause of the current mismatch
The card is meant to be a **two-column row** but currently renders **single-column** (Image the user shared). In `Explorer.astro`:
```
.row-body { display: flex; flex-wrap: wrap; gap: 2rem 3rem; }
.row-main { flex: 1 1 48%; }
.row-side { flex: 1 1 51%; }
```
`48% + 51% = 99%` **plus** a `3rem` (48px) column gap exceeds 100% of the container, so `flex-wrap` drops `.row-side` (description + Visit Page) onto a second line → the card becomes a tall single column. Secondary: the sector and "Visit Page" use the wrong font/size.

## The exact Figma card (measured — do not assume)
Card `1:24199` = 1595×244px. Structure:

**Top row (badge + rule + spark), vertical center ≈ card-y 44px:**
| Element | Figma | Node |
|---|---|---|
| Badge pill `BACKED BY {BACKER}` | outlined pill, ~2px navy border (`--color-ink-alt`), navy uppercase text; **font/size to confirm** (screenshot reads ~13–14px; current uses Sora 16px/600/0.04em — verify against `get_design_context` on the card badge) | 1:24299 |
| Orange horizontal rule | from badge right edge to the spark, at the badge's vertical center; orange (`#f37d2c`, faint) | — |
| Orange spark | right end of the rule; ~60px | 1:24200/24203 |

**Content — TWO COLUMNS (left ≈48%, right ≈52%):**
| Element | Figma exact | Node |
|---|---|---|
| **LEFT · Title** `{name}` | Faculty **65px**, `#1e1e3c` (`--color-ink-alt`); card-x 3, card-y ~115 | 1:24205 |
| **LEFT · Sector** `● {sector}` | dot (gray ~12px `#959595`) + text **Faculty 14.88px**, `#949494` (≈`--color-gray`), tracking **0.1em** (1.488/14.88); card-y ~225 (bottom) | 1:24314/24315 |
| **RIGHT · Description** | Sora **~20px** (derived from group h53.2 / 2 lines), `#1e1e3c`, max-width **42rem** (671.9px), 2 lines; starts card-x ~769 (≈48% of card), card-y ~139 | 1:24206 |
| **RIGHT · Visit Page** `Visit Page →` | **Faculty 14.88px**, `#f37d2c` (`--color-orange`), tracking **0.1em**, + arrow glyph; card-y ~225 (bottom, same baseline as sector) | 1:24317/24318 |

Vertical: title (top-left) and description (top-right) sit near the top; **sector and Visit Page align on the same bottom baseline** (card-y ~225). Left column: title x224 → sector x226. Right column begins at x≈990 (48.2% of the 1595 card).

## Deviations to fix (current → Figma)
1. **Layout — two columns, no wrap** (the main fix). Replace the wrapping flex with a non-wrapping split so `.row-main` (left) and `.row-side` (right) sit side by side at desktop. Options: `grid-template-columns: 48% 52%` (with the right column's inner content = description + Visit), or flex bases that sum ≤100% (e.g. `flex: 0 0 48%` / `0 0 48%` with `justify-content: space-between`, no `flex-wrap`). Right column content (description) left-edge ≈48% of the row.
2. **Sector font**: `Sora 1rem` → **Faculty 14.88px (0.93rem)**, `--color-gray`, letter-spacing **0.1em**. Keep the leading dot (~0.7rem, `--color-gray`). *(Note: sector text is title-case in Figma, e.g. "Hydrogen & Fuel Cells" — no `text-transform`.)*
3. **Visit Page font**: `Sora 1.25rem/600` → **Faculty 14.88px (0.93rem)**, `--color-orange`, letter-spacing **0.1em**, with the arrow. (Much smaller than now.)
4. **Bottom alignment**: sector (left) and Visit Page (right) share the bottom baseline — give each column enough height / use `justify-content: space-between` in a column flex so both pin to the card bottom, OR match the measured vertical offsets (title y115→sector y225; desc y139→visit y225).
5. **Description**: already ~20px Sora — confirm size (Figma ≈20px) and line-height against the node; likely a no-op or minor.
6. **Title**: already Faculty 65px `--color-ink-alt` — matches Figma (65px `#1e1e3c`); no change.
7. **Badge**: confirm exact font/size/border against `get_design_context` on `1:24299`; adjust size if it differs from the current Sora 16px.

## Implementation steps
1. In `Explorer.astro`, rework `.row-body` / `.row-main` / `.row-side` to a **non-wrapping two-column** layout (grid or fixed flex bases), right column starting at ≈48%.
2. Update `.row-sector` and `.row-link` fonts to **Faculty 14.88px, 0.1em tracking** (sector gray, link orange).
3. Align sector + Visit Page to the card bottom.
4. Confirm/adjust badge, description size, and the rule/spark position against Figma.
5. Verify with a headless-Chrome render at 1920px against `1:24199`; iterate until it matches. Keep the existing filters/hover/CTA untouched.
6. Commit + push to `main` (single commit, `Explorer.astro` only).

## Verify-don't-assume (confirm at implementation time)
- Badge exact font/size (`1:24299`).
- Description exact size/line-height (`1:24206`, outlined — derive from bbox).
- The rule color (solid `#f37d2c` vs a faint gradient) and spark exact size/position (`1:24200`/`1:24203`).
- Row-to-row vertical spacing (gap between stacked cards) if it also looks off.
