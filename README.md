# Suhas Choudary — Spider-Verse portfolio

Personal portfolio with a fan-made Spider-Man / Spider-Verse comic theme: a Three.js night skyline with a pluckable web, click-anywhere web-shooting, comic-cover project "issues", and five suits (themes).

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
npm run sync:github  # refresh content/github.json from the GitHub API (set GITHUB_TOKEN to avoid rate limits)
```

## Edit your content

| File | What to edit |
|---|---|
| `content/projects.ts` | Projects: title, description, highlights, cover SFX + blurb, stat, links |
| `content/about.ts` | Bio, origin story captions, experience, photo, résumé path |
| `content/skills.ts` | Skill groups shown on the web of skills |
| `public/Suhas_Choudary_Resume.pdf` | The résumé linked from the header, hero and footer |
| `public/images/suhas.jpg` | Photo on the About page press pass |

The home page's "Spun on GitHub" section starts from `content/github.json` and refreshes live from the GitHub API in the browser when it can.

## Things to find

- **Intro:** a title sequence in the style of the 2012 cartoon opening, with my name as the title. Plays once per session on the home page; replay it from the footer. Skipped under reduced motion.
- **Suits:** Classic, Miles, Gwen (light theme), 2099. Up, up, down, down, left, right, left, right, B, A unlocks Noir.
- **Web-shooter:** click any empty spot. The hero web can be brushed and plucked.
- **Spider:** rides its dragline down the right edge as you scroll; click it to go back to the top.

## AI chat

The chat widget (`src/components/ChatWidget.tsx`) answers questions about me. Its backends are Vercel functions configured through env vars (copy `.env.example` to `.env`):

| Env var | Used by | Purpose |
|---|---|---|
| `GROQ_API_KEY` | `api/chat.ts` | Groq API key |
| `GROQ_MODEL` | `api/chat.ts` | Model ID, defaults to `openai/gpt-oss-20b` |

## Credits

Fan-made Spider-Man theme. Not affiliated with Marvel or Sony. The spider emblem in the intro (`public/images/spider-emblem.png`) is a supplied image; all other artwork is original.
