import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./About.module.css";
import AboutDemo from "./AboutDemo";

function Counter({ target, duration = 1.8, plus }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const end = parseInt(target, 10);
    const totalMs = duration * 1000;

    const stepAnim = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / totalMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(stepAnim);
      }
    };

    const animId = requestAnimationFrame(stepAnim);
    return () => cancelAnimationFrame(animId);
  }, [isVisible, target, duration]);

  return (
    <span ref={elementRef} className={styles.statNumber}>
      {plus && "+"}{count.toLocaleString()}
    </span>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const statsData = [
    { label: t("about.stats.years"), target: 4, plus: false },
    { label: t("about.stats.projects"), target: 10, plus: true },
    { label: t("about.stats.hours"), target: 10000, plus: true }
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Cabeçalho de seção */}
        <div className="section-header reveal">
          <div className="section-number">{t("about.number")}</div>
          <h2 className="section-title">{t("about.title")}</h2>
        </div>

        {/* Grid com Demo slider à esquerda e conteúdo textual à direita */}
        <div className={`${styles.aboutGrid} reveal`}>
          <AboutDemo />

          <div className={styles.sideContent}>
            <p
              className={styles.introText}
              dangerouslySetInnerHTML={{ __html: t("about.intro") }}
            />

            <div className={`${styles.moreWrapper} ${isExpanded ? styles.open : ""}`} id="about-more">
              <p className={styles.moreText}>
                {t("about.text1")}
              </p>
              <p className={styles.moreText}>
                {t("about.text2")}
              </p>
            </div>

            <button
              type="button"
              className={styles.readMoreBtn}
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-controls="about-more"
            >
              {isExpanded ? t("about.readLess", "Ler menos −") : t("about.readMore", "Ler mais +")}
            </button>

            {/* Stats */}
            <div className={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <div className={styles.statItem} key={index}>
                  <Counter
                    target={stat.target}
                    duration={1.8}
                    plus={stat.plus}
                  />
                  <small className={styles.statLabel}>{stat.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
