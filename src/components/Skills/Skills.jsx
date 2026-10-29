import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Skills.module.css";

const STACK_LOGOS = {
  React: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  TypeScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  HTML5: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  Tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  Figma: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
  "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  Express: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  Git: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
  Docker: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  Postman: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
  WordPress: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg",
  Java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
  R: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg"
};

const SKILL_LAYERS = [
  {
    id: "frontend",
    titleKey: "skills.layers.frontend",
    defaultTitle: "Interface Visual",
    descKey: "skills.layers.frontendDesc",
    defaultDesc: "Design System, Componentização & Responsividade",
    levelBadge: "01 · FRONT-END",
    accentGlow: "rgba(99, 179, 237, 0.28)",
    skills: [
      { name: "React", role: "UI Library", featured: true },
      { name: "Next.js", role: "Framework", featured: true },
      { name: "JavaScript", role: "Core Web" },
      { name: "HTML5", role: "Semântica" },
      { name: "CSS3", role: "Estilização" },
      { name: "Tailwind", role: "Utility CSS" },
      { name: "Figma", role: "UI/UX & Protótipo" }
    ]
  },
  {
    id: "logic",
    titleKey: "skills.layers.logic",
    defaultTitle: "Ideação & TypeScript",
    descKey: "skills.layers.logicDesc",
    defaultDesc: "Tipagem Estrita, Regras de Negócio & Arquitetura",
    levelBadge: "02 · LOGIC & CORE",
    accentGlow: "rgba(147, 197, 253, 0.24)",
    skills: [
      { name: "TypeScript", role: "Type Safety", featured: true },
      { name: "Postman", role: "API Testing" },
      { name: "WordPress", role: "CMS & Sites" },
      { name: "R", role: "Data Analysis" }
    ]
  },
  {
    id: "backend",
    titleKey: "skills.layers.backend",
    defaultTitle: "API & Lógica Back-End",
    descKey: "skills.layers.backendDesc",
    defaultDesc: "Microsserviços, Endpoints REST & Autenticação",
    levelBadge: "03 · BACK-END",
    accentGlow: "rgba(165, 180, 252, 0.22)",
    skills: [
      { name: "Node.js", role: "Runtime", featured: true },
      { name: "Express", role: "REST Framework" },
      { name: "Python", role: "APIs & Scripting" },
      { name: "Java", role: "OOP Core" },
      { name: "C++", role: "Performance" }
    ]
  },
  {
    id: "database",
    titleKey: "skills.layers.database",
    defaultTitle: "Dados & Infraestrutura",
    descKey: "skills.layers.databaseDesc",
    defaultDesc: "Bancos Relacionais/NoSQL, Docker & Versionamento",
    levelBadge: "04 · DATA & INFRA",
    accentGlow: "rgba(125, 211, 252, 0.24)",
    skills: [
      { name: "PostgreSQL", role: "Relational DB", featured: true },
      { name: "MySQL", role: "SQL Database" },
      { name: "MongoDB", role: "NoSQL DB" },
      { name: "Docker", role: "Containers", featured: true },
      { name: "Git", role: "Version Control" }
    ]
  }
];

function SkillBadge3D({ skill }) {
  const iconSrc = STACK_LOGOS[skill.name];

  return (
    <div
      className={`${styles.skillBadge3D} ${skill.featured ? styles.featuredBadge : ""}`}
      title={`${skill.name} — ${skill.role}`}
    >
      <div className={styles.badgeTopSheen} aria-hidden="true" />
      <div className={styles.badgeIconWrapper}>
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width="28"
            height="28"
            loading="lazy"
            draggable="false"
            className={styles.skillIconImg}
          />
        ) : (
          <span className={styles.fallbackIcon}>{skill.name.slice(0, 2)}</span>
        )}
      </div>
      <div className={styles.badgeInfo}>
        <span className={styles.badgeName}>{skill.name}</span>
        {skill.role && <span className={styles.badgeRole}>{skill.role}</span>}
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useTranslation();
  const [activeLayer, setActiveLayer] = useState(null);
  const stageRef = useRef(null);
  const targetTiltRef = useRef({ rx: 0, ry: 0 });
  const currTiltRef = useRef({ rx: 0, ry: 0 });
  const animFrameRef = useRef(null);

  // Smooth 3D tilt tracking for the isometric stage
  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetTiltRef.current.ry = x * 8;
    targetTiltRef.current.rx = -y * 6;
  }, []);

  const handleMouseLeave = useCallback(() => {
    targetTiltRef.current.rx = 0;
    targetTiltRef.current.ry = 0;
  }, []);

  useEffect(() => {
    const loop = () => {
      const drx = targetTiltRef.current.rx - currTiltRef.current.rx;
      const dry = targetTiltRef.current.ry - currTiltRef.current.ry;
      if (Math.abs(drx) > 0.01 || Math.abs(dry) > 0.01) {
        currTiltRef.current.rx += drx * 0.1;
        currTiltRef.current.ry += dry * 0.1;
        if (stageRef.current) {
          stageRef.current.style.setProperty("--stage-rx", `${currTiltRef.current.rx.toFixed(2)}deg`);
          stageRef.current.style.setProperty("--stage-ry", `${currTiltRef.current.ry.toFixed(2)}deg`);
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section id="skills" className={styles.skillsSection} aria-labelledby="skills-heading">
      {/* ── Seamless Top Transition Bridge from About ── */}
      <div className={styles.topBridge} aria-hidden="true" />

      {/* ── Studio Overhead Keylight Beams ── */}
      <div className={styles.studioLightBeam} aria-hidden="true" />
      <div className={styles.studioLightSpot} aria-hidden="true" />

      <div className="container" style={{ position: "relative", zIndex: 3 }}>
        {/* Section Header */}
        <div className="section-header reveal">
          <div className="section-number">{t("skills.number")}</div>
          <h2 id="skills-heading" className="section-title">{t("skills.title")}</h2>
          <p className={styles.sectionSubtitle}>
            {t("skills.subtitle", "Arquitetura em camadas: da interface visual ao banco de dados e infraestrutura.")}
          </p>
        </div>

        {/* ── 3D Isometric Layers Showcase ── */}
        <div
          ref={stageRef}
          className={styles.isometricStage}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle Ambient Studio 3D Floating Geometry */}
          <div className={`${styles.monochrome3D} ${styles.floatCube}`} aria-hidden="true">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none">
              <defs>
                <filter id="skCubeBlur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <linearGradient id="skTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#eef4fa" />
                </linearGradient>
                <linearGradient id="skLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e6edf7" />
                  <stop offset="100%" stopColor="#c5d3e6" />
                </linearGradient>
                <linearGradient id="skRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d3e0f0" />
                  <stop offset="100%" stopColor="#b1c2d8" />
                </linearGradient>
              </defs>
              <ellipse cx="40" cy="70" rx="26" ry="7" fill="rgba(12, 23, 44, 0.2)" filter="url(#skCubeBlur)" />
              <polygon points="40,10 68,26 40,42 12,26" fill="url(#skTop)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
              <polygon points="12,26 40,42 40,70 12,54" fill="url(#skLeft)" />
              <polygon points="40,42 68,26 68,54 40,70" fill="url(#skRight)" />
            </svg>
          </div>

          <div className={`${styles.monochrome3D} ${styles.floatOcta}`} aria-hidden="true">
            <svg viewBox="0 0 76 76" width="54" height="54" fill="none">
              <defs>
                <filter id="skOctBlur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <linearGradient id="skOctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#d8e2ee" />
                  <stop offset="100%" stopColor="#b0bfd3" />
                </linearGradient>
              </defs>
              <ellipse cx="38" cy="66" rx="24" ry="7" fill="rgba(12, 23, 44, 0.18)" filter="url(#skOctBlur)" />
              <polygon points="38,8 64,38 38,46 12,38" fill="url(#skOctGrad)" stroke="rgba(255,255,255,0.9)" strokeWidth="0.8" />
              <polygon points="12,38 38,46 38,68 12,38" fill="#9db0c8" />
              <polygon points="64,38 38,46 38,68 64,38" fill="#b9c9dc" />
            </svg>
          </div>

          {/* ── Main Isometric Stack Canvas ── */}
          <div className={styles.stackCanvas}>
            {SKILL_LAYERS.map((layer, index) => {
              const isActive = activeLayer === layer.id;
              const title = t(layer.titleKey, layer.defaultTitle);
              const desc = t(layer.descKey, layer.defaultDesc);

              return (
                <div
                  key={layer.id}
                  className={`${styles.layerRow} ${isActive ? styles.layerRowActive : ""}`}
                  style={{
                    "--layer-index": index,
                    "--layer-z": (4 - index) * 40
                  }}
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                >
                  {/* Left Label Callout */}
                  <div className={styles.leftCallout}>
                    <div className={styles.calloutDot} />
                    <div className={styles.calloutLine} />
                    <div className={styles.calloutContent}>
                      <span className={styles.calloutBadge}>{layer.levelBadge}</span>
                      <h3 className={styles.calloutTitle}>{title}</h3>
                      <p className={styles.calloutDesc}>{desc}</p>
                    </div>
                  </div>

                  {/* 3D Isometric Glass Slab Panel */}
                  <div className={styles.slabWrapper}>
                    <div className={styles.slabCard}>
                      {/* Glass Sheen Highlights */}
                      <div className={styles.slabTopSheen} aria-hidden="true" />
                      <div className={styles.slabEdge3D} aria-hidden="true" />
                      <div
                        className={styles.slabGlow}
                        style={{ background: layer.accentGlow }}
                        aria-hidden="true"
                      />

                      {/* Header Inside the Slab */}
                      <div className={styles.slabHeader}>
                        <div className={styles.slabTitleGroup}>
                          <span className={styles.slabPill}>{layer.levelBadge}</span>
                          <span className={styles.slabTitle}>{title}</span>
                        </div>
                        <span className={styles.slabCounter}>
                          {layer.skills.length} techs
                        </span>
                      </div>

                      {/* Skills Grid on the Slab Surface */}
                      <div className={styles.slabBadgesGrid}>
                        {layer.skills.map((skill) => (
                          <SkillBadge3D key={skill.name} skill={skill} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Flow Callout (Connecting Flows) */}
                  <div className={styles.rightCallout} aria-hidden="true">
                    <div className={styles.flowLine} />
                    <div className={styles.flowArrow} />
                    <span className={styles.flowText}>
                      {index === 0 && t("skills.flows.flow1", "Visual → Componentes → Lógica")}
                      {index === 1 && t("skills.flows.flow1", "Visual → Componentes → Lógica")}
                      {index === 2 && t("skills.flows.flow2", "APIs → Regras → Dados")}
                      {index === 3 && t("skills.flows.flow3", "Git → Deploy → Banco de Dados")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Studio Floor Contact Shadow Pool ── */}
          <div className={styles.studioGroundShadow} aria-hidden="true" />
        </div>
      </div>

      {/* ── Seamless Bottom Transition Bridge into Pricing ── */}
      <div className={styles.bottomBridge} aria-hidden="true" />
      <div className={styles.sectionConduit} aria-hidden="true" />
    </section>
  );
}
