import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import WebShooter from './components/WebShooter'
import SpiderDrop from './components/SpiderDrop'
import ChatWidget from './components/ChatWidget'
import TitleSequence from './components/TitleSequence'
import { unlockNoir } from './lib/suit'
import { useIntroPlaying } from './lib/intro'
import { useSpiderCursor } from './lib/spider'
import Home from './pages/Home'

// Home ships in the main bundle; every other page loads on demand.
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Skills = lazy(() => import('./pages/Skills'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    // initial={false}: the first page paints immediately (the intro or plain load), only route changes get the iris
    <AnimatePresence mode="wait" initial={false}>
      <Suspense key={location.pathname} fallback={<div className="min-h-[100dvh]" />}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

// Up, up, down, down, left, right, left, right, B, A: unlocks the Noir suit.
function NoirEgg() {
  const [toast, setToast] = useState(false)
  useEffect(() => {
    let i = 0
    let timer = 0
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.('input, textarea')) return
      i = e.key === KONAMI[i] || e.key.toLowerCase() === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        unlockNoir()
        setToast(true)
        window.clearTimeout(timer)
        timer = window.setTimeout(() => setToast(false), 3200)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
    }
  }, [])
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          initial={{ y: 40, opacity: 0, rotate: -3 }}
          animate={{ y: 0, opacity: 1, rotate: -2 }}
          exit={{ y: 40, opacity: 0 }}
          className="caption-box fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 !text-sm"
        >
          Noir suit unlocked. Welcome to 1933.
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  // while the intro plays, the page behind it is inert: no tabbing into invisible links
  const playing = useIntroPlaying()
  useSpiderCursor()
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MotionConfig reducedMotion="user">
        <div inert={playing}>
          <a href="#main" className="caption-box sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
            Skip to content
          </a>
          <SiteHeader />
          <AnimatedRoutes />
          <SiteFooter />
          <SpiderDrop />
          <WebShooter />
          <NoirEgg />
          <ChatWidget />
        </div>
        <TitleSequence />
      </MotionConfig>
    </BrowserRouter>
  )
}
