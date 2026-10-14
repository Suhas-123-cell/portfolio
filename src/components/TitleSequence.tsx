import { useEffect, useRef } from 'react'
import { useAnimate } from 'motion/react'
import { intro, useIntroPlaying } from '../lib/intro'
import { projects } from '../../content/projects'

// A title sequence in the style of the 2012 cartoon opening, with my name as the title:
// letterboxed comic panels hard-cut past, KA-BOOM, the strip collapses into a red name
// plate, a spider drops in from the camera, the first name flies down, the surname slams
// in, web ropes snap taut around it, a held title card, then the camera rushes through
// web sheets into a red flash and the site is underneath.
// The spider emblem behind the name is the owner's supplied image (public/images/spider-emblem.png).

const RED = 'oklch(58% 0.22 27)'
const ROPE = 'linear-gradient(180deg, #ffffff 0%, #eef0f5 45%, #b9bdc9 100%)'

function Panel({ i, text }: { i: number; text: string }) {
  const tones = ['#f5a524', '#e86a1c', '#ffd25a', '#c9481a', '#f7b733', '#ff8a3d']
  return (
    <div
      className="relative h-full shrink-0 overflow-hidden border-x-4 border-black"
      style={{ width: `${34 + (i % 3) * 8}vw`, background: tones[i % tones.length] }}
    >
      <div className="speedlines absolute inset-0 text-black/25" />
      <div className="halftone absolute inset-0 text-black/20" />
      <span
        className="sfx absolute left-1/2 top-1/2 whitespace-nowrap text-[9vmin]"
        style={{ translate: '-50% -50%', rotate: `${i % 2 ? 7 : -8}deg` }}
      >
        {text}
      </span>
    </div>
  )
}

// A web rope is a bundle of three strands with cross-ties, tapering to where it lands.
function Rope({ top, rot, thick, land, front = false }: { top: number; rot: number; thick: number; land: number; front?: boolean }) {
  return (
    <div
      data-rope
      className={`pointer-events-none absolute opacity-0 ${front ? 'z-10' : ''}`}
      style={{
        left: `${land}%`,
        top: `calc(50% + ${top}em)`,
        width: '100vw',
        height: `${thick}vmin`,
        transformOrigin: '100% 50%',
        rotate: `${rot}deg`,
        clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)',
        filter: 'drop-shadow(0 0.3vmin 0 rgba(0,0,0,0.4))',
      }}
    >
      {['top-0', 'top-[39%]', 'bottom-0'].map((pos) => (
        <div key={pos} className={`absolute inset-x-0 h-[22%] ${pos}`} style={{ background: ROPE }} />
      ))}
      <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(90deg, rgba(244,245,248,0.7) 0 3px, transparent 3px 4.6vmin)' }} />
    </div>
  )
}

// [top offset (em of the title), rotation, thickness (vmin), where it lands (% of title width)]
const ROPES: [number, number, number, number][] = [
  [-0.26, -9, 3.4, 50],
  [0.02, -2, 2.8, 58],
  [0.2, 4, 3.6, 46],
  [-0.1, -4.5, 2.2, 64],
]

export default function TitleSequence() {
  const playing = useIntroPlaying()
  if (!playing) return null
  return <Sequence />
}

function Sequence() {
  const [scope, animate] = useAnimate()
  const skipRef = useRef<HTMLButtonElement>(null)
  const panels = [...projects.slice(0, 8).map((p) => p.sfx), 'THWIP!']

  useEffect(() => {
    // warm the 3D chunk while the intro plays, so the sky is ready at the reveal
    void import('../three/WebHero')
    document.body.style.overflow = 'hidden'
    skipRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' || e.key === 'Enter') && intro.end()
    window.addEventListener('keydown', onKey)

    const snap: [number, number, number, number] = [0.9, 0, 0.1, 1]
    const hit: { ease: ('easeIn' | 'easeOut')[] } = { ease: ['easeIn', 'easeOut', 'easeOut'] }
    const FLASH = 5.65
    const controls = animate([
      // comic panels hard-cut past in the letterbox; blur only during each snap
      ['[data-track]', { x: ['0%', '-14%', '-28%', '-44%', '-62%'] }, { duration: 1.5, ease: [snap, snap, snap, snap] }],
      ['[data-track]', { filter: ['blur(0px)', 'blur(6px)', 'blur(0px)', 'blur(6px)', 'blur(0px)', 'blur(6px)', 'blur(0px)', 'blur(6px)', 'blur(0px)'] }, { duration: 1.5, at: 0 }],
      ['[data-bloom]', { opacity: [0, 1, 0], scale: [0.4, 1.6, 2.2] }, { duration: 0.4, at: 1.3 }],
      ['[data-boom]', { opacity: [0, 1], scale: [1.25, 1] }, { duration: 0.18, at: 1.45, ease: 'easeOut' }],
      ['[data-boom]', { opacity: 0 }, { duration: 0.06, at: 1.85 }],
      // the strip collapses into the name plate (clip + translate, no layout work)
      ['[data-strip]', { clipPath: ['inset(0px 0px)', 'inset(calc(18vh - 4.5vmin) calc(50vw - 17vmin))'], y: ['0vh', '-35vh'] }, { duration: 0.5, at: 1.85, ease: [0.7, 0, 0.2, 1] }],
      ['[data-plate]', { opacity: [0, 1] }, { duration: 0.15, at: 2.1 }],
      // red glow, then the spider drops in from the camera and lands with a hit
      ['[data-glow]', { opacity: [0, 0.9, 0], scale: [0.6, 1.4, 1.8] }, { duration: 0.5, at: 2.4 }],
      ['[data-spider]', { opacity: [0, 1, 1], scale: [6, 0.95, 1], filter: ['blur(16px)', 'blur(0px)', 'blur(0px)'] }, { duration: 0.4, at: 2.6, times: [0, 0.7, 1], ease: ['easeIn', 'easeOut'] }],
      // first name flies down
      ['[data-first]', { opacity: [0, 1], y: ['-45vh', '0vh'], scaleY: [3, 1], filter: ['blur(12px)', 'blur(0px)'] }, { duration: 0.3, at: 3.15, ease: 'easeIn' }],
      // surname slams in: accelerate into the screen, overshoot, settle; shake on contact
      ['[data-last]', { opacity: [0, 1, 1, 1], scale: [4, 0.94, 1.03, 1], skewX: [-6, -6, -6, -6], filter: ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] }, { duration: 0.32, at: 3.55, times: [0, 0.55, 0.8, 1], ...hit }],
      ['[data-stage]', { x: [0, -12, 9, -5, 3, 0], y: [0, 7, -5, 2, 0, 0] }, { duration: 0.24, at: 3.73 }],
      // web ropes snap taut from off-screen right, behind the letters
      ['[data-rope]', { scaleX: [0, 1.04, 1], opacity: [1, 1, 1] }, { duration: 0.22, at: 3.95, times: [0, 0.75, 1], ease: ['easeOut', 'easeOut'] }],
      ['[data-stage]', { x: [0, 6, -3, 0] }, { duration: 0.14, at: 4.12 }],
      // hold the title card, then the camera rushes through web sheets
      ['[data-sheet]', { x: ['130vw', '-130vw'], opacity: [1, 1] }, { duration: 0.5, at: 5.2, ease: [0.5, 0, 0.9, 1] }],
      ['[data-stage]', { scale: [1, 6], filter: ['blur(0px)', 'blur(6px)'], opacity: [1, 0] }, { duration: 0.42, at: 5.25, ease: [0.6, 0, 1, 1] }],
      // red flash; the hero is revealed underneath at its peak
      ['[data-flash]', { opacity: [0, 1] }, { duration: 0.1, at: FLASH }],
      [scope.current, { opacity: [1, 0] }, { duration: 0.45, at: FLASH + 0.12, ease: 'easeOut' }],
    ])
    const revealTimer = window.setTimeout(() => intro.reveal(), (FLASH + 0.08) * 1000)
    controls.then(() => intro.end())

    return () => {
      controls.stop()
      window.clearTimeout(revealTimer)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      // hand focus to the page once the skip button is gone (after the inert wrapper lifts)
      requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
    }
  }, [animate, scope])

  return (
    <div ref={scope} role="dialog" aria-modal="true" aria-label="Intro: Maddali Suhas Choudary" className="fixed inset-0 z-[90] overflow-hidden bg-black">
      <div data-stage className="absolute inset-0">
        {/* letterboxed strip of comic panels; collapses into the name plate */}
        <div data-strip className="absolute left-0 top-[calc(50%-18vh)] h-[36vh] w-screen overflow-hidden" style={{ clipPath: 'inset(0px 0px)' }}>
          <div data-track className="flex h-full" style={{ filter: 'sepia(0.35) saturate(1.3)' }}>
            {panels.map((t, i) => (
              <Panel key={i} i={i} text={t} />
            ))}
          </div>
          <div data-bloom className="absolute inset-0 opacity-0" style={{ background: 'radial-gradient(circle at 60% 50%, #fff 0%, #ffe9a8 25%, transparent 60%)' }} />
          <div data-boom className="absolute inset-0 overflow-hidden opacity-0" style={{ background: '#ffd84a' }}>
            <div className="speedlines absolute inset-0 text-[#e2401c]/50" />
            <span className="sfx absolute left-1/2 top-1/2 whitespace-nowrap text-[13vmin]" style={{ translate: '-50% -50%', rotate: '-6deg', color: '#e2401c' }}>
              KA-BOOM!
            </span>
          </div>
          <div data-plate className="absolute left-1/2 top-1/2 flex h-[9vmin] w-[34vmin] -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0" style={{ background: RED }}>
            <span className="font-display text-[5.4vmin] leading-none tracking-[0.06em] text-white">MADDALI</span>
          </div>
        </div>

        <div data-glow className="absolute left-1/2 top-[58%] h-[60vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-0" style={{ background: `radial-gradient(closest-side, ${RED}, transparent)` }} />

        {/* the spider emblem sits behind the name; everything below is anchored to the centre of the screen */}
        <div data-spider className="absolute left-1/2 top-[59%] -translate-x-1/2 -translate-y-1/2 opacity-0">
          <img src="/images/spider-emblem.png" alt="" draggable={false} className="h-[min(74vmin,100vw)] w-auto select-none max-md:portrait:h-[min(62vh,135vw)]" />
        </div>

        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2">
          <span
            data-first
            className="font-display absolute bottom-full left-1/2 mb-[1.2vmin] block -translate-x-1/2 text-[7vmin] leading-none text-white opacity-0"
            style={{ letterSpacing: '0.42em', paddingLeft: '0.42em', WebkitTextStroke: `0.05em ${RED}`, paintOrder: 'stroke fill' }}
          >
            SUHAS
          </span>
          <div className="relative text-[min(19vmin,17vw)]">
            {/* ropes sit behind the letters... */}
            {ROPES.map(([top, rot, thick, land], k) => (
              <Rope key={k} top={top} rot={rot} thick={thick} land={land} />
            ))}
            <span
              data-last
              className="font-display relative block whitespace-nowrap leading-[0.9] opacity-0"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 52%, #c9ccd6 53%, #f2f3f7 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextStroke: `0.035em ${RED}`,
                filter: `drop-shadow(0.05em 0.05em 0 #7a0f12) drop-shadow(0.02em 0.02em 0 ${RED})`,
              }}
            >
              CHOUDARY
            </span>
            {/* ...except one thin strand that wraps over the front */}
            <Rope top={0.08} rot={1.5} thick={0.9} land={54} front />
          </div>
        </div>

        {/* web sheets the camera flies through */}
        {[
          { top: '8%', h: '46vh', clip: 'polygon(0 50%, 100% 0, 100% 100%)' },
          { top: '40%', h: '60vh', clip: 'polygon(0 40%, 100% 0, 92% 100%)' },
          { top: '62%', h: '38vh', clip: 'polygon(0 60%, 100% 10%, 100% 90%)' },
        ].map((s, k) => (
          <div
            key={k}
            data-sheet
            className="pointer-events-none absolute left-0 w-[120vw] opacity-0"
            style={{ top: s.top, height: s.h, clipPath: s.clip, background: 'repeating-linear-gradient(172deg, rgba(255,255,255,0.95) 0 4px, transparent 4px 28px), repeating-linear-gradient(84deg, rgba(225,228,236,0.85) 0 3px, transparent 3px 70px)' }}
          />
        ))}
      </div>

      <div data-flash className="pointer-events-none absolute inset-0 opacity-0" style={{ background: RED }} />

      <button
        ref={skipRef}
        type="button"
        onClick={() => intro.end()}
        className="absolute bottom-6 right-6 border-2 border-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white/85 transition-colors hover:bg-white hover:text-black"
      >
        Skip intro
      </button>
    </div>
  )
}
