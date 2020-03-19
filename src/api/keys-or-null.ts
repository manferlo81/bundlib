import { Dictionary, Nullable, StrictNullable } from './helper-types'
import { keys } from './helpers'

function keysOrNull(deps: Nullable<Dictionary<unknown>>): StrictNullable<string[]> {
  return deps ? keys(deps) : null
}

export default keysOrNull
