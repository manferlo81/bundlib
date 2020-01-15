function isDepInstalled(name: string, ...list: Array<Record<string, string> | null>) {
  return list.some((deps) => (
    deps && !!deps[name]
  ))
}

export default isDepInstalled
