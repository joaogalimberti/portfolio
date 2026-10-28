import { lazy, Suspense } from "react";
import Header from "./components/Header/Header";
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
  useScrollReveal(); // ← ativa o reveal no site inteiro

  return (
    <>
      <Header />
      <main>
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
