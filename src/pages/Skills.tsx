import PageTransition from '../components/PageTransition'
import SkillWeb from '../components/SkillWeb'
import github from '../../content/github.json'

export default function Skills() {
  const total = github.languages.reduce((n, l) => n + l.repos, 0)
  return (
    <PageTransition title="Skills | Suhas Choudary">
      <section className="mx-auto max-w-7xl px-4 pt-32 md:px-8 md:pt-40">
        <h1 className="font-display misprint text-6xl md:text-8xl">Web of skills</h1>
        <p className="mt-5 max-w-[50ch] text-lg text-paper/85">
          What I reach for, grouped by where it sits in a system. Hover a group to light up its strands.
        </p>
        <div className="mt-14">
          <SkillWeb />
        </div>
      </section>

      <section aria-labelledby="langs" className="mx-auto mt-28 max-w-7xl px-4 md:px-8">
        <h2 id="langs" className="font-display text-4xl md:text-5xl">
          What my repos are written in
        </h2>
        <p className="mt-3 text-paper-dim">Primary language of each public repo on GitHub.</p>
        <div className="mt-8 flex h-14 w-full overflow-hidden border-2 border-line" role="img" aria-label={github.languages.map((l) => `${l.name}: ${l.repos} repos`).join(', ')}>
          {github.languages.map((l, i) => (
            <div
              key={l.name}
              className={`flex items-center overflow-hidden whitespace-nowrap px-3 font-display text-lg ${i ? 'border-l-2 border-line' : ''}`}
              style={{
                flexGrow: l.repos,
                flexBasis: 0,
                background: ['var(--hero)', 'var(--web)', 'var(--caption)', 'var(--ink-3)'][i % 4],
                color: ['var(--hero-ink)', 'var(--web-ink)', 'var(--caption-ink)', 'var(--paper)'][i % 4],
              }}
            >
              {l.repos / total > 0.12 ? `${l.name} ${l.repos}` : l.repos}
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper-dim">
          {github.languages.map((l) => (
            <li key={l.name}>
              <span className="font-semibold text-paper">{l.name}</span> {l.repos} repos
            </li>
          ))}
        </ul>
      </section>
    </PageTransition>
  )
}
