export function createFlags(fullFlag: string, shortFlag: string): string {
  return [`-${shortFlag}`, `--${fullFlag}`].join(', ')
}
