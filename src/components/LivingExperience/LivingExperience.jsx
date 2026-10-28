import { useEffect, useRef } from "react";
import styles from "./LivingExperience.module.css";

export default function LivingExperience() {
  const ambRef = useRef(null);
  const progRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run mouse cursor ring on fine pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    let px = -99;
    let py = -99;
    let rx = -99;
    let ry = -99;
    let rs = 1;
    let rt = 1;

    let lastY = window.scrollY;
    let vel = 0;
    let animId;
    let isMarqueeHovered = false;

    const ring = ringRef.current;
    const amb = ambRef.current;
    const prog = progRef.current;

    // Track mouse pointer for custom ring
    const onPointerMove = (e) => {
      px = e.clientX;
      py = e.clientY;
      if (ring) {
        ring.style.opacity = "1";
        const target = e.target;
        const isInteractive = target && target.closest && target.closest(
          'a, button, [role="button"], input, select, textarea, [data-parallax], [class*="card"], [class*="stage"], [class*="pi"], [class*="pdt"], [class*="cb"], [class*="demo"]'
        );
        rt = isInteractive ? 1.85 : 1;
      }
    };

    const onPointerLeave = () => {
      if (ring) ring.style.opacity = "0";
    };

    if (isFinePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    // Magnetic buttons setup
    const magneticCleanupList = [];
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

    // Marquee hover pause listener
    const marqueeWrappers = document.querySelectorAll('[class*="marquee"]');
    marqueeWrappers.forEach((m) => {
      m.addEventListener("pointerenter", () => { isMarqueeHovered = true; });
      m.addEventListener("pointerleave", () => { isMarqueeHovered = false; });
    });

    // Marquee tracks for inertial scroll
    const marqueeTracks = [...document.querySelectorAll("[data-marquee-track]")].map(
      (el, i) => ({
        el,
        x: i ? -1 : 0,
        dir: el.getAttribute("data-dir") === "1" ? 1 : -1,
      })
    );

    // Initial setup after components mount
    setTimeout(setupMagneticButtons, 500);

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

      // 4. Parallax on cards & stages (like inspiration)
      const stageEl = document.querySelector('[data-parallax="stage"]');
      const demoEl = document.querySelector('[data-parallax="demo"]');
      const pricingCards = document.querySelectorAll("[data-pricing-card]");

      if (stageEl && stageEl.parentElement) {
        const r = stageEl.parentElement.getBoundingClientRect();
        stageEl.style.translate = `0 ${((r.top + r.height / 2 - H / 2) * -0.05).toFixed(1)}px`;
      }

      if (demoEl && demoEl.parentElement) {
        const r = demoEl.parentElement.getBoundingClientRect();
        demoEl.style.translate = `0 ${((r.top + r.height / 2 - H / 2) * -0.05).toFixed(1)}px`;
      }

      const cardSpeeds = [-0.03, -0.09, -0.03];
      pricingCards.forEach((c, idx) => {
        if (c.parentElement) {
          const r = c.parentElement.getBoundingClientRect();
          const speed = cardSpeeds[idx % cardSpeeds.length];
          c.style.translate = `0 ${((r.top + r.height / 2 - H / 2) * speed).toFixed(1)}px`;
        }
      });

      // 5. Skills marquee inertial movement
      if (marqueeTracks.length > 0) {
        marqueeTracks.forEach((track) => {
          const w = track.el.offsetWidth / 3 || 1;
          const sp = (isMarqueeHovered ? 0 : 0.55) + vel * 0.9;
          track.x += track.dir * sp;
          track.x = -((((-track.x) % w) + w) % w);
          track.el.style.transform = `translateX(${track.x.toFixed(1)}px)`;
        });
      }

      // 6. Magnetic cursor ring smoothing
      if (isFinePointer && ring) {
        rx += (px - rx) * 0.2;
        ry += (py - ry) * 0.2;
        rs += (rt - rs) * 0.15;
        ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) scale(${rs.toFixed(2)})`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      if (isFinePointer) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
      magneticCleanupList.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      <div ref={ambRef} className={styles.ambientGlow} aria-hidden="true" />
      <div ref={progRef} className={styles.progressBar} aria-hidden="true" />
      <div ref={ringRef} className={styles.cursorRing} aria-hidden="true" />
    </>
  );
}

