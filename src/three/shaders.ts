/** Shared GLSL. Sky colour is computed in screen space so fog can blend buildings into the exact sky behind them. */

export const SKY_PARS = /* glsl */ `
uniform vec2 uRes;
uniform vec3 uSkyTop;
uniform vec3 uSkyHorizon;
uniform vec3 uHaze;
uniform vec3 uMoonPos; // xy: screen uv, z: radius in screen-height units
uniform float uHorizon;
uniform vec2 uSkyOff; // screen-uv shift of everything at infinity (camera rotation)

vec3 skyBase(vec2 suv) {
  float aspect = uRes.x / uRes.y;
  vec3 c = mix(uSkyHorizon, uSkyTop, smoothstep(uHorizon - 0.05, 1.05, suv.y));
  vec2 d = (suv - uMoonPos.xy) * vec2(aspect, 1.0);
  float r = length(d);
  float halo = exp(-max(r - uMoonPos.z, 0.0) * 3.2);
  c = mix(c, uHaze, halo * 0.6);
  float band = exp(-pow((suv.y - uHorizon) / 0.16, 2.0));
  c = mix(c, uHaze, band * 0.4);
  c = mix(c, uSkyTop, smoothstep(uHorizon - 0.05, uHorizon - 0.5, suv.y) * 0.5);
  return c;
}
`

export const HASH = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
}
`
