export type toUnionType<T> = T[keyof T]

export type UnionType<T, U> = T extends keyof U ? U[T] : never