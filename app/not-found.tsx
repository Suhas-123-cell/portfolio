import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center font-vt323 p-8 text-center"
      style={{ background: 'oklch(5% 0.007 55)', color: 'oklch(78% 0.17 72)' }}>
      <div className="font-press-start text-[40px] sm:text-[60px] mb-4"
        style={{ color: 'oklch(60% 0.18 28)', textShadow: '0 0 20px oklch(60% 0.18 28 / 0.5)' }}>
        GAME OVER
      </div>
      <div className="font-press-start text-xs mb-2" style={{ color: 'oklch(35% 0.10 62)' }}>
        ERROR 404
      </div>
      <div className="text-xl mb-1" style={{ color: 'oklch(55% 0.155 65)' }}>PAGE NOT FOUND</div>
      <div className="text-xl mb-12" style={{ color: 'oklch(35% 0.10 62)' }}>
        The cartridge you requested does not exist.
      </div>
      <Link href="/menu"
        className="font-press-start text-[10px] px-6 py-3 border-2 hover:opacity-80 transition-opacity"
        style={{ color: 'oklch(90% 0.12 80)', borderColor: 'oklch(78% 0.17 72)', boxShadow: '0 0 12px oklch(78% 0.17 72 / 0.3)' }}>
        INSERT COIN ▶
      </Link>
      <div className="mt-8 text-base blink" style={{ color: 'oklch(35% 0.10 62)' }}>
        CONTINUE? &nbsp; 9 &nbsp; 8 &nbsp; 7…
      </div>
    </div>
  )
}
