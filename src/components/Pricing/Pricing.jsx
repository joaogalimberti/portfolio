import styles from "./Pricing.module.css";

export default function Pricing() {
    const phoneNumber = "5511999999999"; // Replace with actual number if provided, otherwise placeholder

    const plans = [
        {
            title: "Landing Page",
            price: "A partir de R$ 800",
            description: "Ideal para captar leads e apresentar seu serviço.",
            features: [
                "Design Personalizado",
                "Alta Conversão",
                "Otimização Mobile",
                "Integração com WhatsApp",
                "Hospedagem Inclusa (1 mês)"
            ],
            highlight: false,
            message: "Olá João! Vim do site e tenho interesse no plano Landing Page."
        },
        {
            title: "Site Institucional",
            price: "A partir de R$ 1.500",
            description: "Para empresas que querem consolidar sua marca.",
            features: [
                "Até 5 Páginas",
                "Blog Integrado",
                "SEO Básico",
                "Painel Administrativo",
                "Suporte Prioritário"
            ],
            highlight: true,
            message: "Olá João! Vim do site e tenho interesse no plano Site Institucional."
        },
        {
            title: "E-commerce",
            price: "Sob Consulta",
            description: "Venda seus produtos online com segurança.",
            features: [
                "Loja Completa",
                "Gestão de Estoque",
                "Integração de Pagamentos",
                "Cálculo de Frete",
                "Treinamento de Uso"
            ],
            message: "Olá João! Vim do site e tenho interesse no plano E-commerce."
        }
    ];

    return (
        <section id="pricing" className={styles.pricingSection}>
            <div className="container">
                <div className="section-header reveal">
                    <div className="section-number">03 | INVESTIMENTO</div>
                    <h2 className="section-title">Planos e Pacotes</h2>
                    <p className={styles.subtitle}>
                        Escolha a melhor solução para transformar sua presença digital.
                    </p>
                </div>

                <div className={styles.grid}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${plan.highlight ? styles.highlighted : ''} reveal`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >

                            <div className={styles.cardHeader}>
                                <h3 className={styles.planTitle}>{plan.title}</h3>
                                <div className={styles.planPrice}>{plan.price}</div>
                                <p className={styles.planDesc}>{plan.description}</p>
                            </div>

                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(plan.message)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaButton}
                            >
                                Começar agora
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
