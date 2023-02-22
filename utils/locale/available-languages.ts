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
  ja: {
    name: '日本語',
    iso: 'ja-JP',
    icon: 'i-openmoji-flag-japan'
  },
  id: {
    name: 'Bahasa Indonesia',
    iso: 'id-ID',
    icon: 'i-twemoji-flag-indonesia'
  }
}