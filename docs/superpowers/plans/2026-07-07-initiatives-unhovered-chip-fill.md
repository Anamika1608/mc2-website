# Initiatives Programs — Fix Unhovered Card Chips to Match Figma

**Branch:** `feat/initiatives-chips` (from synced `origin/main` `f05181e`).
**Component:** `src/components/initiatives/Programs.astro` only.
**Figma:** section frame `1:16447`; the unhovered chip reference is node `1:15905` ("LAB RESIDENCY").

## Problem
On the initiatives "How It Works" program cards (O1 Grand Challenges … O4), the chips on the **unhovered / collapsed** cards are effectively **invisible**. The current `.chip` base rule fills them with `var(--color-cream)` (`#F3F2EB`) — the *same* color as the section/page background — so they render as floating text with no pill boundary (a prior agent's literal reading of the node's "raw fill", see the in-file comment at ~line 776).

Figma shows them as **visible, filled pills**: sampling the actual Figma render (user's Image #14) at three unhovered chips ("LAB RESIDENCY", "20 FELLOWS A YEAR", "SIX MONTHS") gives a uniform fill of **`#E7E5D8`**, which is the site's `--color-line` token (`#e8e6da`) — a light warm tan that reads clearly against the cream page. Text stays navy.

## The change (single edit)
In `Programs.astro`, the base `.chip` rule (~line 758–771):

- **`background: var(--color-cream)` → `background: var(--color-line)`**  (`#e8e6da`, matches Figma's `#E7E5D8`)
- Keep everything else: `color: var(--color-ink-alt)` (navy text), `border-radius: 999px`, padding, font-size, the `background-color`/`color` transitions.
- **Do NOT touch** `.card.is-active .chip` (the orange filled hovered-card chip) — that's the hovered state, which the user is handling separately/next.
- Update the now-stale in-file comment (lines ~755–781) that justifies the cream/invisible treatment, so it reflects the visible `--color-line` fill.

Because `.card.is-active .chip` overrides the background to orange, this change only affects the chips on cards that are **not** active (i.e. the unhovered/collapsed cards) — exactly the target. On mobile (<1024, no hover) every non-O1 card's chips become the tan pill too, which is consistent with the design.

## Open item to confirm (NOT in this change unless you say so)
Figma renders **all** chip labels in **UPPERCASE** ("LAB RESIDENCY", "THEMED BRIEFS"); the current build shows **Sentence case** ("Lab residency", "Themed briefs") for both hovered and unhovered chips. This is a separate difference that affects *all* chips (hovered + unhovered), so uppercasing only the unhovered ones would look inconsistent. Recommend handling the case change for all chips together (e.g. `text-transform: uppercase` on `.chip`) when you do the hovered-card pass — flagging here, not doing it in this step. Confirm if you'd like it included now.

## Verify
1. `bunx astro check` — clean.
2. Build + static preview; render `/initiatives` at 1600px.
3. Confirm the unhovered cards (O2/O3/O4) now show **visible light-tan pills** with navy text, matching Figma `1:15905`; the O1 (active) orange chips are unchanged; the card layout/borders/titles are unchanged.
4. Compare the rendered unhovered chip against Image #14 side-by-side.
5. Commit (`Programs.astro` only) + push the branch.

## Out of scope
- The hovered/active orange chips.
- Chip text-case (see open item above).
- The step cards (O1–O4 "Apply / Find champions / …" header row), card borders, numerals, titles, bodies, spacing — nothing else changes.
