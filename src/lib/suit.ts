import { useSyncExternalStore } from 'react'

export type SuitId = 'classic' | 'miles' | 'gwen' | '2099' | 'noir'

export const SUITS: { id: SuitId; name: string; colors: [string, string]; hidden?: boolean }[] = [
  { id: 'classic', name: 'Classic', colors: ['#d23434', '#2b4bb3'] },
  { id: 'miles', name: 'Miles', colors: ['#1d1a1a', '#e0352c'] },
  { id: 'gwen', name: 'Gwen', colors: ['#f6eef4', '#d63a86'] },
  { id: '2099', name: '2099', colors: ['#0b0f1c', '#e8322c'] },
  { id: 'noir', name: 'Noir', colors: ['#1e1e1e', '#d9d9d9'], hidden: true },
]

const listeners = new Set<() => void>()
const read = () => (document.documentElement.dataset.suit as SuitId | undefined) ?? 'classic'

function apply(id: SuitId) {
  document.documentElement.dataset.suit = id
  try {
    localStorage.setItem('suit', id)
  } catch {
    /* storage blocked: the suit still applies for this visit */
  }
  window.dispatchEvent(new Event('suitchange'))
  listeners.forEach((l) => l())
}

/** Switch suits through a stepped "dimension glitch" (view transition) where supported. */
export function setSuit(id: SuitId) {
  if (id === read()) return
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduce) doc.startViewTransition(() => apply(id))
  else apply(id)
}

export function useSuit() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    read,
    () => 'classic' as SuitId,
  )
}

export function isNoirUnlocked() {
  try {
    return localStorage.getItem('noir') === '1'
  } catch {
    return false
  }
}

export function unlockNoir() {
  try {
    localStorage.setItem('noir', '1')
  } catch {
    /* ignore */
  }
  setSuit('noir')
}
