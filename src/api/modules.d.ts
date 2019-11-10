declare module 'rollup-plugin-babel' {

  import { PluginImpl } from 'rollup'

  type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

  interface BabelPluginOptions {
    extensions?: string[];
    include?: MinimatchPattern;
    exclude?: MinimatchPattern;
    babelrc?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    presets?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins?: any[];
    runtimeHelpers?: boolean;
  }

  const babel: PluginImpl<BabelPluginOptions>

  export default babel

}
