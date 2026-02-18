import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function HeroParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.speed = Math.random() * 0.5 + 0.15;
                this.size = Math.random() * 1 + 1.5;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                // Read directly from DOM to pick up changes from ANY source
                const isDark = document.body.dataset.theme === 'dark';

                ctx.fillStyle = isDark
                    ? `rgba(255, 255, 255, ${this.opacity * 0.5})` // Brighter white for dark mode
                    : `rgba(26, 26, 26, ${this.opacity * 0.15})`;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = Array.from({ length: 250 }, () => new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // No dependencies needed, direct DOM check handles everything

    return <canvas ref={canvasRef} className={styles.heroCanvas} />;
}
