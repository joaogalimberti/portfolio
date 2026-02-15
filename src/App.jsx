import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Pricing from "./components/Pricing/Pricing";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import useScrollReveal from "./hooks/useScrollReveal";

function App() {
  useScrollReveal(); // ← ativa o reveal no site inteiro

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Pricing />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
