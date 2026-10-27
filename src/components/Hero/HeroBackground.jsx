import { useEffect, useRef } from 'react';
import styles from './HeroBackground.module.css';

const TECH_LOGOS = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  PostgreSQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  Tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg'
};

const NODES_DATA = [
  ['React', 62, 22],
  ['TypeScript', 82, 18],
  ['Node.js', 70, 48],
  ['PostgreSQL', 90, 46],
  ['Next.js', 54, 70],
  ['Docker', 78, 76],
  ['Git', 92, 78],
  ['Tailwind', 46, 38],
  ['Node.js', 36, 84]
];

const GRAPH_EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [4, 5],
  [5, 6], [3, 6], [0, 7], [7, 2], [4, 8], [7, 4]
];

function rng(a) {
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function HeroBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeElementsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
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
      const isDark = document.body.dataset.theme === 'dark';
      return isDark ? '140,180,240' : '45,60,90';
    };

    const build = () => {
      dpr = window.devicePixelRatio || 1;
      W = container.clientWidth;
      H = container.clientHeight;
      if (W === 0 || H === 0) return;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const r = rng(7);
      const cs = W < 700 ? 150 : 190;
      V = [];
      Pl = [];

      for (let y = -cs / 2; y < H + cs; y += cs) {
        for (let x = -cs / 2; x < W + cs; x += cs) {
          V.push({
            x: x + r() * cs,
            y: y + r() * cs,
            g: 0,
            r: 0.6 + r() * 0.7,
            t: null
          });
        }
      }

      NODES_DATA.forEach(([, x, y], i) => {
        V.push({
          x: (x / 100) * W,
          y: (y / 100) * H,
          g: 0,
          r: 2,
          t: nodeElementsRef.current[i] || null
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

      const addEdge = (a, b) => {
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
        const n = v.t ? 4 : 2;
        for (let m = 1; m <= n; m++) {
          if (d[m]) addEdge(i, d[m][0]);
        }
      });

      const offset = V.length - NODES_DATA.length;
      GRAPH_EDGES.forEach(([a, b]) => {
        addEdge(offset + a, offset + b);
      });
    };

    const spawn = (n) => {
      const l = Adj[n];
      if (!l || !l.length || Pl.length > 30) return;
      const e = l[Math.floor(Math.random() * l.length)];
      const [a, b] = Ed[e];
      Pl.push({
        e,
        from: a === n ? a : b,
        to: a === n ? b : a,
        t: 0,
        sp: 0.12 + Math.random() * 0.15
      });
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const inX = e.clientX >= rect.left && e.clientX <= rect.right;
      const inY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inX && inY) {
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
      } else {
        mx = -999;
        my = -999;
      }
    };

    const onPointerLeave = () => {
      mx = -999;
      my = -999;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      build();
    });
    resizeObserver.observe(container);
    build();

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, W, H);
      const COL = getColors();
      const isDark = document.body.dataset.theme === 'dark';

      const R = 150;
      const near = [];

      V.forEach((v) => {
        const dx = mx - v.bx;
        const dy = my - v.by;
        const d = Math.hypot(dx, dy);
        let tx = 0;
        let ty = 0;

        if (d < R && mx > 0 && my > 0) {
          const k = (Math.pow(1 - d / R, 2) * (v.t ? 24 : 32)) / (d || 1);
          tx = dx * k;
          ty = dy * k;
          near.push(v);
        }

        const f = Math.min(1, dt * 2.5);
        v.ox += (tx - v.ox) * f;
        v.oy += (ty - v.oy) * f;
        v.x = v.bx + v.ox;
        v.y = v.by + v.oy;

        if (v.t) {
          v.t.style.transform = `translate(${v.ox.toFixed(1)}px, ${v.oy.toFixed(1)}px)`;
        }
      });

      // Draw background grid lines (delicate and clean)
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(${COL}, ${isDark ? 0.04 : 0.024})`;
      ctx.beginPath();
      Ed.forEach(([a, b]) => {
        if (V[a] && V[b]) {
          ctx.moveTo(V[a].x, V[a].y);
          ctx.lineTo(V[b].x, V[b].y);
        }
      });
      ctx.stroke();

      // Draw lines connected to pointer (interactive mouse web)
      if (mx > 0 && my > 0) {
        near.forEach((v) => {
          const d = Math.hypot(mx - v.x, my - v.y);
          ctx.strokeStyle = `rgba(${COL}, ${0.08 * (1 - d / R)})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(v.x, v.y);
          ctx.stroke();
          v.g = Math.max(v.g, 0.45 * (1 - d / R));
        });
      }

      // Spawn pulses along edges occasionally
      if (Math.random() < dt * 0.75) {
        const targetIndex = Math.random() < 0.3
          ? V.length - 1 - Math.floor(Math.random() * NODES_DATA.length)
          : Math.floor(Math.random() * V.length);
        spawn(targetIndex);
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
        p.t += (dt * p.sp * 160) / len;

        if (p.t >= 1) {
          B.g = 0.6;
          Pl.splice(i, 1);
          const c = Math.random();
          if (c < 0.6) spawn(p.to);
          continue;
        }

        const hx = A.x + (B.x - A.x) * p.t;
        const hy = A.y + (B.y - A.y) * p.t;
        const tl = Math.min(p.t, 40 / len);
        const tx = A.x + (B.x - A.x) * (p.t - tl);
        const ty = A.y + (B.y - A.y) * (p.t - tl);
        const f = (Math.sin(Math.PI * p.t) * 0.9 + 0.1) * (B.t ? Math.min(1, (1 - p.t) / 0.3) : 1);

        const g = ctx.createLinearGradient(tx, ty, hx, hy);
        g.addColorStop(0, `rgba(${COL}, 0)`);
        g.addColorStop(1, `rgba(${COL}, ${f * 0.22})`);

        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = `rgba(${COL}, ${f * 0.3})`;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw vertices / dots (soft and minimal)
      V.forEach((v) => {
        v.g = Math.max(0, v.g - dt * 0.5);
        if (!v.t) {
          ctx.fillStyle = `rgba(${COL}, ${isDark ? 0.055 + v.g * 0.15 : 0.035 + v.g * 0.12})`;
          ctx.beginPath();
          ctx.arc(v.x, v.y, v.r + v.g * 0.9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          v.t.style.setProperty('--g', (v.g * v.g * 0.5).toFixed(3));
        }
      });

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.backgroundContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.nodes}>
        {NODES_DATA.map(([name, x, y], index) => (
          <div
            key={`${name}-${index}`}
            ref={(el) => (nodeElementsRef.current[index] = el)}
            className={styles.node}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${-index * 0.9}s`
            }}
          >
            <div className={styles.nodeSvg}>
              {TECH_LOGOS[name] && (
                <img
                  src={TECH_LOGOS[name]}
                  alt={`${name} icon`}
                  width="24"
                  height="24"
                  loading="lazy"
                  draggable="false"
                />
              )}
            </div>
            <span className={styles.nodeLabel}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
