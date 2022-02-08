export type Undefinable<T> = {
  [K in keyof T]: T[K] | undefined
}

export type DeepUndefinable<T> = {
  [K in keyof T]: DeepUndefinable<T[K]> | undefined
}


export type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null
}
