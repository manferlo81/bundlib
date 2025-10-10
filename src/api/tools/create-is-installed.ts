import type { Dictionary, MaybeNullish } from '../types/helper-types'
import type { IsInstalled } from '../types/private-types'

export function createIsInstalled(...dependencies: Array<MaybeNullish<Partial<Dictionary<string>>>>): IsInstalled {

  const reduced = dependencies.reduce<Partial<Dictionary<string>>>(
    (result, deps) => Object.assign(result, deps),
    {},
  )

  return (id): string | undefined => reduced[id]

}
