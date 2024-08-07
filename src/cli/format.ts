import type { Chalk } from './tools/colors';
import { green, yellow } from './tools/colors';

export function formatProjectInfo(name: string, ver: string) {
  const projName = green.bold(name);
  const projVer = yellow.bold(`v${ver}`);
  return `${projName} ${projVer}`;
}

export function consoleTag(text: string, color: Chalk) {
  return color.inverse.bold(` ${text} `);
}
