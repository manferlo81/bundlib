export function isDepInstalled(name: string, ...list: Array<Record<string, string> | null>): string | null {
  return list.reduce<string | null>((result, deps) => {
    if (!deps) {
      return result
    }
    const ver = deps[name] as string | void
    if (!ver) {
      return result
    }
    return ver
  }, null)
}

export default isDepInstalled
