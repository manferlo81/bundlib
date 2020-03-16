function isDepInstalled(name: string, ...list: Array<Record<string, string> | null>): boolean {
  return list.some(
    (deps) => deps && Object.prototype.hasOwnProperty.call(deps, name),
  )
}

export default isDepInstalled
