import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.speed = Math.random() * 0.5 + 0.15;
        this.size = Math.random() * 1 + 1.5;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        // Check for dark mode class on html element or body
        const isDark = document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme') === 'dark';

        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${this.opacity * 0.5})` // Brighter white for dark mode
          : `rgba(26, 26, 26, ${this.opacity * 0.22})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 250 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.heroCanvas} />

      <div className={`${styles.heroContent} reveal`}>
        <h1 className={styles.heroTitle}>
          {t('hero.greeting')} <span className={styles.heroName}>{t('hero.name')},</span>
          <br />{t('hero.role')}
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