// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Anything = any;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined;

export type AllowNull<T> = T | null;
export type AllowNullish<T> = T | Nullish;
export type AllowVoid<T> = T | Void;

export type SelectFrom<P, T extends P> = T extends P ? T : never;

export type Dictionary<T> = Record<string, T>;
export type IsInstalled = (id: string) => string | undefined;
export type TypeCheckFunction<T> = (value: unknown) => value is T;
