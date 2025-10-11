// JSON Object

export type JsonObject<T extends JsonValue, K extends string = string> = Readonly<Record<K, T>>
export type JsonPartialObject<T extends JsonValue, K extends string = string> = Partial<JsonObject<T, K>>

export type JsonUnknownObject = {
  readonly [K in string]?: JsonValue
}

// JSON Array

export type JsonArray<T extends JsonValue> = readonly T[]
export type JsonUnknownArray = readonly JsonValue[]

// JSON Value

type JsonPrimitive = string | number | boolean
export type JsonValue = JsonPrimitive | JsonUnknownArray | JsonUnknownObject
