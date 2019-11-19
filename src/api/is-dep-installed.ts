function isDepInstalled(name: string, ...list: Array<string[] | null>) {
  return list.some((deps) => (
    deps && deps.indexOf(name) !== -1
  ))
}

export default isDepInstalled
