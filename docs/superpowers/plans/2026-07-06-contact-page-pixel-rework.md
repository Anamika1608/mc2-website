# Contact Page — Pixel-Perfect Rework Plan

**Goal:** Rework the existing `/contact` page (already on `main`, commit `41411b1`) so it matches Figma frame `1:28676` (file `u4NLOVKuXUTKULhSn0sAJQ`, 1920×3805) **pixel-for-pixel**. The first pass approximated too much; this plan replaces guessed values with exact Figma-measured ones.

**Method:** All values below are measured from `get_metadata` (positions/sizes → spacing) and `get_design_context` (fonts/sizes/fills), or pixel-sampled where the node exports as a raster. rem = px ÷ 16.

**Files reworked:** `src/components/contact/ContactHero.astro`, `NetworkSection.astro`, `ContactForm.astro` (no page/asset changes except possibly re-exporting; `hero-curves.svg` and `network-map.svg` are already correct exports).

---

## Verified exact type scale & fills
| Element | Font / size | Fill | Node |
|---|---|---|---|
| Eyebrow CONTACT | Faculty 27.07px, tracking 0.25em | `#949494` (`--color-gray`) | 1:29712 |
| H1 (3 lines) | Faculty 80px, line-height 1.094 | base `#1e1e3e`; accents `#ff7400` | 1:29716/17/18 |
| Lede | Sora ~31px, line-height 1.30 | `#1e1e3e` | 1:29719 (outlined) |
| Section H2 "The MC²+ network" | Faculty 65px | `#1e1e3c` (`--color-ink-alt`) | 1:28682 |
| Form H2 "Send us a message" | Faculty 50px | `#1e1e3c` | 1:29037 |
| Form labels (I AM A / FULL NAME / EMAIL / ORGANISATION / HOW CAN WE HELP?) | **Faculty 18.53px, tracking 0.25em** | `#1e1e3e` | 1:29110/29111/29113/29112/29152 |
| Info labels (GENERAL ENQUIRIES etc) | **Faculty 18.53px, tracking 0.1em** | `#949494` | 1:29239 … |
| Emails | Sora (size ~ derive, see §4) | `#f37d2c` (`--color-orange`) | pixel-sampled |
| Input fill | — | `#e7e5d8` (warm-gray literal) | pixel-sampled |
| Active chip (FOUNDER) | — | bg `#f37d2c`, text white | pixel-sampled |
| Inactive chip | — | bg cream, text `#1e1e3c` | pixel-sampled |
| Submit button | — | body `#1e1e3a` (`--color-ink`), circle `#ff7400`, text white | pixel-sampled |
| Banner | Sora | bg renders ~`#e77628` (source orange w/ mix-blend-multiply), text cream | 1:28683/28684 |

---

## §1. ContactHero — corrections (current file mostly reused TeamHero values)
| Property | Current (wrong) | **Target (exact)** | Basis |
|---|---|---|---|
| `.lede` max-width | 47.58rem | **50.31rem** (804.9px) | lede group 1:29719 width |
| `.lede` margin-top (H1→lede gap) | 1.43rem | **1.54rem** (24.7px) | H1 line-3 bottom 698.1 → lede 722.8 |
| `.scroll` margin-top (lede→chevron) | 6rem | **8.54rem** (136.7px) | lede bottom 826.9 → chevron 963.6 |
| `.hero-inner` max-width | 60rem | **57.25rem** (916px, widest H1 line) | 1:29716 width |
| underline width | 11.77rem | 11.77rem ✓ (188.25px) | 1:29711 |
| eyebrow→underline / underline→H1 gaps | 2.82 / 1.72rem | ✓ 2.84rem (45.5px) / 1.72rem (27.5px) | 1:29712/711/716 |
| H1 line-height | 1.095 | ✓ 1.094 (87.55/80) | line baselines |
- Keep eyebrow/H1/accent colors (already correct). **Hero band `min-height`** stays 63.25rem (curve SVG height) — final band fit is the one item needing a 1920px visual check (no browser this session).

## §2. NetworkSection — corrections
| Property | Current | **Target (exact)** | Basis |
|---|---|---|---|
| H2 margin-bottom (H2→map gap) | 3rem | **5.06rem** (81px) | H2 bottom 1253 → map top 1334 |
| `.map` max-width | 80.25rem | **80.2rem** (1283.3px) ✓ | map group 1:28755 |
| banner margin-top (map→banner gap) | 3rem | **4.69rem** (75px) | map bottom 1867 → banner 1942 |
| banner max-width | 43.75rem | **43.44rem** (695.2px) | banner 1:28683 |
| banner padding | 1.25rem 2.5rem | **1.63rem 5.06rem** (26px / 81px) | banner box vs text box 1:28685 |
| banner radius | 999px | **3.32rem** (53.15px = h/2, pill) ✓ | banner h106.3 |
| banner bg / text | `--color-orange` / cream | bg `#e77628` (flat, matches multiply render) / cream | sampled |
| section padding-block | 6rem | **top from hero gap; bottom owned by next** — set `padding-block: <hero→network gap> 0` (single-ownership like About/Team); H2 sits at frame y1169 | frame rhythm |
- The map itself (`/public/network-map.svg`, exact Figma export) stays — it is already pixel-exact. Keep the mobile fallback list + `alt`.

## §3. ContactForm — biggest corrections (many guessed values)
**Grid (2-col):** currently `57rem / 30rem, gap 4rem, align:start`. **Target:** card **57.06rem** (913.3px) + info **29.88rem** (478.1px), **gap 7.625rem** (122px); total 94.6rem centered. Info column is **offset down ~19.9rem** (319px) at desktop so GENERAL ENQUIRIES aligns with the form's field region (info top y2498 vs card top y2178.6) — apply as `margin-top` on the info column, removed when stacked. *(Flag for 1920px visual check.)*

**Form card:** width 913.3px; padding **2.25rem 2.5rem 3.75rem** (top 36 / sides ~40 / bottom 60px, from H2/content/submit insets). Keep the small folded top-right notch but size it ~1.25rem (measure 1:29038; current 1.75rem is a guess).

**Card internals (exact):**
| Element | Target | Basis |
|---|---|---|
| H2 "Send us a message" | Faculty **50px** (3.125rem) `#1e1e3c` ✓ | 1:29037 |
| H2 → "I AM A" gap | **4.24rem** (67.8px) | 2279 → 2346.8 |
| Labels (all) | **Faculty 18.53px** (1.158rem), tracking **0.25em**, `#1e1e3e` — NOT Sora 0.85rem/600 as currently | 1:29110/29111 |
| "I AM A" → chips gap | 0.75rem (12px) ✓ | 2370 → 2382.5 |
| Chip height | **2.43rem** (38.9px); pill radius ~1.2rem | chip groups |
| Chip col gap / row gap | **1.49rem** (23.9px) / **0.84rem** (13.4px) | chip x/y deltas |
| Chip fills | active `#f37d2c`+white; inactive cream+`#1e1e3c` | sampled |
| Row-1 field widths | **FULL NAME 29.77rem (476.3px) / EMAIL 20.9rem (334.3px)** — NOT 1fr/1fr; col gap **2.04rem** (32.6px) | inputs 1:29114/29197 |
| Label → input gap | ~0.63rem (10px) | label bottom → input |
| Input height / fill / radius | **2.61rem** (41.8px) / `#e7e5d8` / ~0.6rem | 1:29114 |
| ORGANISATION input | full width (52.7rem / 843px) | 1:29125 |
| Textarea (HOW CAN WE HELP) | width 843px, height **9.27rem** (148.3px) | 1:29153 |
| Field-block vertical gap | ~2.2rem (35–43px) | block deltas |
| Textarea → submit gap | **3.44rem** (55px) | 2929 → 2984.5 |
| Submit button | **22.3rem × 4.75rem** (356.9×76px), body `#1e1e3a`, white "Send Message", orange circle `#ff7400` (~4rem), centered | 1:29215/29218 |

**Info column (right):**
| Element | Target | Basis |
|---|---|---|
| Column width | 29.88rem (478.1px) | 1:29237 |
| Labels | Faculty 18.53px `#949494`, tracking 0.1em — NOT Sora | 1:29239 |
| Emails | Sora ~1.6rem (~25px), `#f37d2c`, `mailto:` links | sampled / 1:29240 |
| Block vertical gap | ~3rem (~48px between the 5 blocks) | block y-deltas 2498/2606/2714/2823/2931 |
| Registered office | label + 3 lines Sora ~1.25rem `#1e1e3c` | 1:29318/29320 |

## §4. Items needing a 1920px visual confirmation (no browser this session)
1. Hero band `min-height` / hero→network gap.
2. Info-column ~19.9rem downward offset.
3. Email font-size (~25px estimate) and chip text font/size (Sora estimate).
These are built to best-measured values; a side-by-side at 1920px against the Figma frame (`.superpowers/sdd/figma-contact-full.png` — re-export `1:28676`) confirms them.

## §5. Execution
Rework the three components in place with the exact values above (single commit, or one per component). Verify `bunx astro check` 0/0 + `bun run build` 7 pages + copy sweep unchanged. Commit + push to `main` (per user's direct-to-main instruction). Do a `get_screenshot` of `1:28676` at 4096 for the human side-by-side.

## Deviations kept intentionally
- Network diagram served as the exact exported SVG (`/public/network-map.svg`) + mobile fallback list — pixel-exact and accessible.
- Form is static UI (no backend submission).
- Orange-on-cream contrast (accents/emails/banner) — same known deferred WCAG item as the other pages.
