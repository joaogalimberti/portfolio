import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Projects.module.css";

const GITHUB_SVG = (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
  </svg>
);

export default function Projects() {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [checkedAppts, setCheckedAppts] = useState({ 0: true, 1: true });
  const [checkedOliva, setCheckedOliva] = useState({ 0: true, 3: true });
  const [gameScore, setGameScore] = useState(0);
  const [hitBugs, setHitBugs] = useState({});

  const stageRef = useRef(null);
  const devRef = useRef(null);
  const isHoveredRef = useRef(false);
  const timerRef = useRef(null);

  const projects = t("projects.items", { returnObjects: true }) || [];

  // Auto-advance projects every 7 seconds when not hovered
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (!isHoveredRef.current) {
        setCur((prev) => (prev + 1) % 5);
      }
    }, 7000);

    return () => clearInterval(timerRef.current);
  }, [cur]);

  // 3D stage tilt tracking mouse
  const handlePointerMove = (e) => {
    if (!stageRef.current || !devRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const ry = (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2);
    const rx = ((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2);
    devRef.current.style.setProperty("--ry", `${ry}deg`);
    devRef.current.style.setProperty("--rx", `${rx}deg`);
  };

  const handlePointerLeave = () => {
    if (!devRef.current) return;
    devRef.current.style.setProperty("--ry", "0deg");
    devRef.current.style.setProperty("--rx", "0deg");
  };

  const toggleAppt = (idx) => {
    setCheckedAppts((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleOliva = (idx) => {
    setCheckedOliva((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleHitBug = (id) => {
    if (hitBugs[id]) return;
    setHitBugs((prev) => ({ ...prev, [id]: true }));
    setGameScore((prev) => prev + 10);
    setTimeout(() => {
      setHitBugs((prev) => ({ ...prev, [id]: false }));
    }, 1800);
  };

  const selectProject = (index) => {
    setCur(index);
  };

  // Mosquitoes coordinates for Dengue Mission
  const desktopBugs = [
    { id: 'b1', x: 8, y: 28, delay: 0, dur: 5 },
    { id: 'b2', x: 38, y: 16, delay: 2, dur: 6 },
    { id: 'b3', x: 62, y: 38, delay: 1, dur: 4.5 },
    { id: 'b4', x: 22, y: 52, delay: 3, dur: 5.5 },
    { id: 'b5', x: 74, y: 18, delay: 2.5, dur: 6.5 }
  ];

  const phoneBugs = [
    { id: 'pb1', x: 8, y: 30, delay: 0, dur: 5 },
    { id: 'pb2', x: 40, y: 18, delay: 2, dur: 6 },
    { id: 'pb3', x: 20, y: 52, delay: 3, dur: 5.5 }
  ];

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className="container">
        {/* Header */}
        <div className="section-header reveal">
          <div className="section-number">{t("projects.number")}</div>
          <h2 className="section-title">{t("projects.title")}</h2>
        </div>

        {/* 2-Column Showcase */}
        <div
          className={`${styles.pj} reveal`}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
        >
          {/* Left Column: 3D Stage with Monitor and Phone */}
          <div
            ref={stageRef}
            className={styles.stage}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div ref={devRef} className={styles.dev}>
              {/* Desktop Monitor */}
              <div className={styles.mon}>
                <div className={styles.sc}>
                  {/* Slide 0: Praeso */}
                  <div className={`${styles.sn} ${cur === 0 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uPraeso}`}>
                      <div className={styles.h1}>
                        <span>Praeso</span>
                        <i>Hoje · 12 agendamentos</i>
                      </div>
                      <div className={styles.st3}>
                        <div className={styles.kp}><b>92%</b><div className={styles.ln} style={{ width: "70%" }} /></div>
                        <div className={styles.kp}><b>12</b><div className={styles.ln} style={{ width: "60%" }} /></div>
                        <div className={styles.kp}><b>3</b><div className={styles.ln} style={{ width: "50%" }} /></div>
                      </div>
                      {[
                        { w: "55%", i: 0 },
                        { w: "45%", i: 1 },
                        { w: "60%", i: 2 },
                        { w: "50%", i: 3 }
                      ].map((item) => (
                        <div
                          key={`appt-d-${item.i}`}
                          className={`${styles.ap} ${checkedAppts[item.i] ? styles.ok : ""}`}
                          onClick={() => toggleAppt(item.i)}
                        >
                          <div className={styles.av} />
                          <div className={styles.ln} style={{ width: item.w, margin: 0, flex: 1 }} />
                          <i className={styles.dt} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide 1: Solène */}
                  <div className={`${styles.sn} ${cur === 1 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uSolene}`}>
                      <div className={styles.h1}>
                        <span>SOLÈNE</span>
                        <i>Carrinho · <b>{cartCount}</b></i>
                      </div>
                      <div className={styles.gr}>
                        {["#c9a578", "#aebfd8", "#8da6cc", "#1f2a44"].map((color, i) => (
                          <div
                            key={`pdt-${i}`}
                            className={styles.pdt}
                            onClick={() => setCartCount((prev) => prev + 1)}
                          >
                            <s style={{ background: color }} />
                            <div className={styles.ln} style={{ width: "100%" }} />
                            <div className={styles.ln} style={{ width: "60%" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Oliva */}
                  <div className={`${styles.sn} ${cur === 2 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uOliva}`}>
                      <div className={styles.mini}>
                        <h6 className={styles.ol}>Oliva</h6>
                        <div className={styles.add}>
                          <div className={styles.ln} style={{ width: "50%", margin: 0 }} />
                        </div>
                        {[
                          { w: "60%", i: 0 },
                          { w: "45%", i: 1 },
                          { w: "70%", i: 2 },
                          { w: "50%", i: 3 },
                          { w: "55%", i: 4 }
                        ].map((item) => (
                          <div
                            key={`ol-d-${item.i}`}
                            className={`${styles.it} ${checkedOliva[item.i] ? styles.ck : ""}`}
                            onClick={() => toggleOliva(item.i)}
                          >
                            <i />
                            <div className={styles.ln} style={{ width: item.w, margin: 0, flex: 1 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Slide 3: Strevo */}
                  <div className={`${styles.sn} ${cur === 3 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uStrevo}`}>
                      <div className={styles.sh}>
                        <span>STREVO</span>
                        <b>{t("projects.streak", "12 dias")}</b>
                      </div>
                      <div className={styles.rg} style={{ "--p": "74%" }}>
                        <b>74%</b>
                      </div>
                      <div className={styles.bs}>
                        {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
                          <s
                            key={`str-${i}`}
                            style={{ height: `${h}%`, animationDelay: `${-(i * 0.4)}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Slide 4: Dengue Mission */}
                  <div className={`${styles.sn} ${cur === 4 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uDengue}`}>
                      <div className={styles.hud}>
                        <span>{t("projects.scoreLabel", "PONTOS")}</span>
                        <b>{gameScore}</b>
                      </div>
                      {desktopBugs.map((b) => (
                        <div
                          key={b.id}
                          className={`${styles.bug} ${hitBugs[b.id] ? styles.hit : ""}`}
                          style={{
                            left: `${b.x}%`,
                            top: `${b.y}%`,
                            animationDelay: `${-b.delay}s`,
                            animationDuration: `${b.dur}s`
                          }}
                          onClick={() => handleHitBug(b.id)}
                        />
                      ))}
                      <div className={styles.gnd} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor Stand & Base */}
              <div className={styles.stand} />
              <div className={styles.base} />

              {/* Mobile Phone Floating */}
              <div className={styles.ph}>
                <div className={styles.phs}>
                  {/* Phone Slide 0: Praeso */}
                  <div className={`${styles.sn} ${cur === 0 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uPraeso}`}>
                      <div className={styles.h1}>Praeso</div>
                      <div className={styles.st3} style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className={styles.kp}><b>92%</b></div>
                        <div className={styles.kp}><b>12</b></div>
                      </div>
                      {[
                        { w: "60%", i: 0 },
                        { w: "50%", i: 1 },
                        { w: "65%", i: 2 }
                      ].map((item) => (
                        <div
                          key={`appt-p-${item.i}`}
                          className={`${styles.ap} ${checkedAppts[item.i] ? styles.ok : ""}`}
                          onClick={() => toggleAppt(item.i)}
                        >
                          <div className={styles.av} />
                          <div className={styles.ln} style={{ width: item.w, margin: 0, flex: 1 }} />
                          <i className={styles.dt} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Slide 1: Solène */}
                  <div className={`${styles.sn} ${cur === 1 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uSolene}`}>
                      <div className={styles.h1} style={{ justifyContent: "center" }}>SOLÈNE</div>
                      <div className={styles.big} />
                      <div className={styles.ln} style={{ width: "100%" }} />
                      <div className={styles.ln} style={{ width: "60%" }} />
                      <div className={styles.cta1} />
                    </div>
                  </div>

                  {/* Phone Slide 2: Oliva */}
                  <div className={`${styles.sn} ${cur === 2 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uOliva}`}>
                      <h6 className={styles.ol}>Oliva</h6>
                      <div className={styles.add}>
                        <div className={styles.ln} style={{ width: "50%", margin: 0 }} />
                      </div>
                      {[
                        { w: "60%", i: 0 },
                        { w: "45%", i: 1 },
                        { w: "70%", i: 2 },
                        { w: "50%", i: 3 }
                      ].map((item) => (
                        <div
                          key={`ol-p-${item.i}`}
                          className={`${styles.it} ${checkedOliva[item.i] ? styles.ck : ""}`}
                          onClick={() => toggleOliva(item.i)}
                        >
                          <i />
                          <div className={styles.ln} style={{ width: item.w, margin: 0, flex: 1 }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phone Slide 3: Strevo */}
                  <div className={`${styles.sn} ${cur === 3 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uStrevo}`}>
                      <div className={styles.sh}>
                        <span>STREVO</span>
                        <b>12d</b>
                      </div>
                      <div className={styles.rg} style={{ "--p": "74%" }}>
                        <b>74%</b>
                      </div>
                    </div>
                  </div>

                  {/* Phone Slide 4: Dengue Mission */}
                  <div className={`${styles.sn} ${cur === 4 ? styles.on : ""}`}>
                    <div className={`${styles.ui} ${styles.uDengue}`}>
                      <div className={styles.hud}>
                        <span>PTS</span>
                        <b>{gameScore}</b>
                      </div>
                      {phoneBugs.map((b) => (
                        <div
                          key={b.id}
                          className={`${styles.bug} ${hitBugs[b.id] ? styles.hit : ""}`}
                          style={{
                            left: `${b.x}%`,
                            top: `${b.y}%`,
                            animationDelay: `${-b.delay}s`,
                            animationDuration: `${b.dur}s`
                          }}
                          onClick={() => handleHitBug(b.id)}
                        />
                      ))}
                      <div className={styles.gnd} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Project List */}
          <div className={styles.pjList}>
            {Array.isArray(projects) &&
              projects.map((proj, index) => {
                const isActive = cur === index;
                return (
                  <div
                    key={proj.id || index}
                    role="button"
                    tabIndex={0}
                    className={`${styles.pi} ${isActive ? styles.on : ""}`}
                    onClick={() => selectProject(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectProject(index);
                      }
                    }}
                  >
                    <small>{proj.number}</small>
                    <h3>{proj.title}</h3>

                    <div className={styles.pd}>
                      <p>{proj.desc}</p>

                      {proj.tags && Array.isArray(proj.tags) && (
                        <ul className={styles.tagsList}>
                          {proj.tags.map((tag, tIdx) => (
                            <li key={tIdx} className={styles.tagPill}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className={styles.lk}>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.linkBtn} ${styles.primary}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className={styles.onlineDot} aria-hidden="true" />
                          {t("projects.live", "Ver ao vivo")}
                        </a>

                        <a
                          href={proj.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkBtn}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {GITHUB_SVG}
                          <span>{t("projects.code", "Código")}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
