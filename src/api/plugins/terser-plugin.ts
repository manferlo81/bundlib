/* eslint-disable @typescript-eslint/camelcase */

import { terser } from 'rollup-plugin-terser'

export function optimizePlugin(sourcemapBool: boolean) {

  return terser({
    sourcemap: sourcemapBool,
    toplevel: true,
    module: true,
    compress: {
      passes: 2,
      sequences: 2,
    },
    mangle: false,
    output: {
      beautify: true,
      indent_level: 2,
    },
  })

}

export function minifyPlugin(sourcemapBool: boolean) {

  return terser({
    sourcemap: sourcemapBool,
    toplevel: true,
    module: true,
    compress: {
      passes: 2,
    },
  })

}
