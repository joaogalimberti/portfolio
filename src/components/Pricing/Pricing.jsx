import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import styles from "./Pricing.module.css";

// Hook para animar o preço contando
function useCountUp(target, duration = 1200, start = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        // Extrai número do string (ex: "R$ 1.500" → 1500)
        const numericTarget = parseInt(String(target).replace(/\D/g, ""), 10);
        if (!numericTarget || isNaN(numericTarget)) return;

        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numericTarget));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [start, target, duration]);

    return count;
}

// Card de plano individual com interatividades
function PlanCard({ plan, index, isHighlighted }) {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const cardRef = useRef(null);
    const phoneNumber = "5527995059130";

    // IntersectionObserver para animar entrada
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Features aparecem com delay após o card
                    setTimeout(() => setFeaturesVisible(true), 300);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    // TiltCard integrado
    const [tilt, setTilt] = useState({
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.45s ease-out",
    });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        const rx = (0.5 - py) * 12;
        const ry = (px - 0.5) * 12;
        setTilt({
            transform: `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: "transform 0.08s ease-out",
        });
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setTilt({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        });
    };

    return (
        <div
            ref={cardRef}
            className={`
                ${styles.card}
                ${isHighlighted ? styles.highlighted : ""}
                ${visible ? styles.cardVisible : ""}
            `}
            style={{
                ...tilt,
                transitionDelay: visible ? `${index * 100}ms` : "0ms",
                position: "relative",
                transformStyle: "preserve-3d",
                willChange: "transform",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Badge "Mais Popular" */}
            {isHighlighted && (
                <div className={styles.popularBadge}>
                    <span className={styles.badgeDot} />
                    {t("pricing.popular")}
                </div>
            )}

            {/* Glare spotlight */}
            <div
                className={`${styles.glare} ${hovered ? styles.glareVisible : ""}`}
                aria-hidden="true"
            />

            {/* Glow borda highlight */}
            {isHighlighted && <div className={styles.glowBorder} aria-hidden="true" />}

            <div className={styles.cardHeader}>
                <h3 className={styles.planTitle}>{plan.title}</h3>
                <div className={styles.planPrice}>{plan.price}</div>
                <p className={styles.planDesc}>{plan.description}</p>
            </div>

            <ul className={styles.featuresList}>
                {plan.features &&
                    Array.isArray(plan.features) &&
                    plan.features.map((feature, i) => (
                        <li
                            key={i}
                            className={`${styles.featureItem} ${featuresVisible ? styles.featureVisible : ""}`}
                            style={{ transitionDelay: `${i * 60}ms` }}
                        >
                            <svg
                                className={styles.checkIcon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
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
                <span className={styles.ctaButtonBg} aria-hidden="true" />
                <span className={styles.ctaButtonText}>{t("pricing.cta")}</span>
            </a>
        </div>
    );
}

export default function Pricing() {
    const { t } = useTranslation();

    const plans = [
        {
            title: t("pricing.plans.lp.title"),
            price: t("pricing.plans.lp.price"),
            description: t("pricing.plans.lp.description"),
            features: t("pricing.plans.lp.features", { returnObjects: true }),
            highlight: false,
            message: t("pricing.plans.lp.message"),
        },
        {
            title: t("pricing.plans.institutional.title"),
            price: t("pricing.plans.institutional.price"),
            description: t("pricing.plans.institutional.description"),
            features: t("pricing.plans.institutional.features", { returnObjects: true }),
            highlight: true,
            message: t("pricing.plans.institutional.message"),
        },
        {
            title: t("pricing.plans.ecommerce.title"),
            price: t("pricing.plans.ecommerce.price"),
            description: t("pricing.plans.ecommerce.description"),
            features: t("pricing.plans.ecommerce.features", { returnObjects: true }),
            highlight: false,
            message: t("pricing.plans.ecommerce.message"),
        },
    ];

    return (
        <section id="pricing" className={styles.pricingSection}>
            <div className="container">
                <div className="section-header reveal">
                    <div className="section-number">{t("pricing.number")}</div>
                    <h2 className="section-title">{t("pricing.title")}</h2>
                    <p className={styles.subtitle}>{t("pricing.subtitle")}</p>
                </div>

                <div className={styles.grid}>
                    {plans.map((plan, index) => (
                        <PlanCard
                            key={index}
                            plan={plan}
                            index={index}
                            isHighlighted={plan.highlight}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
