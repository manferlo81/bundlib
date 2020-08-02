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
