import {
  HalfFloatType,
  NoToneMapping,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { createCity, createShared, createSky, type CityLayoutParams } from './city'
import { PrintShader } from './printPass'
import { luminance, mixRgb, readTheme, scaleRgb, toColor } from './theme'
import { SpiderWeb, Swinger } from './web'

const WEB_DIST = 14
const CAM_POS = new Vector3(0, 40, 40)
const CAM_TARGET = new Vector3(0, 30, -120)
/** Pointer parallax: world-unit camera travel and yaw (radians) at the frame edge. */
const PAR_X = 5
const PAR_Y = 2.5
const PAR_YAW = (1.5 * Math.PI) / 180
/** The web lags this fraction of the camera's travel, so it reads as the nearest layer. */
const WEB_LAG = 0.08
const CRANE_FROM = -18
const CRANE_DUR = 1.6
const GLITCH_DUR = 0.42
const GLITCH_PEAK = 0.18
const SHIFT_BASE = 0.9
const SHIFT_PLUCK = 4

export interface HeroScene {
  resize(width: number, height: number): void
  /** Pointer in client coordinates; `inside` = over the canvas rect. */
  pointerMove(ndcX: number, ndcY: number, inside: boolean): void
  pointerDown(ndcX: number, ndcY: number): void
  applyTheme(): void
  /** Animated suit swap: a print-glitch tear with the colours switching at its peak. */
  suitChange(): void
  /** Advance and render one frame. */
  frame(dt: number, animate: boolean): void
  /** Average ms per frame over the last ~2s (for diagnostics). */
  readonly stats: { ms: number }
  dispose(): void
}

export function createHeroScene(canvas: HTMLCanvasElement): HeroScene {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'default',
    // software GL would crawl; throwing here lets WebHero fall back to the CSS sky
    failIfMajorPerformanceCaveat: true,
  })
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NoToneMapping
  // phones: 1.5x is plenty under a halftone screen and keeps fill cost down
  const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 1.75)
  renderer.setPixelRatio(dpr)

  const shared = createShared()
  shared.uDpr.value = dpr

  const scene = new Scene()
  const camera = new PerspectiveCamera(38, 1, 0.5, 1200)
  const sky = createSky(shared)
  scene.add(sky)

  const layoutParams = (): CityLayoutParams => {
    const tanHalfV = Math.tan((camera.fov * Math.PI) / 360)
    const dist = CAM_POS.z + 250
    const mx = shared.uMoonPos.value.x
    return {
      camZ: CAM_POS.z,
      tanHalfV,
      aspect: camera.aspect,
      narrow: camera.aspect < 0.9,
      landmarkX: (mx * 2 - 1) * tanHalfV * camera.aspect * dist,
    }
  }
  const city = createCity(shared, layoutParams())
  for (const o of city.objects) scene.add(o)

  const web = new SpiderWeb(shared)
  scene.add(web.group)
  const swinger = new Swinger(shared)
  scene.add(swinger.group)

  // composer with MSAA on the scene pass
  const rt = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: dpr > 1.4 ? 2 : 4 })
  const composer = new EffectComposer(renderer, rt)
  composer.setPixelRatio(dpr)
  const renderPass = new RenderPass(scene, camera)
  // the print pass also does the linear -> sRGB output encode (no separate OutputPass)
  const printPass = new ShaderPass(PrintShader)
  composer.addPass(renderPass)
  composer.addPass(printPass)
  const pu = printPass.uniforms

  // ---- camera rig
  const rig = new Object3D()
  const right = new Vector3()
  const up = new Vector3()
  const fwd = new Vector3()
  const webBase = new Vector3()
  const parallax = new Vector2()
  const parallaxTarget = new Vector2()
  let lastAspect = 0
  let lastNarrow: boolean | null = null

  function layoutRig() {
    camera.position.copy(CAM_POS)
    camera.lookAt(CAM_TARGET)
    camera.updateMatrixWorld()
    rig.position.copy(CAM_POS)
    rig.quaternion.copy(camera.quaternion)
    right.set(1, 0, 0).applyQuaternion(rig.quaternion)
    up.set(0, 1, 0).applyQuaternion(rig.quaternion)
    fwd.set(0, 0, -1).applyQuaternion(rig.quaternion)
    webBase.copy(CAM_POS).addScaledVector(fwd, WEB_DIST)
    web.group.position.copy(webBase)
    web.group.quaternion.copy(rig.quaternion)
    web.group.scale.setScalar(WEB_DIST * Math.tan((camera.fov * Math.PI) / 360))
    web.group.updateMatrixWorld(true)
    // haze line sits where distant streets meet the sky
    const h = new Vector3(0, 18, -420).project(camera)
    shared.uHorizon.value = h.y * 0.5 + 0.5
  }

  function resize(width: number, height: number) {
    const w = Math.max(1, Math.floor(width))
    const h = Math.max(1, Math.floor(height))
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    const aspect = w / h
    const narrow = aspect < 0.9
    camera.aspect = aspect
    camera.fov = narrow ? 52 : 38
    camera.updateProjectionMatrix()
    shared.uRes.value.set(w * dpr, h * dpr)
    pu.uRes.value.set(w * dpr, h * dpr)
    pu.uDpr.value = dpr
    cssH = h
    shared.uMoonPos.value.set(narrow ? 0.72 : 0.75, narrow ? 0.66 : 0.56, narrow ? 0.1 : 0.15)
    layoutRig()
    placeCamera()
    if (narrow !== lastNarrow || Math.abs(aspect - lastAspect) / Math.max(lastAspect, 1e-3) > 0.12) {
      city.rebuild(layoutParams())
      web.build({ aspect, narrow })
      lastAspect = aspect
      lastNarrow = narrow
    }
  }

  // ---- theme
  function applyTheme() {
    const t = readTheme()
    const light = luminance(t.ink) > 0.5
    shared.uIsLight.value = light ? 1 : 0
    // light suit: silhouettes pushed well toward the dark "paper" ink so the city stays graphic
    const building = light ? mixRgb(t.ink2, t.paper, 0.94) : mixRgb(t.ink, t.ink2, 0.75)
    const moon = light ? mixRgb(t.hero, t.ink, 0.4) : mixRgb(t.paper, t.window, 0.2)
    toColor(light ? mixRgb(t.ink, t.web, 0.05) : scaleRgb(t.ink, 0.8), shared.uSkyTop.value)
    toColor(light ? mixRgb(t.ink, t.hero, 0.1) : mixRgb(t.ink, t.web, 0.32), shared.uSkyHorizon.value)
    toColor(
      light ? mixRgb(t.ink, t.hero, 0.24) : mixRgb(mixRgb(t.ink, t.web, 0.55), t.paper, 0.1),
      shared.uHaze.value,
    )
    toColor(moon, shared.uMoon.value)
    toColor(building, shared.uBuilding.value)
    toColor(light ? mixRgb(building, t.hero, 0.22) : mixRgb(building, moon, 0.1), shared.uBuildingLit.value)
    toColor(light ? mixRgb(building, t.hero, 0.45) : mixRgb(building, moon, 0.4), shared.uRim.value)
    toColor(light ? mixRgb(building, t.paper, 0.35) : scaleRgb(building, 0.72), shared.uGlass.value)
    toColor(t.window, shared.uWindow.value)
    toColor(light ? mixRgb(t.web, t.paper, 0.2) : mixRgb(t.web, t.paper, 0.45), shared.uWindowAlt.value)
    toColor(t.hero, shared.uHero.value)
    toColor(light ? mixRgb(t.ink, t.hero, 0.6) : mixRgb(t.web, t.paper, 0.55), shared.uBeam.value)
    toColor(light ? t.paper : mixRgb(t.paper, t.window, 0.15), shared.uStar.value)
    shared.uFogDensity.value = light ? 0.0016 : 0.0029
    web.setColors(
      toColor(t.paper),
      toColor(light ? t.hero : mixRgb(t.paper, t.web, 0.35)),
      light,
    )
    swinger.setColors(
      toColor(light ? mixRgb(t.paper, t.ink, 0.08) : mixRgb(scaleRgb(t.ink, 0.45), t.ink2, 0.2)),
      toColor(light ? mixRgb(t.paper, t.ink, 0.3) : mixRgb(t.paper, t.web, 0.3)),
    )
    renderer.setClearColor(toColor(t.ink), 1)
    ;(pu.uInk.value as Vector3).set(t.ink[0], t.ink[1], t.ink[2])
    pu.uAmount.value = light ? 0.7 : 0.6
  }

  // ---- suit switch glitch
  let glitchT = -1
  let themePending = false
  function suitChange() {
    glitchT = 0
    themePending = true
  }

  // ---- pointer
  const raycaster = new Raycaster()
  const plane = new Plane()
  const hit = new Vector3()
  const ndc = new Vector2()
  const tmpN = new Vector3()

  function toWebLocal(x: number, y: number): Vector3 | null {
    ndc.set(x, y)
    raycaster.setFromCamera(ndc, camera)
    tmpN.set(0, 0, 1).applyQuaternion(web.group.quaternion)
    plane.setFromNormalAndCoplanarPoint(tmpN, web.group.position)
    if (!raycaster.ray.intersectPlane(plane, hit)) return null
    return web.group.worldToLocal(hit)
  }

  function pointerMove(x: number, y: number, inside: boolean) {
    parallaxTarget.set(inside ? x : 0, inside ? y : 0)
    const p = inside ? toWebLocal(x, y) : null
    if (p) web.setPointer(p.x, p.y, true)
    else web.setPointer(0, 0, false)
  }

  let shiftKick = 0
  function pointerDown(x: number, y: number) {
    const p = toWebLocal(x, y)
    if (p && web.pluck(p.x, p.y)) shiftKick = 1
  }

  // ---- ambient swinger: a tiny figure web-slinging through the mid-distance every 11-15 s
  let shotTimer = 2 // first swing lands soon after the hero is revealed
  let cssH = 1
  const ray = new Raycaster()
  const zPlane = new Plane(new Vector3(0, 0, 1), 0)
  const at = new Vector3()
  const restCam = new PerspectiveCamera()
  /** World point on the plane z = zp under the resting camera's NDC (x, y). */
  function onPlane(x: number, y: number, zp: number): Vector3 {
    zPlane.constant = -zp
    ndc.set(x, y)
    ray.setFromCamera(ndc, restCam)
    if (!ray.ray.intersectPlane(zPlane, at)) at.set(0, 0, zp)
    return at
  }
  function maybeShoot(dt: number) {
    shotTimer -= dt
    if (shotTimer > 0 || swinger.active) return
    shotTimer = 11 + Math.random() * 4
    restCam.copy(camera)
    restCam.position.copy(CAM_POS)
    restCam.lookAt(CAM_TARGET)
    restCam.updateMatrixWorld()
    const zp = -100
    const narrow = camera.aspect < 0.9
    const ltr = Math.random() < 0.5
    // wide: runs stay right of the headline, the on-screen end rises from / dives behind rooftops;
    // narrow: the whole width, entering and leaving off-screen
    const near = narrow ? -1.25 : 0.02
    const far = 1.25
    const x0 = onPlane(ltr ? (narrow ? -far : near) : far, 0, zp).x
    const x1 = onPlane(ltr ? far : narrow ? -far : near, 0, zp).x
    const yLow = onPlane(0, narrow ? 0.05 : 0.1, zp).y
    const yHigh = onPlane(0, narrow ? 0.4 : 0.52, zp).y
    const yAnchor = onPlane(0, 1.12, zp).y // lines run out of the top of the frame
    const a = onPlane(0, 0, zp).clone()
    const worldPerPx = onPlane(0, 2 / cssH, zp).distanceTo(a)
    swinger.fire({
      z: zp,
      x0,
      x1,
      yLow,
      yHigh,
      yAnchor,
      body: worldPerPx * (narrow ? 36 : 52),
      riseIn: ltr && !narrow,
    })
  }

  // ---- frame
  const stats = { ms: 16.7 }
  let time = 0
  let craneT = 0
  let craneY = CRANE_FROM
  let seedT = 0

  const tmpT = new Vector3()
  function placeCamera() {
    // parallax travel (the web follows it, minus a small lag)
    tmpT.set(0, 0, 0).addScaledVector(right, parallax.x * PAR_X).addScaledVector(up, parallax.y * PAR_Y)
    web.group.position.copy(webBase).addScaledVector(tmpT, 1 - WEB_LAG)
    web.group.position.y += craneY
    camera.position.copy(CAM_POS).add(tmpT)
    camera.position.y += craneY
    tmpT.copy(CAM_TARGET)
    tmpT.y += craneY
    camera.lookAt(tmpT)
    camera.rotateY(-parallax.x * PAR_YAW)
    camera.updateMatrixWorld()
    web.group.quaternion.copy(camera.quaternion)
    web.group.updateMatrixWorld()
    // the sky (moon, stars, haze) is at infinity: it follows camera rotation only
    tmpT.copy(camera.position).addScaledVector(fwd, 1e4).project(camera)
    shared.uSkyOff.value.set(tmpT.x * 0.5, tmpT.y * 0.5)
  }

  function frame(dt: number, animate: boolean) {
    const t0 = performance.now()
    if (animate) {
      time += dt
      shared.uTime.value = time
      const k = 1 - Math.exp(-dt * 2.5)
      parallax.x += (parallaxTarget.x - parallax.x) * k
      parallax.y += (parallaxTarget.y - parallax.y) * k
      // load crane-up
      if (craneT < CRANE_DUR) {
        craneT = Math.min(craneT + dt, CRANE_DUR)
        const f = craneT / CRANE_DUR
        craneY = CRANE_FROM * (f >= 1 ? 0 : Math.pow(2, -10 * f))
      }
      placeCamera()
      web.update(dt)
      maybeShoot(dt)
      swinger.update(dt)

      // print misregistration: pluck spike + suit-switch glitch
      shiftKick *= Math.exp(-dt / 0.1)
      let glitch = 0
      if (glitchT >= 0) {
        glitchT += dt
        if (glitchT < GLITCH_PEAK) glitch = smooth(glitchT / GLITCH_PEAK)
        else glitch = 1 - smooth((glitchT - GLITCH_PEAK) / (GLITCH_DUR - GLITCH_PEAK))
        if (themePending && glitchT >= GLITCH_PEAK) {
          themePending = false
          applyTheme()
        }
        if (glitchT >= GLITCH_DUR) {
          glitchT = -1
          glitch = 0
        }
        // tear pattern re-rolls on twos
        seedT += dt
        if (seedT >= 1 / 12) {
          seedT = 0
          pu.uSeed.value = Math.random() * 100
        }
      }
      pu.uGlitch.value = glitch
      pu.uShift.value = SHIFT_BASE + (SHIFT_PLUCK - SHIFT_BASE) * shiftKick
    } else {
      // still frame (reduced motion / offscreen): settled camera, no transient effects
      shared.uTime.value = 0
      craneT = CRANE_DUR
      craneY = 0
      parallax.set(0, 0)
      placeCamera()
      if (themePending) {
        themePending = false
        applyTheme()
      }
      glitchT = -1
      shiftKick = 0
      pu.uGlitch.value = 0
      pu.uShift.value = SHIFT_BASE
    }
    composer.render(dt)
    stats.ms = stats.ms * 0.97 + (performance.now() - t0) * 0.03
  }

  applyTheme()

  return {
    resize,
    pointerMove,
    pointerDown,
    applyTheme,
    suitChange,
    frame,
    stats,
    dispose() {
      city.dispose()
      web.dispose()
      swinger.dispose()
      sky.geometry.dispose()
      ;(sky.material as { dispose(): void }).dispose()
      renderPass.dispose()
      printPass.dispose()
      composer.dispose()
      rt.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

function smooth(x: number) {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}
