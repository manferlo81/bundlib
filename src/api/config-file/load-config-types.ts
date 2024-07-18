import type { CosmiconfigResult as CosmiconfigOriginalResult } from 'cosmiconfig';
import type { BundlibConfig } from '../types/bundlib-options';
import type { Dictionary } from '../types/helper-types';

type ObjectOnly<T> = T extends Dictionary<unknown> ? T : never;
type CosmiconfigConfigResult = ObjectOnly<CosmiconfigOriginalResult>;

type CosmiconfigTypedResult<T> = {
  [K in keyof CosmiconfigConfigResult]: K extends 'config' ? T : CosmiconfigConfigResult[K]
};

type CosmiconfigResult<T> = CosmiconfigTypedResult<T> | null;

export type BundlibCosmiconfigResult = CosmiconfigResult<BundlibConfig>;
