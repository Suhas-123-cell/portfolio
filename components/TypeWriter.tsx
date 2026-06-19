'use client'

import { useEffect, useState } from 'react'

export function useTypeWriter(lines: string[], speed = 30, lineDelay = 200) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let lineIdx = 0
    let charIdx = 0
    let current = ''

    function tick() {
      if (lineIdx >= lines.length) { setDone(true); return }

      if (charIdx <= lines[lineIdx].length) {
        current = lines[lineIdx].slice(0, charIdx)
        setDisplayed(prev => {
          const next = [...prev]
          next[lineIdx] = current
          return next
        })
        charIdx++
        setTimeout(tick, speed)
      } else {
        lineIdx++
        charIdx = 0
        setTimeout(tick, lineDelay)
      }
    }

    tick()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { displayed, done }
}
