import { UnionType } from './'

export const FETCH_MODES = {
  FEED: 'feed',
  TEXT: 'text',
  ARTWORK: 'artwork'
} as const
export type TFetchModes = UnionType<keyof typeof FETCH_MODES, typeof FETCH_MODES>

export const newUserWelcomeMenus = [
  {
    icon: 'i-fluent-person-32-regular',
    title: 'feeds.newUser.welcomingMenus.setupYourAccount',
    href: '/profile/setting'
  },
  {
    icon: 'i-ion-add',
    title: 'feeds.newUser.welcomingMenus.uploadYourArtwork',
    href: '/post'
  },
  {
    icon: 'i-ph-user-plus',
    title: 'feeds.newUser.welcomingMenus.followSomeone',
    href: '/search?t=users'
  },
  {
    icon: 'i-ion-search',
    title: 'feeds.newUser.welcomingMenus.exploreArtworks',
    href: '/artworks/browse'
  },
]

