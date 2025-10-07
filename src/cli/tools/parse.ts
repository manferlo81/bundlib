import { parse as parsePath, relative } from 'node:path'
import slash from 'slash'

export function parseFileName(filename: string, cwd: string) {
  const { dir, base } = parsePath(filename)

  const unnormalizedRelativeDir = relative(cwd, dir)
  const normalizedDir = slash(unnormalizedRelativeDir)
  const relativeDir = `./${normalizedDir}`

  return [relativeDir, base]
}
