'use client'

/**
 * Lightning — animated WebGL lightning bolt for hero backgrounds.
 *
 * Adapted from a 21st.dev 'hero-odyssey' spec which packaged this
 * shader inside a kitchen-sink demo (nav, hue slider, feature pins,
 * hero text). Only the WebGL canvas + shader are kept here; rest
 * is irrelevant decoration.
 *
 * Render pipeline:
 *   - Full-bleed canvas, position:absolute parent decides placement
 *   - GLSL fragment shader generates a vertical lightning bolt via
 *     fractal-Brownian-motion warping of normalized coordinates
 *   - HSV→RGB conversion lets us tint the bolt by hue + saturation;
 *     saturation 0 gives white lightning, 0.7 gives the saturated
 *     blue of the original spec
 *
 * Performance guards added (the spec component had none):
 *   - prefers-reduced-motion: returns null, no canvas mounted
 *   - IntersectionObserver pauses the RAF loop when scrolled off
 *     viewport, resumes when back in
 *   - WebGL unsupported: silently renders an empty <canvas>, no
 *     console spam
 *   - Cleanup tears down RAF, resize listener, GL objects
 *
 * External flash trigger:
 *   - flashIntensity prop (0–1) gates the shader's output via a
 *     uFlashIntensity uniform. Parent ramps this value on scroll
 *     events so the lightning only appears during scroll bursts.
 *   - Default 1.0 (always visible, same as original spec) when
 *     not driven externally.
 */

import { useEffect, useRef, useState } from 'react'

interface LightningProps {
  /** Hue 0–360. Default 220 (blue). For white, set saturation to 0. */
  hue?: number
  /** 0–1. Default 0.7 (saturated). 0 = pure white lightning. */
  saturation?: number
  /** Horizontal offset of the bolt in normalized units. */
  xOffset?: number
  /** Shader animation speed multiplier. */
  speed?: number
  /** Brightness multiplier baked into the shader output. */
  intensity?: number
  /** Noise scale. Larger = thinner bolt. */
  size?: number
  /**
   * 0–1 multiplier applied AFTER intensity. Set by parent to 0
   * to hide the lightning, ramp to 1 on scroll events for a
   * flash burst. Defaults to 1 (always visible) so the component
   * works standalone.
   */
  flashIntensity?: number
}

export default function Lightning({
  hue = 220,
  saturation = 0.7,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  flashIntensity = 1,
}: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  // Latest flashIntensity in a ref so the RAF loop reads current
  // value without re-running the whole effect.
  const flashRef = useRef(flashIntensity)
  flashRef.current = flashIntensity
  // Same for hue/saturation/size/etc — they may change per render.
  const propsRef = useRef({ hue, saturation, xOffset, speed, intensity, size })
  propsRef.current = { hue, saturation, xOffset, speed, intensity, size }

  // Detect reduced motion once at mount.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) {
      // Graceful fallback — no console spam, canvas stays empty.
      return
    }

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // ===== shaders =====
    // Vertex passes through clip-space coords.
    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    // Fragment generates the lightning via fbm-warped uvs.
    // uSaturation added vs the spec so saturation 0 yields white.
    // uFlashIntensity multiplies final output for the trigger ramp.
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uSaturation;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uFlashIntensity;

      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        uv.x += uXOffset;
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        float dist = abs(uv.x);
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, uSaturation, 0.85));
        vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
        col *= uFlashIntensity;
        fragColor = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // Two triangles covering the clip-space.
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ])
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const uniforms = {
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iTime: gl.getUniformLocation(program, 'iTime'),
      uHue: gl.getUniformLocation(program, 'uHue'),
      uSaturation: gl.getUniformLocation(program, 'uSaturation'),
      uXOffset: gl.getUniformLocation(program, 'uXOffset'),
      uSpeed: gl.getUniformLocation(program, 'uSpeed'),
      uIntensity: gl.getUniformLocation(program, 'uIntensity'),
      uSize: gl.getUniformLocation(program, 'uSize'),
      uFlashIntensity: gl.getUniformLocation(program, 'uFlashIntensity'),
    }

    // ===== visibility gate via IntersectionObserver =====
    // RAF loop only schedules new frames while the canvas is in
    // viewport. Saves CPU/GPU/battery once the user scrolls past
    // the hero.
    let isVisible = true
    const io = new IntersectionObserver(
      (entries) => {
        const wasVisible = isVisible
        isVisible = entries[0]?.isIntersecting ?? true
        // Resume the loop if it was paused while we were offscreen.
        if (isVisible && !wasVisible) {
          rafId = requestAnimationFrame(render)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const startTime = performance.now()
    let rafId = 0

    const render = () => {
      if (!isVisible) {
        // Don't schedule more frames; IO callback above will
        // resume when canvas re-enters viewport.
        return
      }
      resizeCanvas()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height)
      const t = (performance.now() - startTime) / 1000.0
      gl.uniform1f(uniforms.iTime, t)
      const p = propsRef.current
      gl.uniform1f(uniforms.uHue, p.hue)
      gl.uniform1f(uniforms.uSaturation, p.saturation)
      gl.uniform1f(uniforms.uXOffset, p.xOffset)
      gl.uniform1f(uniforms.uSpeed, p.speed)
      gl.uniform1f(uniforms.uIntensity, p.intensity)
      gl.uniform1f(uniforms.uSize, p.size)
      gl.uniform1f(uniforms.uFlashIntensity, flashRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      io.disconnect()
      gl.deleteBuffer(vertexBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
    // Only re-create the GL context if reducedMotion flips. All
    // visual props feed via refs so they update each frame
    // without remounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
