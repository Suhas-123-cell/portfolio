import { Color, SRGBColorSpace } from 'three'

export type ThemeKey = 'ink' | 'ink2' | 'hero' | 'web' | 'paper' | 'window'

/** Raw sRGB theme colours (0..1) read from CSS custom properties. */
export type Theme = Record<ThemeKey, [number, number, number]>

const VARS: Record<ThemeKey, [string, string]> = {
  ink: ['--ink', '#0b1020'],
  ink2: ['--ink-2', '#151c33'],
  hero: ['--hero', '#d92b2b'],
  web: ['--web', '#2f5bc4'],
  paper: ['--paper', '#f5f2ea'],
  window: ['--window', '#f2cf73'],
}

let probe: CanvasRenderingContext2D | null = null

/** Resolve any CSS colour string (incl. oklch) to sRGB 0..1 by painting it. */
function cssToRgb(value: string, fallback: string): [number, number, number] {
  if (!probe) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    probe = c.getContext('2d', { willReadFrequently: true })
  }
  if (!probe) return hexToRgb(fallback)
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = fallback
  probe.fillStyle = value || fallback // invalid strings are ignored by the canvas
  probe.fillRect(0, 0, 1, 1)
  const d = probe.getImageData(0, 0, 1, 1).data
  return [d[0] / 255, d[1] / 255, d[2] / 255]
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export function readTheme(): Theme {
  const cs = getComputedStyle(document.documentElement)
  const out = {} as Theme
  for (const key of Object.keys(VARS) as ThemeKey[]) {
    const [name, fb] = VARS[key]
    out[key] = cssToRgb(cs.getPropertyValue(name).trim(), fb)
  }
  return out
}

export function luminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** sRGB triple -> linear THREE.Color (for scene materials). */
export function toColor(rgb: [number, number, number], target = new Color()): Color {
  return target.setRGB(rgb[0], rgb[1], rgb[2], SRGBColorSpace)
}

export function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export function scaleRgb(a: [number, number, number], s: number): [number, number, number] {
  return [a[0] * s, a[1] * s, a[2] * s]
}
