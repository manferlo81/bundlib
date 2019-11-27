import { IsExternal } from 'rollup'

function arrayToExternal(modules: string[] | null): IsExternal {

  if (!modules) {
    return () => false
  }

  const cache: Record<string, boolean> = {}

  // return modules as any;

  return (source: string, _: string, isResolved: boolean) => {

    // ignore local and resolved modules

    if (isResolved || source.startsWith('.')) {
      return
    }

    // return from cache if present

    if (Object.prototype.hasOwnProperty.call(cache, source)) {
      return cache[source]
    }

    // set cached value

    return cache[source] = modules.some((moduleName): (boolean | void) => {

      if (source === moduleName) {
        return true
      }

      const len = moduleName.length

      return (source.substr(0, len) === moduleName) && /^[/\\]$/.test(source[len])

    })

  }

}

export default arrayToExternal
