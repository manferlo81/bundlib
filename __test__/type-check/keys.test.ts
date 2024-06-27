import { keysCheck } from '../../src/api/type-check/keys';

describe('keysCheck function', () => {

  const isPizza = (value: unknown): value is 'pizza' => value === 'pizza';
  const isTea = (value: unknown): value is 'tea' => value === 'tea';

  const check = (obj: Record<string, unknown>) => keysCheck(obj, isPizza, isTea);

  test('Should return true if all keys match at least one of the checks', () => {
    expect(check({})).toBe(true);
    expect(check({ pizza: true })).toBe(true);
    expect(check({ tea: 'green' })).toBe(true);
    expect(check({ pizza: true, tea: 'green' })).toBe(true);
  });

  test('Should return false if at least one key does\'t match any check', () => {
    expect(check({ pizza: true, tea: 'black', coffee: 'espresso' })).toBe(false);
  });

});
