import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

export default function AboutDemo() {
  const { t } = useTranslation();
  const demoRef = useRef(null);
  const stageRef = useRef(null);
  const targetXRef = useRef(38);
  const currXRef = useRef(38);
  const targetRotRef = useRef({ rx: 0, ry: 0 });
  const currRotRef = useRef({ rx: 0, ry: 0 });
  const isDraggingRef = useRef(false);
  const animFrameRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    if (!demoRef.current) return;
    const rect = demoRef.current.getBoundingClientRect();
    const clamped = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    targetXRef.current = clamped;
  }, []);

  // 120fps hardware-accelerated physics loop for rotation and slider (ZERO React re-renders)
  useEffect(() => {
    // Initial position
    if (demoRef.current) {
      demoRef.current.style.setProperty('--x', `${currXRef.current}%`);
    }

    const loop = () => {
      // 1. Lerp slider position
      const dx = targetXRef.current - currXRef.current;
      if (Math.abs(dx) > 0.04) {
        currXRef.current += dx * 0.14;
        if (demoRef.current) {
          demoRef.current.style.setProperty('--x', `${currXRef.current.toFixed(2)}%`);
        }
      }

      // 2. Lerp 3D tilt rotation
      const drx = targetRotRef.current.rx - currRotRef.current.rx;
      const dry = targetRotRef.current.ry - currRotRef.current.ry;
      if (Math.abs(drx) > 0.02 || Math.abs(dry) > 0.02) {
        currRotRef.current.rx += drx * 0.12;
        currRotRef.current.ry += dry * 0.12;
        if (stageRef.current) {
          stageRef.current.style.setProperty('--rx', `${currRotRef.current.rx.toFixed(2)}deg`);
          stageRef.current.style.setProperty('--ry', `${currRotRef.current.ry.toFixed(2)}deg`);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Pointer drag listeners
  useEffect(() => {
    const onPointerMove = (e) => {
      if (isDraggingRef.current) {
        updatePosition(e.clientX);
      }
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [updatePosition]);

  // Dynamic 3D tilt tracking mouse with lerp (silky smooth)
  const handlePointerMove = (e) => {
    if (!stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    targetRotRef.current.ry = ((e.clientX - r.left) / r.width - 0.5) * 12;
    targetRotRef.current.rx = (0.5 - (e.clientY - r.top) / r.height) * 10;
  };

  const handlePointerLeave = () => {
    targetRotRef.current.rx = 0;
    targetRotRef.current.ry = 0;
  };

  // Auto-demonstrate dynamically with scroll (if user hasn't dragged yet)
  useEffect(() => {
    const demoEl = demoRef.current;
    if (!demoEl) return;

    let userInteracted = false;
    const onUserInteract = () => {
      userInteracted = true;
    };

    demoEl.addEventListener('pointerdown', onUserInteract);

    const handleScroll = () => {
      if (userInteracted || isDraggingRef.current) return;
      const rect = demoEl.getBoundingClientRect();
      const H = window.innerHeight;
      const p = (H - rect.top) / (H + rect.height);
      if (p > 0.12 && p < 0.95) {
        const autoX = Math.max(15, Math.min(85, ((p - 0.22) / 0.46) * 100));
        targetXRef.current = autoX;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      demoEl.removeEventListener('pointerdown', onUserInteract);
    };
  }, []);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    updatePosition(e.clientX);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetXRef.current = Math.max(0, targetXRef.current - 8);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetXRef.current = Math.min(100, targetXRef.current + 8);
    }
  };

  return (
    <div
      ref={stageRef}
      className={styles.stage3DWrapper}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* ── Monochromatic 3D Shapes with Real Studio Light & Shadows ── */}

      {/* 1. Top-Right: Frosted White Octahedron Crystal */}
      <div className={`${styles.floating3D} ${styles.crystalBlue}`} aria-hidden="true">
        <svg viewBox="0 0 90 90" width="80" height="80" fill="none">
          <defs>
            <filter id="crystBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <linearGradient id="crystTopR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e8eff8" />
            </linearGradient>
            <linearGradient id="crystTopL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5f8fc" />
              <stop offset="100%" stopColor="#d5e0ee" />
            </linearGradient>
            <linearGradient id="crystBotL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c5d3e4" />
              <stop offset="100%" stopColor="#a4b5cb" />
            </linearGradient>
            <linearGradient id="crystBotR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b4c4dc" />
              <stop offset="100%" stopColor="#93a5be" />
            </linearGradient>
          </defs>
          <ellipse cx="45" cy="78" rx="28" ry="9" fill="rgba(12, 23, 44, 0.25)" filter="url(#crystBlur)" />
          <polygon points="45,8 14,44 45,52" fill="url(#crystTopL)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          <polygon points="45,8 76,44 45,52" fill="url(#crystTopR)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          <polygon points="14,44 45,80 45,52" fill="url(#crystBotL)" />
          <polygon points="76,44 45,80 45,52" fill="url(#crystBotR)" />
          <line x1="45" y1="8" x2="45" y2="52" stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 2. Top-Left: White Polyhedral Diamond */}
      <div className={`${styles.floating3D} ${styles.whitePoly}`} aria-hidden="true">
        <svg viewBox="0 0 86 86" width="70" height="70" fill="none">
          <defs>
            <filter id="polyBlur2" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <linearGradient id="wpTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef4fa" />
            </linearGradient>
            <linearGradient id="wpMid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dce5f2" />
              <stop offset="100%" stopColor="#bac8dc" />
            </linearGradient>
            <linearGradient id="wpDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a9bacf" />
              <stop offset="100%" stopColor="#8e9fb5" />
            </linearGradient>
          </defs>
          <ellipse cx="43" cy="74" rx="26" ry="8" fill="rgba(12, 23, 44, 0.22)" filter="url(#polyBlur2)" />
          <polygon points="43,8 16,38 36,44" fill="url(#wpTop)" stroke="rgba(255,255,255,0.85)" strokeWidth="0.8" />
          <polygon points="43,8 72,34 36,44" fill="url(#wpTop)" stroke="rgba(255,255,255,0.95)" strokeWidth="1" />
          <polygon points="72,34 63,74 36,44" fill="url(#wpMid)" />
          <polygon points="16,38 34,78 36,44" fill="url(#wpDark)" />
          <polygon points="34,78 63,74 36,44" fill="url(#wpMid)" />
        </svg>
      </div>

      {/* 3. Mid-Left: Solid Ceramic Slate 3D Cube */}
      <div className={`${styles.floating3D} ${styles.navyCube}`} aria-hidden="true">
        <svg viewBox="0 0 80 80" width="62" height="62" fill="none">
          <defs>
            <filter id="cubeBlur2" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <linearGradient id="ncTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e8eff8" />
            </linearGradient>
            <linearGradient id="ncLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dce4f0" />
              <stop offset="100%" stopColor="#b4c2d6" />
            </linearGradient>
            <linearGradient id="ncRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9fb0c6" />
              <stop offset="100%" stopColor="#788ba3" />
            </linearGradient>
          </defs>
          <ellipse cx="40" cy="70" rx="26" ry="7" fill="rgba(12, 23, 44, 0.25)" filter="url(#cubeBlur2)" />
          <polygon points="40,10 68,26 40,42 12,26" fill="url(#ncTop)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          <polygon points="12,26 40,42 40,70 12,54" fill="url(#ncLeft)" />
          <polygon points="40,42 68,26 68,54 40,70" fill="url(#ncRight)" />
          <line x1="40" y1="10" x2="12" y2="26" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
          <line x1="40" y1="10" x2="68" y2="26" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 4. Bottom-Left: Satin Silver Diamond Ring */}
      <div className={`${styles.floating3D} ${styles.diamondRing}`} aria-hidden="true">
        <svg viewBox="0 0 76 76" width="60" height="60" fill="none">
          <defs>
            <filter id="ringBlur2" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <linearGradient id="ringSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#d8e2ee" />
              <stop offset="80%" stopColor="#b0bfd3" />
              <stop offset="100%" stopColor="#d6e0ec" />
            </linearGradient>
          </defs>
          <ellipse cx="38" cy="66" rx="24" ry="7" fill="rgba(12, 23, 44, 0.2)" filter="url(#ringBlur2)" />
          <polygon points="38,6 68,36 38,66 8,36" stroke="url(#ringSilver)" strokeWidth="7" strokeLinejoin="miter" fill="none" />
          <path d="M38 6 L68 36" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>

      {/* 5. Top Center: Minimalist Monochromatic Pill Badge */}
      <div className={`${styles.floating3D} ${styles.goldPill}`} aria-hidden="true">
        <div className={styles.goldPillBody}>
          <span /><span /><span /><span />
        </div>
      </div>

      {/* 6. Bottom-Right: Ceramic Cube */}
      <div className={`${styles.floating3D} ${styles.goldGem}`} aria-hidden="true">
        <svg viewBox="0 0 50 50" width="38" height="38" fill="none">
          <defs>
            <filter id="gemBlur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <linearGradient id="ggTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#edf3f9" />
            </linearGradient>
            <linearGradient id="ggLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dce4ef" />
              <stop offset="100%" stopColor="#b8c7db" />
            </linearGradient>
            <linearGradient id="ggRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a4b5cb" />
              <stop offset="100%" stopColor="#7f92a9" />
            </linearGradient>
          </defs>
          <ellipse cx="25" cy="44" rx="16" ry="5" fill="rgba(12, 23, 44, 0.22)" filter="url(#gemBlur)" />
          <polygon points="25,6 42,16 25,26 8,16" fill="url(#ggTop)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" />
          <polygon points="8,16 25,26 25,44 8,34" fill="url(#ggLeft)" />
          <polygon points="25,26 42,16 42,34 25,44" fill="url(#ggRight)" />
        </svg>
      </div>

      {/* ── Main 3D Card Board ── */}
      <div
        ref={demoRef}
        data-parallax="demo"
        className={styles.board3D}
        tabIndex={0}
        role="slider"
        aria-orientation="horizontal"
        aria-label={t('about.ariaSlider', 'Arraste para transformar a ideia em interface')}
        aria-valuenow={38}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        {/* Layer 1: Left / IDEA Wireframe */}
        <div className={`${styles.boardLayer} ${styles.ideaLayer}`} aria-hidden="true">
          <div className={styles.ideaCanvas}>
            {/* Dotted grid pattern backdrop */}
            <div className={styles.gridDots} />

            {/* Wireframe UI Elements */}
            <div className={styles.wireAvatar} />
            <div className={styles.wireHeader} />
            <div className={styles.wireLine1} />
            <div className={styles.wireLine2} />
            <div className={styles.wireCard} />

            {/* Bottom Label: IDEA */}
            <span className={styles.ideaLabel}>IDEA</span>
          </div>
        </div>

        {/* Layer 2: Right / INTERFACE 3D Rich Implementation */}
        <div className={`${styles.boardLayer} ${styles.interfaceLayer}`} aria-hidden="true">
          <div className={styles.interfaceCanvas}>
            {/* Top Indicator Bars */}
            <div className={styles.topIndicatorBars}>
              <span className={styles.topBarPill} />
              <span className={styles.topBarPill} />
            </div>

            {/* Top Floating "INTERFACE" Pill Badge */}
            <div className={styles.badgeTopInterface}>
              <span>INTERFACE</span>
            </div>

            {/* 3D Extruded Bar Columns & Shelf (Clean Luxury Monochromatic Slate) */}
            <div className={styles.chart3DStage}>
              {/* Column 1: Graphite Slate (46% height) */}
              <div className={styles.bar3D} style={{ height: '46%' }}>
                <svg viewBox="0 0 50 140" preserveAspectRatio="none" className={styles.barSvg}>
                  <polygon points="0,12 24,0 48,0 24,12" fill="#464e5d" />
                  <polygon points="24,12 48,0 48,128 24,140" fill="#1e222a" />
                  <rect x="0" y="12" width="24" height="128" fill="url(#colGrad1)" />
                </svg>
              </div>

              {/* Column 2: Slate Platinum (80% height) */}
              <div className={styles.bar3D} style={{ height: '80%' }}>
                <svg viewBox="0 0 50 240" preserveAspectRatio="none" className={styles.barSvg}>
                  <polygon points="0,12 24,0 48,0 24,12" fill="#6a7689" />
                  <polygon points="24,12 48,0 48,228 24,240" fill="#2d333e" />
                  <rect x="0" y="12" width="24" height="228" fill="url(#colGrad2)" />
                </svg>
              </div>

              {/* Column 3: Silver Slate (64% height) */}
              <div className={styles.bar3D} style={{ height: '64%' }}>
                <svg viewBox="0 0 50 190" preserveAspectRatio="none" className={styles.barSvg}>
                  <polygon points="0,12 24,0 48,0 24,12" fill="#8896aa" />
                  <polygon points="24,12 48,0 48,178 24,190" fill="#3b4452" />
                  <rect x="0" y="12" width="24" height="178" fill="url(#colGrad3)" />
                </svg>
              </div>

              {/* Column 4: Tallest Ceramic Silver-White (100% height) */}
              <div className={styles.bar3D} style={{ height: '100%' }}>
                <svg viewBox="0 0 50 300" preserveAspectRatio="none" className={styles.barSvg}>
                  <polygon points="0,12 24,0 48,0 24,12" fill="#ffffff" />
                  <polygon points="24,12 48,0 48,288 24,300" fill="#677589" />
                  <rect x="0" y="12" width="24" height="288" fill="url(#colGrad4)" />
                </svg>
              </div>

              {/* Column 5: Classic Platinum (72% height) */}
              <div className={styles.bar3D} style={{ height: '72%' }}>
                <svg viewBox="0 0 50 220" preserveAspectRatio="none" className={styles.barSvg}>
                  <polygon points="0,12 24,0 48,0 24,12" fill="#758296" />
                  <polygon points="24,12 48,0 48,208 24,220" fill="#323a47" />
                  <rect x="0" y="12" width="24" height="208" fill="url(#colGrad5)" />
                </svg>
              </div>

              {/* Monochromatic SVG Gradients definition */}
              <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                  <linearGradient id="colGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3d4452" />
                    <stop offset="100%" stopColor="#222630" />
                  </linearGradient>
                  <linearGradient id="colGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#556073" />
                    <stop offset="100%" stopColor="#373f4d" />
                  </linearGradient>
                  <linearGradient id="colGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#738196" />
                    <stop offset="100%" stopColor="#4f5969" />
                  </linearGradient>
                  <linearGradient id="colGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dce5f2" />
                    <stop offset="100%" stopColor="#9cb0ca" />
                  </linearGradient>
                  <linearGradient id="colGrad5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5e6b7f" />
                    <stop offset="100%" stopColor="#3f4857" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 3D Shelf Base */}
            <div className={styles.shelf3D} />

            {/* Bottom Floating Badge: INTERFACE + Circle Checkmark */}
            <div className={styles.badgeBottomInterface}>
              <span className={styles.badgeText}>INTERFACE</span>
              <div className={styles.checkCircle}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 8.5 6.5 12 13 4.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Center Draggable Divider Handle ── */}
        <div className={styles.handle}>
          <div className={styles.handleIcon}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 6 3 12 8 18" />
              <polyline points="16 6 21 12 16 18" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
