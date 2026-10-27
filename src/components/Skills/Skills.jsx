import { useTranslation } from "react-i18next";
import styles from "./Skills.module.css";

const STACK_LOGOS = {
  React: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  HTML5: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  R: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  WordPress: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg",
  Tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
};

const ROW_1 = [
  "React",
  "TypeScript",
  "Node.js",
  "HTML5",
  "Docker",
  "MySQL",
  "MongoDB",
  "Python",
  "PostgreSQL",
  "Java"
];

const ROW_2 = [
  "Next.js",
  "JavaScript",
  "Tailwind",
  "Git",
  "C++",
  "R",
  "WordPress",
  "Docker",
  "PostgreSQL",
  "Python"
];

function SkillOrbItem({ name }) {
  const iconSrc = STACK_LOGOS[name];

  return (
    <div className={styles.skillItem} title={name}>
      <div className={styles.skillOrb}>
        <div className={styles.skillIcon}>
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={`${name} logo`}
              width="44"
              height="44"
              loading="lazy"
              draggable="false"
            />
          ) : (
            <span className={styles.fallbackIcon}>{name.slice(0, 2)}</span>
          )}
        </div>
      </div>
      <span className={styles.skillName}>{name}</span>
    </div>
  );
}

export default function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-number">{t("skills.number")}</div>
          <h2 className="section-title">{t("skills.title")}</h2>
        </div>
      </div>

      <div className={`${styles.marqueeWrapper} reveal`}>
        {/* Row 1 - scrolling left */}
        <div className={styles.marquee}>
          <div className={styles.track}>
            {[...ROW_1, ...ROW_1, ...ROW_1].map((name, index) => (
              <SkillOrbItem key={`row1-${name}-${index}`} name={name} />
            ))}
          </div>
        </div>

        {/* Row 2 - scrolling right (reverse) */}
        <div className={styles.marquee}>
          <div className={`${styles.track} ${styles.trackBack}`}>
            {[...ROW_2, ...ROW_2, ...ROW_2].map((name, index) => (
              <SkillOrbItem key={`row2-${name}-${index}`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}