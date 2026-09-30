import { useRef, useState, useEffect } from "react";

export default function TiltCard({ children, className = "", maxTilt = 8, style = {}, ...props }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.4s ease-out",
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    const rotateX = (0.5 - percentY) * maxTilt * 2;
    const rotateY = (percentX - 0.5) * maxTilt * 2;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.08s ease-out",
    });

    setGlarePos({
      x: percentX * 100,
      y: percentY * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setTransformStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
    });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...transformStyle,
        position: "relative",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={className}
      {...props}
    >
      {children}
      {/* Glare sheen spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 75%)`,
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          zIndex: 5,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
