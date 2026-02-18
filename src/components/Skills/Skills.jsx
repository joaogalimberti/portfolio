import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const techStacks = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB"
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#000000"
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E"
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6"
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    color: "#E34F26"
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    color: "#1572B6"
  },
  {
    name: "Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    color: "#06B6D4"
  },
  {
    name: "WordPress",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
    color: "#21759B"
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#339933"
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    color: "#3776AB"
  },
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    color: "#007396"
  },
  {
    name: "C++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    color: "#00599C"
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#4479A1"
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791"
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248"
  },
  {
    name: "R",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    color: "#276DC3"
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    color: "#F05032"
  },
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    color: "#181717"
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED"
  },
  {
    name: "Figma",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    color: "#F24E1E"
  }
];

// Shuffle array function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Skills() {
  const { t } = useTranslation();
  const row1 = shuffleArray(techStacks).slice(0, 10);
  const row2 = shuffleArray(techStacks).slice(0, 10);

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-number">{t("skills.number")}</div>
          <h2 className="section-title">{t("skills.title")}</h2>
        </div>

        <div className="skills-marquee-wrapper reveal">
          {/* First Row - Left to Right */}
          <div className="skills-marquee-row">
            <div className="skills-track skills-track-right">
              {[...row1, ...row1, ...row1].map((tech, index) => (
                <div
                  key={`row1-${tech.name}-${index}`}
                  className="tech-card"
                >
                  <div className="tech-icon-wrapper">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="tech-icon"
                      loading="lazy"
                    />
                    <div className="icon-glow" style={{ background: tech.color }}></div>
                  </div>
                  <h3 className="tech-name">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Right to Left */}
          <div className="skills-marquee-row">
            <div className="skills-track skills-track-left">
              {[...row2, ...row2, ...row2].map((tech, index) => (
                <div
                  key={`row2-${tech.name}-${index}`}
                  className="tech-card"
                >
                  <div className="tech-icon-wrapper">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="tech-icon"
                      loading="lazy"
                    />
                    <div className="icon-glow" style={{ background: tech.color }}></div>
                  </div>
                  <h3 className="tech-name">{tech.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}