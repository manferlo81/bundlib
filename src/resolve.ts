import { resolve } from "path";

const resolvePath = (filename: string, cwd = process.cwd()) => resolve(cwd, filename);

export default resolvePath;
