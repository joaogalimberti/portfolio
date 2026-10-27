import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

export default function AboutDemo() {
  const { t } = useTranslation();
  const demoRef = useRef(null);
  const [tx, setTx] = useState(25);
  const [cx, setCx] = useState(25);
  const isDraggingRef = useRef(false);
  const animFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const updatePosition = useCallback((clientX) => {
    if (!demoRef.current) return;
    const rect = demoRef.current.getBoundingClientRect();
    const clamped = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setTx(clamped);
  }, []);

  // Smooth lerp for position
  useEffect(() => {
    const loop = () => {
      setCx((prev) => {
        const next = prev + (tx - prev) * 0.14;
        if (Math.abs(tx - prev) < 0.05) return tx;
        return next;
      });
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [tx]);

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

  // Auto-demonstrate when scrolled into view
  useEffect(() => {
    const demoEl = demoRef.current;
    if (!demoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setTimeout(() => {
            setTx(65);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(demoEl);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    updatePosition(e.clientX);
  };

  const handlePointerHover = (e) => {
    if (e.pointerType === 'mouse' && !isDraggingRef.current) {
      updatePosition(e.clientX);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setTx((prev) => Math.max(0, prev - 8));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setTx((prev) => Math.min(100, prev + 8));
    }
  };

  return (
    <div
      ref={demoRef}
      className={styles.demo}
      style={{ '--x': `${cx.toFixed(2)}%` }}
      tabIndex={0}
      role="slider"
      aria-label={t('about.ariaSlider', 'Arraste para transformar a ideia em interface')}
      aria-valuenow={Math.round(cx)}
      aria-valuemin={0}
      aria-valuemax={100}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerHover}
      onKeyDown={handleKeyDown}
    >
      {/* Wireframe Mockup (Left / Idea Layer) */}
      <div className={`${styles.ly} ${styles.wireframeLayer}`}>
        <div className={styles.mockupFrame}>
          <div className={styles.mockupNav}>
            <div className={styles.mockupLogo}>JG</div>
            <div className={styles.mockupBar} />
            <div className={styles.mockupBar} />
            <div className={styles.mockupBar} />
          </div>
          <div className={styles.mockupBody}>
            <div className={styles.mockupLeft}>
              <h4>{t('about.demoHello', 'Olá, mundo')}</h4>
              <p className={styles.mockupLine} />
              <p className={styles.mockupLineShort} />
              <span className={styles.mockupBtn}>{t('about.demoStart', 'Começar')}</span>
            </div>
            <div className={styles.mockupViz}>
              <div className={styles.mockupBarChart} style={{ '--h': '45%', '--i': 0 }} />
              <div className={styles.mockupBarChart} style={{ '--h': '70%', '--i': 1 }} />
              <div className={styles.mockupBarChart} style={{ '--h': '55%', '--i': 2 }} />
              <div className={styles.mockupBarChart} style={{ '--h': '90%', '--i': 3 }} />
              <div className={styles.mockupBarChart} style={{ '--h': '65%', '--i': 4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Styled UI Mockup (Right / Interface Layer) */}
      <div className={`${styles.ly} ${styles.uiLayer}`}>
        <div className={styles.mockupFrame}>
          <div className={styles.mockupNav}>
            <div className={`${styles.mockupLogo} ${styles.uiLogo}`}>JG</div>
            <div className={`${styles.mockupBar} ${styles.uiBar}`} />
            <div className={`${styles.mockupBar} ${styles.uiBar}`} />
            <div className={`${styles.mockupBar} ${styles.uiBar}`} />
          </div>
          <div className={styles.mockupBody}>
            <div className={styles.mockupLeft}>
              <h4 className={styles.uiTitle}>{t('about.demoHello', 'Olá, mundo')}</h4>
              <p className={`${styles.mockupLine} ${styles.uiLine}`} />
              <p className={`${styles.mockupLineShort} ${styles.uiLine}`} />
              <span className={`${styles.mockupBtn} ${styles.uiBtn}`}>{t('about.demoStart', 'Começar')}</span>
            </div>
            <div className={styles.mockupViz}>
              <div className={`${styles.mockupBarChart} ${styles.uiChartBar}`} style={{ '--h': '45%', '--i': 0 }} />
              <div className={`${styles.mockupBarChart} ${styles.uiChartBar}`} style={{ '--h': '70%', '--i': 1 }} />
              <div className={`${styles.mockupBarChart} ${styles.uiChartBar}`} style={{ '--h': '55%', '--i': 2 }} />
              <div className={`${styles.mockupBarChart} ${styles.uiChartBar}`} style={{ '--h': '90%', '--i': 3 }} />
              <div className={`${styles.mockupBarChart} ${styles.uiChartBar}`} style={{ '--h': '65%', '--i': 4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Slider Divider Handle */}
      <div className={styles.handle}>
        <div className={styles.handleIcon}>
          <span>‹ ›</span>
        </div>
      </div>

      {/* Labels */}
      <span className={`${styles.labelTag} ${styles.labelLeft}`}>{t('about.idea', 'Ideia')}</span>
      <span className={`${styles.labelTag} ${styles.labelRight}`}>{t('about.interface', 'Interface')}</span>
    </div>
  );
}
