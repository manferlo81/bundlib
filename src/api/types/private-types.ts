export type IsInstalled = (id: string) => string | undefined
export type TypeCheckFunction<T> = (value: unknown) => value is T
