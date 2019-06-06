import { resolve } from "path";

const resolvePath = (filename: string, cwd: string) => resolve(cwd, filename);

export default resolvePath;
