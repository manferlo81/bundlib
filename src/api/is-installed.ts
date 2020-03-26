import hasOwn from './has-own'
import { Dictionary, IsInstalled, Nullable } from './helper-types'

function createIsInstalled(...dependencies: Nullable<Dictionary<unknown>>[]): IsInstalled {
  return (id) => dependencies.some((deps) => !!deps && hasOwn.call(deps, id))
}

export default createIsInstalled
