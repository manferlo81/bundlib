import hasOwn from './has-own'
import { Dictionary, Nullable } from './helper-types'

function isDepInstalled(name: string, dependencies: Nullable<Dictionary<unknown>>): boolean {
  return dependencies ? hasOwn.call(dependencies, name) : false
}

export default isDepInstalled
