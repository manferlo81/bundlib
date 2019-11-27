function isDepInstalled(name: string, ...list: Array<string[] | null>) {
  return list.some((deps) => (
    deps && deps.includes(name)
  ))
}

export default isDepInstalled
