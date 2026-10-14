import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ProjectCover, { issueNo } from '../components/ProjectCover'
import NotFound from './NotFound'
import { projects } from '../../content/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return <NotFound />
  const p = projects[i]
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  const facts: [string, string][] = [
    ['Status', p.status],
    ['When', p.period],
    ['Field', p.domain],
    ['Stack', p.tags.join(', ')],
  ]

  return (
    <PageTransition title={`${p.title} | Suhas Choudary`}>
      <article className="mx-auto max-w-7xl px-4 pt-28 md:px-8 md:pt-36">
        <Link to="/projects" className="group inline-flex items-center gap-2 font-semibold text-paper-dim transition-colors hover:text-paper">
          <ArrowLeft size={18} aria-hidden className="transition-transform group-hover:-translate-x-1" /> Back to the collection
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-16">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <ProjectCover project={p} static />
            <dl className="panel panel-web grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 p-5 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-semibold uppercase tracking-wider text-paper-dim">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div>
            <h1 className="font-display misprint text-6xl md:text-8xl">{p.title}</h1>
            <p className="mt-3 text-lg font-semibold uppercase tracking-wider text-paper-dim">{p.subtitle}</p>
            <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-paper/90">{p.description}</p>

            <div className="mt-8 flex flex-wrap gap-5">
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-hero sense">
                <Github size={18} aria-hidden /> Read the code
              </a>
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Try it live <ArrowUpRight size={18} aria-hidden />
                </a>
              )}
            </div>

            <h2 className="font-display mt-16 text-4xl">What's inside</h2>
            <ol className="mt-6 space-y-5">
              {p.highlights.map((h, n) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: n * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`panel ${n % 2 ? 'panel-web' : ''} relative p-5 pl-16`}
                >
                  <span aria-hidden className="font-display absolute left-4 top-4 text-3xl text-hero-text">
                    {n + 1}
                  </span>
                  <p className="leading-relaxed">{h}</p>
                </motion.li>
              ))}
            </ol>

          </div>
        </div>

        <nav aria-label="More issues" className="mt-24 grid gap-6 border-t-2 border-line pt-10 sm:grid-cols-2">
          <Link to={`/projects/${prev.slug}`} className="misprint-hover group">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-paper-dim">
              <ArrowLeft size={16} aria-hidden /> Previous issue, #{issueNo(prev)}
            </span>
            <span className="font-display misprint mt-2 block text-4xl">{prev.title}</span>
          </Link>
          <Link to={`/projects/${next.slug}`} className="misprint-hover group sm:text-right">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-paper-dim sm:justify-end">
              Next issue, #{issueNo(next)} <ArrowRight size={16} aria-hidden />
            </span>
            <span className="font-display misprint mt-2 block text-4xl">{next.title}</span>
          </Link>
        </nav>
      </article>
    </PageTransition>
  )
}
