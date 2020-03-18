function isDepInstalled(name: string, dependencies: Record<string, unknown> | null): boolean {
  return dependencies ? Object.prototype.hasOwnProperty.call(dependencies, name) : false
}

export default isDepInstalled
