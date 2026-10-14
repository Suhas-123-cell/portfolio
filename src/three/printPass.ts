import { Vector2, Vector3 } from 'three'

/**
 * Spider-Verse "comic print" look. Also the output pass: the scene target is linear, so each
 * sample is encoded to display sRGB here (no tone mapping), saving a full-screen OutputPass.
 * - red / cyan plate misregistration that grows toward the edges (spikes on a web pluck)
 * - Ben-Day dot screen on low/mid tones, measured as distance from the ink (background) colour,
 *   so it works for dark suits (bright dots on night) and the light gwen suit (dark dots on paper).
 * - uGlitch: suit-switch "dimension tear", row blocks slide sideways and the plates fly apart.
 */
export const PrintShader = {
  name: 'PrintShader',
  uniforms: {
    tDiffuse: { value: null },
    uRes: { value: new Vector2(1, 1) },
    uDpr: { value: 1 },
    uInk: { value: new Vector3() },
    uAmount: { value: 0.5 },
    uShift: { value: 0.9 },
    uCell: { value: 5.5 },
    uGlitch: { value: 0 },
    uSeed: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uDpr;
    uniform vec3 uInk;
    uniform float uAmount;
    uniform float uShift;
    uniform float uCell;
    uniform float uGlitch;
    uniform float uSeed;
    varying vec2 vUv;

    vec3 toSrgb(vec3 c) {
      c = max(c, 0.0);
      return mix(c * 12.92, 1.055 * pow(c, vec3(0.41666)) - 0.055, step(0.0031308, c));
    }
    float h11(float n) { return fract(sin(n * 127.1 + uSeed * 311.7) * 43758.5453); }

    void main() {
      vec2 uv = vUv;
      float shift = uShift;
      if (uGlitch > 0.001) {
        float row = floor(uv.y * 28.0);
        float hr = h11(row);
        // only some bands tear, and they tear by different amounts
        uv.x += (hr - 0.5) * 2.0 * step(0.45, h11(row + 17.0)) * uGlitch * 0.04;
        shift *= 1.0 + 10.0 * uGlitch;
      }
      vec2 px = 1.0 / uRes;
      vec2 d = uv - 0.5;
      float edge = clamp(dot(d, d) * 4.0, 0.0, 1.0);
      vec2 off = (vec2(0.8, 0.45) + d * 1.2) * (shift * (0.5 + 0.9 * edge)) * uDpr * px;
      vec3 s0 = toSrgb(texture2D(tDiffuse, uv).rgb);
      float r = toSrgb(texture2D(tDiffuse, uv + off).rgb).r;
      vec2 gb = toSrgb(texture2D(tDiffuse, uv - off * 0.6).rgb).gb;
      vec3 col = vec3(r, gb);
      // keep plates registered on flat areas, only fringe at contrast edges
      col = mix(s0, col, 0.85);

      // Ben-Day dots on a 45deg screen
      float cell = uCell * uDpr;
      vec2 p = mat2(0.7071, -0.7071, 0.7071, 0.7071) * gl_FragCoord.xy / cell;
      vec2 f = fract(p) - 0.5;
      float dist = length(f);
      vec3 diff = col - uInk;
      float tone = clamp(length(diff) * 1.7, 0.0, 1.0);
      float radius = sqrt(tone) * 0.58;
      float aa = 0.75 / cell;
      float dotm = 1.0 - smoothstep(radius - aa, radius + aa, dist);
      vec3 dotCol = uInk + diff * 1.65;
      vec3 ht = mix(uInk + diff * 0.35, dotCol, dotm);
      float w = uAmount * smoothstep(0.015, 0.08, tone) * (1.0 - smoothstep(0.32, 0.62, tone));
      col = mix(col, ht, w);

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
}
