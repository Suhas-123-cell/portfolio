import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, ArrowUpRight, FileText, Star } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ProjectCover from '../components/ProjectCover'
import WebMark from '../components/WebMark'
import { about } from '../../content/about'
import { projects } from '../../content/projects'
import { timeAgo, useRepos } from '../lib/github'
import { useIntroRevealed } from '../lib/intro'

const WebHero = lazy(() => import('../three/WebHero'))

// The name lands first, with a hit (it is the beat the intro hands over to)...
const slam: Variants = {
  hidden: { opacity: 0, scale: 1.25, filter: 'blur(8px)' },
  show: { opacity: [0, 1, 1], scale: [1.25, 0.97, 1], filter: ['blur(8px)', 'blur(0px)', 'blur(0px)'], transition: { duration: 0.28, times: [0, 0.7, 1], ease: 'easeIn' } },
}

// ...then the narration boxes pop in like comic captions...
const caption: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -6 },
  show: (i: number) => ({ opacity: 1, scale: 1, rotate: i % 2 ? 1 : -1.5, transition: { delay: 0.3 + i * 0.2, type: 'spring', stiffness: 520, damping: 22 } }),
}

// ...and the supporting copy rises last.
const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
}

function Hero() {
  const revealed = useIntroRevealed()
  const state = revealed ? 'show' : 'hidden'
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden border-b-2 border-line">
      {/* CSS night sky shows while the 3D scene loads, and stays if WebGL is unavailable */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,var(--ink-3),var(--ink)_70%)]" />
      {/* the 3D scene waits for the intro's red flash so the title sequence never stutters */}
      {revealed && (
        <Suspense fallback={null}>
          <WebHero className="absolute inset-0" />
        </Suspense>
      )}
      {/* darken only behind the text, so the web in the top-left stays visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_0%,color-mix(in_oklch,var(--ink)_70%,transparent)_38%,transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_22%,black_52%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-28 md:px-8 md:pb-24">
        <div className="flex flex-col items-start gap-2">
          <motion.p variants={caption} initial="hidden" animate={state} custom={0} className="caption-box !text-[0.8rem] md:!text-sm">
            Alright, let's do this one last time.
          </motion.p>
          <motion.p variants={caption} initial="hidden" animate={state} custom={1} className="caption-box ml-6 !text-[0.8rem] md:!text-sm">
            My name is
          </motion.p>
        </div>
        <motion.h1
          variants={slam}
          initial="hidden"
          animate={state}
          className="font-display misprint mt-4 origin-left text-[clamp(4rem,13vw,10.5rem)]"
        >
          Suhas
          <br />
          Choudary
        </motion.h1>
        <motion.p
          variants={rise}
          initial="hidden"
          animate={state}
          custom={0}
          className="mt-6 max-w-[36ch] text-lg leading-relaxed text-paper/90 md:text-xl"
        >
          AI and full stack engineer in Hyderabad, building agents, their guardrails, and the apps around them.
        </motion.p>
        <motion.div variants={rise} initial="hidden" animate={state} custom={1} className="mt-9 flex flex-wrap items-center gap-5">
          <Link to="/projects" className="btn btn-hero sense">
            See the work <ArrowRight size={18} aria-hidden />
          </Link>
          <a href={about.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <FileText size={18} aria-hidden /> Résumé
          </a>
        </motion.div>
      </div>

      <p aria-hidden className="font-sfx absolute bottom-8 right-28 hidden rotate-[-4deg] text-xl text-paper lg:block">
        Pluck the web. Click the sky.
      </p>
    </section>
  )
}

function Featured() {
  const [a, b, c, d] = projects.filter((p) => p.featured)
  return (
    <section aria-labelledby="featured" className="mx-auto max-w-7xl px-4 pt-24 md:px-8 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="featured" className="font-display misprint text-5xl md:text-7xl">
          Featured issues
        </h2>
        <Link to="/projects" className="group flex items-center gap-2 font-semibold text-paper-dim transition-colors hover:text-paper">
          All {projects.length} issues
          <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <ProjectCover project={a} size="lg" className="lg:col-span-7 lg:row-span-2" />
        <ProjectCover project={b} className="lg:col-span-5" />
        <ProjectCover project={c} className="lg:col-span-5" />
        <ProjectCover project={d} size="wide" className="lg:col-span-12" />
      </div>
    </section>
  )
}

function GitHubPulse() {
  const { repos, live, user, languages } = useRepos()
  const recent = repos.slice(0, 6)
  const top = languages[0]

  return (
    <section aria-labelledby="pulse" className="relative mt-28 overflow-hidden border-y-2 border-line bg-ink-2 md:mt-36">
      <WebMark className="pointer-events-none absolute -right-32 -top-32 h-[34rem] w-[34rem] text-paper/[0.05]" strokeWidth={0.8} />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 id="pulse" className="font-display misprint text-5xl md:text-6xl">
            Spun on GitHub
          </h2>
          <p className="mt-4 max-w-[38ch] text-paper/85">
            {live ? 'Pulled live from the GitHub API.' : 'From the latest GitHub snapshot.'} What I pushed most recently, newest first.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6">
            <div className="flex flex-col-reverse">
              <dt className="mt-1 text-sm font-semibold uppercase tracking-wider text-paper-dim">Public repos</dt>
              <dd className="font-display text-6xl leading-none text-hero-text">{user.publicRepos}</dd>
            </div>
            {top && (
              <div className="flex flex-col-reverse">
                <dt className="mt-1 text-sm font-semibold uppercase tracking-wider text-paper-dim">{top.name} repos</dt>
                <dd className="font-display text-6xl leading-none text-hero-text">{top.repos}</dd>
              </div>
            )}
          </dl>
          <a
            href={about.links.github}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 font-semibold underline decoration-hero decoration-2 underline-offset-4"
          >
            Full profile <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        <ul className="grid content-start gap-4 sm:grid-cols-2">
          {recent.map((r, i) => (
            <motion.li
              key={r.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between gap-4 border-2 border-line bg-ink p-4 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--web)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="break-all text-lg font-bold">{r.name}</span>
                  <ArrowUpRight size={18} aria-hidden className="mt-1 shrink-0 text-paper-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <div className="flex items-center gap-3 text-sm text-paper-dim">
                  {r.language && <span className="font-semibold text-paper">{r.language}</span>}
                  {r.stars > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={13} aria-hidden /> {r.stars}
                    </span>
                  )}
                  <span className="ml-auto">pushed {timeAgo(r.pushedAt)}</span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Signal() {
  return (
    <section aria-labelledby="signal" className="mx-auto max-w-7xl px-4 pt-28 md:px-8 md:pt-36">
      <div className="panel panel-web relative overflow-hidden px-6 py-16 md:px-14 md:py-20">
        <div aria-hidden className="speedlines absolute inset-0 text-paper/[0.04]" />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="signal" className="font-display misprint text-5xl md:text-7xl">
              Got a problem worth swinging at?
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg text-paper/85">
              Open to internships and collaborations. Tell me what you are building.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/contact" className="btn btn-hero sense text-xl">
              Drop me a line <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PageTransition title="Suhas Choudary | AI engineer and full stack developer">
      <Hero />
      <Featured />
      <GitHubPulse />
      <Signal />
    </PageTransition>
  )
}
