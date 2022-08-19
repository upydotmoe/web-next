import { useI18n } from 'vue-i18n'

export default function () {
  const { t } = useI18n()
  
  const tl = (translationKey) => {
    return t(translationKey)
  }

  return {
    t,
    tl
  }
}