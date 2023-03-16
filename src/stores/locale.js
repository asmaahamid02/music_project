import { defineStore } from 'pinia'
import { setLocale } from '@vee-validate/i18n'
import i18n from '@/includes/i18n'

export default defineStore('locale', {
  state: () => ({
    locale: 'en'
  }),
  actions: {
    changeLocale(locale) {
      i18n.global.locale = locale
      this.locale = locale
      setLocale(locale)
      localStorage.setItem('locale', locale)
    }
  }
})
