import { FileText, Github, Mail, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import { about } from '../../content/about'
import { intro } from '../lib/intro'
import WebMark from './WebMark'

export default function SiteFooter() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const replay = () => {
    navigate('/')
    intro.start()
  }

  return (
    <footer className="relative mt-24 overflow-hidden border-t-2 border-line bg-ink-2">
      <WebMark className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 text-paper/[0.07]" strokeWidth={1} />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl">{about.name}</p>
          <p className="mt-1 text-sm text-paper-dim">Fan-made Spider-Man theme. Not affiliated with Marvel or Sony.</p>
          {!reduce && <button
            type="button"
            onClick={replay}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold underline decoration-hero decoration-2 underline-offset-4"
          >
            <Play size={14} aria-hidden /> Replay the intro
          </button>}
        </div>
        <ul className="flex gap-3">
          <li>
            <a href={about.resume} target="_blank" rel="noreferrer" className="btn btn-ghost !px-3 !py-2.5 text-sm" aria-label="Résumé (PDF)">
              <FileText size={18} aria-hidden />
            </a>
          </li>
          <li>
            <a href={about.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost !px-3 !py-2.5 text-sm" aria-label="GitHub">
              <Github size={18} aria-hidden />
            </a>
          </li>
          <li>
            <a href={`mailto:${about.links.email}`} className="btn btn-ghost !px-3 !py-2.5 text-sm" aria-label="Email">
              <Mail size={18} aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
