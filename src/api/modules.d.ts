declare module 'rollup-plugin-babel' {

  import { PluginImpl } from 'rollup'

  type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

  interface BabelPluginOptions {
    extensions: string[];
    include: MinimatchPattern;
    exclude: MinimatchPattern;
    babelrc: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    presets: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: any[];
    runtimeHelpers: boolean;
  }

  const babel: PluginImpl<Partial<BabelPluginOptions>>

  export default babel

}

declare module 'rollup-plugin-eslint' {

  import { PluginImpl } from 'rollup'

  type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

  interface EslintPluginOptions {
    fix: boolean;
    throwOnError: boolean;
    throwOnWarning: boolean;
    include: MinimatchPattern;
    exclude: MinimatchPattern;
    formatter: string | (() => string);
  }

  const eslint: PluginImpl<Partial<EslintPluginOptions>>

}
