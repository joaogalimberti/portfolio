import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import HeroBackground from './HeroBackground';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      mouseRef.current.tx = ((e.clientX / W) - 0.5) * 14;
      mouseRef.current.ty = ((e.clientY / H) - 0.5) * 8;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      const m = mouseRef.current;
      m.cx = lerp(m.cx, m.tx, 0.06);
      m.cy = lerp(m.cy, m.ty, 0.06);
      if (el) {
        el.style.transform = `translate(${m.cx.toFixed(2)}px, ${m.cy.toFixed(2)}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <HeroBackground />

      <div ref={contentRef} className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {t('hero.greeting')} <span className={styles.heroName}>{t('hero.name')},</span>
          <br /><span className={styles.heroRole}>{t('hero.role')}</span>
        </h1>

        <p className={styles.heroSubtitle}>
          {t('hero.description')}
        </p>

        <div className={styles.heroActions}>
          <a href="#projects" className={styles.heroLink}>
            <span className={styles.linkText}>{t('hero.viewProjects')}</span>
          </a>

          <a href="#contact" className={styles.heroLink}>
            <span className={styles.linkText}>{t('hero.contact')}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
