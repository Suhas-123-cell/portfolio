import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
  type IUniform,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { HASH, SKY_PARS } from './shaders'

/** Uniforms shared (by reference) between every scene material, so a suit change is one write. */
export interface Shared {
  uTime: IUniform<number>
  uRes: IUniform<Vector2>
  uDpr: IUniform<number>
  uIsLight: IUniform<number>
  uSkyTop: IUniform<Color>
  uSkyHorizon: IUniform<Color>
  uHaze: IUniform<Color>
  uMoon: IUniform<Color>
  uMoonPos: IUniform<Vector3>
  uHorizon: IUniform<number>
  uSkyOff: IUniform<Vector2>
  uBuilding: IUniform<Color>
  uBuildingLit: IUniform<Color>
  uRim: IUniform<Color>
  uGlass: IUniform<Color>
  uWindow: IUniform<Color>
  uWindowAlt: IUniform<Color>
  uHero: IUniform<Color>
  uBeam: IUniform<Color>
  uStar: IUniform<Color>
  uFogDensity: IUniform<number>
}

export function createShared(): Shared {
  const c = () => ({ value: new Color() })
  return {
    uTime: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
    uDpr: { value: 1 },
    uIsLight: { value: 0 },
    uSkyTop: c(),
    uSkyHorizon: c(),
    uHaze: c(),
    uMoon: c(),
    uMoonPos: { value: new Vector3(0.74, 0.5, 0.17) },
    uHorizon: { value: 0.4 },
    uSkyOff: { value: new Vector2() },
    uBuilding: c(),
    uBuildingLit: c(),
    uRim: c(),
    uGlass: c(),
    uWindow: c(),
    uWindowAlt: c(),
    uHero: c(),
    uBeam: c(),
    uStar: c(),
    uFogDensity: { value: 0.0029 },
  }
}

/* ------------------------------------------------------------------ sky -- */

const SKY_FRAG = /* glsl */ `
${SKY_PARS}
${HASH}
uniform vec3 uMoon;
uniform vec3 uBeam;
uniform vec3 uStar;
uniform float uTime;
uniform float uIsLight;

float beam(vec2 p, vec2 o, float ang, float width) {
  vec2 d = p - o;
  float along = length(d);
  float a = atan(d.x, d.y) - ang;
  float i = exp(-pow(a / width, 2.0));
  return i * smoothstep(0.0, 0.2, along) * exp(-along * 1.3);
}

void main() {
  vec2 suv = gl_FragCoord.xy / uRes - uSkyOff;
  float aspect = uRes.x / uRes.y;
  vec3 c = skyBase(suv);

  // stars (dark suits only)
  vec2 sp = suv * vec2(aspect, 1.0) * 90.0;
  vec2 sid = floor(sp);
  float sh = hash12(sid);
  vec2 sf = fract(sp) - 0.5 - (vec2(hash12(sid + 7.1), hash12(sid + 3.7)) - 0.5) * 0.6;
  float star = step(0.986, sh) * (1.0 - smoothstep(0.03, 0.09, length(sf)));
  star *= 0.55 + 0.45 * sin(uTime * (0.6 + sh * 2.0) + sh * 60.0);
  star *= smoothstep(uHorizon + 0.05, uHorizon + 0.35, suv.y) * (1.0 - uIsLight);
  c = mix(c, uStar, star * 0.8);

  // searchlights sweeping behind the skyline
  vec2 p = suv * vec2(aspect, 1.0);
  float b = beam(p, vec2(0.52 * aspect, uHorizon - 0.1), -0.25 + 0.3 * sin(uTime * 0.11), 0.03);
  b += beam(p, vec2(0.97 * aspect, uHorizon - 0.12), 0.2 + 0.25 * sin(uTime * 0.083 + 2.0), 0.028);
  c = mix(c, uBeam, clamp(b, 0.0, 1.0) * 0.16);

  // moon
  vec2 md = (suv - uMoonPos.xy) * vec2(aspect, 1.0);
  float R = uMoonPos.z;
  float r = length(md);
  float aa = 1.5 / uRes.y;
  float disc = 1.0 - smoothstep(R - aa, R + aa, r);
  vec2 mp = md / R;
  float mar = vnoise(mp * 2.6 + 3.0) * 0.6 + vnoise(mp * 6.0 + 11.0) * 0.4;
  vec3 moon = uMoon * (1.0 - smoothstep(0.45, 0.8, mar) * 0.14);
  moon = mix(moon, uHaze, smoothstep(0.55, 1.0, r / R) * 0.25); // soft limb
  c = mix(c, moon, disc);

  // thin cloud streaks crossing the moon
  float sx = (suv.x - uMoonPos.x) * aspect / R;
  float s1 = 1.0 - smoothstep(0.0, 0.035, abs((suv.y - uMoonPos.y) / R + 0.18 + 0.05 * sin(sx * 2.0 + uTime * 0.05)));
  float s2 = 1.0 - smoothstep(0.0, 0.022, abs((suv.y - uMoonPos.y) / R - 0.34 + 0.04 * sin(sx * 2.7 + 1.0)));
  float ext1 = smoothstep(-1.9, -0.6, sx) * (1.0 - smoothstep(0.6, 1.6, sx));
  float ext2 = smoothstep(-1.2, -0.2, sx) * (1.0 - smoothstep(0.9, 2.0, sx));
  c = mix(c, uSkyTop, clamp(s1 * ext1 + s2 * ext2, 0.0, 1.0) * 0.85);

  gl_FragColor = vec4(c, 1.0);
}
`

export function createSky(shared: Shared): Mesh {
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
  const m = new ShaderMaterial({
    uniforms: { ...shared },
    vertexShader: /* glsl */ `void main(){ gl_Position = vec4(position.xy, 1.0, 1.0); }`,
    fragmentShader: SKY_FRAG,
    depthTest: false,
    depthWrite: false,
  })
  const mesh = new Mesh(g, m)
  mesh.frustumCulled = false
  mesh.renderOrder = -10
  return mesh
}

/* ------------------------------------------------------------ buildings -- */

const BUILDING_VERT = /* glsl */ `
attribute vec4 aInfo; // seed, layer, windows?, lit probability
varying vec3 vN;
varying vec2 vFace;
varying vec2 vSize;
varying vec4 vInfo;
varying vec3 vView;
varying float vWorldY;
void main() {
  vec3 s = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
  vec3 p = position;
  vN = normal;
  if (abs(normal.z) > 0.5) { vFace = vec2((p.x + 0.5) * s.x, p.y * s.y); vSize = s.xy; }
  else if (abs(normal.x) > 0.5) { vFace = vec2((p.z + 0.5) * s.z, p.y * s.y); vSize = s.zy; }
  else { vFace = vec2((p.x + 0.5) * s.x, (p.z + 0.5) * s.z); vSize = s.xz; }
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vWorldY = wp.y;
  vec4 mv = viewMatrix * wp;
  vView = mv.xyz;
  vInfo = aInfo;
  gl_Position = projectionMatrix * mv;
}
`

const BUILDING_FRAG = /* glsl */ `
${SKY_PARS}
${HASH}
uniform vec3 uBuilding;
uniform vec3 uBuildingLit;
uniform vec3 uRim;
uniform vec3 uGlass;
uniform vec3 uWindow;
uniform vec3 uWindowAlt;
uniform float uTime;
uniform float uFogDensity;
uniform float uIsLight;
varying vec3 vN;
varying vec2 vFace;
varying vec2 vSize;
varying vec4 vInfo;
varying vec3 vView;
varying float vWorldY;

void main() {
  float vDist = length(vView);
  float seed = vInfo.x;
  float layer = vInfo.y;
  float pLit = vInfo.w;
  vec3 n = normalize(vN);
  float roof = step(0.5, n.y);

  vec3 col = uBuilding;
  col = mix(col, uBuildingLit, clamp(n.x, 0.0, 1.0) * 0.85);    // moon side
  col *= 1.0 - clamp(-n.x, 0.0, 1.0) * 0.22;                    // shadow side
  col = mix(col, uBuildingLit, roof * 0.55);
  col *= mix(0.78, 1.0, smoothstep(0.0, 45.0, vWorldY) * (1.0 - roof) + roof);

  if (vInfo.z < -1.5) {
    // street level: dark blocks with glowing avenues / cross streets
    vec2 g = vFace;
    vec2 dd = vec2(mod(g.x, 46.0) - 23.0, mod(g.y, 31.0) - 15.5);
    float glow = max(exp(-dd.x * dd.x * 0.35), exp(-dd.y * dd.y * 0.35));
    col = uBuilding * 0.5;
    col = mix(col, uWindow * 0.5, glow * 0.28 * (1.0 - uIsLight));
    col = mix(col, uBuilding * 0.3, glow * uIsLight * 0.4);
  }
  float winAmt = 0.0;
  if (vInfo.z > 0.5 && roof < 0.5) {
    vec2 cell = layer < 0.5 ? vec2(1.35, 1.9) : (layer < 1.5 ? vec2(1.7, 2.4) : vec2(2.1, 3.0));
    vec2 margin = vec2(0.7, 1.4);
    vec2 q = (vFace - margin) / cell;
    vec2 id = floor(q);
    vec2 f = fract(q);
    vec2 nCells = floor((vSize - margin * vec2(2.0, 1.6)) / cell);
    float inside = step(0.0, id.x) * step(id.x, nCells.x - 1.0) * step(0.0, id.y) * step(id.y, nCells.y - 1.0);
    vec2 fw = fwidth(q);
    vec2 wmin = vec2(0.26, 0.22);
    vec2 wmax = vec2(0.74, 0.7);
    vec2 m = smoothstep(wmin - fw, wmin + fw, f) * (1.0 - smoothstep(wmax - fw, wmax + fw, f));
    float mask = m.x * m.y * inside;
    float side = n.x * 13.7 + n.z * 5.3;
    float h = hash12(id + vec2(seed * 91.7 + side, seed * 13.3));
    float rowH = hash12(vec2(id.y * 3.1 + side, seed * 41.9));
    float lit = step(h, pLit * (0.35 + 1.1 * rowH));
    float h2 = hash12(id.yx * 1.31 + seed * 7.9 + side);
    if (h2 > 0.975) lit *= 0.55 + 0.45 * sin(uTime * (0.5 + h2 * 1.2) + h * 40.0);
    if (h2 < 0.012) lit = step(0.45, fract(uTime / (11.0 + h * 25.0) + h));
    vec3 wc = mix(uWindow, uWindowAlt, step(0.86, hash12(id * 1.7 + seed)));
    wc *= 0.72 + 0.42 * hash12(id + 3.3 + seed);
    vec3 winCol = mix(uGlass, wc, lit);
    float lod = clamp(max(fw.x, fw.y) * 1.8 - 0.5, 0.0, 1.0);
    col = mix(col, winCol, mask * (1.0 - lod));
    col = mix(col, mix(uGlass, wc, pLit * 0.55), lod * inside * mix(0.5, 0.3, uIsLight));
    winAmt = mask * lit * (1.0 - lod);
  }

  // inked edges: lit cornice on top, darker vertical seams
  vec2 ef = max(fwidth(vFace), vec2(1e-4));
  float topPx = (vSize.y - vFace.y) / ef.y;
  float sidePx = min(vFace.x, vSize.x - vFace.x) / ef.x;
  if (vInfo.z < -0.5) {
  } else if (roof < 0.5) {
    col = mix(col, uRim, (1.0 - smoothstep(0.6, 1.8, topPx)) * 0.9);
    col = mix(col, uBuilding * 0.55, (1.0 - smoothstep(0.3, 1.2, sidePx)) * 0.6);
  } else {
    float e = min(sidePx, min(vFace.y, vSize.y - vFace.y) / ef.y);
    col = mix(col, uRim, (1.0 - smoothstep(0.6, 1.8, e)) * 0.7);
  }

  float fogF = 1.0 - exp(-pow(uFogDensity * vDist, 2.0));
  fogF *= 1.0 - winAmt * 0.35;
  col = mix(col, skyBase(gl_FragCoord.xy / uRes - uSkyOff), fogF);
  gl_FragColor = vec4(col, 1.0);
}
`

/* -------------------------------------------------------------- lights -- */

const LIGHT_VERT = /* glsl */ `
attribute vec2 aInfo; // phase, kind (0 antenna, 1 aircraft red, 2 aircraft white)
uniform float uTime;
uniform float uDpr;
varying float vI;
varying float vKind;
void main() {
  vec3 p = position;
  float kind = aInfo.y;
  float t = uTime;
  float blink;
  if (kind < 0.5) {
    blink = pow(max(0.0, sin(t * 1.9 + aInfo.x * 6.28)), 10.0);
  } else {
    float period = 70.0;
    float k = mod(t + aInfo.x, period) / period;
    p.x += mix(-420.0, 420.0, k);
    p.y += sin(k * 6.28) * 6.0;
    blink = kind < 1.5 ? 0.35 + 0.65 * step(0.5, fract(t * 0.9)) : step(0.92, fract(t * 1.3 + 0.3));
    blink *= smoothstep(0.0, 0.05, k) * (1.0 - smoothstep(0.95, 1.0, k));
  }
  vI = blink;
  vKind = kind;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (3.0 + 7.0 * blink) * uDpr;
  gl_Position = projectionMatrix * mv;
}
`

const LIGHT_FRAG = /* glsl */ `
uniform vec3 uHero;
uniform vec3 uStar;
varying float vI;
varying float vKind;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(0.18, 0.32, d);
  float glow = exp(-d * d * 5.0) * 0.6;
  float a = max(core * (0.35 + 0.65 * vI), glow * vI);
  if (a < 0.01) discard;
  vec3 c = vKind > 1.5 ? uStar : uHero;
  gl_FragColor = vec4(c * (0.8 + 0.6 * core), a);
}
`

/* -------------------------------------------------------------- layout -- */

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Box {
  x: number
  y: number
  z: number
  w: number
  h: number
  d: number
  seed: number
  layer: number
  win: number
  lit: number
}

export interface CityLayoutParams {
  camZ: number
  tanHalfV: number
  aspect: number
  narrow: boolean
  /** World x of the landmark tower (placed under the moon). */
  landmarkX: number
}

const LAYERS = [
  { z0: -10, z1: -40, hMin: 8, hMax: 24, wMin: 7, wMax: 14, rows: 1, gap: 3, lit: 0.16 },
  { z0: -70, z1: -150, hMin: 14, hMax: 46, wMin: 7, wMax: 15, rows: 2, gap: 2.8, lit: 0.2 },
  { z0: -185, z1: -330, hMin: 22, hMax: 82, wMin: 9, wMax: 19, rows: 2, gap: 3.2, lit: 0.26 },
] as const

function layout(p: CityLayoutParams) {
  const rand = mulberry32(1337)
  const boxes: Box[] = []
  const towers: { x: number; y: number; z: number; s: number }[] = []
  const lights: { x: number; y: number; z: number; phase: number }[] = []
  const perches: Vector3[] = []
  const density = p.narrow ? 0.75 : 1

  const addBox = (b: Omit<Box, 'seed'>) => boxes.push({ ...b, seed: rand() })

  LAYERS.forEach((L, li) => {
    const dist = p.camZ - L.z1
    const halfW = dist * p.tanHalfV * Math.max(p.aspect, 0.5) * 1.12 + 14
    for (let row = 0; row < L.rows; row++) {
      let cursor = -halfW + rand() * 6
      const rz0 = L.z0 + ((L.z1 - L.z0) * row) / L.rows
      const rz1 = L.z0 + ((L.z1 - L.z0) * (row + 1)) / L.rows
      while (cursor < halfW) {
        const w = (L.wMin + rand() * (L.wMax - L.wMin)) / density
        const x = cursor + w / 2
        cursor += w + rand() * L.gap
        if (li === 2 && Math.abs(x - p.landmarkX) < 14) continue
        const d = w * (0.7 + rand() * 0.6)
        const z = rz0 + rand() * (rz1 - rz0)
        // taller midtown cluster to the right, lower on the left where the web lives
        const nx = x / halfW
        const cluster = 0.62 + 0.55 * Math.exp(-(((nx - 0.25) / 0.45) ** 2)) + (li === 0 ? 0.1 : 0)
        let h = (L.hMin + (L.hMax - L.hMin) * rand() ** 1.7) * cluster
        if (li > 0 && rand() < 0.07) h *= 1.45
        if (li === 1 && Math.abs(x - p.landmarkX * 0.55) < 10) h *= 0.55
        addBox({ x, y: 0, z, w, h, d, layer: li, win: 1, lit: L.lit })
        let top = h
        if (li === 1 && h > 30) perches.push(new Vector3(x - w * 0.35, h, z + d * 0.5))
        // setbacks
        if (h > L.hMax * 0.55 && rand() < 0.65) {
          const h2 = h * (0.12 + rand() * 0.12)
          addBox({ x, y: top, z, w: w * 0.72, h: h2, d: d * 0.72, layer: li, win: 1, lit: L.lit })
          top += h2
          if (rand() < 0.5) {
            const h3 = h * 0.08
            addBox({ x, y: top, z, w: w * 0.45, h: h3, d: d * 0.45, layer: li, win: 1, lit: L.lit })
            top += h3
          }
        }
        // antenna + aviation light
        if (top > L.hMax * 0.7 && rand() < 0.55) {
          const ah = 4 + rand() * top * 0.12
          addBox({ x, y: top, z, w: 0.35, h: ah, d: 0.35, layer: li, win: 0, lit: 0 })
          lights.push({ x, y: top + ah + 0.4, z, phase: rand() })
        }
        // rooftop water towers
        if (li < 2 && rand() < (li === 0 ? 0.55 : 0.3)) {
          const s = li === 0 ? 1.5 + rand() * 0.6 : 1.8 + rand() * 0.6
          towers.push({ x: x + (rand() - 0.5) * (w - 3 * s), y: top, z: z + (rand() - 0.5) * (d - 3 * s), s })
        }
      }
    }
  })

  // Landmark: an Art-Deco stepped tower with spire, silhouetted against the moon
  {
    const x = p.landmarkX
    const z = -250
    const steps: [number, number, number][] = [
      [20, 62, 15],
      [15, 26, 11],
      [10, 14, 8],
      [6.5, 9, 5.5],
      [3.6, 6, 3.2],
    ]
    let y = 0
    for (const [w, h, d] of steps) {
      addBox({ x, y, z, w, h, d, layer: 2, win: 1, lit: 0.3 })
      y += h
    }
    addBox({ x, y, z, w: 0.9, h: 24, d: 0.9, layer: 2, win: 0, lit: 0 })
    lights.push({ x, y: y + 24.5, z, phase: 0.2 })
  }
  // street level
  addBox({ x: 0, y: -1, z: -300, w: 2400, h: 1, d: 700, layer: 0, win: -2, lit: 0 })

  return { boxes, towers, lights, perches }
}

function waterTowerGeometry(): BufferGeometry {
  const parts: BufferGeometry[] = []
  const tank = new CylinderGeometry(1, 1, 1.5, 12, 1, false)
  tank.translate(0, 1.95, 0)
  const cap = new ConeGeometry(1.08, 0.75, 12, 1, true)
  cap.translate(0, 3.07, 0)
  parts.push(tank, cap)
  for (const [x, z] of [
    [0.62, 0.62],
    [-0.62, 0.62],
    [0.62, -0.62],
    [-0.62, -0.62],
  ]) {
    const leg = new BoxGeometry(0.14, 1.2, 0.14)
    leg.translate(x, 0.6, z)
    parts.push(leg)
  }
  const merged = mergeGeometries(parts.map((g) => g.toNonIndexed()))
  parts.forEach((g) => g.dispose())
  merged.deleteAttribute('uv')
  return merged
}

export interface City {
  /** Rooftop corners a web line can attach to. */
  perches: Vector3[]
  objects: (InstancedMesh | Points)[]
  rebuild(p: CityLayoutParams): void
  dispose(): void
}

const MAX_BOXES = 900
const MAX_TOWERS = 160
const MAX_LIGHTS = 80

export function createCity(shared: Shared, params: CityLayoutParams): City {
  const material = new ShaderMaterial({
    uniforms: { ...shared },
    vertexShader: BUILDING_VERT,
    fragmentShader: BUILDING_FRAG,
  })

  const boxGeo = new BoxGeometry(1, 1, 1)
  boxGeo.translate(0, 0.5, 0)
  boxGeo.deleteAttribute('uv')
  const boxInfo = new InstancedBufferAttribute(new Float32Array(MAX_BOXES * 4), 4)
  boxGeo.setAttribute('aInfo', boxInfo)
  const buildings = new InstancedMesh(boxGeo, material, MAX_BOXES)
  buildings.frustumCulled = false

  const towerGeo = waterTowerGeometry()
  const towerInfo = new InstancedBufferAttribute(new Float32Array(MAX_TOWERS * 4), 4)
  towerGeo.setAttribute('aInfo', towerInfo)
  const towers = new InstancedMesh(towerGeo, material, MAX_TOWERS)
  towers.frustumCulled = false

  const lightGeo = new BufferGeometry()
  const lightPos = new BufferAttribute(new Float32Array(MAX_LIGHTS * 3), 3)
  const lightInfo = new BufferAttribute(new Float32Array(MAX_LIGHTS * 2), 2)
  lightGeo.setAttribute('position', lightPos)
  lightGeo.setAttribute('aInfo', lightInfo)
  const lightMat = new ShaderMaterial({
    uniforms: { ...shared },
    vertexShader: LIGHT_VERT,
    fragmentShader: LIGHT_FRAG,
    transparent: true,
    depthWrite: false,
  })
  const lights = new Points(lightGeo, lightMat)
  lights.frustumCulled = false
  lights.renderOrder = 2

  const m = new Matrix4()

  function rebuild(p: CityLayoutParams) {
    const { boxes, towers: tw, lights: lt, perches } = layout(p)
    city.perches = perches
    const nb = Math.min(boxes.length, MAX_BOXES)
    for (let i = 0; i < nb; i++) {
      const b = boxes[i]
      m.makeScale(b.w, b.h, b.d).setPosition(b.x, b.y, b.z)
      buildings.setMatrixAt(i, m)
      boxInfo.setXYZW(i, b.seed, b.layer, b.win, b.lit)
    }
    buildings.count = nb
    buildings.instanceMatrix.needsUpdate = true
    boxInfo.needsUpdate = true

    const nt = Math.min(tw.length, MAX_TOWERS)
    for (let i = 0; i < nt; i++) {
      const t = tw[i]
      m.makeScale(t.s, t.s, t.s).setPosition(t.x, t.y, t.z)
      towers.setMatrixAt(i, m)
      towerInfo.setXYZW(i, 0, 0, -1, 0)
    }
    towers.count = nt
    towers.instanceMatrix.needsUpdate = true
    towerInfo.needsUpdate = true

    // aviation lights + two aircraft lights (red beacon and white strobe)
    let n = 0
    for (const l of lt) {
      if (n >= MAX_LIGHTS - 2) break
      lightPos.setXYZ(n, l.x, l.y, l.z)
      lightInfo.setXY(n, l.phase, 0)
      n++
    }
    lightPos.setXYZ(n, 0, 175, -420)
    lightInfo.setXY(n++, 12, 1)
    lightPos.setXYZ(n, 1.6, 175, -420)
    lightInfo.setXY(n++, 12, 2)
    lightGeo.setDrawRange(0, n)
    lightPos.needsUpdate = true
    lightInfo.needsUpdate = true
  }

  const city: City = {
    perches: [],
    objects: [buildings, towers, lights],
    rebuild,
    dispose() {
      boxGeo.dispose()
      towerGeo.dispose()
      lightGeo.dispose()
      material.dispose()
      lightMat.dispose()
      buildings.dispose()
      towers.dispose()
    },
  }
  rebuild(params)
  return city
}
