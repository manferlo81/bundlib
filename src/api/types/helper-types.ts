export type Dictionary<T> = Record<string, T>;
export type AllowNull<T> = T | null;
export type AllowNullish<T> = AllowNull<T> | undefined | void;

/** @deprecated */
export type StrictNullable<T> = AllowNull<T>;
/** @deprecated */
export type Nullable<T> = AllowNullish<T>;

export type IsInstalled = (id: string) => string | undefined | void;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
export type TypeCastCheckFunction<T> = <X = T>(value: unknown) => value is X;
