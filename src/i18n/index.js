import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "./locales/pt/translation.json";
import en from "./locales/en/translation.json";

// Configuração básica do i18n
// Certifique-se de instalar: npm install i18next react-i18next
const resources = {
    pt: { translation: pt },
    en: { translation: en }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "pt", // idioma padrão
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
