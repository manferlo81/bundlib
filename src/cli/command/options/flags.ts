export function createFlags(flag: string): string {
  const short = flag.substring(0, 1);
  return [`-${short}`, `--${flag}`].join(', ');
}
