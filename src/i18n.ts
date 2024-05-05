import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english_translation from "./locales/english.json";
import portuguese_translation from "./locales/portuguese.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
    lng: "pt",
    resources: {
      pt: portuguese_translation,
      en: english_translation,
    },
  });

export default i18n;
