import { useTranslation } from "react-i18next";
import { useRef } from "react";
import HeroBackground from "./HeroBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useTranslation();
  const contentRef = useRef(null);

  return (
    <section id="hero" className={styles.hero}>
      <HeroBackground />

      <div ref={contentRef} id="heroTxt" className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {t("hero.greeting")}{" "}
          <span className={styles.heroName}>{t("hero.name")},</span>
          <br />
          <span className={styles.heroRole}>{t("hero.role")}</span>
        </h1>

        <p className={styles.heroSubtitle}>{t("hero.description")}</p>

        <div className={styles.heroActions}>
          <a href="#projects" className={`${styles.heroLink} ${styles.primaryBtn}`}>
            <span className={styles.linkText}>{t("hero.viewProjects")}</span>
          </a>

          <a href="#contact" className={styles.heroLink}>
            <span className={styles.linkText}>{t("hero.contact")}</span>
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} id="heroScroll" aria-hidden="true" />
    </section>
  );
}
