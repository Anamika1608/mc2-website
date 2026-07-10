// Press releases shown on /press-releases. Content migrated verbatim from the
// previous site (https://mc2plus.in/press-release/) per user directive
// 2026-07-10 — see docs/superpowers/specs/2026-07-10-press-releases-page-design.md.
// To add a release: drop its PDF in public/press/, its thumbnail photo in
// src/assets/press/, and append an entry here (newest first). Thumbnails are
// the release's photograph only — not the PDF's headed first page (user
// directive 2026-07-10: "just the photo in the thumbnail").
import type { ImageMetadata } from "astro";
import oilPtrcCover from "../assets/press/press-photo.jpg";

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
