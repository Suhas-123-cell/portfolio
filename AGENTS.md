# Agent notes

This is a **Vite + React 19 + TypeScript** single-page app (not Next.js). Styling is Tailwind v4 via `@tailwindcss/vite`, animation is Motion (`motion/react`), the hero is plain Three.js in `src/three/`.

- Content lives in `content/` (projects, about, skills) and `content/github.json` (snapshot from `npm run sync:github`).
- Every colour comes from the suit tokens in `src/index.css` (`:root[data-suit=...]`). Don't hard-code colours in components; the Three.js scene reads the same tokens and listens for the `suitchange` event.
- Every animation must respect `prefers-reduced-motion`.
- `api/chat.ts` is the Vercel serverless function behind the chat widget; `npm run dev` serves it locally too.
- The intro uses the owner-supplied emblem `public/images/spider-emblem.png`; all other artwork is original.
