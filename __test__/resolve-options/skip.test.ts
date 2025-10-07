import { resolveSkipOption } from '../../src/api/options/skip'
import { SKIP_OPTION_KEYS } from '../../src/api/selective/constants'
import type { SelectiveSkipKey } from '../../src/api/types/bundlib-options'
import { colorizeMessage } from '../tools/colors'
import type { GetSelectiveResultValue } from '../tools/selective-tools'
import { createSelectiveResult, isApiKey } from '../tools/selective-tools'

describe(colorizeMessage('resolve "skip" option'), () => {

  const createResult = <V>(getValue: GetSelectiveResultValue<SelectiveSkipKey, V>) => {
    return createSelectiveResult<SelectiveSkipKey, V>(SKIP_OPTION_KEYS, getValue)
  }

  test(colorizeMessage('Should throw on invalid "skip" option'), () => {

    const invalidSkipOptionValues = [
      0,
      1,
      'invalid',
      ['invalid'],
      { cli: true },
      { default: 'invalid' },
      { api: 'invalid' },
      { main: 'invalid' },
      { module: 'invalid' },
      { browser: 'invalid' },
      { bin: 'invalid' },
      { types: 'invalid' },
    ]

    invalidSkipOptionValues.forEach((invalid) => {
      expect(() => resolveSkipOption(invalid as never)).toThrow('Invalid "skip" option')
    })

  })

  test(colorizeMessage('Should resolve nullish "skip" option'), () => {
    const expected = createResult(() => false);
    [null, undefined].forEach((value) => {
      expect(resolveSkipOption(value)).toEqual(expected)
    })
  })

  test(colorizeMessage('Should resolve boolean "skip" option'), () => {
    [true, false].forEach((value) => {
      const expected = createResult(() => value)
      expect(resolveSkipOption(value)).toEqual(expected)
    })
  })

  test(colorizeMessage('Should resolve build type "skip" option'), () => {

    const values = [
      ...SKIP_OPTION_KEYS.map((value) => ({
        value,
        expected: createResult((key) => key === value),
      })),
      {
        value: 'api' as const,
        expected: createResult(isApiKey),
      },
    ]

    values.forEach(({ value, expected }) => {
      expect(resolveSkipOption(value)).toEqual(expected)
    })

  })

  test(colorizeMessage('Should resolve array of build type as "skip" option'), () => {

    const values = [
      ...SKIP_OPTION_KEYS.map((value) => ({
        value: [value],
        expected: createResult((key) => key === value),
      })),
      {
        value: ['api'] as ['api'],
        expected: createResult(isApiKey),
      },
      {
        value: ['main', 'bin'] as ['main', 'bin'],
        expected: createResult((key) => ['main', 'bin'].includes(key)),
      },
      {
        value: ['api', 'types'] as ['api', 'types'],
        expected: createResult((key) => isApiKey(key) || key === 'types'),
      },
    ]

    values.forEach(({ value: array, expected }) => {
      expect(resolveSkipOption(array)).toEqual(expected)
    })

  })

  test(colorizeMessage('Should resolve selective object "skip" option'), () => {

    const values = [
      {
        value: {},
        expected: createResult(() => false),
      },
      {
        value: { default: false },
        expected: createResult(() => false),
      },
      {
        value: { default: true },
        expected: createResult(() => true),
      },
      {
        value: { default: false, main: true },
        expected: createResult((key) => key === 'main'),
      },
      {
        value: { default: true, module: false },
        expected: createResult((key) => key !== 'module'),
      },
      {
        value: { default: false, api: true, browser: false },
        expected: createResult((key) => isApiKey(key) && key !== 'browser'),
      },
      {
        value: { api: true, browser: false },
        expected: createResult((key) => ['main', 'module'].includes(key)),
      },
      {
        value: { main: false, module: null, browser: undefined },
        expected: createResult(() => false),
      },
      {
        value: { main: true, module: null, bin: undefined },
        expected: createResult((key) => key === 'main'),
      },
    ]

    values.forEach(({ value, expected }) => {
      expect(resolveSkipOption(value)).toEqual(expected)
    })

  })

})
