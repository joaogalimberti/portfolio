import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", label: t("menu.home", "Início") },
    { id: "about", label: t("menu.about", "Sobre") },
    { id: "skills", label: t("menu.skills", "Habilidades") },
    { id: "pricing", label: t("menu.pricing", "Investimento") },
    { id: "projects", label: t("menu.projects", "Projetos") },
    { id: "contact", label: t("menu.contact", "Contato") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.45;
      let current = "hero";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= scrollThreshold) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      {/* Top-Right Controls: Theme & Language */}
      <div className={styles.topRightControls}>
        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={toggleLanguage}
          aria-label="Alternar idioma"
          title={i18n.language === "pt" ? "Switch to English" : "Mudar para Português"}
        >
          <span>{i18n.language === "pt" ? "EN" : "PT"}</span>
        </button>

        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={toggleTheme}
          aria-label="Alternar tema"
          title={theme === "light" ? "Modo escuro" : "Modo claro"}
        >
          {theme === "light" ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>

      {/* Right Side Navigation (identical to #sn in inspiration) */}
      <nav id="sn" className={styles.sideNav} aria-label="Navegação lateral">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`${styles.navLink} ${isActive ? styles.on : ""}`}
              onClick={(e) => scrollToSection(e, sec.id)}
            >
              <span className={styles.navLabel}>{sec.label}</span>
              <i className={styles.navDot} />
            </a>
          );
        })}
      </nav>
    </>
  );
}

