import { useI18n } from 'vue-i18n'

import useLocale from '@/stores/locale.store'

import { availableLanguages } from './available-languages'

export async function initLocale() {
  const { locale } = useI18n()
  const localeStore = useLocale()

  const readBrowserLanguage = () => {
    const defaultLocale = 'en-US'

    try {
      const lang = window ? window.navigator.language : defaultLocale
      return availableLanguages[lang.split('-')[0]] ? lang : defaultLocale
    } catch (error) {
      return defaultLocale
    }
  }

  const initLocale = () => {
    const userPersonalizedLocale = localeStore.locale
    
    if (userPersonalizedLocale) {
      locale.value = localeStore.locale
    } else {
      const browserLanguage = readBrowserLanguage()
      locale.value = browserLanguage
    }
  }
  
  await initLocale()
}