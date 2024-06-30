import { Chalk, bold } from './tools/colors';

const greenBold = bold.green;
const yellowBold = bold.yellow;

export function formatProjectInfo(name: string, ver: string) {
  const projName = greenBold(name);
  const projVer = yellowBold(`v${ver}`);
  return `${projName} ${projVer}`;
}

export function tag(color: Chalk, text: string) {
  const tag = color.inverse(` ${text} `);
  return tag;
}
