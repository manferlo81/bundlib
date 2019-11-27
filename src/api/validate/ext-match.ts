import { extname } from 'path'

function extensionMatch(filename: string, extensions: string[]): boolean {
  return extensions.includes(extname(filename).toLowerCase())
}

export default extensionMatch
