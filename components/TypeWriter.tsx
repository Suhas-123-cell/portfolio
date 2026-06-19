'use client'

import { useEffect, useState } from 'react'

export function useTypeWriter(lines: string[], speed = 30, lineDelay = 200) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>
    let lineIdx = 0
    let charIdx = 0

    function tick() {
      if (cancelled) return
      if (lineIdx >= lines.length) { setDone(true); return }

      if (charIdx <= lines[lineIdx].length) {
        const slice = lines[lineIdx].slice(0, charIdx)
        setDisplayed(prev => { const next = [...prev]; next[lineIdx] = slice; return next })
        charIdx++
        timeoutId = setTimeout(tick, speed)
      } else {
        lineIdx++
        charIdx = 0
        timeoutId = setTimeout(tick, lineDelay)
      }
    }

    tick()
    return () => { cancelled = true; clearTimeout(timeoutId) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { displayed, done }
}
