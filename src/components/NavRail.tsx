import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, FolderGit2, BarChart2, User, Mail } from 'lucide-react'

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/skills', label: 'Skills', icon: BarChart2 },
  { href: '/about', label: 'About', icon: User },
  { href: '/contact', label: 'Contact', icon: Mail },
]

export default function NavRail() {
  const { pathname } = useLocation()

  return (
    <>
      {/* Desktop vertical rail */}
      <nav aria-label="Main navigation" className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2 p-2 glass rounded-2xl">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} to={href} aria-label={label} aria-current={active ? 'page' : undefined}
              className={`nav-icon-btn w-11 h-11 flex items-center justify-center rounded-xl relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${active ? 'active' : ''}`}
              style={{ color: active ? 'oklch(85% 0.20 185)' : 'oklch(72% 0.04 240)', outlineColor: 'oklch(75% 0.18 185)' }}>
              <Icon size={20} aria-hidden />
              <span aria-hidden className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity glass-sm" style={{ color: 'oklch(95% 0.01 240)', fontFamily: 'Sora, sans-serif' }}>
                {label}
              </span>
              {active && (
                <motion.span layoutId="nav-indicator" className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full" style={{ background: 'oklch(75% 0.18 185)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center h-16 px-2 glass"
        style={{ borderRadius: 0, borderTop: '1px solid oklch(100% 0 0 / 0.10)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} to={href} aria-label={label} aria-current={active ? 'page' : undefined}
              className={`nav-icon-btn flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${active ? 'active' : ''}`}
              style={{ color: active ? 'oklch(85% 0.20 185)' : 'oklch(72% 0.04 240)', outlineColor: 'oklch(75% 0.18 185)' }}>
              <Icon size={20} aria-hidden />
              <span style={{ fontSize: 9, fontFamily: 'Sora, sans-serif' }}>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
