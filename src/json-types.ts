export interface PkgJsonObject {
  [key: string]: PkgJsonPossibleTypes;
}

export interface PkgJsonArray {
  [index: number]: PkgJsonPossibleTypes;
}

export type PkgJsonPossibleTypes = string | number | boolean | PkgJsonObject | PkgJsonArray | null;
