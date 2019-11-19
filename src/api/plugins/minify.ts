import { terser } from 'rollup-plugin-terser'

function minify(sourcemap: boolean) {
  return terser({
    sourcemap,
    toplevel: true,
    module: true,
    compress: {
      passes: 2,
    },
  })
}

export default minify
