// JSON Object

type JsonRecord<T extends JsonValue, K extends string> = Record<K, T>
type IncludingReadonly<T> = T | Readonly<T>

export type JsonRequiredObject<T extends JsonValue, K extends string = string> = IncludingReadonly<JsonRecord<T, K>>
export type JsonObject<T extends JsonValue, K extends string = string> = IncludingReadonly<Partial<JsonRecord<T, K>>>

type JsonUnknownMutableObject = {
  [K in string]?: JsonValue
}

export type JsonUnknownObject = IncludingReadonly<JsonUnknownMutableObject>

// JSON Array

export type JsonArray<T extends JsonValue> = T[] | readonly T[]
export type JsonUnknownArray = readonly JsonValue[]

// JSON Value

export type JsonPrimitive = string | number | boolean
export type JsonValue = JsonPrimitive | JsonUnknownArray | JsonUnknownObject
