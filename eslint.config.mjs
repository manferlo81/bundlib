import pluginJavascript from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as pluginTypescriptConfigs } from 'typescript-eslint';

const javascriptPluginConfig = config(
  pluginJavascript.configs.recommended,
  normalizeRulesConfig({
    'no-useless-rename': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-useless-concat': 'error',
    eqeqeq: 'smart',
  }),
);

const stylisticPluginConfig = config(
  pluginStylistic.configs.customize({
    indent: 2,
    semi: true,
    arrowParens: true,
    quoteProps: 'as-needed',
    braceStyle: '1tbs',
  }),
  normalizeRulesConfig('@stylistic', {
    quotes: 'single',
    'linebreak-style': 'unix',
    'no-extra-parens': 'all',
    'no-extra-semi': 'error',
    'no-mixed-operators': 'error',
    'padded-blocks': 'off',
  }),
);

const typescriptPluginConfigs = config(
  pluginTypescriptConfigs.strictTypeChecked,
  pluginTypescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  normalizeRulesConfig('@typescript-eslint', {
    'array-type': { default: 'array-simple', readonly: 'array-simple' },
  }),
  {
    ...pluginTypescriptConfigs.disableTypeChecked,
    files: ['**/*.{js,mjs,cjs}'],
  },
);

export default config(
  { ignores: ['bin', 'dist', 'coverage'] },
  { languageOptions: { globals: globals.node } },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  javascriptPluginConfig,
  stylisticPluginConfig,
  typescriptPluginConfigs,
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['error', 'off', 'warn'].includes(entry)) return entry;
  return ['error', entry];
}

function createPluginRuleNameNormalizer(pluginName) {
  const pluginPrefix = `${pluginName}/`;
  return (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
}

function createEntriesNormalizer(pluginName) {
  if (!pluginName) return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  const normalizeRuleName = createPluginRuleNameNormalizer(pluginName);
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function normalizeRulesConfig(pluginName, rules) {
  if (!rules && pluginName) return normalizeRulesConfig(null, pluginName);
  const normalizeEntry = createEntriesNormalizer(pluginName);
  const entries = Object.entries(rules).map(normalizeEntry);
  const rulesNormalized = Object.fromEntries(entries);
  return { rules: rulesNormalized };
}
