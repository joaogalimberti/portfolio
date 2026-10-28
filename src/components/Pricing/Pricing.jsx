import { useTranslation } from "react-i18next";
import styles from "./Pricing.module.css";

const PHONE_NUMBER = "5527995059130";

function PricingCard({ plan, isPopular, delayIndex }) {
  const { t } = useTranslation();

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(plan.message)}`;

  return (
    <div
      className={`${styles.card} ${isPopular ? styles.popularCard : ""}`}
      data-pricing-card={delayIndex}
      style={{ transitionDelay: `${delayIndex * 0.12}s` }}
      onPointerMove={handlePointerMove}
    >
      {isPopular && (
        <span className={styles.popularBadge}>
          {t("pricing.popular", "Mais popular")}
        </span>
      )}

      <h3 className={styles.planTitle}>{plan.title}</h3>

      <div className={styles.priceWrapper}>
        <small className={styles.priceLabel}>{plan.label}</small>
        <div className={styles.priceValue}>{plan.price}</div>
      </div>

      <p className={styles.description}>{plan.description}</p>

      <ul className={styles.featuresList}>
        {plan.features &&
          Array.isArray(plan.features) &&
          plan.features.map((feature, i) => (
            <li key={i} className={styles.featureItem}>
              <div className={styles.checkCircle} aria-hidden="true">
                <svg
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 5l2 2 4-4" />
                </svg>
              </div>
              <span>{feature}</span>
            </li>
          ))}
      </ul>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaButton}
      >
        {t("pricing.cta", "Começar agora")}
      </a>
    </div>
  );
}

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      title: t("pricing.plans.lp.title"),
      label: t("pricing.plans.lp.label", "A partir de"),
      price: t("pricing.plans.lp.price"),
      description: t("pricing.plans.lp.description"),
      features: t("pricing.plans.lp.features", { returnObjects: true }),
      isPopular: false,
      message: t("pricing.plans.lp.message")
    },
    {
      title: t("pricing.plans.institutional.title"),
      label: t("pricing.plans.institutional.label", "A partir de"),
      price: t("pricing.plans.institutional.price"),
      description: t("pricing.plans.institutional.description"),
      features: t("pricing.plans.institutional.features", { returnObjects: true }),
      isPopular: true,
      message: t("pricing.plans.institutional.message")
    },
    {
      title: t("pricing.plans.ecommerce.title"),
      label: t("pricing.plans.ecommerce.label", "Investimento"),
      price: t("pricing.plans.ecommerce.price"),
      description: t("pricing.plans.ecommerce.description"),
      features: t("pricing.plans.ecommerce.features", { returnObjects: true }),
      isPopular: false,
      message: t("pricing.plans.ecommerce.message")
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-number">{t("pricing.number")}</div>
          <h2 className="section-title">{t("pricing.title")}</h2>
          <p className={styles.subtitle}>{t("pricing.subtitle")}</p>
        </div>

        <div className={`${styles.grid} reveal`}>
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              isPopular={plan.isPopular}
              delayIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
