import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CRTScreen } from '@/components/CRTScreen'
import { projects } from '@/content/projects'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-2xl mx-auto">
          <Link href="/projects" className="text-lg hover:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>← ALL PROJECTS</Link>

          {/* Hero image */}
          <div className="mt-8 relative w-full h-48 sm:h-64 overflow-hidden border-2"
            style={{ borderColor: 'oklch(55% 0.155 65)', boxShadow: '0 0 32px oklch(78% 0.17 72 / 0.15)' }}>
            {/* ponytail: plain img bypasses next/image optimization cache */}
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: project.darkBg
                  ? 'sepia(0.5) hue-rotate(10deg) saturate(1.3) brightness(0.8)'
                  : 'invert(1) sepia(0.5) hue-rotate(170deg) saturate(0.8) brightness(0.7)',
                opacity: 0.85,
              }}
            />
            <div className="absolute inset-0"
              style={{ background: 'oklch(55% 0.155 65 / 0.08)', mixBlendMode: 'color' }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px, transparent 3px,
                  oklch(0% 0 0 / 0.25) 3px, oklch(0% 0 0 / 0.25) 4px
                )`,
              }} />
            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4"
              style={{ background: 'linear-gradient(to top, oklch(5% 0.007 55), transparent)' }}>
              <div className="font-press-start text-[8px]" style={{ color: 'oklch(35% 0.10 62)' }}>
                LOADING LEVEL...
              </div>
              <h1 className="font-press-start text-base sm:text-xl mt-1 chromatic amber-glow"
                style={{ color: 'oklch(90% 0.12 80)' }}>{project.title}</h1>
            </div>
          </div>

          <div className="mt-4 text-xl" style={{ color: 'oklch(68% 0.15 198)' }}>{project.subtitle}</div>

          <p className="mt-4 text-xl sm:text-2xl leading-relaxed"
            style={{ color: 'oklch(78% 0.17 72)' }}>{project.description}</p>

          <div className="mt-6">
            <div className="font-press-start text-[8px] mb-3" style={{ color: 'oklch(35% 0.10 62)' }}>
              TECH STACK
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="font-press-start text-[8px] px-2 py-1 border"
                  style={{
                    color: 'oklch(68% 0.15 198)',
                    borderColor: 'oklch(68% 0.15 198 / 0.5)',
                    background: 'oklch(10% 0.009 55)',
                  }}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-6 font-press-start text-[9px]">
            <a href={project.repo} target="_blank" rel="noopener noreferrer"
              className="cyan-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(82% 0.18 198)' }}>VIEW CODE ↗</a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="amber-glow hover:underline focus:outline-none"
                style={{ color: 'oklch(90% 0.12 80)' }}>LIVE DEMO ↗</a>
            )}
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
