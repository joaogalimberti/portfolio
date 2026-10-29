import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "./components/Navigation/Navigation";
import LivingExperience from "./components/LivingExperience/LivingExperience";
import Hero from "./components/Hero/Hero";
import useScrollReveal from "./hooks/useScrollReveal";

// Lazy-load below-fold sections to improve initial load time
const About = lazy(() => import("./components/About/About"));
const Skills = lazy(() => import("./components/Skills/Skills"));
const Pricing = lazy(() => import("./components/Pricing/Pricing"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Contact = lazy(() => import("./components/Contact/Contact"));
const Footer = lazy(() => import("./components/Footer/Footer"));

function App() {
  const { t } = useTranslation();
  useScrollReveal(); // ← ativa o reveal no site inteiro

  return (
    <>
      {/* Skip to Main Content Link for Screen Readers and Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        {t("menu.skipToContent", "Pular para o conteúdo principal")}
      </a>

      <LivingExperience />
      <Navigation />

      <main id="main-content" tabIndex="-1">
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Skills />
          <Pricing />
          <Projects />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
