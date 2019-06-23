import { relative } from "path";

export function log(pattern: string | Error, ...args: any[]): void {
  // tslint:disable-next-line: no-console
  console.log(pattern, ...args);
}

export function logFilename(filename: string, cwd: string, pattern: string) {
  log(pattern, relative(cwd, filename));
}
