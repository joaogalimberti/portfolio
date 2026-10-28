import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    // Gzip compression for static assets
    compression({ algorithm: "gzip", exclude: [/\.(png|jpg|jpeg|gif|webp|svg|ico)$/] }),
    // Brotli compression (better compression ratio)
    compression({ algorithm: "brotliCompress", exclude: [/\.(png|jpg|jpeg|gif|webp|svg|ico)$/] }),
  ],
  base: "/",
  build: {
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Increase chunk warning limit slightly
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large libraries into separate chunks for better caching
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-i18n": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
        // Organize output files
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
    // Remove console logs and debugger in production
    minify: "esbuild",
    esbuildOptions: {
      drop: ["console", "debugger"],
    },
  },
});
