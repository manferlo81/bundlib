export const PRODUCT_NAME = 'bundlib';

export const OPTION_FILE_PATHS = [
  ...['', '.json', '.yaml', '.yml', '.js'].map((ext) => `.${PRODUCT_NAME}rc${ext}`),
  `${PRODUCT_NAME}.config.js`,
];
