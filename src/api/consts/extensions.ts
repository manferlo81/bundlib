export const TS_ONLY_EXTENSIONS = ['.ts', '.cts', '.mts', '.tsx'] as const;
export const JS_EXTENSIONS = ['.js', '.cjs', '.mjs', '.jsx', '.es6', '.es', '.node'] as const;
export const TS_EXTENSIONS = [...TS_ONLY_EXTENSIONS, ...JS_EXTENSIONS] as const;
