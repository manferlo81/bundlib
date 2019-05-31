export interface PkgJsonObject {
  [key: string]: PkgJsonPossibleTypes;
}

export interface PkgJsonArray extends Array<PkgJsonPossibleTypes> { }

export type PkgJsonPossibleTypes = string | number | boolean | PkgJsonObject | PkgJsonArray | null;
