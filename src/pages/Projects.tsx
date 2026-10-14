import { motion } from 'motion/react'
import PageTransition from '../components/PageTransition'
import ProjectCover from '../components/ProjectCover'
import { projects } from '../../content/projects'

// Every fifth issue gets a double-width cover so the shelf has rhythm.
const span = (i: number) => (i % 5 === 0 ? 'md:col-span-2' : '')

export default function Projects() {
  return (
    <PageTransition title="Work | Suhas Choudary">
      <section className="mx-auto max-w-7xl px-4 pt-32 md:px-8 md:pt-40">
        <h1 className="font-display misprint text-6xl md:text-8xl">The collection</h1>
        <p className="mt-5 max-w-[52ch] text-lg text-paper/85">
          {projects.length} issues, newest first. Agents, guardrails, computer vision, and the apps that put them in people's hands.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className={`flex ${span(i)}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCover project={p} size={i % 5 === 0 ? 'wide' : 'md'} className="w-full" />
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
