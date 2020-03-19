import { existsSync } from 'fs'
import { StrictNullable } from './helper-types'

function findFirst(...filenames: string[]): StrictNullable<string> {
  for (const filename of filenames) {
    if (existsSync(filename)) {
      return filename
    }
  }
  return null
}

export default findFirst
