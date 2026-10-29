import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const sections = [
    { id: "hero", label: t("menu.home", "Início") },
    { id: "about", label: t("menu.about", "Sobre") },
    { id: "skills", label: t("menu.skills", "Habilidades") },
    { id: "pricing", label: t("menu.pricing", "Investimento") },
    { id: "projects", label: t("menu.projects", "Projetos") },
    { id: "contact", label: t("menu.contact", "Contato") },
  ];

  // Section spy on scroll
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
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(nextLang);
  };

  const isPt = i18n.language && i18n.language.startsWith("pt");
  const langLabel = isPt
    ? t("menu.langSwitch", "Mudar idioma para Inglês")
    : t("menu.langSwitch", "Switch language to Portuguese");

  const themeLabel = theme === "light"
    ? t("menu.themeDark", "Mudar para modo escuro")
    : t("menu.themeLight", "Mudar para modo claro");

  return (
    <>
      {/* Top-Right Controls: Theme, Language & Mobile Menu */}
      <div className={styles.topRightControls}>
        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={toggleLanguage}
          aria-label={langLabel}
          title={langLabel}
        >
          <span>{isPt ? "EN" : "PT"}</span>
        </button>

        <button
          type="button"
          className={styles.ctrlBtn}
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {theme === "light" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
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

        {/* Mobile menu toggle (visible only on mobile) */}
        <button
          type="button"
          className={`${styles.ctrlBtn} ${styles.mobileMenuToggle}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-overlay"
          aria-label={isMobileMenuOpen ? t("menu.closeMenu", "Fechar menu") : t("menu.openMenu", "Abrir menu")}
        >
          {isMobileMenuOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop Right Side Navigation (identical to #sn in inspiration) */}
      <nav id="sn" className={styles.sideNav} aria-label={t("menu.navigation", "Navegação pelas seções")}>
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`${styles.navLink} ${isActive ? styles.on : ""}`}
              onClick={(e) => scrollToSection(e, sec.id)}
              aria-label={sec.label}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={styles.navLabel}>{sec.label}</span>
              <i className={styles.navDot} aria-hidden="true" />
            </a>
          );
        })}
      </nav>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-overlay"
          ref={mobileMenuRef}
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu.navigation", "Menu de navegação")}
        >
          <div className={styles.mobileBackdrop} onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
          <nav className={styles.mobileNavCard}>
            <ul className={styles.mobileNavList}>
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={`${styles.mobileNavLink} ${isActive ? styles.mobileActive : ""}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span>{sec.label}</span>
                      {isActive && <span className={styles.activePill} aria-hidden="true" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
