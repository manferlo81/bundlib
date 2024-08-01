// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Anything = any;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type Void = void;

export type Nullish = null | undefined | Void;

export type Dictionary<T> = Record<string, T>;
export type AllowNull<T> = T | null;
export type AllowNullish<T> = T | Nullish;

/** @deprecated */
export type StrictNullable<T> = AllowNull<T>;
/** @deprecated */
export type Nullable<T> = AllowNullish<T>;

export type IsInstalled = (id: string) => string | undefined | Void;

export type TypeCheckFunction<T> = (value: unknown) => value is T;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export type TypeCastCheckFunction<T> = <X extends T = T>(value: unknown) => value is X;

export type SelectFrom<P, T extends P> = T extends P ? T : never;
