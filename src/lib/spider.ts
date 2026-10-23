import { useEffect } from 'react'

// One spider drawing, shared by the scroll spider (SpiderDrop) and the mouse cursor.
// Left-side legs; the right side is the mirror image.
export const SPIDER_LEGS = [
  'M-4 -3 L-11 -10 L-15 -4',
  'M-4 -1 L-13 -4 L-17 2',
  'M-4 1 L-12 4 L-15 11',
  'M-4 3 L-9 9 L-10 16',
]

// A CSS cursor can't read var(), so the image is rebuilt from the suit tokens whenever the suit changes.
function cursorValue() {
  const css = getComputedStyle(document.documentElement)
  const [ink, paper, hero] = ['--ink', '--paper', '--hero'].map((t) => css.getPropertyValue(t).trim())
  const legs = SPIDER_LEGS.map((d) => `<path d='${d}'/><path d='${d}' transform='scale(-1 1)'/>`).join('')
  const body = `<ellipse cx='0' cy='5' rx='5.2' ry='7'/><circle cx='0' cy='-4' r='3.6'/>`
  // the ink pass underneath keeps the spider readable on both dark and light suits
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-20 -16 40 36' width='36' height='32'>` +
    `<g fill='${ink}' stroke='${ink}' stroke-width='4.4' stroke-linecap='round' stroke-linejoin='round'>` +
    `<g fill='none'>${legs}</g>${body}</g>` +
    `<g fill='none' stroke='${paper}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'>${legs}</g>` +
    `<g fill='${hero}' stroke='${paper}' stroke-width='1.4'>${body}</g></svg>`
  // hotspot on the head, so a click lands where the spider's face is
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 18 11, auto`
}

export function useSpiderCursor() {
  useEffect(() => {
    const apply = () => document.documentElement.style.setProperty('--spider-cursor', cursorValue())
    apply()
    window.addEventListener('suitchange', apply)
    return () => {
      window.removeEventListener('suitchange', apply)
      document.documentElement.style.removeProperty('--spider-cursor')
    }
  }, [])
}
