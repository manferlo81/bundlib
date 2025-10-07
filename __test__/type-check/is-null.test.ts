import { isNullish } from '../../src/api/type-check/basic'
import { colorizeMessage } from '../tools/colors'
import { arrays, booleans, functions, objects, nullish, numbers, strings } from '../tools/typed-values'

describe(colorizeMessage('isNullish function'), () => {

  test(colorizeMessage('Should return false on non nullish values'), () => {

    const nonObjectValues = [
      ...numbers,
      ...strings,
      ...booleans,
      ...functions,
      ...arrays,
      ...objects,
    ]

    nonObjectValues.forEach((value) => {
      expect(isNullish(value)).toBe(false)
    })

  })

  test(colorizeMessage('Should return true on null & undefined values'), () => {

    nullish.forEach((value) => {
      expect(isNullish(value)).toBe(true)
    })

  })

})
