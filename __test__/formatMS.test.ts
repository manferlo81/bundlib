import { formatMS } from '../src/cli/tools/format'

describe('formatMS function', () => {

  test('Should format milliseconds', () => {
    const cases = [
      { value: 0, expected: '0s' },
      { value: 50, expected: '50ms' },
      { value: 1200, expected: '1.2s' },
      { value: 60 * 1000, expected: '1m' },
      { value: 66 * 1000, expected: '1m 6s' },
    ]
    cases.forEach(({ value, expected }) => {
      expect(formatMS(value)).toBe(expected)
    })
  })

  test('Should round result to 2 decimal places', () => {
    const cases = [
      { value: 50.431, expected: '50.43ms' },
      { value: 50.438, expected: '50.44ms' },
      { value: 1321, expected: '1.32s' },
      { value: 1328, expected: '1.33s' },
    ]
    cases.forEach(({ value, expected }) => {
      expect(formatMS(value)).toBe(expected)
    })
  })

})
