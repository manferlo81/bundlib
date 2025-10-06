import { blueBright, cyanBright, greenBright, magentaBright, redBright, yellow } from 'chalk';
export { greenBright as buildTypeColor, yellow as filenameColor, blueBright as javascriptValueColor, redBright as packageFieldColor, magentaBright as packageNameColor };

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

const addQuotes = (name: string): string => `"${name}"`;

const pkgFields = [
  'main',
  'module',
  'jsnext:main',
  'browser',
  'bin',
  'types',
  'typings',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'bundlib',
].map(addQuotes);

const fields = [
  'field',
  'fields',
  ...pkgFields,
];

const bundlibOptions = [
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
].map(addQuotes);

const options = [
  'option',
  'options',
  ...bundlibOptions,
];

const modules = [
  '@babel/core',
  'chokidar',
  '@rollup/plugin-babel',
  'rollup-plugin-strip-shebang',
  'rollup-plugin-add-shebang',
];

type ColorizeText = (text: string) => string;

interface ColorizeList {
  words: string[];
  style: ColorizeText;
}

const colorizeMap: ColorizeList[] = [
  { words: ['Should', 'should'], style: greenBright },
  { words: [...functions, ...constants, ...types, ...keywords], style: blueBright },
  { words: filenames, style: yellow },
  { words: [...fields, ...options], style: cyanBright },
  { words: modules, style: magentaBright },
];

const colorizeDictionary: Partial<Record<string, ColorizeText>> = colorizeMap.reduce((output, { words, style }) => {
  return words.reduce((wordsOutput, word) => {
    return { ...wordsOutput, [word]: style };
  }, output);
}, {});

export function colorizeMessage(message: string) {
  const messageWords = message.split(' ');
  const colorizedWords = messageWords.map((word) => {
    if (!word) return word;
    const colorize = colorizeDictionary[word];
    if (!colorize) return word;
    return colorize(word);
  });
  return colorizedWords.join(' ');
}
