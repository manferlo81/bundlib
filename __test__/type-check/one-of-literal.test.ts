import { createOneOfLiteral } from '../../src/api/type-check/advanced'
import { colorizeMessage } from '../tools/colors'

describe(colorizeMessage('createOneOfLiteral function'), () => {

  const pizza = 'pizza'
  const drinks = ['tea' as const, 'coffee' as const] as const
  const isPizzaOrDrinkOrZero = createOneOfLiteral<'pizza' | 'tea' | 'coffee' | 0>(pizza, ...drinks, 0)

  test(colorizeMessage('Should return false on non matching values'), () => {

    ['doughnut', 1, 100, true].forEach((value) => {
      expect(isPizzaOrDrinkOrZero(value)).toBe(false)
    })

  })

  test(colorizeMessage('Should return true on matching values'), () => {

    [pizza, ...drinks, 0].forEach((value) => {
      expect(isPizzaOrDrinkOrZero(value)).toBe(true)
    })

  })

})
