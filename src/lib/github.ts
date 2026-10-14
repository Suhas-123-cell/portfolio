import { useEffect, useState } from 'react'
import snapshot from '../../content/github.json'

export type Repo = {
  name: string
  url: string
  description: string | null
  language: string | null
  stars: number
  pushedAt: string
  homepage: string | null
}

const KEY = 'gh-repos'
const TTL = 10 * 60 * 1000

/** Repos from the build-time snapshot, refreshed live from the GitHub API when it answers. */
export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>(snapshot.repos)
  const [live, setLive] = useState(false)

  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as { at: number; repos: Repo[] } | null
      if (cached && Date.now() - cached.at < TTL) {
        setRepos(cached.repos)
        setLive(true)
        return
      }
    } catch {
      /* fall through to network */
    }

    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${snapshot.user.login}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Array<Record<string, unknown>>) => {
        const fresh: Repo[] = data
          .filter((r) => !r.fork && !r.archived && r.name !== snapshot.user.login)
          .map((r) => ({
            name: r.name as string,
            url: r.html_url as string,
            description: (r.description as string | null) ?? null,
            language: (r.language as string | null) ?? null,
            stars: r.stargazers_count as number,
            pushedAt: r.pushed_at as string,
            homepage: (r.homepage as string | null) || null,
          }))
        setRepos(fresh)
        setLive(true)
        try {
          sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), repos: fresh }))
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* rate-limited or offline: the snapshot is already on screen */
      })
    return () => ctrl.abort()
  }, [])

  return { repos, live, user: snapshot.user, languages: snapshot.languages, syncedAt: snapshot.syncedAt }
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function timeAgo(iso: string) {
  const s = (new Date(iso).getTime() - Date.now()) / 1000
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, secs] of steps) if (Math.abs(s) >= secs) return rtf.format(Math.round(s / secs), unit)
  return 'just now'
}
