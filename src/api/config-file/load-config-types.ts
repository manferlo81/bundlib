import type { CosmiconfigResult as OriginalCosmiconfigResult } from 'cosmiconfig'
import type { BundlibConfig } from '../options/types/bundlib'

type CosmiconfigResultObject = Extract<OriginalCosmiconfigResult, object>

type CosmiconfigTypedResultObject<T> = {
  [K in keyof CosmiconfigResultObject]: K extends 'config' ? T : CosmiconfigResultObject[K]
}

type CosmiconfigResult<T> = CosmiconfigTypedResultObject<T> | null

export type BundlibCosmiconfigResult = CosmiconfigResult<BundlibConfig>
