import { Chalk, green, yellow } from './tools/colors';

const greenBold = green.bold;
const yellowBold = yellow.bold;

export function formatProjectInfo(name: string, ver: string) {
  const projName = greenBold(name);
  const projVer = yellowBold(`v${ver}`);
  return `${projName} ${projVer}`;
}

export function tag(color: Chalk, text: string) {
  const tag = color.inverse(` ${text} `);
  return tag;
}
