import { useTranslation } from "react-i18next";
import styles from "./Pricing.module.css";

export default function Pricing() {
    const { t } = useTranslation();
    const phoneNumber = "5527995059130";

    const plans = [
        {
            title: t("pricing.plans.lp.title"),
            price: t("pricing.plans.lp.price"),
            description: t("pricing.plans.lp.description"),
            features: t("pricing.plans.lp.features", { returnObjects: true }),
            highlight: false,
            message: t("pricing.plans.lp.message")
        },
        {
            title: t("pricing.plans.institutional.title"),
            price: t("pricing.plans.institutional.price"),
            description: t("pricing.plans.institutional.description"),
            features: t("pricing.plans.institutional.features", { returnObjects: true }),
            highlight: true,
            message: t("pricing.plans.institutional.message")
        },
        {
            title: t("pricing.plans.ecommerce.title"),
            price: t("pricing.plans.ecommerce.price"),
            description: t("pricing.plans.ecommerce.description"),
            features: t("pricing.plans.ecommerce.features", { returnObjects: true }),
            message: t("pricing.plans.ecommerce.message")
        }
    ];

    return (
        <section id="pricing" className={styles.pricingSection}>
            <div className="container">
                <div className="section-header reveal">
                    <div className="section-number">{t("pricing.number")}</div>
                    <h2 className="section-title">{t("pricing.title")}</h2>
                    <p className={styles.subtitle}>
                        {t("pricing.subtitle")}
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
                                {plan.features && Array.isArray(plan.features) && plan.features.map((feature, i) => (
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
                                {t("pricing.cta")}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
