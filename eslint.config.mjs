import pluginJavascript from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const javascriptPluginConfig = config(
  pluginJavascript.configs.recommended,
  {
    rules: normalizeRules({
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'no-useless-concat': 'error',
      'prefer-template': 'error',
    }),
  },
);

const stylisticPluginConfig = config(
  pluginStylistic.configs.customize({
    quotes: 'single',
    indent: 2,
    semi: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
  }),
  {
    rules: normalizeRules('@stylistic', {
      'linebreak-style': 'unix',
      'no-extra-parens': 'error',
      'no-extra-semi': 'error',
      'no-mixed-operators': 'error',
      'padded-blocks': 'off',
    }),
  },
);

const typescriptPluginConfigs = config(
  typescriptConfigs.strictTypeChecked,
  typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,cjs,mjs}'], extends: [typescriptConfigs.disableTypeChecked] },
  {
    rules: normalizeRules('@typescript-eslint', {
      'array-type': {
        default: 'array-simple',
        readonly: 'array-simple',
      },
    }),
  },
);

export default config(
  { files: ['**/*.{ts,js,cjs,mjs}'] },
  { ignores: ['bin', 'dist', 'coverage'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfigs,
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['error', 'warn', 'off'].includes(entry)) return entry;
  return ['error', entry];
}

function createEntriesMapper(pluginName) {
  if (!pluginName) {
    return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  }
  const pluginPrefix = `${pluginName}/`;
  const normalizeRuleName = (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function normalizeRules(pluginName, rules) {
  if (!rules && pluginName) return normalizeRules(null, pluginName);
  return Object.fromEntries(
    Object.entries(rules).map(
      createEntriesMapper(pluginName),
    ),
  );
}
