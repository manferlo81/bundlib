export type SelectiveResolved<K extends string, T> = Record<K, T>;
export type SelectiveResolvedBoolean<K extends string> = SelectiveResolved<K, boolean>;
