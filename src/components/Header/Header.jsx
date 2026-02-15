import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';
import useTheme from '../../hooks/useTheme';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('pt');

  const translations = {
    pt: {
      menu: [
        { label: "Início", link: "#hero" },
        { label: "Sobre", link: "#about" },
        { label: "Habilidades", link: "#skills" },
        { label: "Planos", link: "#pricing" },
        { label: "Projetos", link: "#projects" },
        { label: "Contato", link: "#contact" }
      ]
    },
    en: {
      menu: [
        { label: "Home", link: "#hero" },
        { label: "About", link: "#about" },
        { label: "Skills", link: "#skills" },
        { label: "Pricing", link: "#pricing" },
        { label: "Projects", link: "#projects" },
        { label: "Contact", link: "#contact" }
      ]
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (e, link) => {
    e.preventDefault();
    const element = document.querySelector(link);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const menuItems = translations[language].menu;

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.logo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span>JG</span>
        </motion.div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                className={styles.navItem}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + (index * 0.05),
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <a
                  href={item.link}
                  className={styles.navLink}
                  onClick={(e) => handleScroll(e, item.link)}
                >
                  {item.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            className={styles.languageToggle}
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {language.toUpperCase()}
          </button>

          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' ? (
                  <svg
                    width="18"
                    height="18"
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
                    width="18"
                    height="18"
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
              </motion.div>
            </AnimatePresence>
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
}