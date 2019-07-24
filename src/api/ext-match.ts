import { extname } from "path";

function extensionMatch(filename: string, extensions: string[]): boolean {
  return extensions.indexOf(extname(filename).toLowerCase()) >= 0;
}

export default extensionMatch;
