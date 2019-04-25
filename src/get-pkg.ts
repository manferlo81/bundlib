import { readFile as fsReadFile } from "fs";
import { resolve as resolvePath } from "path";
import { promisify } from "util";

import { Pkg } from "./npm-pkg";

const readFile = promisify(fsReadFile);

const getPkg = async (cwd: string): Promise<Pkg> => {

  const pkgFilename = resolvePath(cwd, "package.json");

  const pkgContent = await readFile(pkgFilename);
  return JSON.parse(pkgContent.toString()) as Pkg;

};

export default getPkg;
