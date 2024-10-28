import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['error', 'warn', 'off'].includes(entry)) return entry;
  return ['error', entry];
}

function normalizeRuleEntries(rules, pluginName) {
  const entries = Object.entries(rules).map(
    ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)],
  );
  if (!pluginName) return Object.fromEntries(entries);
  const pluginPrefix = `${pluginName}/`;
  const normalizeRuleName = (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
  return Object.fromEntries(
    entries.map(
      ([ruleName, normalizedRuleEntry]) => [normalizeRuleName(ruleName), normalizedRuleEntry],
    ),
  );
}

function normalizeRules(pluginOrRules, rules) {
  if (typeof pluginOrRules !== 'string') return normalizeRuleEntries(pluginOrRules);
  return normalizeRuleEntries(rules, pluginOrRules);
}

const eslintRules = normalizeRules({
  'no-useless-rename': 'error',
  'object-shorthand': 'error',
  'prefer-template': 'error',
});

const stylisticRules = normalizeRules('@stylistic', {
  indent: 2,
  'linebreak-style': 'unix',
  'no-extra-parens': 'error',
  'no-extra-semi': 'error',
  'no-mixed-operators': 'error',
  'padded-blocks': 'off',
});

const typescriptRules = normalizeRules('@typescript-eslint', {
  'array-type': {
    default: 'array-simple',
    readonly: 'array-simple',
  },
});

const stylisticConfig = stylistic.configs.customize({
  semi: true,
  indent: 2,
  quotes: 'single',
  quoteProps: 'as-needed',
  arrowParens: true,
  braceStyle: '1tbs',
});

const typescriptFlatConfigs = config(
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,cjs,mjs}'], ...typescriptConfigs.disableTypeChecked },
);

export default config(
  { ignores: ['bin', 'dist', 'coverage'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  js.configs.recommended,
  stylisticConfig,
  ...typescriptFlatConfigs,
  { rules: { ...eslintRules, ...stylisticRules, ...typescriptRules } },
);
