import { toUnionType } from '../utils'

export const REPORT_TYPES = {
  ARTWORK: 'artwork',
  FEED: 'feed',
  COMMENT: 'comment',
  COMMENT_REPLY: 'comment_reply'
} as const

export type TReportType = toUnionType<typeof REPORT_TYPES>