import type { BuildType } from '../../src/api'
import { resolveInputOption } from '../../src/api/options/input'
import { MODULE_BUILD_KEYS } from '../../src/api/selective/constants'
import { colorizeMessage } from '../tools/colors'
import type { GetSelectiveResultValue } from '../tools/selective-tools'
import { createSelectiveResult, isApiKey } from '../tools/selective-tools'

describe(colorizeMessage('resolve "input" option'), () => {

  const createResult = <V>(getValue: GetSelectiveResultValue<BuildType, V>) => {
    return createSelectiveResult<BuildType, V>(MODULE_BUILD_KEYS, getValue)
  }

  test(colorizeMessage('Should throw on invalid "input" option'), () => {

    const invalidInputValues = [
      0,
      1,
      [0, 1],
      { invalid: true },
      { default: 0 },
      { main: 1 },
      { module: 2 },
      { browser: 3 },
      { api: 4 },
      { bin: 5 },
    ]

    invalidInputValues.forEach((invalid) => {
      expect(() => resolveInputOption(invalid as never)).toThrow('Invalid "input" option')
    })

  })

  test(colorizeMessage('Should resolve nullish "input" option'), () => {
    const expected = createResult(() => null);
    [null, undefined].forEach((value) => {
      expect(resolveInputOption(value)).toEqual(expected)
    })
  })

  test(colorizeMessage('Should resolve string "input" option'), () => {
    ['input1.ts', 'input2.ts', 'input3.js'].forEach((value) => {
      const expected = createResult(() => value)
      expect(resolveInputOption(value)).toEqual(expected)
    })
  })

  test(colorizeMessage('Should resolve selective object as "input" option'), () => {

    const values = [
      {
        value: {},
        expected: createResult(() => null),
      },
      ...['', 'default.js'].map((value) => ({
        value,
        expected: createResult(() => value),
      })),
      {
        value: { default: null, main: 'main.js' },
        expected: createResult((key) => key === 'main' ? 'main.js' : null),
      },
      {
        value: { default: 'default.js', api: 'api.js', browser: 'browser.js' },
        expected: createResult((key) => !isApiKey(key) ? 'default.js' : key === 'browser' ? 'browser.js' : 'api.js'),
      },
    ]

    values.forEach(({ value, expected }) => {
      expect(resolveInputOption(value)).toEqual(expected)
    })

  })

})
