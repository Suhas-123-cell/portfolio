import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { skillGroups } from '../../content/skills'

// Skills as an orb web: one spoke per skill, spokes grouped by category,
// capture spiral sagging between them. Hover or click a group to light its strands.

const all = skillGroups.flatMap((g, gi) => g.skills.map((s) => ({ name: s, group: gi })))
const N = all.length
const R = 300
const RINGS = [70, 130, 190, 250, 300]
const accents = ['var(--hero)', 'var(--web)', 'var(--caption)', 'var(--paper)']

const angle = (i: number) => (i / N) * Math.PI * 2 - Math.PI / 2
const at = (r: number, a: number) => [r * Math.cos(a), r * Math.sin(a)] as const

function ringPath(r: number) {
  let d = ''
  for (let i = 0; i <= N; i++) {
    const a0 = angle(i)
    const [x, y] = at(r, a0)
    if (i === 0) {
      d += `M${x.toFixed(1)} ${y.toFixed(1)}`
      continue
    }
    const [cx, cy] = at(r * 0.94, (angle(i - 1) + a0) / 2)
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

export default function SkillWeb() {
  const [hover, setHover] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const active = hover ?? pinned
  const reduce = useReducedMotion()

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
      <svg viewBox="-520 -420 1040 840" className="hidden w-full md:block" role="img" aria-label="Skills arranged as a spider web, grouped by category">
        <g fill="none" stroke="var(--paper)" strokeOpacity={0.35} strokeWidth={1.2}>
          {RINGS.map((r, k) => (
            <motion.path
              key={r}
              d={ringPath(r)}
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + k * 0.12, duration: 0.9, ease: 'easeInOut' }}
            />
          ))}
        </g>
        {all.map((s, i) => {
          const a = angle(i)
          const [x, y] = at(R, a)
          // alternate label distance so neighbouring labels never collide
          const [lx, ly] = at(R + 20 + (i % 2) * 34, a)
          const lit = active === null || active === s.group
          const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'
          // each node pops only once its strand has landed
          const land = i * 0.025 + 0.45
          return (
            <g key={s.name} style={{ opacity: lit ? 1 : 0.22, transition: 'opacity 0.25s' }}>
              <motion.line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={accents[s.group]}
                strokeWidth={active === s.group ? 2.6 : 1.6}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025, duration: 0.45 }}
              />
              <motion.g
                initial={reduce ? false : { opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: land, type: 'spring', stiffness: 500, damping: 18 }}
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                <circle cx={x} cy={y} r={5} fill={accents[s.group]} stroke="var(--ink)" strokeWidth={2} />
                <text x={lx} y={ly} dy="0.35em" textAnchor={anchor} fill="var(--paper)" fontSize={17} fontWeight={600} fontFamily="var(--font-body)">
                  {s.name}
                </text>
              </motion.g>
            </g>
          )
        })}
        <circle r={8} fill="var(--hero)" stroke="var(--paper)" strokeWidth={2} />
      </svg>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        {skillGroups.map((g, gi) => (
          <li key={g.name}>
            <button
              type="button"
              onMouseEnter={() => setHover(gi)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(gi)}
              onBlur={() => setHover(null)}
              onClick={() => setPinned((p) => (p === gi ? null : gi))}
              aria-pressed={pinned === gi}
              className="w-full border-2 border-line bg-ink-2 p-4 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: `5px 5px 0 ${accents[gi]}` }}
            >
              <span className="font-display text-2xl">{g.name}</span>
              <span className="mt-2 block text-[0.95rem] leading-relaxed text-paper/85">{g.skills.join(', ')}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
