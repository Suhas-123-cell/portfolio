// The site mark: an eight-spoke orb web whose rings sag between spokes.
const SPOKES = 8
const R = 46

const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`

function ring(r: number) {
  let d = ''
  for (let i = 0; i < SPOKES; i++) {
    const a0 = (i / SPOKES) * Math.PI * 2 - Math.PI / 2
    const a1 = ((i + 1) / SPOKES) * Math.PI * 2 - Math.PI / 2
    if (i === 0) d += `M${pt(r, a0)}`
    d += ` Q${pt(r * 0.8, (a0 + a1) / 2)} ${pt(r, a1)}`
  }
  return d
}

const spokes = Array.from({ length: SPOKES }, (_, i) => {
  const a = (i / SPOKES) * Math.PI * 2 - Math.PI / 2
  return `M0 0 L${pt(R, a)}`
}).join(' ')

const rings = [12, 24, 36, 46].map(ring).join(' ')

export default function WebMark({ className, strokeWidth = 3.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden fill="none">
      <path d={`${spokes} ${rings}`} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
