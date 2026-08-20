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

## AI chat + voice

The site ships with a chat widget (`src/components/ChatWidget.tsx`) that answers questions about me. It has two serverless backends, both configured entirely through env vars — no model names or keys are hardcoded in source:

| Env var | Used by | Purpose |
|---|---|---|
| `GROQ_API_KEY` | `api/chat.ts` | Groq API key for chat completions |
| `GROQ_MODEL` | `api/chat.ts` | Groq model ID to run the chat on. Defaults to `openai/gpt-oss-20b` if unset — fast (~1000 tok/s), cheap, and free-tier friendly. Swap in `openai/gpt-oss-120b` for stronger answers at ~half the speed. Full list: [console.groq.com/docs/models](https://console.groq.com/docs/models) |
| `LMNT_API_KEY` | `api/voice.ts` | LMNT API key for text-to-speech |
| `LMNT_VOICE_ID` | `api/voice.ts` | Which LMNT voice to speak replies with — pick one at [app.lmnt.com/voice-library](https://app.lmnt.com/voice-library) |

Voice input (mic) uses the browser's built-in Web Speech API — no key needed, and it's unsupported on iOS Safari (the mic button just doesn't render there).

Copy `.env.example` to `.env` and fill these in to run the chat/voice features locally.

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
