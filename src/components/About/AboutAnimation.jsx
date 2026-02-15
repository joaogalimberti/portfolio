import { useRef, useEffect, useState } from 'react';
import styles from './About.module.css';

export default function AboutAnimation() {
    const canvasRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const totalFrames = 192;
    const imagesRef = useRef([]);

    useEffect(() => {
        let images = [];
        let loadedCount = 0;

        const preloadImages = () => {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                // Pads numbers with leading zeros: 1 -> 001, 50 -> 050, etc.
                const frameNumber = i.toString().padStart(3, '0');
                img.src = `/portfolio/about-animation/${frameNumber}.png`; // Assuming base path might need adjustment if deployed differently, but '/about-animation' is standard public
                // Adjusting path to match user's public folder structure: /about-animation/001.png
                // If the site is served from root, it's /about-animation/...
                // However, user setup seems to be Vite, so 'public' contents are at root.
                img.src = `/about-animation/${frameNumber}.png`;

                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalFrames) {
                        setImagesLoaded(true);
                    }
                };
                images.push(img);
            }
            imagesRef.current = images;
        };

        preloadImages();
    }, []);

    useEffect(() => {
        if (!imagesLoaded) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;

        // Set canvas dimensions to match the first image (assuming all are same size)
        // Or we can rely on CSS to size the canvas and use scale
        const firstImage = imagesRef.current[0];
        canvas.width = firstImage.naturalWidth;
        canvas.height = firstImage.naturalHeight;

        let frameIndex = 0;
        let animationFrameId;

        // Control FPS - targeting 30fps for smoothness without being too fast
        let lastTime = 0;
        const fps = 30;
        const interval = 1000 / fps;

        const render = (currentTime) => {
            animationFrameId = requestAnimationFrame(render);

            const deltaTime = currentTime - lastTime;
            if (deltaTime > interval) {
                lastTime = currentTime - (deltaTime % interval);

                const img = imagesRef.current[frameIndex];
                if (img) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                }

                frameIndex = (frameIndex + 1) % totalFrames;
            }
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [imagesLoaded]);

    return (
        <div className={styles.animationContainer}>
            {!imagesLoaded && <div className={styles.loadingPlaceholder}>Loading...</div>}
            <canvas
                ref={canvasRef}
                className={styles.aboutCanvas}
                style={{ opacity: imagesLoaded ? 1 : 0 }}
            />
        </div>
    );
}
