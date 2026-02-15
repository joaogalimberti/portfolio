import "./Projects.css";

export default function Projects() {
  const projects = [
    {
      title: "Solene – E-commerce",
      desc: "Plataforma completa de e-commerce desenvolvida com React, focada em moda premium de linho europeu. Possui catálogo dinâmico de produtos, carrinho de compras em tempo real, filtros avançados, ordenação, busca, controle de quantidades, persistência de estado entre páginas e design totalmente responsivo.",
      img: "solene.jpeg",
      tech: ["React", "JavaScript", "HTML5", "CSS3", "JSON", "React Router", "DOM", "Vite", "UI Moderna"],
      demo: "https://joaogalimberti.github.io/solene-ecommerce-page/",
      code: "https://github.com/joaogalimberti/solene-ecommerce-page"
    },
    {
      title: "Formulário de Pesquisa – SUS",
      desc: "Formulário de pesquisa responsivo desenvolvido com HTML semântico, CSS moderno e JavaScript, com foco em acessibilidade, organização visual, validações inteligentes e interação fluida com o usuário.",
      img: "sus.jpeg",
      tech: ["HTML5", "CSS3", "JavaScript", "DOM", "Regex"],
      demo: "https://joaogalimberti.github.io/survey-form-sus/",
      code: "https://github.com/joaogalimberti/survey-form-sus"
    },
    {
      title: "Documentação Técnica Interativa",
      desc: "Página de documentação técnica limpa, organizada e responsiva, desenvolvida com HTML, CSS e JavaScript, com navegação intuitiva, foco em acessibilidade e estrutura ideal para aprendizado rápido em múltiplos dispositivos.",
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
          <div className="section-number">04 | PROJETOS</div>
          <h2 className="section-title">Projetos em Destaque</h2>
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
                      <a href={project.demo} target="_blank" className="project-link">Demo</a>
                      <a href={project.code} target="_blank" className="project-link">Código</a>
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