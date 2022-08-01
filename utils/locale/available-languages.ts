export interface ILocales {
  [key: string]: {
    name: string
    iso: string
    icon: string
  }
}

export const availableLanguages: ILocales = {
  en: {
    name: 'English',
    iso: 'en-US',
    icon: 'i-twemoji-flag-us-outlying-islands'
  },
  id: {
    name: 'Bahasa Indonesia',
    iso: 'id-ID',
    icon: 'i-twemoji-flag-indonesia'
  }
}