declare module '@rollup/plugin-babel' {

  import { PluginImpl } from 'rollup';

  type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

  export interface BabelPluginOptions {
    include?: MinimatchPattern;
    exclude?: MinimatchPattern;
    extensions?: string[];
    babelHelpers?: 'bundled' | 'runtime' | 'inline' | 'external';
  }

  const babel: PluginImpl<BabelPluginOptions>;

  export default babel;

}

declare module 'rollup-plugin-eslint' {

  import { PluginImpl } from 'rollup';

  type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

  export interface EslintPluginOptions {
    include?: MinimatchPattern;
    exclude?: MinimatchPattern;
    throwOnError?: boolean;
    throwOnWarning?: boolean;
    fix?: boolean;
  }

  export const eslint: PluginImpl<EslintPluginOptions>;

}
