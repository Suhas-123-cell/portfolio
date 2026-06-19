import Link from 'next/link'
import { CRTScreen } from '@/components/CRTScreen'
import { projects } from '@/content/projects'

export default function ProjectsPage() {
  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-4xl mx-auto">
          <Link href="/menu" className="text-lg hover:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>
            ← BACK
          </Link>

          <h1 className="font-press-start text-sm sm:text-base mt-8 mb-2 amber-glow chromatic"
            style={{ color: 'oklch(90% 0.12 80)' }}>
            PROJECTS
          </h1>
          <div className="mb-8 text-xl" style={{ color: 'oklch(35% 0.10 62)' }}>
            SELECT A CARTRIDGE TO LOAD
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="block project-card p-4 focus:outline-none"
              >
                {p.featured && (
                  <div className="font-press-start text-[7px] mb-2"
                    style={{ color: 'oklch(68% 0.15 198)' }}>
                    ★ FEATURED
                  </div>
                )}
                <h2 className="font-press-start text-[9px] sm:text-[10px] leading-relaxed"
                  style={{ color: 'oklch(90% 0.12 80)' }}>
                  {p.title}
                </h2>
                <div className="mt-1 text-base" style={{ color: 'oklch(55% 0.155 65)' }}>
                  {p.subtitle}
                </div>
                <p className="mt-3 text-base leading-relaxed"
                  style={{ color: 'oklch(65% 0.12 65)' }}>
                  {p.description.slice(0, 120)}…
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tags.slice(0, 3).map(t => (
                    <span key={t}
                      className="font-press-start text-[6px] px-1 py-0.5 border"
                      style={{
                        color: 'oklch(68% 0.15 198)',
                        borderColor: 'oklch(68% 0.15 198 / 0.4)',
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 font-press-start text-[7px]"
                  style={{ color: 'oklch(55% 0.155 65)' }}>
                  PRESS ENTER ▶
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
