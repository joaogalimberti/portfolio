import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import pt from "./locales/pt/translation.json";
import en from "./locales/en/translation.json";

const resources = {
  pt: { translation: pt },
  en: { translation: en }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"]
    },
    interpolation: {
      escapeValue: false
    }
  });

// Sync <html> lang attribute for screen readers
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng === "pt" ? "pt-BR" : "en";
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = (i18n.language && i18n.language.startsWith("pt")) ? "pt-BR" : "en";
}

export default i18n;
