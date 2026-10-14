import { useSyncExternalStore } from 'react'

// The cartoon-style title sequence plays once per session on the home page,
// never under reduced motion, and can be replayed from the footer.
// `revealed` flips at the red flash, a beat before the overlay is gone, so the
// hero is already in place when the flash fades.

function shouldAutoPlay() {
  if (typeof window === 'undefined') return false
  if (window.location.pathname.replace(import.meta.env.BASE_URL, '/') !== '/') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !sessionStorage.getItem('intro-seen')
  } catch {
    return true
  }
}

let playing = shouldAutoPlay()
let revealed = !playing
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const intro = {
  start() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    playing = true
    revealed = false
    emit()
  },
  reveal() {
    if (revealed) return
    revealed = true
    emit()
  },
  end() {
    try {
      sessionStorage.setItem('intro-seen', '1')
    } catch {
      /* ignore */
    }
    playing = false
    revealed = true
    emit()
  },
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function useIntroPlaying() {
  return useSyncExternalStore(subscribe, () => playing, () => false)
}

export function useIntroRevealed() {
  return useSyncExternalStore(subscribe, () => revealed, () => true)
}
