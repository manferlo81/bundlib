// Tools

export type ExtractStrict<T, X extends T> = Extract<T, X>
export type ExcludeStrict<T, X extends T> = Exclude<T, X>
export type OmitStrict<O, K extends keyof O> = Omit<O, K>

// Nullish Types

export type Nullish = null | undefined

export type MaybeNull<T> = T | null
export type MaybeNullish<T> = T | Nullish

// Array Types

export type SomeArray<T> = T[] | readonly T[]
export type UnknownArray = SomeArray<unknown>

// Object Types

export type Dictionary<T, K extends PropertyKey = PropertyKey> = Record<K, T>
export type NonArrayObject<T, K extends PropertyKey = PropertyKey> = Dictionary<T, K> | Readonly<Dictionary<T, K>>

// Falsy Types

type FalsyTypes = Nullish | false | 0 | ''
type FalsyNumber<T extends number> = T extends 0 ? 0 : number extends T ? number : never
export type Falsy<T = unknown> = unknown extends T ? FalsyTypes : T extends number ? FalsyNumber<T> : T extends string ? '' : Extract<T, FalsyTypes>

// Truthy Types

type TruthyTypes = object | true | string | number
type TruthyNumber<T extends number> = T extends 0 ? never : T
export type Truthy<T = unknown> = unknown extends T ? TruthyTypes : T extends number ? TruthyNumber<T> : Exclude<T, Falsy<T>>

// Void Involving Types

export type Void = ReturnType<() => void>

export type AllowVoid<T> = T | Void
export type AllowNullishReturn<T> = AllowVoid<MaybeNullish<T>>
