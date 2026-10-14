import {
  Color,
  DynamicDrawUsage,
  Group,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  InstancedInterleavedBuffer,
  InterleavedBufferAttribute,
  BufferAttribute,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
  type IUniform,
} from 'three'

/**
 * Orb web simulated with verlet integration.
 * Local units: 1 = half the frame height at the web's distance, so (±aspect, ±1) are the frame edges.
 */

interface Spec {
  aspect: number
  narrow: boolean
}

const STEP = 1 / 60

const LINE_VERT = /* glsl */ `
attribute vec3 iStart;
attribute vec3 iEnd;
attribute vec2 iMeta;   // base brightness, width scale
attribute float iGlint;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCore;
uniform float uGlow;
uniform float uSheen;
uniform float uTime;
uniform vec3 uHub; // xy: hub, z: web radius
varying float vAcross;
varying float vHalf;
varying float vBright;
varying float vGlint;
void main() {
  vec4 a = projectionMatrix * modelViewMatrix * vec4(iStart, 1.0);
  vec4 b = projectionMatrix * modelViewMatrix * vec4(iEnd, 1.0);
  vec2 sa = a.xy / a.w * 0.5 * uRes;
  vec2 sb = b.xy / b.w * 0.5 * uRes;
  vec2 dir = sb - sa;
  float len = length(dir);
  dir = len > 1e-4 ? dir / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  float core = uCore * iMeta.y * uDpr;
  float halfW = core * 0.5 + uGlow * uDpr + 1.0;
  vec4 p = mix(a, b, position.x);
  vec2 off = nrm * position.y * halfW;
  p.xy += off / (0.5 * uRes) * p.w;
  vAcross = position.y * halfW;
  vHalf = core * 0.5;
  vBright = iMeta.x;
  // a slow sheen sliding diagonally across the silk (computed here so a resting web needs no uploads)
  vec2 mid = (iStart.xy + iEnd.xy) * 0.5 - uHub.xy;
  float along = (mid.x - mid.y) / (uHub.z * 1.4);
  float sheenPos = mod(uTime * 0.09, 1.6) * 2.4 - 1.2;
  float sw = (along - sheenPos) / 0.12;
  vGlint = iGlint + exp(-sw * sw) * 0.45 * uSheen;
  gl_Position = p;
}
`

const LINE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uGlintColor;
uniform float uGlow;
uniform float uGlowAmt;
uniform float uDpr;
uniform float uOpacity;
varying float vAcross;
varying float vHalf;
varying float vBright;
varying float vGlint;
void main() {
  float d = abs(vAcross);
  float core = 1.0 - smoothstep(vHalf - 0.55, vHalf + 0.55, d);
  core *= clamp(vHalf * 1.6 + 0.25, 0.0, 1.0);  // sub-pixel lines fade instead of aliasing
  float gw = uGlow * uDpr * (1.0 + vGlint * 0.8);
  float glow = exp(-(d * d) / (gw * gw * 0.3)) * (uGlowAmt + vGlint * 0.35);
  float a = max(core * vBright, glow) * uOpacity;
  if (a < 0.003) discard;
  vec3 c = mix(uColor, uGlintColor, clamp(vGlint, 0.0, 1.0) * 0.7);
  gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
}
`

export interface WebUniforms {
  uRes: IUniform<Vector2>
  uDpr: IUniform<number>
}

/** Instanced screen-space strokes: one quad per segment, positions streamed from a Float32Array. */
function strokeGeometry(count: number, meta: Float32Array, glint: Float32Array) {
  const geo = new InstancedBufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, 1, 0]), 3))
  geo.setIndex([0, 1, 2, 0, 2, 3])
  const arr = new Float32Array(count * 6)
  const buf = new InstancedInterleavedBuffer(arr, 6, 1)
  buf.setUsage(DynamicDrawUsage)
  geo.setAttribute('iStart', new InterleavedBufferAttribute(buf, 3, 0))
  geo.setAttribute('iEnd', new InterleavedBufferAttribute(buf, 3, 3))
  geo.setAttribute('iMeta', new InstancedBufferAttribute(meta, 2))
  const glintAttr = new InstancedBufferAttribute(glint, 1)
  glintAttr.setUsage(DynamicDrawUsage)
  geo.setAttribute('iGlint', glintAttr)
  geo.instanceCount = count
  return { geo, arr, buf, glintAttr }
}

function strokeMaterial(shared: WebUniforms, overlay: boolean): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uRes: shared.uRes,
      uDpr: shared.uDpr,
      uCore: { value: 1 },
      uGlow: { value: 3.2 },
      uGlowAmt: { value: 0 },
      uOpacity: { value: 1 },
      uSheen: { value: 0 },
      uTime: { value: 0 },
      uHub: { value: new Vector3(0, 0, 1) },
      uColor: { value: new Color() },
      uGlintColor: { value: new Color() },
    },
    vertexShader: LINE_VERT,
    fragmentShader: LINE_FRAG,
    transparent: true,
    depthTest: !overlay,
    depthWrite: false,
  })
}

/** Max node speed (frame units per step) below which the web is considered at rest. */
const SLEEP_SPEED = 2e-4
/** Ripple display runs "on twos" (12 fps) like Spider-Verse character animation. */
const TWOS = 1 / 12

export class SpiderWeb {
  readonly group = new Group()
  private mesh: Mesh | null = null
  private geo: InstancedBufferGeometry | null = null
  readonly material: ShaderMaterial

  // particle state
  private n = 0
  private x = new Float32Array(0)
  private y = new Float32Array(0)
  private z = new Float32Array(0)
  private ox = new Float32Array(0)
  private oy = new Float32Array(0)
  private oz = new Float32Array(0)
  private hx = new Float32Array(0)
  private hy = new Float32Array(0)
  private hz = new Float32Array(0)
  private inv = new Float32Array(0)
  private speed = new Float32Array(0)
  // constraints (also the rendered segments)
  private m = 0
  private ca = new Uint16Array(0)
  private cb = new Uint16Array(0)
  private rest = new Float32Array(0)
  private segBuf: Float32Array = new Float32Array(0)
  private segAttr: InstancedInterleavedBuffer | null = null
  private glint: InstancedBufferAttribute | null = null

  private acc = 0
  private time = 0
  private scale = 0.9
  /** Steps left before the sim may sleep (stop stepping and stop uploading buffers). */
  private awake = 0
  private touched = false
  private twosAcc = 0
  private gust = 0
  private light = false
  private narrow = false
  private pointer = { x: 0, y: 0, active: false, sx: 0, sy: 0 }
  private ripples: { x: number; y: number; t: number; amp: number }[] = []

  constructor(shared: WebUniforms) {
    this.material = strokeMaterial(shared, true)
    this.material.uniforms.uSheen.value = 1
  }

  setColors(silk: Color, glint: Color, light: boolean) {
    const u = this.material.uniforms
    ;(u.uColor.value as Color).copy(silk)
    ;(u.uGlintColor.value as Color).copy(glint)
    this.light = light
    this.applyWidth()
  }

  /** Line weight: bold on desktop; lighter on phones where the web covers more of the frame. */
  private applyWidth() {
    const u = this.material.uniforms
    const k = this.narrow ? 0.78 : 1
    u.uGlowAmt.value = (this.light ? 0.1 : 0.24) * k
    u.uCore.value = (this.light ? 1.9 : 1.6) * k
    u.uGlow.value = (this.light ? 2.6 : 3.6) * k
  }

  get sleeping() {
    return this.awake <= 0
  }

  /** (Re)generate topology for a given frame aspect. */
  build({ aspect, narrow }: Spec) {
    const rand = mulberry(narrow ? 77 : 2099)
    this.narrow = narrow
    this.applyWidth()
    const P: number[] = [] // x,y,pinned
    const C: number[] = [] // a,b,restScale*1000
    const meta: number[] = [] // brightness,width per constraint
    const add = (x: number, y: number, pinned = 0) => {
      P.push(x, y, pinned)
      return P.length / 3 - 1
    }
    const link = (a: number, b: number, restScale: number, bright: number, width: number) => {
      C.push(a, b, restScale)
      meta.push(bright, width)
    }
    const px = (i: number) => P[i * 3]
    const py = (i: number) => P[i * 3 + 1]

    // placement in frame units (frame spans x ∈ [-aspect, aspect], y ∈ [-1, 1])
    const R = narrow ? Math.min(0.62, aspect * 1.05) : 0.82
    const hub = narrow ? { x: -aspect + aspect * 0.36, y: 0.6 } : { x: -aspect + 0.42, y: 0.6 }
    this.scale = R
    ;(this.material.uniforms.uHub.value as Vector3).set(hub.x, hub.y, R)
    const top = 1.32
    const left = -aspect - 0.3

    // irregular frame polygon (angle deg, radius) — counter-clockwise
    const frameDef: [number, number][] = [
      [88, 1.08],
      [148, 1.02],
      [205, 1.12],
      [262, 1.0],
      [318, 1.14],
      [24, 1.06],
    ]
    const frame = frameDef.map(([deg, r]) => {
      const a = (deg * Math.PI) / 180
      return { a, x: hub.x + Math.cos(a) * r * R, y: hub.y + Math.sin(a) * r * R }
    })

    const center = add(hub.x, hub.y)
    const N = narrow ? 14 : 16
    const radAng: number[] = []
    for (let i = 0; i < N; i++) radAng.push(((i + 0.5 + (rand() - 0.5) * 0.45) / N) * Math.PI * 2)

    // radial end = ray ∩ frame polygon
    const radEnd: { x: number; y: number; len: number }[] = radAng.map((a) => {
      const dx = Math.cos(a)
      const dy = Math.sin(a)
      let best = Infinity
      for (let k = 0; k < frame.length; k++) {
        const p0 = frame[k]
        const p1 = frame[(k + 1) % frame.length]
        const ex = p1.x - p0.x
        const ey = p1.y - p0.y
        const den = dx * ey - dy * ex
        if (Math.abs(den) < 1e-9) continue
        const wx = p0.x - hub.x
        const wy = p0.y - hub.y
        const t = (wx * ey - wy * ex) / den
        const u = (wx * dy - wy * dx) / den
        if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t)
      }
      return { x: hub.x + dx * best, y: hub.y + dy * best, len: best }
    })

    // nodes along each radial: list of {r, idx}
    const radNodes: { r: number; i: number }[][] = radAng.map(() => [])
    const pitch = (narrow ? 0.07 : 0.062) * R
    const r0 = 0.2 * R
    const crossing: number[][] = radAng.map(() => [])
    const turns = Math.ceil((R * 1.2) / pitch)
    for (let i = 0; i < N; i++) {
      const a = radAng[i]
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      // hub mesh
      for (let k = 0; k < 4; k++) {
        const r = (0.035 + k * 0.022) * R
        radNodes[i].push({ r, i: add(hub.x + ca * r, hub.y + sa * r) })
      }
      for (let t = 0; t < turns; t++) {
        const r = r0 + (t + i / N) * pitch + (rand() - 0.5) * pitch * 0.3
        if (r > radEnd[i].len * 0.93) {
          crossing[i][t] = -1
          continue
        }
        const idx = add(hub.x + ca * r, hub.y + sa * r)
        crossing[i][t] = idx
        radNodes[i].push({ r, i: idx })
      }
    }
    const endIdx = radEnd.map((e) => add(e.x, e.y))

    // radials (taut)
    for (let i = 0; i < N; i++) {
      let prev = center
      for (const node of radNodes[i]) {
        link(prev, node.i, 0.985, 1, 1.05)
        prev = node.i
      }
      link(prev, endIdx[i], 0.985, 1, 1.05)
    }
    // hub mesh rings
    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < N; i++) {
        link(radNodes[i][k].i, radNodes[(i + 1) % N][k].i, 1.0, 0.85, 0.9)
      }
    }
    // capture spiral, each span subdivided once so it can sag
    for (let t = 0; t < turns; t++) {
      for (let i = 0; i < N; i++) {
        const a = crossing[i][t]
        const j = (i + 1) % N
        const b = i === N - 1 ? crossing[0][t + 1] : crossing[j][t]
        if (a === undefined || b === undefined || a < 0 || b < 0) continue
        const mx = (px(a) + px(b)) / 2
        const my = (py(a) + py(b)) / 2
        const mid = add(mx, my - 0.002 * R)
        link(a, mid, 1.004, 0.72, 0.85)
        link(mid, b, 1.004, 0.72, 0.85)
      }
    }
    // frame threads: polygon vertices + radial ends, sorted by angle
    const ring = [
      ...frame.map((f, k) => ({ a: norm(f.a), i: add(f.x, f.y), isVertex: k })),
      ...radEnd.map((_, i) => ({ a: norm(radAng[i]), i: endIdx[i], isVertex: -1 })),
    ].sort((p, q) => p.a - q.a)
    for (let k = 0; k < ring.length; k++) {
      link(ring[k].i, ring[(k + 1) % ring.length].i, 0.99, 1.05, 1.15)
    }
    // anchor threads to the top and left edges (pinned, off-frame)
    for (const r of ring) {
      if (r.isVertex < 0) continue
      const vx = px(r.i)
      const vy = py(r.i)
      const deg = (frameDef[r.isVertex][0] + 360) % 360
      const targets: [number, number][] = []
      if (deg < 120) targets.push([vx + (deg > 300 ? 0.55 : deg < 60 ? 0.3 : -0.1), Math.max(top, vy + 0.3)])
      if (deg >= 120 && deg <= 300) targets.push([Math.min(left, vx - 0.3), vy + (deg > 230 ? -0.5 : 0.15)])
      if (deg === 262) targets.push([Math.min(left, vx - 0.3), vy - 0.15])
      for (const [tx, ty] of targets) {
        const pin = add(tx, ty, 1)
        let prev = r.i
        const segs = 4
        for (let s = 1; s < segs; s++) {
          const f = s / segs
          const mid = add(vx + (tx - vx) * f, vy + (ty - vy) * f)
          link(prev, mid, 0.99, 1.1, 1.25)
          prev = mid
        }
        link(prev, pin, 0.99, 1.1, 1.25)
      }
    }

    // ---- commit to typed arrays
    const n = P.length / 3
    this.n = n
    this.x = new Float32Array(n)
    this.y = new Float32Array(n)
    this.z = new Float32Array(n)
    this.ox = new Float32Array(n)
    this.oy = new Float32Array(n)
    this.oz = new Float32Array(n)
    this.hx = new Float32Array(n)
    this.hy = new Float32Array(n)
    this.hz = new Float32Array(n)
    this.inv = new Float32Array(n)
    this.speed = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      this.x[i] = this.ox[i] = this.hx[i] = P[i * 3]
      this.y[i] = this.oy[i] = this.hy[i] = P[i * 3 + 1]
      this.inv[i] = P[i * 3 + 2] ? 0 : 1
    }
    const m = C.length / 3
    this.m = m
    this.ca = new Uint16Array(m)
    this.cb = new Uint16Array(m)
    this.rest = new Float32Array(m)
    for (let k = 0; k < m; k++) {
      const a = C[k * 3]
      const b = C[k * 3 + 1]
      this.ca[k] = a
      this.cb[k] = b
      this.rest[k] = Math.hypot(P[a * 3] - P[b * 3], P[a * 3 + 1] - P[b * 3 + 1]) * C[k * 3 + 2]
    }

    // ---- GPU buffers
    this.disposeMesh()
    const sg = strokeGeometry(m, new Float32Array(meta), new Float32Array(m))
    this.segBuf = sg.arr
    this.segAttr = sg.buf
    this.glint = sg.glintAttr
    this.geo = sg.geo
    const mesh = new Mesh(sg.geo, this.material)
    mesh.frustumCulled = false
    mesh.renderOrder = 10
    this.mesh = mesh
    this.group.add(mesh)

    // pre-settle so the web is at rest on first frame
    for (let i = 0; i < 160; i++) this.step(false, 0.85)
    this.ripples.length = 0
    this.speed.fill(0)
    this.awake = 30
    this.writeBuffers()
  }

  /** Pointer in web-local coords (frame units). */
  setPointer(x: number, y: number, active: boolean) {
    const p = this.pointer
    if (!p.active || !active) {
      p.sx = x
      p.sy = y
    }
    p.x = x
    p.y = y
    p.active = active
  }

  /** Pluck near (x, y). Returns true if the web was close enough to react. */
  pluck(x: number, y: number): boolean {
    let close = Infinity
    for (let i = 0; i < this.n; i++) {
      const d = Math.hypot(this.x[i] - x, this.y[i] - y)
      if (d < close) close = d
    }
    if (close > 0.08 * this.scale) return false
    const rp = 0.3 * this.scale
    for (let i = 0; i < this.n; i++) {
      if (!this.inv[i]) continue
      const dx = this.x[i] - x
      const dy = this.y[i] - y
      const d = Math.hypot(dx, dy)
      if (d > rp) continue
      const f = (1 - d / rp) ** 2
      const k = d > 1e-5 ? 1 / d : 0
      // previous position pushed toward the click = velocity away from it
      this.ox[i] -= dx * k * 0.025 * f
      this.oy[i] -= dy * k * 0.025 * f
      this.oz[i] -= 0.04 * f
    }
    if (this.ripples.length >= 4) this.ripples.shift()
    this.ripples.push({ x, y, t: 0, amp: 1 })
    this.awake = 90
    this.twosAcc = TWOS // show the first frame of the pluck immediately
    return true
  }

  /** Advance simulation by real dt (seconds). */
  update(dt: number) {
    dt = Math.min(Math.max(dt, 0), 0.1)
    this.time += dt
    this.material.uniforms.uTime.value = this.time
    const p = this.pointer
    const pointerMoved = p.active && (p.x !== p.sx || p.y !== p.sy)
    // breeze comes in gusts (period ~14 s); between them the web settles and the sim sleeps
    const gust = Math.max(0, Math.sin(this.time * 0.45)) ** 2
    if (this.awake <= 0) {
      if (!pointerMoved && gust < 0.02) {
        this.acc = 0
        return
      }
      if (gust >= 0.02) this.awake = 45
    }
    this.gust = gust
    this.acc += dt
    let steps = 0
    while (this.acc >= STEP && steps < 4) {
      this.step(true)
      this.acc -= STEP
      steps++
    }
    if (steps === 4) this.acc = 0
    if (!steps || this.awake <= 0) return
    // the web animates on twos (ripples, sway); direct manipulation stays on ones to track the pointer
    if (!this.touched) {
      this.twosAcc += dt
      if (this.twosAcc < TWOS) return
      this.twosAcc %= TWOS
    }
    this.writeBuffers()
  }

  private step(live: boolean, damp = 0.985) {
    const { x, y, z, ox, oy, oz, hx, hy, hz, inv, n, speed } = this
    const vmax = 0.04
    const g = 0.00004 * this.scale
    const home = 0.012
    const wind = live ? this.gust : 0
    const tt = this.time
    let maxSp = 0
    for (let i = 0; i < n; i++) {
      if (!inv[i]) continue
      let vx = (x[i] - ox[i]) * damp
      let vy = (y[i] - oy[i]) * damp
      let vz = (z[i] - oz[i]) * damp
      // clamp velocity
      const sp = Math.hypot(vx, vy, vz)
      if (sp > vmax) {
        const s = vmax / sp
        vx *= s
        vy *= s
        vz *= s
      }
      if (sp > maxSp) maxSp = sp
      speed[i] = speed[i] * 0.85 + sp * 0.15
      ox[i] = x[i]
      oy[i] = y[i]
      oz[i] = z[i]
      // gentle breeze (in-plane sway + slight billow)
      const wx = wind * 0.000016 * Math.sin(tt * 0.63 + y[i] * 2.1 + x[i] * 0.7) * (0.6 + 0.4 * Math.sin(tt * 0.21))
      const wz = wind * 0.00003 * Math.sin(tt * 0.9 + x[i] * 1.7)
      x[i] += vx + (hx[i] - x[i]) * home + wx
      y[i] += vy + (hy[i] - y[i]) * home - g + wx * 0.5
      z[i] += vz + (hz[i] - z[i]) * home + wz
    }

    // ripples: an expanding ring that kicks nodes as it passes
    const rs = this.ripples
    if (live && rs.length) {
      const band = 0.05 * this.scale
      for (let j = rs.length - 1; j >= 0; j--) {
        const r = rs[j]
        r.t += STEP
        if (r.t >= 2.2) {
          rs[j] = rs[rs.length - 1] // swap-remove, no per-step allocation
          rs.pop()
          continue
        }
        const front = r.t * 1.25 * this.scale
        const amp = r.amp * 0.005 * Math.exp(-r.t * 1.8)
        for (let i = 0; i < n; i++) {
          if (!inv[i]) continue
          const d = Math.hypot(x[i] - r.x, y[i] - r.y)
          const k = Math.abs(d - front)
          if (k < band) {
            const s = Math.cos((k / band) * Math.PI * 0.5) * amp
            z[i] += s
            const q = d > 1e-5 ? (s * 0.8) / d : 0
            x[i] += (x[i] - r.x) * q
            y[i] += (y[i] - r.y) * q
          }
        }
      }
    }

    // pointer brush: silk snags on the finger and is dragged along with it until tension pulls it free
    const p = this.pointer
    this.touched = false
    if (live && p.active) {
      const rb = 0.06 * this.scale
      let mvx = p.x - p.sx
      let mvy = p.y - p.sy
      p.sx = p.x
      p.sy = p.y
      if (mvx * mvx + mvy * mvy > (0.2 * this.scale) ** 2) mvx = mvy = 0 // pointer jumped (re-entry)
      for (let i = 0; i < n; i++) {
        if (!inv[i]) continue
        const dx = x[i] - p.x
        const dy = y[i] - p.y
        const d2 = dx * dx + dy * dy
        if (d2 > rb * rb) continue
        const d = Math.sqrt(d2) || 1e-5
        const f = Math.min(1, 1.6 * (1 - d / rb))
        const push = (rb - d) * 0.04
        x[i] += mvx * f + (dx / d) * push
        y[i] += mvy * f + (dy / d) * push
        z[i] -= push * 0.5
        if (mvx || mvy) this.touched = true
      }
    }

    // constraints
    const { ca, cb, rest, m } = this
    for (let it = 0; it < 10; it++) {
      for (let k = 0; k < m; k++) {
        const a = ca[k]
        const b = cb[k]
        const dx = x[b] - x[a]
        const dy = y[b] - y[a]
        const dz = z[b] - z[a]
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d < 1e-7) continue
        const w = inv[a] + inv[b]
        if (w === 0) continue
        const diff = ((d - rest[k]) / (d * w)) * 0.9
        const wa = inv[a] * diff
        const wb = inv[b] * diff
        x[a] += dx * wa
        y[a] += dy * wa
        z[a] += dz * wa
        x[b] -= dx * wb
        y[b] -= dy * wb
        z[b] -= dz * wb
      }
    }

    // NaN guard
    if (!Number.isFinite(x[0] + y[0] + z[0] + maxSp)) {
      this.reset()
      return
    }
    if (!live) return
    if (maxSp > SLEEP_SPEED || rs.length || this.touched) this.awake = 45
    else if (this.awake > 0 && --this.awake === 0) {
      // settle the glints before the last upload so nothing stays lit while asleep
      speed.fill(0)
      this.writeBuffers()
    }
  }

  private reset() {
    this.x.set(this.hx)
    this.y.set(this.hy)
    this.z.set(this.hz)
    this.ox.set(this.hx)
    this.oy.set(this.hy)
    this.oz.set(this.hz)
    this.ripples.length = 0
  }

  private writeBuffers() {
    const { x, y, z, ca, cb, m, segBuf, speed } = this
    const glint = this.glint
    if (!glint || !this.segAttr) return
    const garr = glint.array as Float32Array
    for (let k = 0; k < m; k++) {
      const a = ca[k]
      const b = cb[k]
      const o = k * 6
      segBuf[o] = x[a]
      segBuf[o + 1] = y[a]
      segBuf[o + 2] = z[a]
      segBuf[o + 3] = x[b]
      segBuf[o + 4] = y[b]
      segBuf[o + 5] = z[b]
      // moving silk catches the light
      garr[k] = Math.min((speed[a] + speed[b]) * 40, 1)
    }
    this.segAttr.needsUpdate = true
    glint.needsUpdate = true
  }

  private disposeMesh() {
    if (this.mesh) this.group.remove(this.mesh)
    this.geo?.dispose()
    this.mesh = null
    this.geo = null
  }

  dispose() {
    this.disposeMesh()
    this.material.dispose()
  }
}

function norm(a: number) {
  const t = Math.PI * 2
  return ((a % t) + t) % t
}

function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface SwingPath {
  /** World plane the swinger moves in. */
  z: number
  /** World x where the run starts / ends. */
  x0: number
  x1: number
  /** World heights: roughly the rooftop line and the highest anchor. */
  yLow: number
  yHigh: number
  /** World height lines attach at (can be above the frame, so lines run out of shot). */
  yAnchor: number
  /** Figure height in world units (a few CSS px on screen). */
  body: number
  /** Start below the rooftops on-screen and leap up into view (else enter from off-screen). */
  riseIn: boolean
}

const FIG_SEGS = 10
const ROPE_SEGS = 6
const SHOOT = 0.14
const RETRACT = 0.22

/**
 * A tiny, distant swinging figure: shoots a line, rides it as a pendulum (theta'' = -g/L sin theta),
 * lets go into a ballistic arc, shoots the next one. Drawn as dark strokes, animated on twos.
 * Physics runs in a "forward" frame (travel is +x) and is mirrored on output.
 */
export class Swinger {
  readonly group = new Group()
  private figMat: ShaderMaterial
  private ropeMat: ShaderMaterial
  private fig: ReturnType<typeof strokeGeometry>
  private rope: ReturnType<typeof strokeGeometry>
  private on = false
  private rand = mulberry(7)

  private path: SwingPath = { z: 0, x0: 0, x1: 0, yLow: 0, yHigh: 1, yAnchor: 1, body: 1, riseIn: false }
  private dir = 1
  private Q = 1
  private H = 1
  private g = 1
  private time = 0
  private phase: 'fly' | 'swing' = 'fly'
  private px = 0
  private py = 0
  private vx = 0
  private vy = 0
  private ax = 0
  private ay = 0
  private L = 1
  private th = 0
  private om = 0
  private thRel = 0.6
  private flyT = 0
  private shootT = -1
  private relT = -1
  private rax = 0
  private ray = 0
  private rhx = 0
  private rhy = 0
  private ux = 0
  private uy = 1
  private flyBlend = 1
  private twosAcc = 0

  constructor(shared: WebUniforms) {
    this.figMat = strokeMaterial(shared, false)
    this.ropeMat = strokeMaterial(shared, false)
    // widths in CSS px: head, torso, then limbs
    const fm = new Float32Array(FIG_SEGS * 2)
    const widths = [4.4, 3.6, 2.1, 1.9, 2.1, 1.9, 2.3, 2.0, 2.3, 2.0]
    widths.forEach((w, i) => {
      fm[i * 2] = 1
      fm[i * 2 + 1] = w
    })
    this.fig = strokeGeometry(FIG_SEGS, fm, new Float32Array(FIG_SEGS))
    const rm = new Float32Array(ROPE_SEGS * 4)
    for (let i = 0; i < ROPE_SEGS * 2; i++) {
      rm[i * 2] = 0.7
      rm[i * 2 + 1] = 1.05
    }
    this.rope = strokeGeometry(ROPE_SEGS * 2, rm, new Float32Array(ROPE_SEGS * 2))
    for (const [g, mat, order] of [
      [this.rope.geo, this.ropeMat, 3],
      [this.fig.geo, this.figMat, 4],
    ] as const) {
      const mesh = new Mesh(g, mat)
      mesh.frustumCulled = false
      mesh.renderOrder = order
      this.group.add(mesh)
    }
    this.group.visible = false
  }

  setColors(figure: Color, silk: Color) {
    ;(this.figMat.uniforms.uColor.value as Color).copy(figure)
    ;(this.ropeMat.uniforms.uColor.value as Color).copy(silk)
  }

  get active() {
    return this.on
  }

  fire(path: SwingPath) {
    this.path = path
    this.dir = path.x1 >= path.x0 ? 1 : -1
    this.Q = Math.abs(path.x1 - path.x0)
    this.H = path.yHigh - path.yLow
    const H = this.H
    this.g = 2.6 * H
    this.time = 0
    this.phase = 'fly'
    this.px = 0
    this.flyT = 0
    this.relT = -1
    this.flyBlend = 1
    this.ux = 0.35
    this.uy = 0.94
    if (path.riseIn) {
      // leap up from behind the rooftops
      this.py = path.yLow - 0.3 * H
      this.vx = 0.55 * H
      this.vy = 2.0 * H
    } else {
      this.py = path.yLow + 0.55 * H
      this.vx = 1.1 * H
      this.vy = 0.3 * H
      this.shootNext()
    }
    this.on = true
    this.group.visible = true
    this.twosAcc = TWOS
  }

  private shootNext() {
    const H = this.H
    // anchor high and ahead; rope length set so the arc bottoms out just above the rooftop line
    const ay = this.path.yAnchor - this.rand() * 0.12 * H
    const bottom = this.path.yLow + (0.12 + this.rand() * 0.12) * H
    const L = Math.max(ay - bottom, 0.35 * H)
    const rise = ay - this.py
    const dx = rise < L ? Math.sqrt(L * L - rise * rise) : 0.3 * L
    this.ay = ay
    this.ax = this.px + Math.min(dx, 0.95 * L)
    this.thRel = 0.75 + this.rand() * 0.2
    this.shootT = 0
  }

  private release() {
    const L = this.L
    this.vx = L * this.om * Math.cos(this.th)
    this.vy = L * this.om * Math.sin(this.th)
    this.phase = 'fly'
    this.flyT = 0
    this.relT = 0
    this.rax = this.ax
    this.ray = this.ay
    this.rhx = this.px
    this.rhy = this.py
  }

  update(dt: number) {
    if (!this.on) return
    dt = Math.min(dt, 1 / 20)
    this.time += dt
    const H = this.H
    const sub = 4
    const h = dt / sub
    for (let s = 0; s < sub; s++) {
      if (this.phase === 'swing') {
        // gravity plus a little pump (legs driving the swing) so each release carries height
        this.om += (-(this.g / this.L) * Math.sin(this.th) + (0.25 * this.g) / this.L) * h
        this.th += this.om * h
        this.px = this.ax + this.L * Math.sin(this.th)
        this.py = this.ay - this.L * Math.cos(this.th)
        if ((this.th >= this.thRel && this.om > 0) || this.om <= 0) this.release()
      } else {
        this.vy -= this.g * h
        this.px += this.vx * h
        this.py += this.vy * h
      }
    }
    if (this.phase === 'fly') {
      this.flyT += dt
      const more = this.px < this.Q - 0.15 * H
      if (this.shootT < 0 && more && (this.vy <= 0 || this.flyT > 0.55)) this.shootNext()
      if (this.shootT >= 0) {
        this.shootT += dt
        if (this.shootT >= SHOOT) {
          // line catches: keep only the tangential part of the velocity
          const dx = this.px - this.ax
          const dy = this.ay - this.py
          this.L = Math.max(Math.hypot(dx, dy), 0.2 * H)
          this.th = Math.atan2(dx, dy)
          this.om = (this.vx * Math.cos(this.th) + this.vy * Math.sin(this.th)) / this.L
          this.om = Math.max(this.om, 0.4 * Math.sqrt(this.g / this.L)) // always swing forward
          this.phase = 'swing'
          this.shootT = -1
        }
      }
      const gone = this.px > this.Q + 0.6 * H || this.py < this.path.yLow - 1.3 * H || this.time > 14
      if (gone) {
        this.on = false
        this.group.visible = false
        return
      }
    }
    if (this.relT >= 0) {
      this.relT += dt
      if (this.relT > RETRACT) this.relT = -1
    }

    // body axis eases toward the rope (swinging) or a forward lean (flying)
    let tx: number
    let ty: number
    if (this.phase === 'swing') {
      tx = this.ax - this.px
      ty = this.ay - this.py
    } else {
      tx = 0.45 + Math.max(-0.3, Math.min(0.3, this.vy / (4 * H)))
      ty = 1
    }
    const tl = Math.hypot(tx, ty) || 1
    const k = 1 - Math.exp(-dt * 12)
    this.ux += (tx / tl - this.ux) * k
    this.uy += (ty / tl - this.uy) * k
    const ul = Math.hypot(this.ux, this.uy) || 1
    this.ux /= ul
    this.uy /= ul
    this.flyBlend += ((this.phase === 'fly' ? 1 : 0) - this.flyBlend) * (1 - Math.exp(-dt * 7))

    // pose/position shown on twos
    this.twosAcc += dt
    if (this.twosAcc < TWOS) return
    this.twosAcc %= TWOS
    this.write()
  }

  /** Write one stroke (forward-frame coords) into a buffer, mirrored into world space. */
  private seg(arr: Float32Array, i: number, x0: number, y0: number, x1: number, y1: number) {
    const o = i * 6
    const X = this.path.x0
    const d = this.dir
    arr[o] = X + d * x0
    arr[o + 1] = y0
    arr[o + 2] = this.path.z
    arr[o + 3] = X + d * x1
    arr[o + 4] = y1
    arr[o + 5] = this.path.z
  }

  /** Unit vector -u*a + n*f (u: body axis, n: forward normal) into this.dx/dy. */
  private limb(a: number, f: number) {
    const dx = -this.ux * a + this.uy * f
    const dy = -this.uy * a - this.ux * f
    const l = Math.hypot(dx, dy) || 1
    this.dx = dx / l
    this.dy = dy / l
  }
  private dx = 0
  private dy = 0

  /** A rope from the hand (hx, hy) to (ex, ey), sagging by `sag`, into rope slots base..base+ROPE_SEGS. */
  private line(base: number, hx: number, hy: number, ex: number, ey: number, sag: number) {
    const lx = ex - hx
    const ly = ey - hy
    for (let i = 0; i < ROPE_SEGS; i++) {
      const f0 = i / ROPE_SEGS
      const f1 = (i + 1) / ROPE_SEGS
      const s0 = Math.sin(f0 * Math.PI) * sag
      const s1 = Math.sin(f1 * Math.PI) * sag
      this.seg(this.rope.arr, base + i, hx + lx * f0, hy + ly * f0 - s0, hx + lx * f1, hy + ly * f1 - s1)
    }
  }

  private write() {
    const b = this.path.body
    const { ux, uy, px, py } = this
    const nx = uy // forward normal to the body axis
    const ny = -ux
    const fa = this.fig.arr
    let k = 0
    // hand on the line, straight arm to the shoulder
    const sx = px - ux * 0.34 * b
    const sy = py - uy * 0.34 * b
    const hipX = sx - ux * 0.33 * b
    const hipY = sy - uy * 0.33 * b
    // head beside the raised arm
    this.seg(fa, k++, sx + (ux * 0.05 + nx * 0.07) * b, sy + (uy * 0.05 + ny * 0.07) * b, sx + (ux * 0.15 + nx * 0.09) * b, sy + (uy * 0.15 + ny * 0.09) * b)
    this.seg(fa, k++, sx, sy, hipX, hipY)
    // holding arm
    const ex = sx + (ux * 0.17 + nx * 0.03) * b
    const ey = sy + (uy * 0.17 + ny * 0.03) * b
    this.seg(fa, k++, sx, sy, ex, ey)
    this.seg(fa, k++, ex, ey, px, py)
    // free arm: reaches for the next anchor while a line is flying, else trails back
    let fx: number
    let fy: number
    if (this.shootT >= 0) {
      const dx = this.ax - sx
      const dy = this.ay - sy
      const l = Math.hypot(dx, dy) || 1
      fx = dx / l
      fy = dy / l
    } else {
      this.limb(0.55 - this.flyBlend * 0.9, -0.85)
      fx = this.dx
      fy = this.dy
    }
    const e2x = sx + fx * 0.18 * b
    const e2y = sy + fy * 0.18 * b
    this.seg(fa, k++, sx, sy, e2x, e2y)
    this.seg(fa, k++, e2x, e2y, e2x + fx * 0.17 * b, e2y + fy * 0.17 * b)
    // legs: trail behind at the start of a swing, pike forward through the bottom, tuck in flight
    const kick = this.phase === 'swing' ? Math.max(-1, Math.min(1, this.th / 0.6)) : 0.6
    const fb = this.flyBlend
    for (let leg = 0; leg < 2; leg++) {
      this.limb(1 - 0.45 * fb, (0.25 + 0.5 * kick) * (1 - fb) + 1.1 * fb + leg * 0.4)
      const kx = hipX + this.dx * 0.24 * b
      const ky = hipY + this.dy * 0.24 * b
      this.limb(1, -(0.55 + 0.4 * fb) + leg * 0.35)
      this.seg(fa, k++, hipX, hipY, kx, ky)
      this.seg(fa, k++, kx, ky, kx + this.dx * 0.24 * b, ky + this.dy * 0.24 * b)
    }
    this.fig.buf.needsUpdate = true

    // rope(s): the live or shooting line, plus the released one snapping back to its anchor
    this.rope.arr.fill(0)
    if (this.phase === 'swing') this.line(0, px, py, this.ax, this.ay, 0)
    else if (this.shootT >= 0) {
      const t = this.shootT / SHOOT
      const r = 1 - (1 - t) ** 3
      const L = Math.hypot(this.ax - px, this.ay - py)
      this.line(0, px, py, px + (this.ax - px) * r, py + (this.ay - py) * r, 0.06 * L * (1 - t))
    }
    if (this.relT >= 0) {
      const t = this.relT / RETRACT
      const hx = this.rhx + (this.rax - this.rhx) * t * t
      const hy = this.rhy + (this.ray - this.rhy) * t * t
      const L = Math.hypot(this.rax - this.rhx, this.ray - this.rhy)
      this.line(ROPE_SEGS, hx, hy, this.rax, this.ray, 0.08 * L * t)
    }
    this.rope.buf.needsUpdate = true
  }

  dispose() {
    this.fig.geo.dispose()
    this.rope.geo.dispose()
    this.figMat.dispose()
    this.ropeMat.dispose()
  }
}
