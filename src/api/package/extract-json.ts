import type { JsonPrimitive } from './json'

type UnknownArray = unknown[] | readonly unknown[]

// Extract JSON Array

export type ExtractJsonArray<T extends UnknownArray> = {
  [K in keyof T]: ExtractJsonValue<T[K]>
}

// Extract JSON Object Literal

type ExtractJsonDictionary<T extends object> = {
  [K in keyof T]: ExtractJsonValue<T[K]>
}

// Extract JSON Object Tools

type ExcludeNeverProps<T extends object> = Exclude<{
  [K in keyof T]: T[K] extends never ? K : T[K] extends undefined ? K : never
}[keyof T], undefined>

type FilerOutNeverProps<T extends object> = Omit<T, ExcludeNeverProps<T>>

type NewType<T extends object> = FilerOutNeverProps<ExtractJsonDictionary<T>>

// Extract JSON Object

type IgnoredObjectTypes = CallableFunction | Date
export type ExtractJsonObject<T extends object> = T extends IgnoredObjectTypes ? never : NewType<T>

// Extract JSON Value
type ExtractJsonPrimitive<T> = Extract<T, JsonPrimitive>
export type ExtractJsonValue<T> = T extends UnknownArray ? ExtractJsonArray<T> : T extends object ? ExtractJsonObject<T> : ExtractJsonPrimitive<T>
