import type { Chalk } from '../tools/colors';
import { green, yellow } from '../tools/colors';

export function formatTag(text: string, color: Chalk): string {
  return color.inverse.bold(` ${text} `);
}

export function formatProjectInfo(name: string, ver: string): string {
  const projName = green.bold(name);
  const projVer = yellow.bold(`v${ver}`);
  return `${projName} ${projVer}`;
}
