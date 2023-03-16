import { createI18n } from 'vue-i18n'
import en from '@/locals/en.json'
import ar from '@/locals/ar.json'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    ar: {
      currency: {
        style: 'currency',
        currency: 'LBP'
      }
    }
  }
})
