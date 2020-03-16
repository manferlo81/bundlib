import { existsSync } from 'fs'

function findFirst(...filenames: string[]): string | null {
  for (const filename of filenames) {
    if (existsSync(filename)) {
      return filename
    }
  }
  return null
}

export default findFirst
