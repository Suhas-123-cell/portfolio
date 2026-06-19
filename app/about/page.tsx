import Link from 'next/link'
import { CRTScreen } from '@/components/CRTScreen'
import { about } from '@/content/about'

export default function AboutPage() {
  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link href="/menu" className="text-lg hover:underline focus:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>
            ← BACK
          </Link>

          {/* Header */}
          <div className="mt-8 border-2 p-4 sm:p-6"
            style={{ borderColor: 'oklch(55% 0.155 65)' }}>
            <div className="font-press-start text-[9px] sm:text-xs mb-1"
              style={{ color: 'oklch(35% 0.10 62)' }}>
              PLAYER ONE — CHARACTER PROFILE
            </div>
            <h1 className="font-press-start text-base sm:text-xl mt-2 chromatic amber-glow"
              style={{ color: 'oklch(90% 0.12 80)' }}>
              {about.name}
            </h1>
            <div className="mt-1 text-xl" style={{ color: 'oklch(68% 0.15 198)' }}>
              {about.class}
            </div>
          </div>

          {/* Stat block */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'LEVEL',    value: about.level },
              { label: 'ORIGIN',   value: about.origin },
              { label: 'WEAPON',   value: about.mainWeapon },
              { label: 'ABILITY',  value: about.specialAbility },
            ].map(s => (
              <div key={s.label} className="border p-3"
                style={{ borderColor: 'oklch(35% 0.10 62)' }}>
                <div className="font-press-start text-[7px]"
                  style={{ color: 'oklch(35% 0.10 62)' }}>
                  {s.label}
                </div>
                <div className="mt-1 text-sm leading-tight" style={{ color: 'oklch(78% 0.17 72)' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div className="mt-6 space-y-4">
            {about.bio.map((para, i) => (
              <p key={i} className="text-xl leading-relaxed"
                style={{ color: i === 0 ? 'oklch(90% 0.12 80)' : 'oklch(78% 0.17 72)' }}>
                {para}
              </p>
            ))}
          </div>

          {/* Links */}
          <div className="mt-8 flex gap-6 font-press-start text-[9px]">
            <a href={about.links.github} target="_blank" rel="noopener noreferrer"
              className="cyan-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(68% 0.15 198)' }}>
              GITHUB ↗
            </a>
            <Link href="/contact"
              className="amber-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(78% 0.17 72)' }}>
              CONTACT ↗
            </Link>
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
