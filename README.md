# suhas.exe — retro portfolio

Personal portfolio built as a CRT terminal / retro arcade OS.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit your content

All real content lives in one place:

| File | What to edit |
|---|---|
| `content/about.ts` | Bio, stat block (level, origin, weapon, ability), links |
| `content/projects.ts` | Project titles, descriptions, tags, repo/demo URLs |
| `content/skills.ts` | Skill names, levels (0–100), categories |

## Toggle CRT effects

- Click **CRT:ON/OFF** button (top-right corner) — persists to localStorage
- Set `prefers-reduced-motion` in your OS to auto-disable flicker/curvature
- CSS intensity knobs live in `app/globals.css` under `:root`

## Dial down the effects

In `app/globals.css`:
```css
:root {
  --crt-scanline-opacity:   0.25;  /* reduce to taste */
  --crt-flicker-intensity:  0.04;  /* set to 0 to kill flicker */
  --crt-aberration-offset:  1.5px; /* chromatic aberration on headings */
  --crt-curvature:          12px;  /* screen corner rounding */
}
```

## Palette

**Phosphor Amber** — inspired by the IBM 5151 amber monochrome monitor (1984).

- Background: `oklch(5% 0.007 55)` — near-black with warm amber tint
- Amber mid: `oklch(55% 0.155 65)` — body/dim UI
- Amber bright: `oklch(78% 0.17 72)` — primary text
- Amber glow: `oklch(90% 0.12 80)` — headings
- Cyan: `oklch(68% 0.15 198)` — accents, [OK] markers, links

## Fonts

- **Press Start 2P** — headings, labels, tags
- **VT323** — body text, terminal output (loaded via `next/font/google`)

## Routes

| Path | What it is |
|---|---|
| `/` | Boot screen — typewriter log, then "PRESS ANY KEY" |
| `/menu` | Game hub — arrow key + mouse navigation |
| `/about` | Character profile — bio + stat block |
| `/projects` | Project cartridge grid |
| `/projects/[slug]` | Project detail — description, stack, links |
| `/skills` | RPG stat bars by category |
| `/contact` | Fake terminal — type `email`, `github`, `back`, `clear` |
