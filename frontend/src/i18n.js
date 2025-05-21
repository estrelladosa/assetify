// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importamos los archivos de traducción
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json'; // Añadimos el idioma francés
import translationIT from './locales/it/translation.json'; // Añadimos el idioma italiano

// Recursos con las traducciones
const resources = {
  es: {
    translation: translationES
  },
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR 
  },
  it: {
    translation: translationIT 
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Inicializa react-i18next
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    supportedLngs: ['es', 'en', 'fr', 'it'],
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Guarda la preferencia en localStorage
    }
  });

export default i18n;