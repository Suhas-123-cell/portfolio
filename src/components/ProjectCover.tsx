import { Link } from 'react-router-dom'
import type { Project } from '../../content/projects'
import { projects } from '../../content/projects'
import WebMark from './WebMark'

export const issueNo = (p: Project) => String(projects.indexOf(p) + 1).padStart(2, '0')

type Props = {
  project: Project
  size?: 'lg' | 'md' | 'wide'
  /** Art only, no link and no title block (used on the detail page). */
  static?: boolean
  className?: string
}

// A project as a comic issue: masthead strip, then the real screenshot shown clean
// (full colour, never cropped), or a plain title card when there is no screenshot.
export default function ProjectCover({ project: p, size = 'md', static: isStatic, className = '' }: Props) {
  const big = size === 'lg' || isStatic
  const wide = size === 'wide'
  const roomy = big || wide

  const art = (
    <div
      className={`relative overflow-hidden border-b-2 border-line bg-ink ${
        isStatic ? 'aspect-[4/3]' : big ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[360px] lg:flex-1' : wide ? 'aspect-[16/9] md:aspect-auto md:min-h-[280px] md:border-b-0 md:border-r-2' : 'aspect-[16/10]'
      }`}
    >
      {p.image ? (
        <img
          src={p.image}
          alt={`Screenshot of ${p.title}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center bg-ink-3 p-6">
          <WebMark className="pointer-events-none absolute -right-8 -top-8 h-[70%] w-auto text-paper/[0.08] transition-transform duration-700 group-hover:rotate-12" strokeWidth={1.2} />
          {p.stat ? (
            <>
              <span className={`font-display relative whitespace-nowrap leading-none text-hero-text ${big ? 'text-[clamp(2.5rem,5vw,4.5rem)]' : 'text-[clamp(2.25rem,4vw,3rem)]'}`}>{p.stat.value}</span>
              <span className="relative mt-2 text-sm font-semibold uppercase tracking-wider text-paper-dim">{p.stat.label}</span>
            </>
          ) : (
            <span className={`relative max-w-[30ch] font-semibold leading-snug text-paper ${big ? 'text-2xl' : 'text-xl'}`}>
              {p.description.split('. ')[0].replace(/\.$/, '')}.
            </span>
          )}
        </div>
      )}
    </div>
  )

  const masthead = (
    <div className="flex items-center justify-between border-b-2 border-line bg-hero px-4 py-1.5 text-hero-ink">
      <span className="font-display text-lg tracking-wider">Issue #{issueNo(p)}</span>
      <span className="text-xs font-bold uppercase tracking-widest">{p.domain}</span>
    </div>
  )

  if (isStatic) {
    return (
      <div className={`panel flex flex-col overflow-hidden ${className}`}>
        {masthead}
        {art}
      </div>
    )
  }

  return (
    <Link
      to={`/projects/${p.slug}`}
      className={`panel group misprint-hover flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--hero)] ${className}`}
      aria-label={`Issue ${issueNo(p)}, ${p.title}: ${p.subtitle}`}
    >
      {masthead}
      <div className={`relative flex flex-1 flex-col ${wide ? 'md:grid md:grid-cols-[1.1fr_1fr]' : ''}`}>
        {art}
        <div className={big ? 'p-6 md:p-7' : 'p-5'}>
          <h3 className={`font-display misprint ${big ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>{p.title}</h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-paper-dim">{p.subtitle}</p>
          {p.image && p.stat && (
            <p className="mt-3 text-sm">
              <span className="font-display text-xl text-hero-text">{p.stat.value}</span> <span className="text-paper-dim">{p.stat.label}</span>
            </p>
          )}
          {roomy && <p className="mt-4 max-w-[60ch] text-[0.95rem] leading-relaxed text-paper/90">{p.description}</p>}
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {p.tags.slice(0, roomy ? 4 : 3).map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  )
}
