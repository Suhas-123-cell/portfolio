// Snapshot public GitHub data into content/github.json.
// Run: npm run sync:github   (set GITHUB_TOKEN to avoid the 60 req/h anonymous limit)
import { writeFile } from 'node:fs/promises'

const USER = 'Suhas-123-cell'
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const get = async (path) => {
  const r = await fetch(`https://api.github.com${path}`, { headers })
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`)
  return r.json()
}

const [user, repos] = await Promise.all([
  get(`/users/${USER}`),
  get(`/users/${USER}/repos?per_page=100&sort=pushed`),
])

const own = repos.filter((r) => !r.fork && r.name !== USER && !r.archived)

const languages = {}
for (const r of own) if (r.language) languages[r.language] = (languages[r.language] ?? 0) + 1

const snapshot = {
  syncedAt: new Date().toISOString(),
  user: {
    login: user.login,
    avatar: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    joined: user.created_at,
  },
  languages: Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name, repos]) => ({ name, repos })),
  repos: own.map((r) => ({
    name: r.name,
    url: r.html_url,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    pushedAt: r.pushed_at,
    homepage: r.homepage || null,
  })),
}

await writeFile(new URL('../content/github.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n')
console.log(`synced ${snapshot.repos.length} repos`)
