import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { FileText, Menu, X } from 'lucide-react'
import WebMark from './WebMark'
import SuitPicker from './SuitPicker'
import { about } from '../../content/about'

export const NAV = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const close = () => {
      setOpen(false)
      toggleRef.current?.focus()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    // rotating a tablet past the breakpoint hides the menu, so make sure it is closed too
    const wide = window.matchMedia('(min-width: 768px)')
    const onWide = () => wide.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const mobileLinks = [{ to: '/', label: 'Home' }, ...NAV]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-line bg-ink">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" aria-label="Suhas Choudary, home" className="misprint-hover flex items-center gap-2.5">
          <WebMark className="h-8 w-8 text-paper transition-transform duration-500 hover:rotate-45" />
          <span className="font-display misprint text-2xl">Suhas</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className="relative py-1 text-[0.95rem] font-semibold tracking-wide">
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-paper' : 'text-paper-dim transition-colors hover:text-paper'}>{label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-strand"
                          className="absolute -bottom-1 left-0 right-0 h-[3px] bg-hero"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href={about.resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 border-2 border-hero px-2.5 py-1 text-[0.95rem] font-semibold tracking-wide text-paper transition-colors hover:bg-hero hover:text-hero-ink"
              >
                <FileText size={15} aria-hidden /> Résumé
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <SuitPicker />
          <button
            ref={toggleRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center border-2 border-line bg-ink-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink md:hidden"
          >
            <WebMark className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-paper/10" strokeWidth={1.2} />
            <ul className="relative flex flex-col gap-1 px-6 pt-8">
              {mobileLinks.map(({ to, label }, i) => (
                <motion.li
                  key={to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={to} onClick={() => setOpen(false)} className="misprint-hover block py-2">
                    <span className="font-display misprint text-6xl">{label}</span>
                  </Link>
                </motion.li>
              ))}
              <li className="mt-6">
                <a href={about.resume} target="_blank" rel="noreferrer" className="btn btn-hero">
                  <FileText size={18} aria-hidden /> Résumé
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
