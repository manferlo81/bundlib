import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const eslintRules = normalizeRules({
  'no-useless-rename': 'error',
  'object-shorthand': 'error',
  'prefer-template': 'error',
});

const stylisticRules = normalizeRules('@stylistic', {
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
  indent: 2,
  semi: true,
  arrowParens: true,
  quotes: 'single',
  quoteProps: 'as-needed',
  braceStyle: '1tbs',
});

const typescriptFlatConfigs = config(
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: process.cwd() } } },
  { files: ['**/*.{js,cjs,mjs}'], ...typescriptConfigs.disableTypeChecked },
);

export default config(
  { files: ['**/*.{ts,js,cjs,mjs}'] },
  { ignores: ['bin', 'dist', 'coverage'] },
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  js.configs.recommended,
  stylisticConfig,
  ...typescriptFlatConfigs,
  { rules: { ...eslintRules, ...stylisticRules, ...typescriptRules } },
);

function normalizeRuleEntry(entry) {
  if (Array.isArray(entry)) return entry;
  if (['error', 'warn', 'off'].includes(entry)) return entry;
  return ['error', entry];
}

function createNormalizeCallback(normalizeRuleName) {
  if (!normalizeRuleName) return ([ruleName, ruleEntry]) => [ruleName, normalizeRuleEntry(ruleEntry)];
  return ([ruleName, ruleEntry]) => [normalizeRuleName(ruleName), normalizeRuleEntry(ruleEntry)];
}

function createNormalizeRuleName(pluginName) {
  if (!pluginName) return;
  const pluginPrefix = `${pluginName}/`;
  return (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };
}

function normalizeRuleEntries(rules, pluginName) {
  return Object.fromEntries(
    Object.entries(rules).map(
      createNormalizeCallback(
        createNormalizeRuleName(pluginName),
      ),
    ),
  );
}

function normalizeRules(pluginOrRules, rules) {
  if (typeof pluginOrRules !== 'string') return normalizeRuleEntries(pluginOrRules);
  return normalizeRuleEntries(rules, pluginOrRules);
}
