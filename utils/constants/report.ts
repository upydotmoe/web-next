import { UnionType } from './'

export const REPORT_TYPES = {
  ARTWORK: 'artwork',
  FEED: 'feed',
  COMMENT: 'comment',
  COMMENT_REPLY: 'comment_reply'
} as const
export type TReportType = UnionType<keyof typeof REPORT_TYPES, typeof REPORT_TYPES>