import { useEffect, useRef } from "react";
import styles from "./HeroBackground.module.css";

const VS_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dark;

// Procedural hash for subtle organic microstructure
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Procedural height field for calm, rolling dunes & silk waves
float getDuneHeight(vec2 p, float t) {
  // Diagonal orientation (~28 deg) matching the reference aesthetic
  float c = 0.88;
  float s = 0.47;
  vec2 rp = vec2(c * p.x - s * p.y, s * p.x + c * p.y);

  // Very calm, gentle progression
  float slowT = t * 0.12;

  // Primary rolling ridge
  float w1 = sin(rp.x * 1.5 + slowT * 0.8 + sin(rp.y * 1.1) * 0.65);
  // Secondary crossing soft dune
  float w2 = cos(rp.y * 1.7 - slowT * 0.5 + sin(rp.x * 0.95) * 0.5) * 0.6;
  // Tertiary silk fold
  float w3 = sin((rp.x + rp.y) * 2.1 + slowT * 0.4) * 0.35;
  // Subtle organic texture
  float n = noise(rp * 2.8 + slowT * 0.18) * 0.22;

  return w1 + w2 + w3 + n;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // Subtle mouse drift
  vec2 m = (u_mouse - 0.5) * 0.2;
  p += m;

  // Normal calculation via finite differences
  float eps = 0.0035;
  float h  = getDuneHeight(p, u_time);
  float hx = getDuneHeight(p + vec2(eps, 0.0), u_time);
  float hy = getDuneHeight(p + vec2(0.0, eps), u_time);

  vec3 normal = normalize(vec3((hx - h) / eps, (hy - h) / eps, 1.45));

  // Key light from top-left
  vec3 lightDir = normalize(vec3(-0.45, 0.75, 0.8));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Smooth diffuse lighting
  float diff = dot(normal, lightDir) * 0.5 + 0.5;

  // Specular sheen (velvety silk / sand glint)
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec = pow(max(dot(normal, halfVec), 0.0), 9.0) * 0.22;

  // Valley ambient occlusion
  float ao = smoothstep(-1.9, 1.9, h);

  // Light theme: white sand dunes / silk with soft natural shadows
  vec3 lightBase = vec3(0.97, 0.975, 0.985);
  vec3 lightShadow = vec3(0.78, 0.81, 0.85);
  vec3 lightHighlight = vec3(1.0, 1.0, 1.0);

  vec3 lightCol = mix(lightShadow, lightBase, diff);
  lightCol = mix(lightCol, lightHighlight, spec);
  lightCol *= (0.76 + 0.24 * ao);

  // Dark theme: deep charcoal & obsidian dunes
  vec3 darkBase = vec3(0.085, 0.095, 0.125);
  vec3 darkShadow = vec3(0.045, 0.05, 0.065);
  vec3 darkHighlight = vec3(0.25, 0.28, 0.36);

  vec3 darkCol = mix(darkShadow, darkBase, diff);
  darkCol = mix(darkCol, darkHighlight, spec * 1.6);
  darkCol *= (0.65 + 0.35 * ao);

  // Blend light and dark themes
  vec3 finalColor = mix(lightCol, darkCol, u_dark);

  // Delicate vignette
  float vig = 1.0 - 0.15 * length(st - 0.5);
  finalColor *= vig;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId;
    let gl = null;
    let program = null;
    let buffer = null;
    let isWebGL = false;

    try {
      gl =
        canvas.getContext("webgl", { antialias: true, powerPreference: "low-power", depth: false }) ||
        canvas.getContext("experimental-webgl");
    } catch {
      gl = null;
    }

    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let currentDark = document.body.dataset.theme === "dark" || document.documentElement.getAttribute("data-theme") === "dark" ? 1.0 : 0.0;
    let targetDark = currentDark;

    const checkTheme = () => {
      const isDark =
        document.body.dataset.theme === "dark" ||
        document.documentElement.getAttribute("data-theme") === "dark";
      targetDark = isDark ? 1.0 : 0.0;
    };

    const themeObserver = new MutationObserver(checkTheme);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Handle mouse move
    const onPointerMove = (e) => {
      const r = container.getBoundingClientRect();
      targetMouseX = (e.clientX - r.left) / (r.width || 1);
      targetMouseY = (e.clientY - r.top) / (r.height || 1);
    };

    const onPointerLeave = () => {
      targetMouseX = 0.5;
      targetMouseY = 0.5;
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (gl) {
      const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);

      if (vs && fs) {
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          isWebGL = true;
          gl.useProgram(program);

          // Fullscreen quad
          buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const posLoc = gl.getAttribLocation(program, "a_position");
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        }
      }
    }

    const resLoc = isWebGL ? gl.getUniformLocation(program, "u_resolution") : null;
    const timeLoc = isWebGL ? gl.getUniformLocation(program, "u_time") : null;
    const mouseLoc = isWebGL ? gl.getUniformLocation(program, "u_mouse") : null;
    const darkLoc = isWebGL ? gl.getUniformLocation(program, "u_dark") : null;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      if (isWebGL && gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const startTime = performance.now();

    // 2D Canvas Fallback if WebGL isn't supported
    const ctx2d = !isWebGL ? canvas.getContext("2d") : null;

    const render = (now) => {
      const elapsed = (now - startTime) / 1000;
      const t = prefersReducedMotion ? 0 : elapsed;

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Smooth dark mode transition
      currentDark += (targetDark - currentDark) * 0.08;

      if (isWebGL && gl && program) {
        gl.useProgram(program);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform1f(timeLoc, t);
        gl.uniform2f(mouseLoc, currentMouseX, currentMouseY);
        gl.uniform1f(darkLoc, currentDark);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        // Fallback 2D animated dunes
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        const grad = ctx2d.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (currentDark > 0.5) {
          grad.addColorStop(0, "#08090c");
          grad.addColorStop(1, "#151821");
        } else {
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(1, "#e6eaf0");
        }
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);

      if (isWebGL && gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.heroBg} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* Subtle overlay for optimal text contrast */}
      <div className={styles.contrastOverlay} />
    </div>
  );
}
