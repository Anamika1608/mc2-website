// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
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
