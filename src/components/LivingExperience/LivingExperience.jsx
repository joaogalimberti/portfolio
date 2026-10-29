import { useEffect, useRef } from "react";
import styles from "./LivingExperience.module.css";

export default function LivingExperience() {
  const ambRef = useRef(null);
  const progRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastY = window.scrollY;
    let vel = 0;
    let animId;
    let isMarqueeHovered = false;

    const amb = ambRef.current;
    const prog = progRef.current;

    // Magnetic buttons setup (only for devices without reduced motion)
    const magneticCleanupList = [];
    if (!prefersReducedMotion) {
      const setupMagneticButtons = () => {
        const btns = document.querySelectorAll(
          'a[class*="heroLink"], button[class*="ctrlBtn"], a[class*="cta"], a[class*="linkBtn"], button[class*="ctaButton"], button[class*="readMoreBtn"], button[class*="up"]'
        );

        btns.forEach((btn) => {
          const handleMove = (e) => {
            const r = btn.getBoundingClientRect();
            const tx = (e.clientX - r.left - r.width / 2) * 0.22;
            const ty = (e.clientY - r.top - r.height / 2) * 0.3;
            btn.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
          };
          const handleLeave = () => {
            btn.style.translate = "0 0";
          };

          btn.addEventListener("pointermove", handleMove, { passive: true });
          btn.addEventListener("pointerleave", handleLeave, { passive: true });
          magneticCleanupList.push(() => {
            btn.removeEventListener("pointermove", handleMove);
            btn.removeEventListener("pointerleave", handleLeave);
          });
        });
      };
      setTimeout(setupMagneticButtons, 400);
    }

    // Main 60/120fps "Living Page" animation loop
    const tick = () => {
      const y = window.scrollY;
      const H = window.innerHeight;
      const max = document.documentElement.scrollHeight - H;
      const p = max > 0 ? y / max : 0;

      // Scroll velocity for inertia
      vel += ((y - lastY) - vel) * 0.1;
      lastY = y;

      // 1. Top progress bar
      if (prog) {
        prog.style.transform = `scaleX(${p})`;
      }

      // 2. Ambient moving glow
      if (amb) {
        const gx = (15 + 70 * p).toFixed(1);
        const gy = (35 + 15 * Math.sin(y / 450)).toFixed(1);
        amb.style.background = `radial-gradient(760px circle at ${gx}% ${gy}%, rgba(120, 150, 210, 0.14), transparent 70%)`;
      }

      if (!prefersReducedMotion) {
        // 3. Hero content scroll parallax and fade
        const heroTxt = document.getElementById("heroTxt");
        const heroScroll = document.getElementById("heroScroll");
        if (heroTxt) {
          const f = Math.min(1, y / (H * 0.8));
          heroTxt.style.translate = `0 ${(y * 0.2).toFixed(1)}px`;
          heroTxt.style.opacity = `${Math.max(0, 1 - f)}`;
          if (heroScroll) {
            heroScroll.style.opacity = `${Math.max(0, 1 - f * 3)}`;
          }
        }

        // 4. Subtle parallax on Hero / top stage if needed
        const stageEl = document.querySelector('[data-parallax="stage"]');
        if (stageEl && stageEl.parentElement) {
          const r = stageEl.parentElement.getBoundingClientRect();
          stageEl.style.translate = `0 ${((r.top + r.height / 2 - H / 2) * -0.04).toFixed(1)}px`;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      magneticCleanupList.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div ref={ambRef} className={styles.ambientGlow} aria-hidden="true" />
      <div ref={progRef} className={styles.progressBar} aria-hidden="true" />
    </>
  );
}
