import { motion } from 'motion/react'
import { FileText } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import WebMark from '../components/WebMark'
import { about } from '../../content/about'

// Each origin panel gets its own colour plate so the strip reads like a comic page.
const plates = ['bg-hero text-hero-ink', 'bg-ink-2 text-paper', 'bg-web text-web-ink']
const sfx = ['ZZT!', 'KRAK!', 'THWIP!']

function PressPass() {
  return (
    <figure className="panel relative mx-auto w-full max-w-sm -rotate-1 overflow-hidden text-ink" style={{ background: 'var(--paper)' }}>
      <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-4 py-2 text-paper">
        <span className="font-display text-xl tracking-wider">The Daily Commit</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">Press pass</span>
      </div>
      <div className="relative m-3 aspect-[4/4.4] overflow-hidden border-2 border-ink">
        <img src={about.photo} alt={`Photo of ${about.fullName}`} className="absolute inset-0 h-full w-full object-cover object-top" loading="eager" />
        {/* print dots creeping in from the corner, like a scanned page */}
        <div aria-hidden className="absolute inset-0 text-ink/25 [background-image:radial-gradient(currentColor_28%,transparent_31%)] [background-size:7px_7px] [mask-image:linear-gradient(200deg,transparent_55%,black_95%)]" />
        <span aria-hidden className="absolute bottom-3 right-3 rotate-[-12deg] border-[3px] border-hero bg-paper/80 px-2 py-0.5 font-display text-lg text-hero">
          Cleared
        </span>
      </div>
      <figcaption className="px-4 pb-4">
        <p className="font-display text-3xl leading-none">{about.fullName}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm text-ink">
          <dt className="font-bold uppercase tracking-wider opacity-70">Beat</dt>
          <dd>AI and full stack</dd>
          <dt className="font-bold uppercase tracking-wider opacity-70">Base</dt>
          <dd>{about.location}</dd>
          <dt className="font-bold uppercase tracking-wider opacity-70">Training</dt>
          <dd>{about.education}</dd>
        </dl>
      </figcaption>
          </figure>
  )
}

export default function About() {
  const x = about.experience
  return (
    <PageTransition title="About | Suhas Choudary">
      <section className="mx-auto max-w-7xl px-4 pt-32 md:px-8 md:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="font-display misprint text-7xl md:text-9xl">Origin story</h1>
            <p className="mt-6 max-w-[46ch] text-xl leading-relaxed text-paper/90">{about.tagline}</p>
            <a href={about.resume} target="_blank" rel="noreferrer" className="btn btn-hero sense mt-8">
              <FileText size={18} aria-hidden /> Read the résumé
            </a>
          </div>
          <PressPass />
        </div>
      </section>

      <section aria-label="Origin, in three panels" className="mx-auto mt-24 max-w-7xl px-4 md:px-8">
        <ol className="grid gap-6 md:grid-cols-[1.2fr_1fr_1.2fr]">
          {about.origin.map((o, i) => (
            <motion.li
              key={o.caption}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.2 : -1.2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex min-h-[22rem] flex-col justify-between overflow-hidden border-2 border-line p-6 shadow-[6px_6px_0_var(--line)] ${plates[i]} ${
                i === 1 ? 'md:mt-10' : ''
              }`}
            >
              <div aria-hidden className="speedlines absolute inset-0 opacity-[0.08]" />
              <span className="caption-box relative self-start">{o.caption}</span>
              <span aria-hidden className="sfx relative my-6 self-center text-6xl md:text-7xl" style={{ rotate: `${i % 2 ? 6 : -8}deg` }}>
                {sfx[i]}
              </span>
              <p className="relative text-[1.05rem] font-medium leading-relaxed">{o.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="fieldwork" className="mx-auto mt-28 max-w-7xl px-4 md:px-8">
        <div className="panel panel-web grid gap-8 p-6 md:grid-cols-[1fr_2fr] md:p-10">
          <div>
            <span className="caption-box -rotate-1">Field work</span>
            <h2 id="fieldwork" className="font-display misprint mt-5 text-5xl">{x.role}</h2>
            <p className="mt-2 font-semibold">{x.org}</p>
            <p className="text-paper-dim">{x.period}</p>
          </div>
          <ul className="space-y-4">
            {x.points.map((pt) => (
              <li key={pt} className="relative pl-7 leading-relaxed">
                <WebMark className="absolute left-0 top-1 h-4 w-4 text-hero" strokeWidth={6} />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-4xl px-4 text-center md:px-8">
        <WebMark className="mx-auto h-14 w-14 text-hero" />
        <blockquote className="font-display misprint mt-6 text-4xl leading-tight md:text-6xl">
          “With great power comes great responsibility.”
        </blockquote>
        <p className="mx-auto mt-6 max-w-[56ch] text-lg text-paper/85">
          Agents that can run tools are power. The responsibility is measuring what they do and saying where the numbers stop. That is the work I want to keep doing.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {about.focus.map((f) => (
            <li key={f} className="chip !text-sm">
              {f}
            </li>
          ))}
        </ul>
      </section>
    </PageTransition>
  )
}
