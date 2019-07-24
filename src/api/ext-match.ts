import { extname } from "path";

function extensionMatch(filename: string, extensions: string[]): boolean {
  const fileExt = extname(filename);
  return extensions.map((ext) => (`.${ext}`).toLowerCase()).indexOf(fileExt.toLowerCase()) >= 0;
}

export default extensionMatch;
