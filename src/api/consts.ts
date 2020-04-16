export const PRODUCT_NAME = 'bundlib';

export const OPTION_FILE_PATHS = [
  ...['', '.json', '.yaml', '.yml', '.js'].map((ext) => `.${PRODUCT_NAME}rc${ext}`),
  `${PRODUCT_NAME}.config.js`,
];

export const TS_DEF_PREFIX = 'd';
export const MIN_PREFIX = 'min';
