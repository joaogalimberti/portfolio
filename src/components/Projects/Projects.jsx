import { useTranslation } from "react-i18next";
import "./Projects.css";

export default function Projects() {
  const { t } = useTranslation();
  const projects = [
    {
      title: t("projects.items.solene.title"),
      desc: t("projects.items.solene.desc"),
      img: "solene.jpeg",
      tech: ["React", "JavaScript", "HTML5", "CSS3", "JSON", "React Router", "DOM", "Vite", "UI Moderna"],
      demo: "https://joaogalimberti.github.io/solene-ecommerce-page/",
      code: "https://github.com/joaogalimberti/solene-ecommerce-page"
    },
    {
      title: t("projects.items.sus.title"),
      desc: t("projects.items.sus.desc"),
      img: "sus.jpeg",
      tech: ["HTML5", "CSS3", "JavaScript", "DOM", "Regex"],
      demo: "https://joaogalimberti.github.io/survey-form-sus/",
      code: "https://github.com/joaogalimberti/survey-form-sus"
    },
    {
      title: t("projects.items.techdocs.title"),
      desc: t("projects.items.techdocs.desc"),
      img: "techdocs.jpeg",
      tech: ["HTML5", "CSS3", "JavaScript", "DOM"],
      demo: "https://joaogalimberti.github.io/technical-documentation-freecodecamp/",
      code: "https://github.com/joaogalimberti/technical-documentation-freecodecamp"
    }
  ];


  return (
    <section id="projects">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-number">{t("projects.number")}</div>
          <h2 className="section-title">{t("projects.title")}</h2>
        </div>

        <div className="projects-grid reveal">
          {projects.map((project, i) => (
            <div className="project-card" key={i}>
              <div className="project-image-wrapper">
                {project.img ? (
                  <img src={project.img} alt={project.title} className="project-image" />
                ) : null}
                <div className="project-overlay">
                  <div className="overlay-content">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-tags">
                      {project.tech.map((t, idx) => (
                        <span className="project-tag" key={idx}>{t}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      <a href={project.demo} target="_blank" className="project-link">{t("projects.demo")}</a>
                      <a href={project.code} target="_blank" className="project-link">{t("projects.code")}</a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="project-description">{project.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
