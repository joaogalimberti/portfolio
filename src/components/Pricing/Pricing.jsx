import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Pricing.module.css";

const PHONE_NUMBER = "5527995059130";

function PricingCard({ plan, isPopular, delayIndex, isOutlineBtn }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const targetTiltRef = useRef({ rx: 0, ry: 0, y: 0 });
  const currTiltRef = useRef({ rx: 0, ry: 0, y: 0 });
  const animFrameRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const loop = () => {
      const drx = targetTiltRef.current.rx - currTiltRef.current.rx;
      const dry = targetTiltRef.current.ry - currTiltRef.current.ry;
      const dy = targetTiltRef.current.y - currTiltRef.current.y;

      if (Math.abs(drx) > 0.01 || Math.abs(dry) > 0.01 || Math.abs(dy) > 0.05) {
        currTiltRef.current.rx += drx * 0.14;
        currTiltRef.current.ry += dry * 0.14;
        currTiltRef.current.y += dy * 0.14;

        cardEl.style.transform = `translateY(${currTiltRef.current.y.toFixed(2)}px) rotateX(${currTiltRef.current.rx.toFixed(2)}deg) rotateY(${currTiltRef.current.ry.toFixed(2)}deg)`;
      } else if (!isHoveredRef.current && (Math.abs(currTiltRef.current.rx) > 0 || Math.abs(currTiltRef.current.y) > 0)) {
        currTiltRef.current.rx = 0;
        currTiltRef.current.ry = 0;
        currTiltRef.current.y = 0;
        cardEl.style.transform = `translateY(0px) rotateX(0deg) rotateY(0deg)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!cardRef.current) return;
    isHoveredRef.current = true;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mx", `${x}px`);
    cardRef.current.style.setProperty("--my", `${y}px`);

    targetTiltRef.current.rx = ((y / rect.height - 0.5) * -7);
    targetTiltRef.current.ry = (((x / rect.width - 0.5) * 7));
    targetTiltRef.current.y = -8;
  }, []);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    targetTiltRef.current.rx = 0;
    targetTiltRef.current.ry = 0;
    targetTiltRef.current.y = 0;
  }, []);

  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(plan.message)}`;

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isPopular ? styles.popularCard : ""}`}
      data-pricing-card={delayIndex}
      style={{ transitionDelay: `${delayIndex * 0.12}s` }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Light sheen layer across glass */}
      <div className={styles.glassSheen} aria-hidden="true" />

      {/* Luminous studio rim highlight on popular card */}
      {isPopular && <div className={styles.popularTopGlow} aria-hidden="true" />}

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
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2.5 6 5 8.5 9.5 3.5" />
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
        className={`${styles.ctaButton} ${isOutlineBtn ? styles.outlineBtn : ""}`}
        aria-label={`${t("pricing.cta", "Começar agora")}: ${plan.title}`}
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
      isOutlineBtn: false,
      message: t("pricing.plans.lp.message")
    },
    {
      title: t("pricing.plans.institutional.title"),
      label: t("pricing.plans.institutional.label", "A partir de"),
      price: t("pricing.plans.institutional.price"),
      description: t("pricing.plans.institutional.description"),
      features: t("pricing.plans.institutional.features", { returnObjects: true }),
      isPopular: true,
      isOutlineBtn: false,
      message: t("pricing.plans.institutional.message")
    },
    {
      title: t("pricing.plans.ecommerce.title"),
      label: t("pricing.plans.ecommerce.label", "Investimento"),
      price: t("pricing.plans.ecommerce.price"),
      description: t("pricing.plans.ecommerce.description"),
      features: t("pricing.plans.ecommerce.features", { returnObjects: true }),
      isPopular: false,
      isOutlineBtn: true,
      message: t("pricing.plans.ecommerce.message")
    }
  ];

  return (
    <section id="pricing" className={styles.pricingSection} aria-labelledby="pricing-heading">
      {/* ── Seamless Top Transition Bridge from Skills ── */}
      <div className={styles.topBridge} aria-hidden="true" />

      {/* ── Studio Overhead Keylight & Atmosphere ── */}
      <div className={styles.studioLightBeam} aria-hidden="true" />
      <div className={styles.studioLightSpot} aria-hidden="true" />

      <div className="container" style={{ position: "relative", zIndex: 3 }}>
        {/* Section Header */}
        <div className="section-header reveal">
          <div className="section-number">{t("pricing.number")}</div>
          <h2 id="pricing-heading" className="section-title">{t("pricing.title")}</h2>
          <p className={styles.subtitle}>{t("pricing.subtitle")}</p>
        </div>

        {/* ── 3D Glassmorphism Stage ── */}
        <div className={styles.pricingStage}>

          {/* 0. Soft Frosted Glass Backdrop Pebble (Left Behind Card 1) */}
          <div className={`${styles.monochrome3D} ${styles.backdropPebble}`} aria-hidden="true">
            <svg viewBox="0 0 240 240" width="220" height="220" fill="none">
              <defs>
                <linearGradient id="pebbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(240, 245, 255, 0.75)" />
                  <stop offset="100%" stopColor="rgba(215, 226, 242, 0.2)" />
                </linearGradient>
                <filter id="pebbleSoft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              <path
                d="M40 120 C25 65 75 25 130 30 C190 35 210 85 205 140 C200 195 150 215 95 210 C50 205 50 160 40 120 Z"
                fill="url(#pebbleGrad)"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.5"
                filter="url(#pebbleSoft)"
              />
            </svg>
          </div>

          {/* 1. Realistic Beveled Ceramic 3D Dice with Inset Slot Pills (Bottom Left) */}
          <div className={`${styles.monochrome3D} ${styles.ceramicCube}`} aria-hidden="true">
            <svg viewBox="0 0 130 130" width="108" height="108" fill="none">
              <defs>
                <filter id="diceBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
                <radialGradient id="diceShadowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0c172c" stopOpacity="0.48" />
                  <stop offset="55%" stopColor="#0c172c" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0c172c" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="diceTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#f7f9fd" />
                  <stop offset="100%" stopColor="#e8eff8" />
                </linearGradient>
                <linearGradient id="diceLeftFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#edf2f9" />
                  <stop offset="100%" stopColor="#ccd7e6" />
                </linearGradient>
                <linearGradient id="diceRightFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d8e3f0" />
                  <stop offset="100%" stopColor="#b4c4d7" />
                </linearGradient>
                <linearGradient id="diceSlotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8fa3bc" />
                  <stop offset="100%" stopColor="#b8c8dd" />
                </linearGradient>
              </defs>

              {/* Contact Ground Shadow */}
              <ellipse cx="65" cy="112" rx="46" ry="13" fill="url(#diceShadowGrad)" filter="url(#diceBlur)" />
              <ellipse cx="65" cy="110" rx="30" ry="7" fill="rgba(12, 23, 44, 0.45)" filter="url(#diceBlur)" />

              {/* Right Face */}
              <path
                d="M65 56 L106 35 C109 33.5 111 35.5 111 38 L111 82 C111 85.5 108 87.5 106 88.5 L65 110 Z"
                fill="url(#diceRightFace)"
              />

              {/* Left Face */}
              <path
                d="M65 56 L24 35 C21 33.5 19 35.5 19 38 L19 82 C19 85.5 22 87.5 24 88.5 L65 110 Z"
                fill="url(#diceLeftFace)"
              />

              {/* 2 Inset Slot Pills on Left Face (Reference detail) */}
              <rect
                x="32"
                y="50"
                width="6"
                height="19"
                rx="3"
                fill="url(#diceSlotGrad)"
                transform="skewY(27)"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="0.9"
              />
              <rect
                x="43"
                y="45"
                width="6"
                height="19"
                rx="3"
                fill="url(#diceSlotGrad)"
                transform="skewY(27)"
                stroke="rgba(255, 255, 255, 0.75)"
                strokeWidth="0.9"
              />

              {/* Top Face (Specular light from overhead keylight) */}
              <path
                d="M65 16 L106 35 L65 56 L24 35 Z"
                fill="url(#diceTopFace)"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="1.2"
              />

              {/* Specular Ridge Highlights */}
              <line x1="65" y1="16" x2="24" y2="35" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.2" />
              <line x1="65" y1="16" x2="106" y2="35" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.2" />
              <line x1="65" y1="56" x2="65" y2="109" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" />
            </svg>
          </div>

          {/* 2. Realistic 3D Pedestal / Podium Platform (Bottom Right) */}
          <div className={`${styles.monochrome3D} ${styles.ceramicPodium}`} aria-hidden="true">
            <svg viewBox="0 0 160 120" width="138" height="104" fill="none">
              <defs>
                <filter id="podiumBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
                <radialGradient id="podiumShadowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0c172c" stopOpacity="0.46" />
                  <stop offset="60%" stopColor="#0c172c" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#0c172c" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="podiumBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d5e0ee" />
                  <stop offset="30%" stopColor="#eef4fa" />
                  <stop offset="70%" stopColor="#ffffff" />
                  <stop offset="90%" stopColor="#c5d3e4" />
                  <stop offset="100%" stopColor="#b0bfd4" />
                </linearGradient>
                <linearGradient id="podiumTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#f5f8fc" />
                  <stop offset="100%" stopColor="#e2ebf7" />
                </linearGradient>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="80" cy="94" rx="66" ry="19" fill="url(#podiumShadowGrad)" filter="url(#podiumBlur)" />
              <ellipse cx="80" cy="91" rx="46" ry="11" fill="rgba(12, 23, 44, 0.38)" filter="url(#podiumBlur)" />

              {/* Cylinder Rim Base */}
              <path
                d="M16 58 C16 73 45 84 80 84 C115 84 144 73 144 58 L144 74 C144 89 115 100 80 100 C45 100 16 89 16 74 Z"
                fill="url(#podiumBodyGrad)"
              />

              {/* Top Disc Face */}
              <ellipse
                cx="80"
                cy="58"
                rx="64"
                ry="19"
                fill="url(#podiumTopGrad)"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="1.5"
              />

              {/* Concentric Inner Beveled Rim */}
              <ellipse
                cx="80"
                cy="58"
                rx="48"
                ry="14"
                fill="none"
                stroke="#d0dced"
                strokeWidth="1.2"
              />

              {/* Floating Pearl / Ceramic Gem above Podium */}
              <ellipse cx="120" cy="52" rx="9" ry="4" fill="rgba(12, 23, 44, 0.25)" filter="url(#podiumBlur)" />
              <circle
                cx="120"
                cy="42"
                r="10"
                fill="url(#podiumTopGrad)"
                stroke="rgba(255, 255, 255, 0.95)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* 3. Floating Beveled Polyhedral Cube (Top Right) */}
          <div className={`${styles.monochrome3D} ${styles.floatingCube}`} aria-hidden="true">
            <svg viewBox="0 0 110 110" width="88" height="88" fill="none">
              <defs>
                <filter id="cubeBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" />
                </filter>
                <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#eef4fa" />
                </linearGradient>
                <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e6edf7" />
                  <stop offset="100%" stopColor="#c5d3e6" />
                </linearGradient>
                <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d3e0f0" />
                  <stop offset="100%" stopColor="#b1c2d8" />
                </linearGradient>
              </defs>

              {/* Cast Soft Shadow Behind */}
              <ellipse cx="62" cy="88" rx="34" ry="12" fill="rgba(12, 23, 44, 0.24)" filter="url(#cubeBlur)" />

              {/* 3D Cube Faces */}
              <path d="M55 16 L88 34 L55 52 L22 34 Z" fill="url(#cubeTop)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1" />
              <path d="M22 34 L55 52 L55 86 L22 68 Z" fill="url(#cubeLeft)" />
              <path d="M55 52 L88 34 L88 68 L55 86 Z" fill="url(#cubeRight)" />

              {/* Specular Edge Highlighting */}
              <line x1="55" y1="16" x2="22" y2="34" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" />
              <line x1="55" y1="16" x2="88" y2="34" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" />
              <line x1="55" y1="52" x2="55" y2="85" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" />
            </svg>
          </div>

          {/* 4. Floating Monochromatic Satin Rhombus Ring (Center / Mid Right) */}
          <div className={`${styles.monochrome3D} ${styles.floatingRing}`} aria-hidden="true">
            <svg viewBox="0 0 90 90" width="72" height="72" fill="none">
              <defs>
                <filter id="ringBlur" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <linearGradient id="ringMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#e3ebf6" />
                  <stop offset="70%" stopColor="#b6c5d9" />
                  <stop offset="100%" stopColor="#dce5f2" />
                </linearGradient>
              </defs>
              <ellipse cx="45" cy="74" rx="28" ry="8" fill="rgba(12, 23, 44, 0.22)" filter="url(#ringBlur)" />
              <path
                d="M45 10 L76 45 L45 80 L14 45 Z"
                fill="none"
                stroke="url(#ringMetal)"
                strokeWidth="8"
                strokeLinejoin="round"
              />
              <path d="M45 10 L76 45" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
            </svg>
          </div>

          {/* ── 3-Card Glassmorphism Grid ── */}
          <div className={`${styles.grid} reveal`}>
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                plan={plan}
                isPopular={plan.isPopular}
                delayIndex={index}
                isOutlineBtn={plan.isOutlineBtn}
              />
            ))}
          </div>

          {/* ── Realistic Studio Ground Contact Shadow Pool ── */}
          <div className={styles.studioGroundShadow} aria-hidden="true" />
        </div>
      </div>

      {/* ── Seamless Bottom Transition Bridge into Projects ── */}
      <div className={styles.bottomBridge} aria-hidden="true" />
      <div className={styles.sectionConduit} aria-hidden="true" />
    </section>
  );
}
