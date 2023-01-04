export * from './feed'
export * from './text-editor'

export type UnionType<T, U> = T extends keyof U ? U[T] : never

export const POST_TYPES = {
  ARTWORK: 'artwork',
  FEED: 'feed'
} as const