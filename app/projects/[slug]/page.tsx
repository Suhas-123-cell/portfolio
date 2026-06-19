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
            style={{ color: 'oklch(68% 0.15 198)' }}>
            ← ALL PROJECTS
          </Link>

          <div className="mt-8 border-2 p-4 sm:p-6"
            style={{ borderColor: 'oklch(55% 0.155 65)', boxShadow: '0 0 24px oklch(78% 0.17 72 / 0.1)' }}>
            <div className="font-press-start text-[8px]" style={{ color: 'oklch(35% 0.10 62)' }}>
              LOADING LEVEL...
            </div>
            <h1 className="font-press-start text-base sm:text-xl mt-3 chromatic amber-glow"
              style={{ color: 'oklch(90% 0.12 80)' }}>
              {project.title}
            </h1>
            <div className="mt-1 text-xl" style={{ color: 'oklch(68% 0.15 198)' }}>
              {project.subtitle}
            </div>
          </div>

          <p className="mt-6 text-xl sm:text-2xl leading-relaxed"
            style={{ color: 'oklch(78% 0.17 72)' }}>
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mt-6">
            <div className="font-press-start text-[8px] mb-3"
              style={{ color: 'oklch(35% 0.10 62)' }}>
              TECH STACK
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag}
                  className="font-press-start text-[8px] px-2 py-1 border"
                  style={{
                    color: 'oklch(68% 0.15 198)',
                    borderColor: 'oklch(68% 0.15 198 / 0.5)',
                    background: 'oklch(10% 0.009 55)',
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 flex gap-6 font-press-start text-[9px]">
            <a href={project.repo} target="_blank" rel="noopener noreferrer"
              className="cyan-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(82% 0.18 198)' }}>
              VIEW CODE ↗
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="amber-glow hover:underline focus:outline-none"
                style={{ color: 'oklch(90% 0.12 80)' }}>
                LIVE DEMO ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
