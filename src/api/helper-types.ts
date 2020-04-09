export type Dictionary<T> = Record<string, T>;
export type StrictNullable<T> = T | null;
export type Nullable<T> = StrictNullable<T> | undefined;

export type IsInstalled = (id: string) => boolean;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
export type TypeCastCheckFunction<T> = <X = T>(value: unknown) => value is X;
