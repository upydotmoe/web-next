import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export default defineStore('locale', () => {
  const locale = ref('en-US')
  const i18nLanguage = useI18n().locale

  const changeLocale = (localePrefix: string) => {
    locale.value = localePrefix
    i18nLanguage.value = localePrefix
  }

  return {
    locale,
    changeLocale
  }
}, {
  persist: true
})