import { useTranslation } from "react-i18next";
import { useRef } from "react";
import HeroBackground from "./HeroBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useTranslation();
  const contentRef = useRef(null);

  return (
    <section id="hero" className={styles.hero} aria-label={t("hero.role", "Desenvolvedor Web Full Stack")}>
      <HeroBackground />

      <div ref={contentRef} id="heroTxt" className={styles.heroContent}>
        <div className={styles.heroBrand}>
          <h1 className={styles.heroName}>
            <span className={styles.nameLine}>JOÃO</span>
            <span className={styles.nameLine}>GALIMBERTI</span>
          </h1>
        </div>

        <p className={styles.heroSubtitle}>
          {t("hero.role", "Desenvolvedor Web Full Stack")}
        </p>

        <div className={styles.heroActions}>
          <a
            href="#projects"
            className={`${styles.heroLink} ${styles.primaryBtn}`}
            aria-label={t("hero.viewProjects", "Ver projetos")}
          >
            <span className={styles.linkText}>{t("hero.viewProjects", "Ver projetos")}</span>
          </a>

          <a
            href="#contact"
            className={styles.heroLink}
            aria-label={t("hero.contact", "Entrar em contato")}
          >
            <span className={styles.linkText}>{t("hero.contact", "Entrar em contato")}</span>
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator} id="heroScroll" aria-hidden="true" />
      <div className={styles.heroBottomBlend} aria-hidden="true" />
      <div className={styles.heroConnectorLine} aria-hidden="true" />
    </section>
  );
}
