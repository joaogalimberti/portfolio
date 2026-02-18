import { useState, useEffect, useRef } from "react";
import styles from "./About.module.css";
import AboutAnimation from "./AboutAnimation";

function Counter({ target, duration = 2, plus }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = parseInt(target);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = totalMiliseconds / end;

    // Adjust for large numbers to keep performance
    let step = 1;
    if (end > 1000) {
      step = Math.ceil(end / 100);
      incrementTime = totalMiliseconds / 100;
    }

    let timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <span ref={elementRef} className={styles.countUpText}>
      {plus && "+"}{count.toLocaleString()}
    </span>
  );
}

export default function About() {
  const statsData = [
    { label: "Anos de experiência em TI", target: 4, plus: false },
    { label: "Projetos de estudo e prática", target: 10, plus: true },
    { label: "Horas de aprendizado contínuo", target: 10000, plus: true }
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* Cabeçalho de seção */}
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
              <Counter
                target={stat.target}
                duration={2}
                plus={stat.plus}
              />
              <span className={styles.statLabelInline}>{stat.label}</span>
              {index < statsData.length - 1 && <span className={styles.statSeparator}>|</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
