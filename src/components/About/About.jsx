import styles from "./About.module.css";
import CountUp from "../CountUp";
import AboutAnimation from "./AboutAnimation";

export default function About() {
  const statsData = [
    { label: "Anos de experiência em TI", target: 4, plus: false },
    { label: "Projetos de estudo e prática", target: 10, plus: true },
    { label: "Horas de aprendizado contínuo", target: 10000, plus: true }
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Cabeçalho de seção (Global em variáveis/global.css, mas podemos usar classes globais se mantidas) */}
        <div className="section-header reveal">
          <div className="section-number">01 | ABOUT</div>
          <h2 className="section-title">Transformando ideias em interfaces reais</h2>
        </div>

        {/* Grid com texto à esquerda e imagem à direita */}
        <div className={`${styles.aboutGrid} reveal`}>
          <div className={styles.aboutContent}>
            <p className={styles.aboutText}>
              Olá! Sou João Vitor, desenvolvedor em formação com foco em Front-End e
              construção de aplicações Web modernas. Estou constantemente evoluindo minhas
              habilidades e aplicando tecnologias atuais para criar interfaces intuitivas
              e experiências digitais significativas.
            </p>

            <p className={styles.aboutText}>
              Tenho experiência prática no manejo de dados, desenvolvimento web e
              ferramentas de análise, sempre buscando entregar projetos organizados,
              escaláveis e com atenção à performance e usabilidade. Meu objetivo é crescer
              como Full Stack Developer, aprendendo e contribuindo em projetos reais.
            </p>
          </div>

          <div className={styles.aboutImageWrapper}>
            <AboutAnimation />
          </div>
        </div>

        {/* Stats em linha no final da seção */}
        <div className={`${styles.aboutStatsInline} reveal`}>
          {statsData.map((stat, index) => (
            <div className={styles.statItemInline} key={index}>
              <CountUp
                to={stat.target}
                from={0}
                duration={2}
                className={styles.countUpText}
              />
              {stat.plus && <span className={styles.plus}>+</span>}
              <span className={styles.statLabelInline}>{stat.label}</span>
              {index < statsData.length - 1 && <span className={styles.statSeparator}>|</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}