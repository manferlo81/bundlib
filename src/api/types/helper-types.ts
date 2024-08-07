// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined;

export type AllowNull<T> = T | null;
export type AllowNullish<T> = T | Nullish;
export type AllowVoid<T> = T | Void;

export type ExtractFrom<F, S extends F> = Extract<F, S>;
export type ExcludeFrom<F, S extends F> = Exclude<F, S>;

export type NonArrayObject<T> = Record<string | number | symbol, T>;
export type Dictionary<T> = Record<string, T>;

export type IsInstalled = (id: string) => string | undefined;
export type TypeCheckFunction<T> = (value: unknown) => value is T;
