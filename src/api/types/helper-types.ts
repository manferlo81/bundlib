export type VoidFunction = () => void;

export type Void = ReturnType<VoidFunction>;
export type Nullish = null | undefined;

export type AllowNull<T> = T | null;
export type AllowVoid<T> = T | Void;
export type AllowNullish<T> = T | Nullish;
export type AllowNullishReturn<T> = AllowVoid<AllowNullish<T>>;

export type ExtractStrict<F, S extends F> = Extract<F, S>;
export type ExcludeStrict<F, S extends F> = Exclude<F, S>;
export type OmitStrict<O, K extends keyof O> = Omit<O, K>;

export type NonArrayObject<T> = Record<PropertyKey, T>;
export type Dictionary<T> = Record<string, T>;

export type IsInstalled = (id: string) => string | undefined;
export type TypeCheckFunction<T> = (value: unknown) => value is T;
