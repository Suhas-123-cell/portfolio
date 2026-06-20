'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
      </svg>
    ),
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
      </svg>
    ),
  },
  {
    href: '/skills',
    label: 'Skills',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
      </svg>
    ),
  },
  {
    href: '/about',
    label: 'About',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
      </svg>
    ),
  },
]

export function NavRail() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop: vertical rail */}
      <nav
        aria-label="Main navigation"
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2 p-2 glass rounded-2xl"
      >
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`nav-icon-btn w-11 h-11 flex items-center justify-center rounded-xl relative group
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                ${active ? 'active' : ''}`}
              style={{
                color: active ? 'oklch(85% 0.20 185)' : 'oklch(72% 0.04 240)',
                outlineColor: 'oklch(75% 0.18 185)',
              }}
            >
              {item.icon}
              <span aria-hidden="true"
                className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs whitespace-nowrap
                           opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity
                           glass-sm font-sora"
                style={{ color: 'oklch(95% 0.01 240)' }}>
                {item.label}
              </span>
              {active && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
                  style={{ background: 'oklch(75% 0.18 185)' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile: bottom bar — hidden from AT since desktop nav is the primary landmark */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-around items-center
                   h-16 px-2 glass"
        style={{
          borderRadius: 0,
          borderTop: '1px solid oklch(100% 0 0 / 0.10)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`nav-icon-btn flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                ${active ? 'active' : ''}`}
              style={{
                color: active ? 'oklch(85% 0.20 185)' : 'oklch(72% 0.04 240)',
                outlineColor: 'oklch(75% 0.18 185)',
              }}
            >
              {item.icon}
              <span className="text-[9px] font-sora">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
