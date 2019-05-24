import { resolve } from "path";

const resolvePath = (filename: string, cwd: string = process.cwd()) => resolve(cwd, filename);

export default resolvePath;
