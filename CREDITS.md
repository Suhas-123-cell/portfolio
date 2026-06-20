# Art Credits

## Hero Background Art

**Current file:** `public/art/hero.svg`

**Status: PLACEHOLDER — must be replaced before public launch**

The SVG at `public/art/hero.svg` is a programmatically generated gradient (stars, mountain
silhouettes, teal atmospheric glow). It is original work and freely usable, but it is *not*
the anime key-art hero image described in the design spec.

Before going public, replace it with artwork you have the rights to use:

1. **AI-generated (recommended):** Use Midjourney / Leonardo.ai / Adobe Firefly.
   Prompt example: "anime key art, full-body warrior, cinematic, teal glow, deep midnight sky".
   Check the provider ToS — you generally own AI-generated outputs for personal use.

2. **Commissioned:** Hire an artist on ArtStation or Fiverr.

3. **CC0 from OpenGameArt:** https://opengameart.org (filter by CC0 + anime/fantasy).

**To swap the art** — edit ONE line in `app/page.tsx`:
```ts
const HERO_ART = '/art/hero.svg'
```
Change to `/art/hero.png`, `/art/hero.webp`, etc. Then drop your file in `public/art/`.

---

## Fonts

- **Sora** — SIL Open Font License 1.1 — via Google Fonts
- **Bebas Neue** — SIL Open Font License 1.1 — via Google Fonts
- **Noto Sans JP** — SIL Open Font License 1.1 — via Google Fonts

---

## Design Inspiration

Anime game-launcher layout inspired by publicly available game UI screenshots (study only).
No assets from those products are included.
