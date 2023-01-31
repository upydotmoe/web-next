import { toUnionType } from '../utils'

export const NOTIFICATION_SECTIONS = {
  ALL: 'all',
  LIKES: 'likes',
  COMMENTS: 'comments',
  FOLLOWS: 'follows',
  FEEDS: 'feeds'
} as const

export type TNotificationSections = toUnionType<typeof NOTIFICATION_SECTIONS>