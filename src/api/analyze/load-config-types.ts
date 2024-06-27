import { CosmiconfigResult as CosmiconfigOriginalResult } from 'cosmiconfig';
import { BundlibConfig } from '../types/bundlib-options';

type CosmiconfigConfigResult = Exclude<CosmiconfigOriginalResult, null>;

type CosmiconfigTypedResult<T> = {
  [K in keyof CosmiconfigConfigResult]: K extends 'config' ? T : CosmiconfigConfigResult[K]
};

export type CosmiconfigResult<T> = CosmiconfigTypedResult<T> | null;

export type BundlibCosmiconfigResult = CosmiconfigResult<BundlibConfig>;
