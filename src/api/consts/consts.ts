export const PRODUCT_NAME = 'bundlib';

export const CONFIG_FILE_SEARCH_PLACES = [
  ...['', '.json', '.yaml', '.yml', '.js'].map((ext) => `.${PRODUCT_NAME}rc${ext}`),
  ...['js', 'cjs', 'mjs', 'ts'].map((ext) => `${PRODUCT_NAME}.config.${ext}`),
];

export const TS_DEF_PREFIX = 'd';
export const MIN_PREFIX = 'min';
