import { blueBright, greenBright, magentaBright, redBright, yellow } from '../../src/cli/tools/colors';

export { magentaBright as packageNameColor, greenBright as buildTypeColor, redBright as packageFieldColor, blueBright as javascriptValueColor, yellow as filenameColor } from '../../src/cli/tools/colors';

const functions = [
  'isNullish',
  'isObject',
  'isDictionary',
  'isDictionaryOrNullish',
  'isStringOrNullish',
  'createOneOfLiteral',
  'composeOneOf',
  'keysCheck',
  'pkgToConfigs',
  'createConfig',
  'configsFromPkg',
  'createIsExternal',
];

const keywords = [
  'throw',
  'return',
];

const types = [
  'nullish',
  'boolean',
  'string',
  'object',
  'objects',
  'array',
  'arrays',
  'dictionary',
  'truthy',
  'falsy',
];

const constants = [
  'true',
  'false',
  'null',
  'undefined',
];

const filenames = [
  'package.json',
];

const quotate = (name: string): string => `"${name}"`;

const fields = [
  'field',
  'fields',
  ...[
    'main',
    'module',
    'jsnext:main',
    'browser',
    'bin',
    'types',
    'typings',
    '"dependencies',
    'devDependencies',
    'peerDependencies',
    'bundlib',
  ].map(quotate),
];

const options = [
  'option',
  'options',
  ...[
    'input',
    'sourcemap',
    'esModule',
    'interop',
    'format',
    'name',
    'id',
    'extend',
    'globals',
    'min',
    'skip',
    'cache',
    'project',
    'chunks',
  ].map(quotate),
];

const modules = [
  'chokidar',
];

const map = [
  { words: ['Should', 'should'], style: greenBright },
  { words: [...functions, ...constants, ...types, ...keywords], style: blueBright },
  { words: filenames, style: yellow },
  { words: [...fields, ...options], style: redBright },
  { words: modules, style: magentaBright },
];

export function colorizeMessage(message: string) {
  return message.split(' ').map((word) => {
    if (!word) return word;
    for (const { words, style } of map) {
      if (words.includes(word)) {
        return style(word);
      }
    }
    return word;
  }).join(' ');
}
