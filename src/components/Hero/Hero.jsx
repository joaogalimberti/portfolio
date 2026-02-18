import { useTranslation } from 'react-i18next';
import HeroParticles from './HeroParticles';
import styles from './Hero.module.css';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" className={styles.hero}>
      <HeroParticles />

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
