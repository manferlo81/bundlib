import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import pluginJavascript from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';
import { flatConfigs as pluginImportConfigs } from 'eslint-plugin-import';
import { configs as pluginTypescriptConfigs } from 'typescript-eslint';

// Constants

const PATTERN_JS = '**/*.{js,mjs,cjs}';
const PATTERN_TS = '**/*.{ts,mts,cts}';

const FILES_TS_ONLY = [PATTERN_TS];
const FILES_ALL = [PATTERN_JS, PATTERN_TS];

// Javascript Plugin

const rulesPluginJavascript = ruleNormalizer()({
  // Avoid useless code
  'object-shorthand': 'on',
  'no-useless-rename': 'on',
  'no-useless-concat': 'on',
  'no-else-return': { allowElseIf: false },
  'no-useless-return': 'on',
  // Style
  'prefer-template': 'on',
  // Strict
  eqeqeq: 'smart',
});

const configPluginJavascript = defineConfig({
  files: FILES_ALL,
  rules: rulesPluginJavascript,
  extends: [
    pluginJavascript.configs.recommended,
  ],
});

// Typescript Plugin

const rulesPluginTypescript = ruleNormalizer({ plugin: '@typescript-eslint' })({
  'array-type': { default: 'array-simple', readonly: 'array-simple' },
  'no-meaningless-void-operator': 'on',
  'no-confusing-void-expression': {
    ignoreArrowShorthand: true,
    ignoreVoidOperator: false,
    ignoreVoidReturningFunctions: true,
  },
  'restrict-template-expressions': {
    allowBoolean: false,
    allowRegExp: false,
    allowAny: false,
    allowNullish: false,
  },
});

const configPluginTypescript = defineConfig({
  files: FILES_TS_ONLY,
  languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
  extends: [
    pluginTypescriptConfigs.strictTypeChecked,
    pluginTypescriptConfigs.stylisticTypeChecked,
  ],
  rules: rulesPluginTypescript,
});

// Import Plugin

const rulesPluginImport = ruleNormalizer({ plugin: 'import' })({
  'consistent-type-specifier-style': 'on',
  'no-useless-path-segments': 'on',
  'no-absolute-path': 'on',
  'no-cycle': 'on',
});

const configPluginImport = defineConfig({
  files: FILES_ALL,
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { 'import/resolver': { typescript: true } },
  extends: [
    pluginImportConfigs.recommended,
    pluginImportConfigs.typescript,
  ],
  rules: rulesPluginImport,
});

// Stylistic Plugin

const rulesPluginStylistic = ruleNormalizer({ plugin: '@stylistic' })({
  indent: ['on', 2],
  quotes: 'single',
  'linebreak-style': 'unix',
  'no-extra-parens': 'all',
  'no-extra-semi': 'on',
  'no-mixed-operators': 'on',
  'padded-blocks': 'off',
});

const configPluginStylistic = defineConfig({
  files: FILES_ALL,
  extends: [
    pluginStylistic.configs.customize({
      semi: true,
      arrowParens: true,
      quoteProps: 'as-needed',
      braceStyle: '1tbs',
      jsx: false,
    }),
  ],
  rules: rulesPluginStylistic,
});

// Config

export default defineConfig(
  globalIgnores(['bin', 'dist', 'coverage']),
  { languageOptions: { globals: globals.node } },
  configPluginJavascript,
  configPluginTypescript,
  configPluginImport,
  configPluginStylistic,
);

// Helpers

function ruleNormalizer({ severity: defaultSeverity = 'error', plugin: pluginName } = {}) {

  const isDefaultSeverity = (entry) => ['error', 'warn'].includes(entry);

  if (!isDefaultSeverity(defaultSeverity)) throw new TypeError(`${defaultSeverity} is not a valid default severity`);

  const resolveSeverity = (entry) => {
    // Resolve with default severity if entry is "on" or true
    if (entry === 'on' || entry === true) return [true, defaultSeverity];

    // Resolve to "off" if entry if false or nullish
    if (entry === false || entry == null) return [true, 'off'];

    // Resolve to entry with wether or not is a valid severity
    return [entry === 'off' || entry === 0 || isDefaultSeverity(entry), entry];
  };

  function normalizeRuleEntry(entry) {

    // Return entry if it's a valid severity
    const [isSeverity, severity] = resolveSeverity(entry);
    if (isSeverity) return severity;

    // Process entry if it's an array
    if (Array.isArray(entry)) {

      // Return default severity if array is empty
      if (!entry.length) return defaultSeverity;

      // Return rule if first element is a valid severity
      const [first, ...rest] = entry;
      const [isSeverity, severity] = resolveSeverity(first);
      if (isSeverity) return [severity, ...rest];

      // Return default severity rule if first element is not a valid severity
      return [defaultSeverity, ...entry];

    }

    // Return default severity rule if it's not a valid severity nor an array
    return [defaultSeverity, entry];

  }

  function createRuleNormalizer(normalizeObjectEntry) {
    return (rules) => {
      const entries = Object.entries(rules);
      const entriesNormalized = entries.map(normalizeObjectEntry);
      return Object.fromEntries(entriesNormalized);
    };
  }

  if (!pluginName) {
    return createRuleNormalizer(
      ([ruleName, ruleEntry]) => [
        ruleName,
        normalizeRuleEntry(ruleEntry),
      ],
    );
  }

  const pluginPrefix = `${pluginName}/`;

  const normalizeRuleName = (ruleName) => {
    if (ruleName.startsWith(pluginPrefix)) return ruleName;
    return `${pluginPrefix}${ruleName}`;
  };

  return createRuleNormalizer(
    ([ruleName, ruleEntry]) => [
      normalizeRuleName(ruleName),
      normalizeRuleEntry(ruleEntry),
    ],
  );

}
