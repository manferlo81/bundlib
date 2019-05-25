import { relative } from "path";

export function log(error: boolean, pattern: string | Error, ...args: any[]): void {
  // tslint:disable-next-line: no-console
  (error ? console.error : console.log)(pattern, ...args);
}

export function logFilename(filename: string, cwd: string, pattern: string) {
  log(false, pattern, relative(cwd, filename));
}
