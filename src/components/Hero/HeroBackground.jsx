import { useEffect, useRef } from "react";
import styles from "./HeroBackground.module.css";

const SVGS = {
  React: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#61dafb" strokeWidth="1.1">
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="#61dafb" />
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#3178c6" />
      <text x="12" y="17" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Inter,sans-serif">TS</text>
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#5fa04e" />
      <text x="12" y="15.5" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="Inter,sans-serif">JS</text>
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#336791" strokeWidth="1.6">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#111" />
      <path d="M9 8v8M9 8l7 9M16 8v5" stroke="#fff" strokeWidth="1.6" fill="none" />
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" fill="#2496ed">
      <rect x="4" y="9" width="3" height="3" />
      <rect x="8" y="9" width="3" height="3" />
      <rect x="12" y="9" width="3" height="3" />
      <rect x="8" y="5.5" width="3" height="3" />
      <rect x="12" y="5.5" width="3" height="3" />
      <path d="M2 13h18c1-1 2-1 2.5-2-1-.5-2-.3-2.5.3-.3-1-1-1.5-1.5-1.8C18 11 18 13 17 15c-2 4-6 5-9 5-3 0-5-2-6-7z" />
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 24 24">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" transform="rotate(45 12 12)" fill="#f05032" />
      <g stroke="#fff" strokeWidth="1.5" fill="#fff">
        <path d="M9 9l5 3M9 9v7" fill="none" />
        <circle cx="9" cy="9" r="1.6" />
        <circle cx="14" cy="12" r="1.6" />
        <circle cx="9" cy="16" r="1.6" />
      </g>
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" fill="#38bdf8">
      <path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3C13.4 10.8 14.5 12 17 12c2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C15.6 7.2 14.5 6 12 6zM7 12c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.7 1.9 1.3C8.4 16.8 9.5 18 12 18c2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.7-1.9-1.3C10.6 13.2 9.5 12 7 12z" />
    </svg>
  ),
};

const NODES_DATA = [
  ["React", 62, 22],
  ["TypeScript", 82, 18],
  ["Node.js", 70, 48],
  ["PostgreSQL", 90, 46],
  ["Next.js", 54, 70],
  ["Docker", 78, 76],
  ["Git", 92, 78],
  ["Tailwind", 46, 38],
  ["Node.js", 36, 84],
];

const EDGES_DATA = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [4, 5],
  [5, 6], [3, 6], [0, 7], [7, 2], [4, 8], [7, 4]
];

function rng(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function HeroBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeElsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const cv = canvasRef.current;
    if (!container || !cv) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let animId;
    let mx = -999;
    let my = -999;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let V = [];
    let Ed = [];
    let Adj = [];
    let Pl = [];
    let last = performance.now();

    const getColors = () => {
      const isDark = document.body.dataset.theme === "dark";
      return isDark ? "130,175,255" : "45,60,90";
    };

    const build = () => {
      dpr = window.devicePixelRatio || 1;
      W = container.clientWidth;
      H = container.clientHeight;
      if (W === 0 || H === 0) return;

      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const r = rng(7);
      const cs = W < 700 ? 85 : 105;
      V = [];
      Pl = [];

      for (let y = -cs / 2; y < H + cs; y += cs) {
        for (let x = -cs / 2; x < W + cs; x += cs) {
          V.push({
            x: x + r() * cs,
            y: y + r() * cs,
            g: 0,
            r: 1 + r() * 0.9,
            t: null,
          });
        }
      }

      NODES_DATA.forEach(([, x, y], i) => {
        V.push({
          x: (x / 100) * W,
          y: (y / 100) * H,
          g: 0,
          r: 3,
          t: nodeElsRef.current[i] || null,
        });
      });

      V.forEach((v) => {
        v.bx = v.x;
        v.by = v.y;
        v.ox = 0;
        v.oy = 0;
      });

      const set = new Set();
      Ed = [];
      Adj = V.map(() => []);

      const add = (a, b) => {
        if (a === b) return;
        const k = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (set.has(k)) return;
        set.add(k);
        Ed.push([a, b]);
        Adj[a].push(Ed.length - 1);
        Adj[b].push(Ed.length - 1);
      };

      V.forEach((v, i) => {
        const d = V.map((u, j) => [j, (u.x - v.x) ** 2 + (u.y - v.y) ** 2]).sort((p, q) => p[1] - q[1]);
        const n = v.t ? 5 : 3;
        for (let m = 1; m <= n; m++) {
          if (d[m]) add(i, d[m][0]);
        }
      });

      const o = V.length - NODES_DATA.length;
      EDGES_DATA.forEach(([a, b]) => {
        add(o + a, o + b);
      });
    };

    const spawn = (n) => {
      const l = Adj[n];
      if (!l || !l.length || Pl.length > 70) return;
      const e = l[Math.floor(Math.random() * l.length)];
      const [a, b] = Ed[e];
      Pl.push({
        e,
        from: a === n ? a : b,
        to: a === n ? b : a,
        t: 0,
        sp: 0.14 + Math.random() * 0.2,
      });
    };

    const onPointerMove = (e) => {
      const r = container.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };

    const onPointerLeave = () => {
      mx = -999;
      my = -999;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(container);
    build();

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      const COL = getColors();

      const R = 170;
      const near = [];

      V.forEach((v) => {
        const dx = mx - v.bx;
        const dy = my - v.by;
        const d = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;

        if (d < R) {
          const k = (Math.pow(1 - d / R, 2) * (v.t ? 26 : 38)) / (d || 1);
          tx = dx * k;
          ty = dy * k;
          near.push(v);
        }

        const f = Math.min(1, dt * 3);
        v.ox += (tx - v.ox) * f;
        v.oy += (ty - v.oy) * f;
        v.x = v.bx + v.ox;
        v.y = v.by + v.oy;

        if (v.t) {
          v.t.style.translate = `${v.ox.toFixed(1)}px ${v.oy.toFixed(1)}px`;
        }
      });

      // Background mesh lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${COL}, 0.045)`;
      ctx.beginPath();
      Ed.forEach(([a, b]) => {
        if (V[a] && V[b]) {
          ctx.moveTo(V[a].x, V[a].y);
          ctx.lineTo(V[b].x, V[b].y);
        }
      });
      ctx.stroke();

      // Mouse interactive constellation web
      near.forEach((v) => {
        const d = Math.hypot(mx - v.x, my - v.y);
        ctx.strokeStyle = `rgba(${COL}, ${0.1 * (1 - d / R)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
        v.g = Math.max(v.g, 0.3 * (1 - d / R));
      });

      // Spawn pulses along network
      if (Math.random() < dt * 3) {
        const target = Math.random() < 0.3
          ? V.length - 1 - Math.floor(Math.random() * NODES_DATA.length)
          : Math.floor(Math.random() * V.length);
        spawn(target);
      }

      for (let i = Pl.length - 1; i >= 0; i--) {
        const p = Pl[i];
        const A = V[p.from];
        const B = V[p.to];
        if (!A || !B) {
          Pl.splice(i, 1);
          continue;
        }

        const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
        p.t += (dt * p.sp * 200) / len;

        if (p.t >= 1) {
          B.g = 1;
          if (B.t) B.g = 1;
          Pl.splice(i, 1);
          const c = Math.random();
          if (c < 0.8) spawn(p.to);
          if (c < 0.3) spawn(p.to);
          continue;
        }

        const hx = A.x + (B.x - A.x) * p.t;
        const hy = A.y + (B.y - A.y) * p.t;
        const tl = Math.min(p.t, 45 / len);
        const tx = A.x + (B.x - A.x) * (p.t - tl);
        const ty = A.y + (B.y - A.y) * (p.t - tl);
        const f = (Math.sin(Math.PI * p.t) * 0.9 + 0.1) * (B.t ? Math.min(1, (1 - p.t) / 0.3) : 1);

        const g = ctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, `rgba(${COL}, 0)`);
        g.addColorStop(1, `rgba(${COL}, ${f * 0.4})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = `rgba(${COL}, ${f * 0.55})`;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vertices / dots and tech node glowing halo
      V.forEach((v) => {
        v.g = Math.max(0, v.g - dt * 0.6);
        if (!v.t) {
          ctx.fillStyle = `rgba(${COL}, ${0.08 + v.g * 0.35})`;
          ctx.beginPath();
          ctx.arc(v.x, v.y, v.r + v.g * 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          v.t.style.setProperty("--g", (v.g * v.g * 0.6).toFixed(3));
        }
      });

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.heroBg} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.nodes}>
        {NODES_DATA.map(([name, x, y], index) => (
          <div
            key={`${name}-${index}`}
            ref={(el) => (nodeElsRef.current[index] = el)}
            className={styles.node}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${-index * 0.9}s`,
            }}
          >
            {SVGS[name]}
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
