import styles from "./Timeline.module.css";

export default function Timeline() {
  const experiences = [
    {
      year: "2023 - Presente",
      role: "Desenvolvedor Front-End",
      company: "Freelancer / Projetos Pessoais",
      desc: "Desenvolvimento de landing pages, dashboards e aplicações web utilizando React, Next.js e TailwindCSS."
    },
    {
      year: "2022 - 2023",
      role: "Estagiário de TI",
      company: "Empresa Tecnologia Ltda.",
      desc: "Suporte técnico, manutenção de hardware e auxílio na gestão de banco de dados SQL."
    },
    {
      year: "2021",
      role: "Início dos Estudos",
      company: "Autodidata / Cursos Online",
      desc: "Início da jornada na programação com Lógica, HTML, CSS e JavaScript básico."
    }
  ];

  return (
    <section id="timeline">
      <div className={styles.timelineContainer}>
        <div className="section-header reveal">
          <div className="section-number">03 | EXPERIENCE</div>
          <h2 className="section-title">Minha trajetória</h2>
        </div>

        <div className={styles.timelineLine}></div>

        {experiences.map((item, index) => (
          <div className={`${styles.timelineItem} reveal`} key={index}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineCard}>
                <div className={styles.timelineYear}>{item.year}</div>
                <h3 className={styles.timelineRole}>{item.role}</h3>
                <div className={styles.timelineCompany}>{item.company}</div>
                <p className={styles.timelineDescription}>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
