import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import { config, configs as typescriptConfigs } from 'typescript-eslint';

const rule = options => ['error', options];

const pluginRules = (pluginName, rules) => Object.keys(rules).reduce((output, ruleName) => {
  const pluginPrefixedRuleName = `${pluginName}/${ruleName}`;
  const ruleEntry = rules[ruleName];
  return { ...output, [pluginPrefixedRuleName]: ruleEntry };
}, {});

const eslintRules = {
  'no-useless-rename': 'error',
  'object-shorthand': 'error',
};

const typescriptRules = pluginRules('@typescript-eslint', {
  'array-type': rule({
    default: 'array-simple',
    readonly: 'array-simple',
  }),
});

const stylisticRules = pluginRules('@stylistic', {
  indent: rule(2),
  'linebreak-style': rule('unix'),
  quotes: rule('single'),
  semi: rule('always'),
  'quote-props': rule('as-needed'),

  'comma-dangle': rule('always-multiline'),
  'member-delimiter-style': rule({}),

  'no-multiple-empty-lines': rule({
    max: 1,
    maxBOF: 0,
    maxEOF: 0,
  }),

  'padded-blocks': 'off',

});

const offRules = (...ruleNames) => ruleNames.reduce((output, ruleName) => ({ ...output, [ruleName]: 'off' }), {});

// These are rules that caused problems when switched to eslint@9 + typescript-eslint + stylistic
// TODO: I will fix them
const toBeFixedRules = {
  ...pluginRules('@stylistic', offRules(
    'brace-style',
    'arrow-parens',
    'no-extra-parens',
    'multiline-ternary',
    'no-mixed-operators',
    'operator-linebreak',
  )),
  ...pluginRules('@typescript-eslint', offRules(
    'prefer-nullish-coalescing',
    'no-confusing-void-expression',
    'no-invalid-void-type',
    'consistent-type-definitions',
    'no-unnecessary-condition',
    'prefer-for-of',
    'prefer-includes',
    'only-throw-error',
    'unified-signatures',
  )),
};

const rules = { ...eslintRules, ...typescriptRules, ...stylisticRules, ...toBeFixedRules };

const typescriptFlatConfigs = config(
  ...typescriptConfigs.strictTypeChecked,
  ...typescriptConfigs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { project: true } } },
  { files: ['**/*.{js,mjs,cjs}'], ...typescriptConfigs.disableTypeChecked },
);

export default config(
  { ignores: ['bin', 'dist', 'coverage'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  js.configs.recommended,
  ...typescriptFlatConfigs,
  stylistic.configs['recommended-flat'],
  { rules },
);
