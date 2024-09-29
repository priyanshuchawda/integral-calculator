import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "ai_assistant": "AI Assistant",
          "ai_placeholder": "Ask me anything about math...",
          "ai_thinking": "Thinking...",
          "ai_submit": "Submit",
          "ai_response": "AI Response",
          "ai_error": "An error occurred while processing your request.",
        }
      },
      // Add more languages here if needed
    },
    lng: "en", // Set default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;