import Link from 'next/link'
import { GlassPanel } from '@/components/GlassPanel'

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-8 text-center md:pl-24"
      id="main">
      <GlassPanel className="p-10 max-w-sm w-full">
        <div className="font-bebas text-8xl mb-2 teal-glow"
          style={{ color: 'oklch(75% 0.18 185)' }}>
          404
        </div>
        <div className="text-[10px] font-sora tracking-[0.25em] uppercase mb-4"
          style={{ color: 'oklch(65% 0.04 240)' }}>
          Quest Not Found
        </div>
        <p className="text-sm font-sora mb-6" style={{ color: 'oklch(65% 0.04 240)' }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sora text-sm font-semibold
                     transition-all hover:opacity-90 active:scale-95
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: 'oklch(75% 0.18 185)',
            color: 'oklch(8% 0.025 240)',
            outlineColor: 'oklch(75% 0.18 185)',
          }}>
          ← Return Home
        </Link>
      </GlassPanel>
    </main>
  )
}
